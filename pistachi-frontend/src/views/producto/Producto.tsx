import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/productcard/ProductCard';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
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

// aqui te pintamos la lista entera de lo que vendemos, puedes filtrar por categorias y volverte loco añadiendo cosas al carrito, como por ejemplo buscando solo los helados en verano
const Productos = () => {
    const [totalProductos, setTotalProductos] = useState<Producto[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);
    
    // ParÃ¡metros de URL
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Si no hay parÃ¡metro, por defecto la pÃ¡gina es 1 y la categorÃ­a 'Todas'
    const paginaActualURL = parseInt(searchParams.get('page') || '1', 10);
    const categoriaSeleccionada = searchParams.get('categoria') || 'Todas';
    
    // aqui te pintamos la lista entera de lo que vendemos, puedes filtrar por categorias y volverte loco añadiendo cosas al carrito, como por ejemplo buscando solo los helados en verano
const productosPorPagina = 6;
    
    // Generar categorÃ­as dinÃ¡micamente basadas en los productos disponibles
    const categoriasBase = Array.from(new Set(totalProductos.map(p => p.categoria))).sort();
    const CATEGORIAS = ['Todas', ...categoriasBase];

    useEffect(() => {
        const obtenerProductos = async () => {
            try {
                const respuesta = await fetch('http://localhost:9090/productos');
                if (!respuesta.ok) throw new Error('Error al conectar con la base de datos');
                const datos = await respuesta.json();
                setTotalProductos(datos);
            } catch (error) {
                console.error("Error al cargar el catÃ¡logo", error);
            } finally {
                setCargando(false);
            }
        };
        obtenerProductos();
    }, []);

    // 1. Filtrar por categorÃ­a
    // aqui te pintamos la lista entera de lo que vendemos, puedes filtrar por categorias y volverte loco añadiendo cosas al carrito, como por ejemplo buscando solo los helados en verano
const productosFiltrados = categoriaSeleccionada === 'Todas' 
        ? totalProductos 
        : totalProductos.filter(p => p.categoria === categoriaSeleccionada);

    // 2. Calcular paginaciÃ³n sobre los productos ya filtrados
    const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina) || 1;
    
    // Asegurarse de que si se pone un page=100 manual y no hay, baje a la Ãºltima posible
    const paginaActual = Math.min(Math.max(1, paginaActualURL), totalPaginas);

    const indiceUltimoItem = paginaActual * productosPorPagina;
    const indicePrimerItem = indiceUltimoItem - productosPorPagina;
    // aqui te pintamos la lista entera de lo que vendemos, puedes filtrar por categorias y volverte loco añadiendo cosas al carrito, como por ejemplo buscando solo los helados en verano
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
            prev.set('page', '1'); // Al cambiar de categorÃ­a, volvemos a la pÃ¡gina 1
            return prev;
        });
    };

    return (
        <div className="catalogo-wrapper">
            <header className="catalogo-cabecera">
                <span className="subtitulo-obrador">Nuestro CatÃ¡logo</span>
                <h1>El Obrador de Pistacho</h1>
                <p>ReposterÃ­a artesanal y snacks premium, horneados a diario.</p>
                
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
                <div className="status-container empty-state">
                    <h3>Vaya, parece que la vitrina de "{categoriaSeleccionada}" estÃ¡ vacÃ­a hoy.</h3>
                    <p>Nuestros pasteleros estÃ¡n trabajando en nuevas delicias.</p>
                    <button className="btn-volver-catalogo" onClick={() => setCategoriaURL('Todas')}>Descubrir todo el catÃ¡logo</button>
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
                                    <CaretLeft size={24} weight="bold" />
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
                                    aria-label="Siguiente pÃ¡gina"
                                >
                                    <CaretRight size={24} weight="bold" />
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
