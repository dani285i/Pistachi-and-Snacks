package com.tienda.repository;

import com.tienda.model.Pedido;
import com.tienda.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IPedidoRepository extends JpaRepository<Pedido, Long> {
    // Consulta personalizada para obtener todos los pedidos de un cliente específico
    List<Pedido> findByUsuario(Usuario usuario);
}