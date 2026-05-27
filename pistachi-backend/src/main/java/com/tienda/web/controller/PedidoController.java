package com.tienda.web.controller;

import com.tienda.model.LineaPedido;
import com.tienda.model.Pedido;
import com.tienda.model.EstadoPedido;
import com.tienda.model.Producto;
import com.tienda.model.Usuario;
import com.tienda.repository.IPedidoRepository;
import com.tienda.repository.IProductoRepository;
import com.tienda.repository.IUsuarioRepository;
import com.tienda.service.interfaces.IPedidoService;
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
    private IPedidoService pedidoService;

    @Autowired
    private IPedidoRepository pedidoRepository;

    @Autowired
    private IProductoRepository productoRepository;

    @Autowired
    private IUsuarioRepository usuarioRepository;

    @PostMapping
    public ResponseEntity<?> crearPedido(@RequestBody PedidoRequest request) {
        try {
            Pedido pedidoGuardado = pedidoService.crearPedido(
                    request.getUsuarioId(),
                    request.getTotal(),
                    request.getTachisUsados(),
                    request.getLineas()
            );
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
        try {
            EstadoPedido nuevoEstado = EstadoPedido.fromDescripcion(payload.get("estado"));
            Pedido pedidoActualizado = pedidoService.actualizarEstadoPedido(id, nuevoEstado);
            if (pedidoActualizado != null) {
                return ResponseEntity.ok(pedidoActualizado);
            }
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Estado inválido");
        }
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
