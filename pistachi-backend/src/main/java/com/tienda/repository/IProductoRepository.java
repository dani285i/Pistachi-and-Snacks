package com.tienda.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tienda.model.Producto;

import java.util.List;

public interface IProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByDestacadoTrue();
    List<Producto> findByNombreContainingIgnoreCaseOrDescripcionContainingIgnoreCase(String nombre, String descripcion);

    @org.springframework.transaction.annotation.Transactional
    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query(value = "DELETE FROM usuario_favoritos WHERE producto_id = :productoId", nativeQuery = true)
    void removeFromAllFavorites(@org.springframework.data.repository.query.Param("productoId") Long productoId);

    @org.springframework.transaction.annotation.Transactional
    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query(value = "DELETE FROM linea_pedido WHERE producto_id = :productoId", nativeQuery = true)
    void removeAllLineaPedidos(@org.springframework.data.repository.query.Param("productoId") Long productoId);
}