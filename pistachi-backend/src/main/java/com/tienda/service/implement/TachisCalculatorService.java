package com.tienda.service.implement;

import com.tienda.model.CategoriaProducto;
import com.tienda.model.LineaPedido;
import org.springframework.stereotype.Service;

@Service
public class TachisCalculatorService {

    // esta es la funcion que calcula cuantos puntos te llevas por cada cosa que metes al carrito, mira la categoria del producto para ver si le toca el 4% el 5% o el 6%, como por ejemplo si es una galleta te da el 5% y ademas si es cara te da un poquito mas, despues te da mil puntos por cada euro para que sume rapido
    public int calcularTachisPorLinea(LineaPedido linea) {
        if (linea.getProducto() == null || linea.getProducto().getCategoria() == null) {
            return 0;
        }

        CategoriaProducto categoria = linea.getProducto().getCategoria();
        double precioProducto = linea.getPrecioUnitario(); 
        int cantidad = linea.getCantidad();

        double precioMin = 0.0;
        double precioMax = 0.0;
        double porcentajeBase = 0.0;

        // GRUPO 1: BOLLERIA, GALLETAS, DESAYUNOS
        if (categoria == CategoriaProducto.BOLLERIA || categoria == CategoriaProducto.GALLETAS || categoria == CategoriaProducto.DESAYUNOS) {
            precioMin = 2.0;
            precioMax = 4.0;
            porcentajeBase = 0.05;
        }
        // GRUPO 2: BEBIDAS
        else if (categoria == CategoriaProducto.BEBIDAS) {
            precioMin = 1.9;
            precioMax = 4.0;
            porcentajeBase = 0.06;
        }
        // GRUPO 3: HELADOS, POSTRES, UNTABLES, TARTAS, REPOSTERIA, DULCES
        else if (categoria == CategoriaProducto.HELADOS || categoria == CategoriaProducto.POSTRES || 
                 categoria == CategoriaProducto.UNTABLES || categoria == CategoriaProducto.TARTAS || 
                 categoria == CategoriaProducto.REPOSTERIA || categoria == CategoriaProducto.DULCES) {
            precioMin = 4.5;
            precioMax = 9.0;
            porcentajeBase = 0.04;
        } else {
            return 0;
        }

        double bono = 0.0;
        if (precioMax > precioMin) {
            bono = ((precioProducto - precioMin) / (precioMax - precioMin)) * 0.02;
        }

        double porcentajeFinal = porcentajeBase + bono;
        int tachisGanados = (int) Math.round((precioProducto * porcentajeFinal) * 1000);

        return tachisGanados * cantidad;
    }
}
