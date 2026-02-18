import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../../components/hero/Hero';
import Novedad from '../../components/novedad/Novedad';
import { useCart } from '../../context/carrito/Carrito';
import { useAuth } from '../../context/auth/Auth';
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
    const { addToCart } = useCart();
    const { usuario } = useAuth();
    const navigate = useNavigate();

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

    const añadirItem = (prod: Producto) => {
        addToCart({
            id: prod.id,
            nombre: prod.nombre,
            precio: prod.precio,
            imagen: prod.imagen,
            cantidad: 1
        });
        alert(`${prod.nombre} añadido al carrito`);
    };

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
            <Novedad />

            <section className="destacados-section">

                <h2 className="section-title">Nuestros Favoritos</h2>
                
                <div className="productos-grid">
                    {productos.map((producto) => (
                    
                        <article key={producto.id} className="producto-card">
                            
                            <div className="img-container">
                                <img src={producto.imagen} alt={`Foto de ${producto.nombre}`} />
                                <span className="badge">Top Ventas</span>
                            </div>
                            
                            <div className="producto-info">
                                <h3>{producto.nombre}</h3>

                                <p className="descripcion">
                                    {producto.descripcion}
                                </p>
                                
                                <div className="producto-footer">
                                    <span className="precio">
                                        {producto.precio.toFixed(2)} €
                                    </span>

                                    {usuario ? (
                                        <button className="add-btn" onClick={() => añadirItem(producto)}>
                                            Añadir al Carrito
                                        </button>
                                    ) : (
                                        <button className="add-btn" onClick={() => navigate('/login')}>
                                            Inicia sesión para comprar
                                        </button>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
}
export default Home;