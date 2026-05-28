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
    // esta ruta te devuelve la lista completa de productos que hay en la tienda, es lo que usa la pagina principal para pintar todos los dulces y snacks de golpe en la pantalla
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
    // aqui es donde mandas los datos nuevos cuando editas un producto desde el panel de admin, como por ejemplo si quieres cambiarle el precio a unas galletas o subirle el stock cuando te llega mercancia nueva
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

    @DeleteMapping("/{id}/notificar-stock")
    public ResponseEntity<Void> resetearNotificacionesStock(@PathVariable Long id) {
        productoService.resetearNotificacionesStock(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/{id}/notificar-status")
    public ResponseEntity<Boolean> estaSuscrito(@PathVariable Long id, @RequestParam Long usuarioId) {
        boolean suscrito = productoService.estaSuscritoANotificacion(id, usuarioId);
        return new ResponseEntity<>(suscrito, HttpStatus.OK);
    }
}