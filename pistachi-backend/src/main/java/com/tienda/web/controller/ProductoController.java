package com.tienda.web.controller;

import org.springframework.web.bind.annotation.*;

import com.tienda.model.Producto;
import com.tienda.repository.ProductoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/productos")
@CrossOrigin(origins = "http://localhost:5173") 
public class ProductoController {

    @Autowired
    private ProductoRepository repositorio;

    @GetMapping
    public List<Producto> obtenerTodos() {
        return repositorio.findAll();
    }

    @GetMapping("/destacados")
    public List<Producto> obtenerDestacados() {
        return repositorio.findByDestacadoTrue();
    }
}