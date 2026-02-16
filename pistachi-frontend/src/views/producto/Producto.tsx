import { useEffect, useState } from 'react';
import './Productos.css';

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

    useEffect(() => {
        const obtenerTodosLosProductos = async () => {
            try {
                setCargando(true);
                
                const respuesta = await fetch('http://localhost:8080/productos');
                
                if (!respuesta.ok) {
                    throw new Error('Fallo al recuperar los productos del servidor');
                }

                const datosGuardados = await respuesta.json();
                setProductos(datosGuardados);

            } catch (error) {
                console.error("Error de conexión con Spring Boot:", error);
                setHuboError(true);
            } finally {
                setCargando(false);
            }
        };

        obtenerTodosLosProductos();

    }, []);

    const productosFiltrados = productos.filter((producto) => {
        const busquedaMinusculas = textoBusqueda.toLowerCase();
        const nombreSeguro = producto.nombre ? producto.nombre.toLowerCase() : "";
        const descripcionSegura = producto.descripcion ? producto.descripcion.toLowerCase() : "";

        return nombreSeguro.includes(busquedaMinusculas) || 
            descripcionSegura.includes(busquedaMinusculas);
    });

    if (cargando) {
        return (
            <div className="catalogo-estado">
                <h2>Cargando nuestro catálogo completo...</h2>
                <p>Por favor, espera un momento.</p>
            </div>
        );
    }

    if (huboError) {
        return (
            <div className="catalogo-estado error">
                <h2>No hemos podido conectar con el menú</h2>
                <p>Revisa que el servidor de datos esté en funcionamiento.</p>
            </div>
        );
    }

    return (
        <div className="catalogo-contenedor">
            <header className="catalogo-cabecera">
                <h1>Menú Completo</h1>
                <p>Descubre todas nuestras creaciones artesanales.</p>

                <div className="contenedor-buscador">
                    <input 
                        type="text" 
                        className="input-buscador"
                        placeholder="Buscar por nombre o ingredientes..." 
                        value={textoBusqueda}
                        onChange={(evento) => setTextoBusqueda(evento.target.value)}
                    />
                </div>
            </header>

            <section className="catalogo-resultados">
                {productosFiltrados.length === 0 ? (
                    <div className="sin-resultados">
                        <h3>No encontramos nada con "{textoBusqueda}"</h3>
                        <p>Prueba con otras palabras o borra la búsqueda.</p>
                    </div>
                ) : (
                    <div className="rejilla-catalogo">
                        {productosFiltrados.map((producto) => (
                            <article key={producto.id} className="tarjeta-basica">
                                <div className="tarjeta-basica-img">
                                    <img src={producto.imagen} alt={producto.nombre} />
                                </div>
                                
                                <div className="tarjeta-basica-info">
                                    <h3>{producto.nombre}</h3>
                                    <p className="categoria-texto">{producto.categoria}</p>
                                    <p className="descripcion-corta">{producto.descripcion}</p>
                                    
                                    <div className="tarjeta-basica-pie">
                                        <span className="precio-etiqueta">
                                            {/* Protegemos también el precio por si llega nulo */}
                                            {producto.precio ? producto.precio.toFixed(2) : "0.00"} €
                                        </span>
                                        <button className="boton-accion">
                                            Añadir al Carrito
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Productos;