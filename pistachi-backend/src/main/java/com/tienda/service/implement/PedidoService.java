package com.tienda.service.implement;

import com.tienda.model.Pedido;
import com.tienda.model.Usuario;
import com.tienda.repository.IPedidoRepository;
import com.tienda.service.interfaces.IPedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PedidoService implements IPedidoService {

    @Autowired
    private IPedidoRepository pedidoRepository;

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
}