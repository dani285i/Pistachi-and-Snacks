import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { scroller, Element } from 'react-scroll';
import Hero from '../../components/hero/Hero';
import Novedad from '../../components/novedad/Novedad';
import ProductCard from '../../components/productcard/ProductCard';
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
    
    const navigate = useNavigate();
    const location = useLocation();

    // Detecta si venimos de otra pestaña con la orden de bajar a novedades
    useEffect(() => {
        if (location.state && (location.state as any).hacerScrollANovedades) {
            // Esperamos un instante corto para que el usuario asimile que volvió al inicio
            const timer = setTimeout(() => {
                scroller.scrollTo('seccion-novedad', {
                    smooth: true,
                    duration: 1000,
                    offset: -70
                });
                
                // Limpiamos el estado de la navegación para que si el usuario pulsa F5 no vuelva a hacer scroll solo
                window.history.replaceState({}, document.title);
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [location]);

    // Carga los productos estrella desde la API de Spring Boot
    useEffect(() => {
        const obtenerProductosDestacados = async () => {
            try {
                setEstaCargando(true);
                const respuesta = await fetch('http://localhost:9090/productos/destacados');
                if (!respuesta.ok) throw new Error('El servidor respondió con error');
                const datosGuardados = await respuesta.json();
                setProductos(datosGuardados);
            } catch (error) {
                console.error("Vaya no pudimos conectar con Spring Boot", error);
                setHuboError(true);
            } finally {
                setEstaCargando(false);
            }
        };
        obtenerProductosDestacados();
    }, []);

    return (
        <div className="home-wrapper">
            <Hero />
            
            <section className="craft-welcome">
                <div className="welcome-content">
                    <svg className="decorative-leaf" viewBox="0 0 24 24" fill="none" stroke="#8BC34A" strokeWidth="1.5">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                    </svg>
                    <h2>El Arte del Pistacho</h2>
                    <p>
                        Bienvenido a tu rincón de confianza. Amasamos, horneamos y preparamos cada detalle a mano, 
                        fusionando la repostería clásica con el inconfundible carácter de nuestra tierra.
                    </p>
                </div>
            </section>

            {/* El punto de destino del scroll automático perfectamente configurado */}
            <Element name="seccion-novedad">
                <Novedad />
            </Element>

            <section className="craft-showcase">
                <div className="showcase-header">
                    <h2>Recién salidos del horno</h2>
                    <p>Nuestros clásicos más queridos por los clientes</p>
                </div>
                
                {estaCargando ? (
                    <div className="showcase-status">Preparando la vitrina...</div>
                ) : huboError ? (
                    <div className="showcase-status error">No hemos podido colocar los productos en el escaparate.</div>
                ) : (
                    <div className="craft-grid">
                        {productos.map((producto) => (
                            <ProductCard key={producto.id} producto={producto} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;