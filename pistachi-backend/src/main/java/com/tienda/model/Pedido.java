package com.tienda.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "pedido")
@NoArgsConstructor
@Data
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Aquí guardamos el ID del usuario que hizo la compra
    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @Column(nullable = false)
    private Double total;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoPedido estado; // CANCELADO, EN_PROCESO, EN_TRANSITO, ENTREGADO

    @Column(name = "tachis_generados", nullable = false)
    private Integer tachisGenerados = 0;

    // Relación: Un pedido tiene muchas líneas de pedido. 
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LineaPedido> lineas = new ArrayList<>();

}