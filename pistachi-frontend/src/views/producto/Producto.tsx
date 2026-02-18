import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Añadido
import { useCart } from '../../context/carrito/Carrito';
import { useAuth } from '../../context/auth/Auth'; // Añadido
import './Producto.css';

interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen: string;
    categoria: string;
    destacado: boolean;
}

const Productos = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);
    const [huboError, setHuboError] = useState<boolean>(false);
    const [textoBusqueda, setTextoBusqueda] = useState<string>('');
    
    const { addToCart } = useCart();
    const { usuario } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const obtenerTodosLosProductos = async () => {
            try {
                setCargando(true);
                const respuesta = await fetch('http://localhost:80/productos');
                if (!respuesta.ok) throw new Error('Fallo al recuperar los productos');
                const datosGuardados = await respuesta.json();
                setProductos(datosGuardados);
            } catch (error) {
                console.error("Error:", error);
                setHuboError(true);
            } finally {
                setCargando(false);
            }
        };
        obtenerTodosLosProductos();
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

    const productosFiltrados = productos.filter((producto) => {
        const busquedaMinusculas = textoBusqueda.toLowerCase();
        const nombreSeguro = producto.nombre ? producto.nombre.toLowerCase() : "";
        const descripcionSegura = producto.descripcion ? producto.descripcion.toLowerCase() : "";
        return nombreSeguro.includes(busquedaMinusculas) || descripcionSegura.includes(busquedaMinusculas);
    });

    if (cargando) return <div className="catalogo-estado"><h2>Cargando...</h2></div>;
    if (huboError) return <div className="catalogo-estado error"><h2>Error de conexión</h2></div>;

    return (
        <div className="catalogo-contenedor">
            <header className="catalogo-cabecera">
                <h1>Menú Completo</h1>
                <div className="contenedor-buscador">
                    <input 
                        type="text" 
                        className="input-buscador"
                        placeholder="Buscar..." 
                        value={textoBusqueda}
                        onChange={(evento) => setTextoBusqueda(evento.target.value)}
                    />
                </div>
            </header>

            <section className="catalogo-resultados">
                <div className="rejilla-catalogo">
                    {productosFiltrados.map((producto) => (
                        <article key={producto.id} className="tarjeta-basica">
                            <div className="tarjeta-basica-img">
                                <img src={producto.imagen} alt={producto.nombre} />
                            </div>
                            <div className="tarjeta-basica-info">
                                <h3>{producto.nombre}</h3>
                                <p className="descripcion-corta">{producto.descripcion}</p>
                                <div className="tarjeta-basica-pie">
                                    <span className="precio-etiqueta">
                                        {producto.precio.toFixed(2)} €
                                    </span>
                                    {usuario ? (
                                        <button className="boton-accion" onClick={() => añadirItem(producto)}>
                                            Añadir al Carrito
                                        </button>
                                    ) : (
                                        <button className="boton-accion" onClick={() => navigate('/login')}>
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
};

export default Productos;