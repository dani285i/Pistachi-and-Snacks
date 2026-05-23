package com.tienda.service.interfaces;

import com.tienda.model.Pedido;
import com.tienda.model.Usuario;
import java.util.List;

public interface IPedidoService {
    Pedido guardarPedido(Pedido pedido);
    List<Pedido> obtenerPedidosPorUsuario(Usuario usuario);
    Pedido obtenerPorId(Long id);
}