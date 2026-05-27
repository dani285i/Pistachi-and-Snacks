package com.tienda.service.interfaces;

import com.tienda.model.Pedido;
import com.tienda.model.Usuario;
import java.util.List;

public interface IPedidoService {
    Pedido guardarPedido(Pedido pedido);
    List<Pedido> obtenerPedidosPorUsuario(Usuario usuario);
    Pedido obtenerPorId(Long id);
    
    Pedido crearPedido(Long usuarioId, Double totalReclamado, Integer tachisUsados, List<com.tienda.web.controller.PedidoController.LineaPedidoRequest> lineasDatos);
    Pedido actualizarEstadoPedido(Long id, com.tienda.model.EstadoPedido nuevoEstado);
}