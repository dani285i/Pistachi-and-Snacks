import React, { useEffect, useState } from 'react';
import './Novedad.css';

interface Producto {
    id: number;
    nombre: string;
    precio: number;
    imagen: string;
}

const Novedad: React.FC = () => {
    // cambia este id cuando quieras que aparezca otro producto en la seccion de novedad, la imagen la tienes que poner tu manualmente
    const idProductoTarget = 6; 

    const [producto, setProducto] = useState<Producto | null>(null);
    const [cargando, setCargando] = useState<boolean>(true);

    useEffect(() => {
        const obtenerProductoNovedad = async () => {
            try {
                setCargando(true);
                const respuesta = await fetch(`http://localhost:80/productos/${idProductoTarget}`);
                
                if (!respuesta.ok) {
                    throw new Error('No se pudo recuperar la novedad');
                }

                const datos = await respuesta.json();
                setProducto(datos);
            } catch (error) {
                console.error("Error al cargar la novedad:", error);
            } finally {
                setCargando(false);
            }
        };

        obtenerProductoNovedad();
    }, [idProductoTarget]);

    if (cargando || !producto) {
        return <section className="novedad-fullscreen"><p>Cargando novedad...</p></section>;
    }

    return (
        <section className="novedad-fullscreen">
            <div className="novedad-left">
                <img 
                    src='/img/crema-de-pistacho-novedad.png'
                    alt={`Foto de ${producto.nombre}`} 
                    className="novedad-hero-image"
                />
            </div>
            
            <div className="novedad-right">
                <h1 className="novedad-alert">¡NOVEDAD!</h1>
                <h2 className="novedad-hero-title">{producto.nombre}</h2>
                <span className="novedad-hero-price">{producto.precio.toFixed(2)} €</span>
                <button 
                    className="novedad-hero-button"
                    onClick={() => window.location.href = `/producto/${producto.id}`}
                >
                    Ver más
                </button>
            </div>
        </section>
    );
};

export default Novedad;