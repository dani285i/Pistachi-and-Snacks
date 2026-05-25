package com.tienda.service.implement;

import com.tienda.model.Producto;
import com.tienda.repository.IProductoRepository;
import com.tienda.service.interfaces.IProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductoService implements IProductoService {

    @Autowired
    private IProductoRepository productoRepository;

    @Override
    public List<Producto> obtenerTodos() {
        return productoRepository.findAll();
    }

    @Override
    public List<Producto> obtenerDestacados() {
        return productoRepository.findByDestacadoTrue();
    }

    @Override
    public Optional<Producto> buscarPorId(Long id) {
        return productoRepository.findById(id);
    }

    @Override
    public List<Producto> buscarPorTexto(String texto) {
        return productoRepository.findByNombreContainingIgnoreCaseOrDescripcionContainingIgnoreCase(texto, texto);
    }

    @Override
    public Producto guardar(Producto producto) {
        return productoRepository.save(producto);
    }

    @Override
    public Producto actualizar(Long id, Producto productoDetalles) {
        Optional<Producto> productoExistente = productoRepository.findById(id);
        
        if (productoExistente.isPresent()) {
            Producto producto = productoExistente.get();
            producto.setNombre(productoDetalles.getNombre());
            producto.setDescripcion(productoDetalles.getDescripcion());
            producto.setPrecio(productoDetalles.getPrecio());
            producto.setImagen(productoDetalles.getImagen());
            producto.setCategoria(productoDetalles.getCategoria());
            producto.setDestacado(productoDetalles.getDestacado());
            producto.setUnidades(productoDetalles.getUnidades());
            producto.setStock(productoDetalles.getStock());
            
            return productoRepository.save(producto);
        }
        return null; // O podrías lanzar una excepción personalizada aquí
    }

    @Override
    public void eliminar(Long id) {
        productoRepository.deleteById(id);
    }
    
}