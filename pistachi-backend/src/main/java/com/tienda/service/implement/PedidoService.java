package com.tienda.service.implement;

import com.tienda.model.Pedido;
import com.tienda.model.Usuario;
import com.tienda.repository.IPedidoRepository;
import com.tienda.service.interfaces.IPedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

import com.tienda.model.EstadoPedido;
import com.tienda.model.LineaPedido;
import com.tienda.model.Producto;
import com.tienda.repository.IProductoRepository;
import com.tienda.repository.IUsuarioRepository;
import com.tienda.web.controller.PedidoController.LineaPedidoRequest;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
public class PedidoService implements IPedidoService {

    @Autowired
    private IPedidoRepository pedidoRepository;

    @Autowired
    private IProductoRepository productoRepository;

    @Autowired
    private IUsuarioRepository usuarioRepository;

    @Autowired
    private TachisCalculatorService tachisCalculatorService;

    @Autowired
    private com.tienda.service.EmailService emailService;

    @Override
    public Pedido guardarPedido(Pedido pedido) {
        // Aquí podríamos añadir lógica extra antes de guardar
        return pedidoRepository.save(pedido);
    }

    @Override
    public List<Pedido> obtenerPedidosPorUsuario(Usuario usuario) {
        return pedidoRepository.findByUsuarioId(usuario.getId());
    }

    @Override
    public Pedido obtenerPorId(Long id) {
        return pedidoRepository.findById(id).orElse(null);
    }

    @Override
    // esta es la funcion principal para meter pedidos nuevos en la base de datos, lo que hace es mirar que los totales del frontend no esten trucados y que haya stock real, como por ejemplo evitando que alguien intente pagar 0 euros por una tarta de 20 euros, ademas de ir sumando el cashback al momento
    @Transactional
    public Pedido crearPedido(Long usuarioId, Double totalReclamado, Integer tachisUsados, List<LineaPedidoRequest> lineasDatos) {
        Pedido pedido = new Pedido();
        pedido.setUsuarioId(usuarioId);
        pedido.setFecha(LocalDateTime.now());
        pedido.setEstado(EstadoPedido.EN_PROCESO);

        double subtotal = 0.0;
        int totalTachisGenerados = 0;

        for (LineaPedidoRequest lpReq : lineasDatos) {
            Producto producto = productoRepository.findById(lpReq.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
            
            subtotal += producto.getPrecio() * lpReq.getCantidad();

            int unidadesPorPack = producto.getUnidades() != null && producto.getUnidades() > 0 ? producto.getUnidades() : 1;
            int unidadesConsumidas = lpReq.getCantidad() * unidadesPorPack;
            int nuevoStock = producto.getStock() - unidadesConsumidas;
            
            if (nuevoStock < 0) {
                throw new RuntimeException("Stock insuficiente para el producto: " + producto.getNombre());
            }
            
            producto.setStock(nuevoStock);
            productoRepository.save(producto);

            LineaPedido linea = new LineaPedido();
            linea.setProducto(producto);
            linea.setCantidad(lpReq.getCantidad());
            linea.setPrecioUnitario(producto.getPrecio());
            linea.setPedido(pedido);
            
            // Calcular Tachis generados para esta línea
            int tachisLinea = tachisCalculatorService.calcularTachisPorLinea(linea);
            totalTachisGenerados += tachisLinea;

            pedido.getLineas().add(linea);
        }

        double costeEnvio = subtotal >= 30.0 ? 0.0 : 2.99;
        double totalCalculado = subtotal + costeEnvio;
        double descuento = 0.0;

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (tachisUsados != null && tachisUsados > 0) {
            if (usuario.getTachis() < tachisUsados) {
                throw new RuntimeException("No tienes suficientes Tachis.");
            }
            descuento = tachisUsados / 1000.0;
            usuario.setTachis(usuario.getTachis() - tachisUsados);
        }

        double totalFinal = Math.max(0, totalCalculado - descuento);

        if (Math.abs(totalFinal - totalReclamado) > 0.01) {
            throw new RuntimeException("El total calculado (" + totalFinal + "€) no coincide con el total proporcionado (" + totalReclamado + "€). Intento de fraude detectado.");
        }

        pedido.setTotal(totalFinal);
        
        // Ajustar Tachis generados basándose únicamente en el dinero real pagado
        if (totalCalculado > 0) {
            double ratioPagoReal = totalFinal / totalCalculado;
            totalTachisGenerados = (int) Math.round(totalTachisGenerados * ratioPagoReal);
        } else {
            totalTachisGenerados = 0;
        }
        
        pedido.setTachisGenerados(totalTachisGenerados);
        
        // Sumar Tachis al usuario inmediatamente al realizar el pedido
        usuario.setTachis(usuario.getTachis() + totalTachisGenerados);
        usuarioRepository.save(usuario);

        Pedido pedidoGuardado = pedidoRepository.save(pedido);

        // Enviar email de confirmación
        if (usuario.getEmail() != null) {
            emailService.enviarEmailConfirmacionPedido(usuario.getEmail(), usuario.getNombre(), pedidoGuardado.getId(), totalFinal);
        }

        return pedidoGuardado;
    }

    @Override
    // aqui cambiamos como esta el envio del pedido, si lo marcas como cancelado le quita al usuario los tachis que habia ganado en ese pedido para evitar tramposos, como por ejemplo alguien que compra para ganar puntos y luego cancela la compra
    @Transactional
    public Pedido actualizarEstadoPedido(Long id, EstadoPedido nuevoEstado) {
        java.util.Optional<Pedido> pedidoOpt = pedidoRepository.findById(id);
        if (pedidoOpt.isPresent()) {
            Pedido pedido = pedidoOpt.get();
            EstadoPedido estadoAnterior = pedido.getEstado();
            pedido.setEstado(nuevoEstado);
            
            // Restar Tachis si se cancela un pedido que generó Tachis (y no estaba cancelado antes)
            if (nuevoEstado == EstadoPedido.CANCELADO && estadoAnterior != EstadoPedido.CANCELADO) {
                if (pedido.getTachisGenerados() > 0) {
                    Usuario usuario = usuarioRepository.findById(pedido.getUsuarioId()).orElse(null);
                    if (usuario != null) {
                        usuario.setTachis(Math.max(0, usuario.getTachis() - pedido.getTachisGenerados()));
                        usuarioRepository.save(usuario);
                    }
                }
            }

            return pedidoRepository.save(pedido);
        }
        return null;
    }
}