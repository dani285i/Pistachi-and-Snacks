package com.tienda.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Concello {
    A_CORUNA("A Coruña"),
    CULLEREDO("Culleredo"),
    OLEIROS("Oleiros"),
    CAMBRE("Cambre"),
    BERGONDO("Bergondo"),
    BETANZOS("Betanzos");

    private final String nombre;

    Concello(String nombre) {
        this.nombre = nombre;
    }

    @JsonValue
    public String getNombre() {
        return nombre;
    }
}
