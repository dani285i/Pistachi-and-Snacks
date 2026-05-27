package com.tienda.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "producto")
@NoArgsConstructor
@Data
public class Producto {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nombre;
    
    @Column(columnDefinition = "TEXT")
    private String descripcion;
    
    private Double precio;

    private String imagen;

    @Enumerated(EnumType.STRING)
    private CategoriaProducto categoria;

    private Boolean destacado;

    @Column(name = "unidades")
    private Integer unidades = 1;

    @Column(name = "stock")
    private Integer stock = 0;

}