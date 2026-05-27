import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/carrito/Carrito';
import { useAuth } from '../../context/auth/Auth';
import { useToast } from '../../context/toast/ToastContext';
import BotonFavorito from '../../components/favorito/BotonFavorito';
import { ShoppingCart, Bell } from '@phosphor-icons/react';
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
                addToast(`🔔 Te enviaremos un email cuando repongamos stock de '${producto.nombre}'.`, 'success');
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
            <div className="detalle-tarjeta">
                <div className="detalle-galeria">
                    <img src={producto.imagen} alt={producto.nombre} />
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
                                onClick={handleNotificarStock}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                            >
                                <Bell size={24} weight="bold" />
                                Agotado - Avisadme
                            </button>
                        ) : usuario ? (
                            <button 
                                className="boton-añadir-carrito" 
                                onClick={() => {
                                    addToCart({
                                        ...producto,
                                        precio: Number(producto.precio),
                                        cantidad: 1
                                    });
                                    addToast('Producto añadido a la cesta', 'success');
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