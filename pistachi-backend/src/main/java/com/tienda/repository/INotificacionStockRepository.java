package com.tienda.repository;

import com.tienda.model.NotificacionStock;
import com.tienda.model.Producto;
import com.tienda.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface INotificacionStockRepository extends JpaRepository<NotificacionStock, Long> {
    List<NotificacionStock> findByProducto(Producto producto);
    Optional<NotificacionStock> findFirstByUsuarioAndProducto(Usuario usuario, Producto producto);
    
    @Transactional
    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("DELETE FROM NotificacionStock n WHERE n.producto = :producto")
    void deleteByProducto(@org.springframework.data.repository.query.Param("producto") Producto producto);
}
