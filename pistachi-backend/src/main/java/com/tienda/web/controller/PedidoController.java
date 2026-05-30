package com.tienda.web.controller;

import java.util.List;
import java.util.ArrayList;
import java.time.LocalDateTime;
import com.tienda.model.LineaPedido;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tienda.model.EstadoPedido;
import com.tienda.model.Pedido;
import com.tienda.repository.IPedidoRepository;
import com.tienda.repository.IProductoRepository;
import com.tienda.repository.IUsuarioRepository;
import com.tienda.service.interfaces.IPedidoService;

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
    // este endpoint es la puerta de entrada cuando le das a pagar en el carrito, coge todo lo que has mandado y se lo pasa al servicio de pedidos para que haga la magia, como por ejemplo revisar si te da los puntos del cashback
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
    public ResponseEntity<List<PedidoResponseDTO>> obtenerTodosPedidos() {
        List<Pedido> pedidos = pedidoRepository.findAll();
        List<PedidoResponseDTO> dtos = new ArrayList<>();
        for (Pedido p : pedidos) {
            PedidoResponseDTO dto = new PedidoResponseDTO();
            dto.setId(p.getId());
            dto.setUsuarioId(p.getUsuarioId());
            dto.setFecha(p.getFecha());
            dto.setTotal(p.getTotal());
            dto.setEstado(p.getEstado());
            dto.setTachisGenerados(p.getTachisGenerados());
            dto.setLineas(p.getLineas());
            
            usuarioRepository.findById(p.getUsuarioId()).ifPresentOrElse(
                u -> dto.setNombreUsuario(u.getNombre()),
                () -> dto.setNombreUsuario("Desconocido")
            );
            dtos.add(dto);
        }
        return ResponseEntity.ok(dtos);
    }

        @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<PedidoResponseDTO>> obtenerPedidosPorUsuario(@PathVariable Long usuarioId) {
        List<Pedido> pedidos = pedidoRepository.findByUsuarioId(usuarioId);
        List<PedidoResponseDTO> dtos = new ArrayList<>();
        for (Pedido p : pedidos) {
            PedidoResponseDTO dto = new PedidoResponseDTO();
            dto.setId(p.getId());
            dto.setUsuarioId(p.getUsuarioId());
            dto.setFecha(p.getFecha());
            dto.setTotal(p.getTotal());
            dto.setEstado(p.getEstado());
            dto.setTachisGenerados(p.getTachisGenerados());
            dto.setLineas(p.getLineas());
            
            usuarioRepository.findById(p.getUsuarioId()).ifPresentOrElse(
                u -> dto.setNombreUsuario(u.getNombre()),
                () -> dto.setNombreUsuario("Desconocido")
            );
            dtos.add(dto);
        }
        return ResponseEntity.ok(dtos);
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
            return ResponseEntity.badRequest().body("Estado invÃƒÂ¡lido");
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

    public static class PedidoResponseDTO {
        private Long id;
        private Long usuarioId;
        private String nombreUsuario;
        private LocalDateTime fecha;
        private Double total;
        private EstadoPedido estado;
        private Integer tachisGenerados;
        private List<LineaPedido> lineas;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getUsuarioId() { return usuarioId; }
        public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
        public String getNombreUsuario() { return nombreUsuario; }
        public void setNombreUsuario(String nombreUsuario) { this.nombreUsuario = nombreUsuario; }
        public LocalDateTime getFecha() { return fecha; }
        public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }
        public Double getTotal() { return total; }
        public void setTotal(Double total) { this.total = total; }
        public EstadoPedido getEstado() { return estado; }
        public void setEstado(EstadoPedido estado) { this.estado = estado; }
        public Integer getTachisGenerados() { return tachisGenerados; }
        public void setTachisGenerados(Integer tachisGenerados) { this.tachisGenerados = tachisGenerados; }
        public List<LineaPedido> getLineas() { return lineas; }
        public void setLineas(List<LineaPedido> lineas) { this.lineas = lineas; }
    }
}