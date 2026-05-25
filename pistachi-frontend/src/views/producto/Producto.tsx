import { useEffect, useState } from 'react';
import ProductCard from '../../components/productcard/ProductCard';
import './Producto.css';

interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen: string;
    categoria: string;
    unidades: number;
    stock: number;
}

const Productos = () => {
    const [totalProductos, setTotalProductos] = useState<Producto[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);
    
    const [paginaActual, setPaginaActual] = useState<number>(1);
    const productosPorPagina = 6;

    useEffect(() => {
        const obtenerProductos = async () => {
            try {
                const respuesta = await fetch('http://localhost:9090/productos');
                if (!respuesta.ok) throw new Error('Error al conectar con la base de datos');
                const datos = await respuesta.json();
                setTotalProductos(datos);
            } catch (error) {
                console.error("Error al cargar el catálogo", error);
            } finally {
                setCargando(false);
            }
        };
        obtenerProductos();
    }, []);

    const indiceUltimoItem = paginaActual * productosPorPagina;
    const indicePrimerItem = indiceUltimoItem - productosPorPagina;
    const productosAMostrar = totalProductos.slice(indicePrimerItem, indiceUltimoItem);
    const totalPaginas = Math.ceil(totalProductos.length / productosPorPagina);

    return (
        <div className="catalogo-wrapper">
            <header className="catalogo-cabecera">
                <span className="subtitulo-obrador">Nuestra Vitrina</span>
                <h1>El Obrador de Pistacho</h1>
                <p>Repostería artesanal y snacks premium, horneados a diario.</p>
            </header>

            {cargando ? (
                <div className="status-container">Preparando las delicias...</div>
            ) : productosAMostrar.length === 0 ? (
                <div className="status-container">Vaya, parece que la vitrina está vacía hoy.</div>
            ) : (
                <>
                    <div className="rejilla-catalogo">
                        {productosAMostrar.map((p) => (
                            <ProductCard key={p.id} producto={p} />
                        ))}
                    </div>

                    {totalPaginas > 1 && (
                        <div className="paginacion-sticky-wrapper">
                            <nav className="paginacion-flotante">
                                <button 
                                    className="pag-btn-nav" 
                                    onClick={() => setPaginaActual(p => p - 1)} 
                                    disabled={paginaActual === 1}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                                </button>
                                
                                {[...Array(totalPaginas)].map((_, i) => (
                                    <button 
                                        key={i + 1} 
                                        onClick={() => setPaginaActual(i + 1)} 
                                        className={paginaActual === i + 1 ? 'pag-btn active' : 'pag-btn'}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                
                                <button 
                                    className="pag-btn-nav" 
                                    onClick={() => setPaginaActual(p => p + 1)} 
                                    disabled={paginaActual === totalPaginas}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                </button>
                            </nav>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Productos;