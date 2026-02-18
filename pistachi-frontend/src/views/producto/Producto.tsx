import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const [paginaActual, setPaginaActual] = useState<number>(1);
    const productosPorPagina = 6;

    const navigate = useNavigate();

    const obtenerTodosLosProductos = async () => {
        try {
            setCargando(true);
            const respuesta = await fetch('http://localhost:80/productos');
            if (!respuesta.ok) throw new Error('Fallo al recuperar los productos');
            const datosGuardados = await respuesta.json();
            setProductos(datosGuardados);
            setPaginaActual(1);
        } catch (error) {
            console.error("Error:", error);
            setHuboError(true);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        obtenerTodosLosProductos();
    }, []);

    const buscarProductos = async () => {
        if (!textoBusqueda.trim()) {
            obtenerTodosLosProductos();
            return;
        }
        try {
            setCargando(true);
            const respuesta = await fetch(`http://localhost:80/productos/buscar?texto=${encodeURIComponent(textoBusqueda)}`);
            if (!respuesta.ok) throw new Error('Fallo al buscar productos');
            const datos = await respuesta.json();
            setProductos(datos);
            setPaginaActual(1);
        } catch (error) {
            console.error("Error en la búsqueda:", error);
            setHuboError(true);
        } finally {
            setCargando(false);
        }
    };

    const indiceUltimoProducto = paginaActual * productosPorPagina;
    const indicePrimerProducto = indiceUltimoProducto - productosPorPagina;
    const productosPaginados = productos.slice(indicePrimerProducto, indiceUltimoProducto);
    const totalPaginas = Math.ceil(productos.length / productosPorPagina);

    const irAPaginaAnterior = () => {
        if (paginaActual > 1) setPaginaActual(paginaActual - 1);
    };

    const irAPaginaSiguiente = () => {
        if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
    };

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
                        placeholder="Buscar productos..." 
                        value={textoBusqueda}
                        onChange={(evento) => setTextoBusqueda(evento.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && buscarProductos()}
                    />
                    <button onClick={buscarProductos} className="boton-accion">Buscar</button>
                </div>
            </header>

            <section className="catalogo-resultados">
                <div className="rejilla-catalogo">
                    {productosPaginados.map((producto) => (
                        <article 
                            key={producto.id} 
                            className="tarjeta-basica"
                            onClick={() => navigate(`/producto/${producto.id}`)}
                            style={{ cursor: 'pointer' }}
                        >
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
                                    <button className="boton-accion">Ver detalles</button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
                {totalPaginas > 1 && (
                    <div className="paginacion-controles" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                        <button 
                            onClick={irAPaginaAnterior} 
                            disabled={paginaActual === 1}
                            className="boton-accion"
                            style={{ opacity: paginaActual === 1 ? 0.5 : 1 }}
                        >
                            Anterior
                        </button>
                        <span style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                            Página {paginaActual} de {totalPaginas}
                        </span>
                        <button 
                            onClick={irAPaginaSiguiente} 
                            disabled={paginaActual === totalPaginas}
                            className="boton-accion"
                            style={{ opacity: paginaActual === totalPaginas ? 0.5 : 1 }}
                        >
                            Siguiente
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Productos;