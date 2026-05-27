package com.tienda.model;

import jakarta.persistence.*;

@Entity
@Table(name = "codigo_postal", uniqueConstraints = {@UniqueConstraint(columnNames = {"concello", "codigo"})})
public class CodigoPostal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private Concello concello;
    private String codigo;
    private String descripcion;

    public CodigoPostal() {}

    public CodigoPostal(Concello concello, String codigo, String descripcion) {
        this.concello = concello;
        this.codigo = codigo;
        this.descripcion = descripcion;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Concello getConcello() {
        return concello;
    }

    public void setConcello(Concello concello) {
        this.concello = concello;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}
