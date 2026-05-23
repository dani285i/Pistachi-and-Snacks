package com.tienda.repository;

import com.tienda.model.LineaPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ILineaPedidoRepository extends JpaRepository<LineaPedido, Long> {
}