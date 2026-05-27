package com.tienda.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tienda.model.Producto;
import com.tienda.service.interfaces.IProductoService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/productos")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductoController {

    @Autowired
    private IProductoService productoService;

    @GetMapping
    public ResponseEntity<List<Producto>> obtenerTodos() {
        List<Producto> productos = productoService.obtenerTodos();
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/destacados")
    public ResponseEntity<List<Producto>> obtenerDestacados() {
        List<Producto> destacados = productoService.obtenerDestacados();
        return ResponseEntity.ok(destacados);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerPorId(@PathVariable Long id) {
        Optional<Producto> producto = productoService.buscarPorId(id);
        
        if (producto.isPresent()) {
            return ResponseEntity.ok(producto.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Producto>> buscarPorTexto(@RequestParam String texto) {
        List<Producto> productos = productoService.buscarPorTexto(texto);
        return ResponseEntity.ok(productos);
    }

    @PostMapping
    public ResponseEntity<Producto> crearProducto(@RequestBody Producto producto) {
        Producto nuevoProducto = productoService.guardar(producto);
        return new ResponseEntity<>(nuevoProducto, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizarProducto(@PathVariable Long id, @RequestBody Producto producto) {
        Producto productoActualizado = productoService.actualizar(id, producto);
        if (productoActualizado != null) {
            return new ResponseEntity<>(productoActualizado, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        Optional<Producto> producto = productoService.buscarPorId(id);
        if (producto.isPresent()) {
            productoService.eliminar(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/{id}/notificar-stock")
    public ResponseEntity<Void> registrarNotificacionStock(@PathVariable Long id, @RequestBody java.util.Map<String, Object> payload) {
        Object obj = payload.get("usuarioId");
        if (obj instanceof Number) {
            Long usuarioId = ((Number) obj).longValue();
            productoService.registrarNotificacionStock(id, usuarioId);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
}