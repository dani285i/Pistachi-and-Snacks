package com.tienda.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum EstadoPedido {
    CANCELADO("Cancelado"),
    EN_PROCESO("En Proceso"),
    EN_TRANSITO("En Tránsito"),
    ENTREGADO("Entregado");

    private final String descripcion;

    EstadoPedido(String descripcion) {
        this.descripcion = descripcion;
    }

    @JsonValue
    public String getDescripcion() {
        return descripcion;
    }

    @JsonCreator
    public static EstadoPedido fromDescripcion(String descripcion) {
        for (EstadoPedido estado : values()) {
            if (estado.getDescripcion().equalsIgnoreCase(descripcion)) {
                return estado;
            }
        }
        throw new IllegalArgumentException("Estado desconocido: " + descripcion);
    }
}
