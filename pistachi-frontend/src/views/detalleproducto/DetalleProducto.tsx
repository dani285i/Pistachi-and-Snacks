// src/views/detalle/DetalleProducto.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './DetalleProducto.css';


interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen: string;
    categoria: string;
    destacado: boolean;
}


const DetalleProducto = () => {

    const { id } = useParams();

    // Estados para manejar los datos
    const [producto, setProducto] = useState<Producto | null>(null);
    const [cargando, setCargando] = useState<boolean>(true);
    const [huboError, setHuboError] = useState<boolean>(false);


    useEffect(() => {
        
        const obtenerDetalleProducto = async () => {
            try {
                setCargando(true);
                
                const respuesta = await fetch(`http://localhost:8080/productos/${id}`);
                
                if (!respuesta.ok) {
                    throw new Error('No se encontró el producto en el servidor');
                }

                const datosGuardados = await respuesta.json();
                setProducto(datosGuardados);

            } catch (error) {
                console.error("Error al cargar el detalle:", error);
                setHuboError(true);
            } finally {
                setCargando(false);
            }
        };

        if (id) {
            obtenerDetalleProducto();
        }

    }, [id]);

    if (cargando) {
        return (
            <div className="detalle-estado">
                <h2>Cargando información del producto...</h2>
            </div>
        );
    }

    if (huboError || !producto) {
        return (
            <div className="detalle-estado error">
                <h2>No hemos encontrado este producto</h2>
                <p>Es posible que haya sido retirado de nuestro menú.</p>
                <Link to="/productos" className="boton-volver">Volver al catálogo</Link>
            </div>
        );
    }

    return (
        <div className="detalle-contenedor">
            
            <div className="botonera-superior">
                <Link to="/productos" className="enlace-volver">
                    Volver al menú
                </Link>
            </div>

            <article className="detalle-tarjeta">
                
                <div className="detalle-galeria">
                    <img 
                        src={producto.imagen} 
                        alt={`Fotografía de ${producto.nombre}`} 
                        className="detalle-imagen"
                    />
                </div>

                <div className="detalle-info">
                    
                    <span className="detalle-categoria">
                        {producto.categoria}
                    </span>
                    
                    <h1 className="detalle-titulo">
                        {producto.nombre}
                    </h1>
                    
                    <p className="detalle-precio">
                        {producto.precio.toFixed(2)} €
                    </p>
                    
                    <div className="detalle-descripcion">
                        <h3>Acerca de esta delicia</h3>
                        <p>{producto.descripcion}</p>
                    </div>

                    <div className="detalle-acciones">
                        
                        <div className="selector-cantidad">
                            <label htmlFor="cantidad">Cantidad:</label>
                            <input 
                                type="number" 
                                id="cantidad" 
                                defaultValue="1" 
                                min="1" 
                                max="10" 
                            />
                        </div>
                        
                        <button className="boton-añadir-carrito">
                            Añadir al Carrito
                        </button>

                    </div>

                </div>

            </article>

        </div>
    );
};

export default DetalleProducto;