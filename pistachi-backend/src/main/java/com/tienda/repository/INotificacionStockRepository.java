package com.tienda.repository;

import com.tienda.model.NotificacionStock;
import com.tienda.model.Producto;
import com.tienda.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface INotificacionStockRepository extends JpaRepository<NotificacionStock, Long> {
    List<NotificacionStock> findByProducto(Producto producto);
    Optional<NotificacionStock> findByUsuarioAndProducto(Usuario usuario, Producto producto);
    void deleteByProducto(Producto producto);
}
