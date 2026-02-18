package com.tienda.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tienda.model.Producto;

import java.util.List;

public interface IProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByDestacadoTrue();
    List<Producto> findByNombreContainingIgnoreCaseOrDescripcionContainingIgnoreCase(String nombre, String descripcion);
}