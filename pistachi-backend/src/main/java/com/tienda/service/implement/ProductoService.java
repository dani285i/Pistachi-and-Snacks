package com.tienda.service.implement;

import com.tienda.model.Producto;
import com.tienda.repository.IProductoRepository;
import com.tienda.service.interfaces.IProductoService;
import com.tienda.model.NotificacionStock;
import com.tienda.repository.INotificacionStockRepository;
import com.tienda.repository.IUsuarioRepository;
import com.tienda.service.EmailService;
import com.tienda.model.Usuario;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProductoService implements IProductoService {

    @Autowired
    private IProductoRepository productoRepository;

    @Autowired
    private INotificacionStockRepository notificacionRepository;

    @Autowired
    private IUsuarioRepository usuarioRepository;

    @Autowired
    private EmailService emailService;

    @Override
    public List<Producto> obtenerTodos() {
        return productoRepository.findAll();
    }

    @Override
    public List<Producto> obtenerDestacados() {
        return productoRepository.findByDestacadoTrue();
    }

    @Override
    public Optional<Producto> buscarPorId(Long id) {
        return productoRepository.findById(id);
    }

    @Override
    public List<Producto> buscarPorTexto(String texto) {
        return productoRepository.findByNombreContainingIgnoreCaseOrDescripcionContainingIgnoreCase(texto, texto);
    }

    @Override
    public Producto guardar(Producto producto) {
        return productoRepository.save(producto);
    }

    @Override
    @Transactional
    public Producto actualizar(Long id, Producto productoDetalles) {
        Optional<Producto> productoExistente = productoRepository.findById(id);
        
        if (productoExistente.isPresent()) {
            Producto producto = productoExistente.get();
            boolean notificar = producto.getStock() == 0 && productoDetalles.getStock() > 0;

            producto.setNombre(productoDetalles.getNombre());
            producto.setDescripcion(productoDetalles.getDescripcion());
            producto.setPrecio(productoDetalles.getPrecio());
            producto.setImagen(productoDetalles.getImagen());
            producto.setCategoria(productoDetalles.getCategoria());
            producto.setDestacado(productoDetalles.getDestacado());
            producto.setUnidades(productoDetalles.getUnidades());
            producto.setStock(productoDetalles.getStock());
            
            Producto productoGuardado = productoRepository.save(producto);

            if (notificar) {
                List<NotificacionStock> notificaciones = notificacionRepository.findByProducto(productoGuardado);
                for (NotificacionStock notificacion : notificaciones) {
                    try {
                        emailService.enviarEmailStockDisponible(notificacion.getUsuario().getEmail(), notificacion.getUsuario().getNombre(), productoGuardado.getNombre());
                    } catch (Exception e) {
                        System.err.println("Error al notificar al usuario " + notificacion.getUsuario().getEmail() + ": " + e.getMessage());
                    }
                }
                notificacionRepository.deleteByProducto(productoGuardado);
            }
            
            return productoGuardado;
        }
        return null; // O podrías lanzar una excepción personalizada aquí
    }

    @Override
    public void eliminar(Long id) {
        productoRepository.deleteById(id);
    }
    
    @Override
    public void registrarNotificacionStock(Long productoId, Long usuarioId) {
        Optional<Producto> productoOpt = productoRepository.findById(productoId);
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(usuarioId);

        if (productoOpt.isPresent() && usuarioOpt.isPresent()) {
            Producto producto = productoOpt.get();
            Usuario usuario = usuarioOpt.get();

            Optional<NotificacionStock> existente = notificacionRepository.findFirstByUsuarioAndProducto(usuario, producto);
            if (existente.isEmpty()) {
                NotificacionStock notificacion = new NotificacionStock();
                notificacion.setUsuario(usuario);
                notificacion.setProducto(producto);
                notificacionRepository.save(notificacion);
            }
        }
    }

    @Override
    public void resetearNotificacionesStock(Long productoId) {
        Optional<Producto> productoOpt = productoRepository.findById(productoId);
        if (productoOpt.isPresent()) {
            notificacionRepository.deleteByProducto(productoOpt.get());
        }
    }

    @Override
    public boolean estaSuscritoANotificacion(Long productoId, Long usuarioId) {
        Optional<Producto> productoOpt = productoRepository.findById(productoId);
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(usuarioId);
        if (productoOpt.isPresent() && usuarioOpt.isPresent()) {
            return notificacionRepository.findFirstByUsuarioAndProducto(usuarioOpt.get(), productoOpt.get()).isPresent();
        }
        return false;
    }
}