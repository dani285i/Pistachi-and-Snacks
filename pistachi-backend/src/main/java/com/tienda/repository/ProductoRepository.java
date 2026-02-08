package com.tienda.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tienda.model.Producto;

import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    // Aquí definimos búsquedas personalizadas
    // Spring entiende esto automáticamente: "Buscar por destacado igual a True"
    List<Producto> findByDestacadoTrue();
}