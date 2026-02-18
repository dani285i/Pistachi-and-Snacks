package com.tienda.service.interfaces;

import com.tienda.model.Producto;
import java.util.List;
import java.util.Optional;

public interface IProductoService {
    List<Producto> obtenerTodos();
    List<Producto> obtenerDestacados();
    Optional<Producto> buscarPorId(Long id);
    List<Producto> buscarPorTexto(String texto);
}