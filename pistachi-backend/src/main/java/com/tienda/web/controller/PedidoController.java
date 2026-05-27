package com.tienda.web.controller;

import com.tienda.model.LineaPedido;
import com.tienda.model.Pedido;
import com.tienda.model.EstadoPedido;
import com.tienda.model.Producto;
import com.tienda.model.Usuario;
import com.tienda.repository.IPedidoRepository;
import com.tienda.repository.IProductoRepository;
import com.tienda.repository.IUsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/pedidos")
@CrossOrigin(origins = "http://localhost:5173")
public class PedidoController {

    @Autowired
    private IPedidoRepository pedidoRepository;

    @Autowired
    private IProductoRepository productoRepository;

    @Autowired
    private IUsuarioRepository usuarioRepository;

    @PostMapping
    public ResponseEntity<?> crearPedido(@RequestBody PedidoRequest request) {
        try {
            Pedido pedido = new Pedido();
            pedido.setUsuarioId(request.getUsuarioId());
            pedido.setFecha(LocalDateTime.now());
            pedido.setEstado(EstadoPedido.EN_PROCESO);

            double subtotal = 0.0;

            for (LineaPedidoRequest lpReq : request.getLineas()) {
                Producto producto = productoRepository.findById(lpReq.getProductoId()).orElseThrow(() -> new RuntimeException("Producto no encontrado"));
                
                // Calcular subtotal real basado en el precio de la base de datos
                subtotal += producto.getPrecio() * lpReq.getCantidad();

                // Restar el stock
                int nuevoStock = producto.getStock() - lpReq.getCantidad();
                producto.setStock(Math.max(nuevoStock, 0));
                productoRepository.save(producto);

                LineaPedido linea = new LineaPedido();
                linea.setProducto(producto);
                linea.setCantidad(lpReq.getCantidad());
                linea.setPrecioUnitario(producto.getPrecio()); // Usar precio seguro de BD
                linea.setPedido(pedido);
                
                pedido.getLineas().add(linea);
            }

            // Calcular Envío y Descuento
            double costeEnvio = subtotal >= 30.0 ? 0.0 : 4.99;
            double totalCalculado = subtotal + costeEnvio;
            double descuento = 0.0;

            if (request.getTachisUsados() != null && request.getTachisUsados() > 0) {
                Usuario usuario = usuarioRepository.findById(request.getUsuarioId()).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
                if (usuario.getTachis() < request.getTachisUsados()) {
                    throw new RuntimeException("No tienes suficientes Tachis.");
                }
                descuento = request.getTachisUsados() / 1000.0;
                usuario.setTachis(usuario.getTachis() - request.getTachisUsados());
                usuarioRepository.save(usuario);
            }

            double totalFinal = Math.max(0, totalCalculado - descuento);

            // Verificación Anti-Trampas
            if (Math.abs(totalFinal - request.getTotal()) > 0.01) {
                throw new RuntimeException("El total calculado (" + totalFinal + "€) no coincide con el total proporcionado (" + request.getTotal() + "€). Intento de fraude detectado.");
            }

            pedido.setTotal(totalFinal);
            
            Pedido pedidoGuardado = pedidoRepository.save(pedido);
            return ResponseEntity.ok(pedidoGuardado);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error al crear el pedido: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Pedido>> obtenerTodosPedidos() {
        return ResponseEntity.ok(pedidoRepository.findAll());
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Pedido>> obtenerPedidosPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(pedidoRepository.findByUsuarioId(usuarioId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPedidoPorId(@PathVariable Long id) {
        java.util.Optional<Pedido> pedidoOpt = pedidoRepository.findById(id);
        if (pedidoOpt.isPresent()) {
            return ResponseEntity.ok(pedidoOpt.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstadoPedido(@PathVariable Long id, @RequestBody java.util.Map<String, String> payload) {
        java.util.Optional<Pedido> pedidoOpt = pedidoRepository.findById(id);
        if (pedidoOpt.isPresent()) {
            Pedido pedido = pedidoOpt.get();
            try {
                EstadoPedido nuevoEstado = EstadoPedido.fromDescripcion(payload.get("estado"));
                pedido.setEstado(nuevoEstado);
                pedidoRepository.save(pedido);
                return ResponseEntity.ok(pedido);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Estado inválido");
            }
        }
        return ResponseEntity.notFound().build();
    }

    // Clases DTO internas para recibir el JSON
    public static class PedidoRequest {
        private Long usuarioId;
        private Double total;
        private Integer tachisUsados;
        private List<LineaPedidoRequest> lineas;

        public Long getUsuarioId() { return usuarioId; }
        public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
        public Double getTotal() { return total; }
        public void setTotal(Double total) { this.total = total; }
        public Integer getTachisUsados() { return tachisUsados; }
        public void setTachisUsados(Integer tachisUsados) { this.tachisUsados = tachisUsados; }
        public List<LineaPedidoRequest> getLineas() { return lineas; }
        public void setLineas(List<LineaPedidoRequest> lineas) { this.lineas = lineas; }
    }

    public static class LineaPedidoRequest {
        private Long productoId;
        private Integer cantidad;
        private Double precioUnitario;

        public Long getProductoId() { return productoId; }
        public void setProductoId(Long productoId) { this.productoId = productoId; }
        public Integer getCantidad() { return cantidad; }
        public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
        public Double getPrecioUnitario() { return precioUnitario; }
        public void setPrecioUnitario(Double precioUnitario) { this.precioUnitario = precioUnitario; }
    }
}
