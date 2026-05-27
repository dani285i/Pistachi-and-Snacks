package com.tienda.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum CategoriaProducto {
    BOLLERIA("Bollería"),
    REPOSTERIA("Repostería"),
    TARTAS("Tartas"),
    BEBIDAS("Bebidas"),
    DULCES("Dulces"),
    UNTABLES("Untables"),
    GALLETAS("Galletas"),
    HELADOS("Helados"),
    POSTRES("Postres"),
    DESAYUNOS("Desayunos");

    private final String nombre;

    CategoriaProducto(String nombre) {
        this.nombre = nombre;
    }

    @JsonValue
    public String getNombre() {
        return nombre;
    }
}
