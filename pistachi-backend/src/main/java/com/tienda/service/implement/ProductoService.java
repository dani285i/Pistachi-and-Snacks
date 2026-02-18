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
}