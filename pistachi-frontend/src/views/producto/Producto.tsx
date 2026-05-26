import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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

const CATEGORIAS = ['Todas', 'Snacks', 'Bollería', 'Repostería', 'Tartas', 'Bebidas', 'Café'];

const Productos = () => {
    const [totalProductos, setTotalProductos] = useState<Producto[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);
    
    // Parámetros de URL
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Si no hay parámetro, por defecto la página es 1 y la categoría 'Todas'
    const paginaActualURL = parseInt(searchParams.get('page') || '1', 10);
    const categoriaSeleccionada = searchParams.get('categoria') || 'Todas';
    
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

    // 1. Filtrar por categoría
    const productosFiltrados = categoriaSeleccionada === 'Todas' 
        ? totalProductos 
        : totalProductos.filter(p => p.categoria === categoriaSeleccionada);

    // 2. Calcular paginación sobre los productos ya filtrados
    const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina) || 1;
    
    // Asegurarse de que si se pone un page=100 manual y no hay, baje a la última posible
    const paginaActual = Math.min(Math.max(1, paginaActualURL), totalPaginas);

    const indiceUltimoItem = paginaActual * productosPorPagina;
    const indicePrimerItem = indiceUltimoItem - productosPorPagina;
    const productosAMostrar = productosFiltrados.slice(indicePrimerItem, indiceUltimoItem);

    // Manejadores de URL
    const setPaginaURL = (num: number) => {
        setSearchParams((prev) => {
            prev.set('page', num.toString());
            return prev;
        });
    };

    const setCategoriaURL = (cat: string) => {
        setSearchParams((prev) => {
            if (cat === 'Todas') {
                prev.delete('categoria');
            } else {
                prev.set('categoria', cat);
            }
            prev.set('page', '1'); // Al cambiar de categoría, volvemos a la página 1
            return prev;
        });
    };

    return (
        <div className="catalogo-wrapper">
            <header className="catalogo-cabecera">
                <span className="subtitulo-obrador">Nuestra Vitrina</span>
                <h1>El Obrador de Pistacho</h1>
                <p>Repostería artesanal y snacks premium, horneados a diario.</p>
                
                <nav className="filtros-categoria">
                    {CATEGORIAS.map(cat => (
                        <button 
                            key={cat}
                            className={`filtro-btn ${categoriaSeleccionada === cat ? 'activo' : ''}`}
                            onClick={() => setCategoriaURL(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </nav>
            </header>

            {cargando ? (
                <div className="status-container">Preparando las delicias...</div>
            ) : productosAMostrar.length === 0 ? (
                <div className="status-container">
                    Vaya, parece que la vitrina de "{categoriaSeleccionada}" está vacía hoy.
                    <br/><br/>
                    <button className="btn-carrito-animado" onClick={() => setCategoriaURL('Todas')}>Ver todo el catálogo</button>
                </div>
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
                                    onClick={() => setPaginaURL(paginaActual - 1)} 
                                    disabled={paginaActual === 1}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                                </button>
                                
                                {[...Array(totalPaginas)].map((_, i) => (
                                    <button 
                                        key={i + 1} 
                                        onClick={() => setPaginaURL(i + 1)} 
                                        className={paginaActual === i + 1 ? 'pag-btn active' : 'pag-btn'}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                
                                <button 
                                    className="pag-btn-nav" 
                                    onClick={() => setPaginaURL(paginaActual + 1)} 
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