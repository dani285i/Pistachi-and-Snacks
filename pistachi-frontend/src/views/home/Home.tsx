import { useEffect, useState } from 'react';
import Hero from '../../components/hero/Hero';
import './Home.css';

interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen: string;
    categoria: string;
    destacado: boolean;
}

const Home = () => {

    const [productos, setProductos] = useState<Producto[]>([]);
    const [estaCargando, setEstaCargando] = useState<boolean>(true);
    const [huboError, setHuboError] = useState<boolean>(false);

    useEffect(() => {
        
        const obtenerProductosDestacados = async () => {

            try {

                setEstaCargando(true);
                
                const respuesta = await fetch('http://localhost:80/productos/destacados');
                if (!respuesta.ok) {
                    throw new Error('El servidor respondió con error');
                }

                const datosGuardados = await respuesta.json();
                
                setProductos(datosGuardados);

            } catch (error) {
                console.error("Vaya, no pudimos conectar con Spring Boot:", error);
                setHuboError(true);
            } finally {

                setEstaCargando(false);
            }
        };

        obtenerProductosDestacados();

    }, []);

    if (estaCargando) {
        return (
            <div className="home-container">
                <Hero />
                <div className="estado-carga">
                    <h2>Preparando las mejores delicias...</h2>
                    <p>Espera...</p>
                </div>
            </div>
        );
    }

    if (huboError) {
        return (
            <div className="home-container">
                <Hero />
                <div className="estado-error">
                    <h2>¡Ups! Algo salió mal</h2>
                    <p>No pudimos cargar los productos.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="home-container">

            <Hero />

            <section className="seccion-destacados">
                
                <div className="encabezado-seccion">
                    <h2>Nuestros Favoritos</h2>
                    <p>Los snacks de pistacho que más enamoran a nuestros clientes.</p>
                </div>
                
                <div className="rejilla-productos">
                    {productos.map((producto) => (
                    
                        <article key={producto.id} className="tarjeta-producto">
                            <div className="tarjeta-imagen">

                                <img src={producto.imagen} alt={`Foto de ${producto.nombre}`} />
                                <span className="etiqueta-destacado">Top Ventas</span>

                            </div>
                            
                            <div className="tarjeta-contenido">

                                <h3 className="tarjeta-titulo">
                                    {producto.nombre}
                                </h3>
                                <p className="tarjeta-descripcion">
                                    {producto.descripcion}
                                </p>
                                
                                <div className="tarjeta-pie">

                                    <span className="precio">
                                        {producto.precio.toFixed(2)} €
                                    </span>
                                    
                                    <button className="boton-comprar">Añadir</button>

                                </div>
                            </div>
                        </article>
                    ))}

                </div>
            </section>
        </div>
    );
};

export default Home;