package com.tienda.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum RolUsuario {
    ADMIN("ADMIN"),
    USUARIO("USUARIO");

    private final String nombre;

    RolUsuario(String nombre) {
        this.nombre = nombre;
    }

    @JsonValue
    public String getNombre() {
        return nombre;
    }
}
