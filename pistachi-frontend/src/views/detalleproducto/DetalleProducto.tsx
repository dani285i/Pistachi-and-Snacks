import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/carrito/Carrito';
import { useAuth } from '../../context/auth/Auth';
import { useToast } from '../../context/toast/ToastContext';
import BotonFavorito from '../../components/favorito/BotonFavorito';
import { ShoppingCart, Bell, X } from '@phosphor-icons/react';
import './DetalleProducto.css';

const DetalleProducto = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { usuario } = useAuth();
    const { addToast } = useToast();
    interface Producto {
        id: number;
        nombre: string;
        descripcion: string;
        precio: number;
        imagen: string;
        categoria: string;
        stock: number;
        unidades?: number;
    }

    const [producto, setProducto] = useState<Producto | null>(null);

    // Estados para el Zoom
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
    const [haSolicitadoAviso, setHaSolicitadoAviso] = useState(false);

    useEffect(() => {
        if (id && usuario) {
            fetch(`http://localhost:9090/productos/${id}/notificar-status?usuarioId=${usuario.id}`)
                .then(res => res.json())
                .then(suscrito => setHaSolicitadoAviso(suscrito))
                .catch(() => setHaSolicitadoAviso(false));
        }
    }, [id, usuario]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isZoomed) return;
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setMousePosition({ x, y });
    };

    useEffect(() => {
        fetch(`http://localhost:9090/productos/${id}`)
            .then(res => res.json())
            .then(data => setProducto(data));
    }, [id]);

    const handleNotificarStock = async () => {
        if (!usuario) {
            navigate('/login');
            return;
        }

        if (!producto) return;

        try {
            const response = await fetch(`http://localhost:9090/productos/${producto.id}/notificar-stock`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ usuarioId: usuario.id })
            });

            if (response.ok) {
                setHaSolicitadoAviso(true);
                addToast('Te enviaremos un email cuando vuelva a estar disponible.', 'success');
            } else {
                addToast('Hubo un error al intentar registrar la notificación.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            addToast('Error de conexión con el servidor.', 'error');
        }
    };

    if (!producto) return <div className="cargando">Cargando producto...</div>;

    return (
        <div className="detalle-contenedor">
            {/* Modal de Zoom */}
            {isModalOpen && (
                <div className="zoom-modal-overlay" onClick={() => { setIsModalOpen(false); setIsZoomed(false); }}>
                    <div 
                        className="zoom-modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button 
                            className="zoom-close-btn"
                            onClick={() => { setIsModalOpen(false); setIsZoomed(false); }}
                            title="Cerrar imagen"
                        >
                            <X size={24} weight="bold" />
                        </button>
                        
                        <div 
                            className={`zoom-image-container ${isZoomed ? 'zoomed' : ''}`}
                            onClick={(e) => { e.stopPropagation(); setIsZoomed(!isZoomed); }}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={() => setMousePosition({ x: 50, y: 50 })}
                        >
                            <img 
                                src={producto.imagen} 
                                alt={producto.nombre} 
                                className="zoom-image"
                                style={isZoomed ? { transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`, transform: 'scale(2)' } : { transformOrigin: 'center center', transform: 'scale(1)' }}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="detalle-tarjeta">
                <div className="detalle-galeria">
                    <img 
                        src={producto.imagen} 
                        alt={producto.nombre} 
                        style={{ cursor: 'zoom-in' }}
                        onClick={() => setIsModalOpen(true)}
                        title="Haz click para ampliar"
                    />
                </div>
                <div className="detalle-info">
                    <h1 className="detalle-titulo">
                        {producto.nombre}
                        {producto.unidades && producto.unidades > 1 && (
                            <span style={{ fontSize: '0.85rem', color: '#888', marginLeft: '8px', fontWeight: 'normal' }}>
                                ({producto.unidades} Uds)
                            </span>
                        )}
                    </h1>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px', paddingBottom: '30px', borderBottom: '1px solid var(--border-light)' }}>
                        <span className="detalle-precio" style={{ margin: 0, padding: 0, border: 'none' }}>
                            {producto.precio.toFixed(2)} €
                        </span>
                        <BotonFavorito producto={producto} />
                    </div>

                    <p>{producto.descripcion}</p>
                    <div className="detalle-acciones">
                        {producto.stock === 0 ? (
                            <button 
                                className="boton-agotado"
                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', filter: haSolicitadoAviso ? 'opacity(0.6)' : 'none', cursor: haSolicitadoAviso ? 'not-allowed' : 'pointer' }}
                                onClick={handleNotificarStock}
                                disabled={haSolicitadoAviso}
                            >
                                <Bell size={24} weight="bold" />
                                {haSolicitadoAviso ? '¡Te avisaremos cuando se reponga el Stock!' : '¡Haz click para recibir un email cuando se reponga el Stock!'}
                            </button>
                        ) : usuario ? (
                            <button 
                                className="boton-añadir-carrito" 
                                onClick={() => {
                                    const result = addToCart({
                                        ...producto,
                                        precio: Number(producto.precio),
                                        cantidad: 1
                                    });
                                    if (result.success) {
                                        addToast('Producto añadido a la cesta', 'success');
                                    } else if (result.reason === 'STOCK') {
                                        addToast('No hay suficiente stock para añadir más', 'error');
                                    } else if (result.reason === 'LIMIT') {
                                        addToast('Solo puedes añadir 10 productos del mismo tipo, ¡Deja algo para lo demás!', 'error');
                                    }
                                }}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                            >
                                <ShoppingCart size={24} weight="bold" />
                                Añadir al Carrito
                            </button>
                        ) : (
                            <button className="boton-añadir-carrito" onClick={() => navigate('/login')}>
                                Inicia sesión para comprar
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetalleProducto;