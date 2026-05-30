import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BotonFavorito from '../favorito/BotonFavorito';
import { useCart } from '../../context/carrito/Carrito';
import { useToast } from '../../context/toast/ToastContext';
import { useAuth } from '../../context/auth/Auth';
import { Plus, ShoppingCart, Bell } from '@phosphor-icons/react';
import '../../views/producto/Producto.css'; // Mantenemos los estilos originales

import type { ProductoFav } from '../../context/favoritos/Favoritos';

export interface ProductoData {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen: string;
    categoria: string;
    destacado?: boolean;
    unidades: number;
    stock: number;
}

interface ProductCardProps {
    producto: ProductoData;
    onIntentoRemover?: (producto: ProductoFav) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ producto, onIntentoRemover }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { addToast } = useToast();
    const { usuario } = useAuth();
    const [haSolicitadoAviso, setHaSolicitadoAviso] = useState(false);

    React.useEffect(() => {
        if (producto.id && usuario) {
            fetch(`http://localhost:9090/productos/${producto.id}/notificar-status?usuarioId=${usuario.id}`)
                .then(res => res.json())
                .then(suscrito => setHaSolicitadoAviso(suscrito))
                .catch(() => setHaSolicitadoAviso(false));
        }
    }, [producto.id, usuario]);

    // Lógica de Stock
    const isAgotado = producto.stock < (producto.unidades || 1);
    const isPocasUnidades = !isAgotado && producto.stock < 10;

    const handleNotificarStock = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!usuario) {
            navigate('/login');
            return;
        }

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
        } catch {
            addToast('Error de conexión con el servidor.', 'error');
        }
    };

    return (
        <article 
            className={`tarjeta-obrador ${isAgotado ? 'agotado' : ''}`}
            onClick={() => navigate(`/producto/${producto.id}`)}
        >
            <div className="tarjeta-img-box">
                <img 
                    src={producto.imagen} 
                    alt={producto.nombre} 
                    className="tarjeta-img" 
                    style={isAgotado ? { filter: 'grayscale(100%) blur(2px)' } : {}}
                />
                {isAgotado && <span className="agotado-badge">AGOTADO</span>}
                {producto.destacado && !isAgotado && <span className="craft-badge">Top Ventas</span>}
                {isPocasUnidades && <span className="pocas-unidades-badge">¡¡Quedan pocas unidades!</span>}
            </div>
            
            <div className="tarjeta-body">
                <div className="tarjeta-header-info">
                    <span className="categoria-badge">{producto.categoria}</span>
                    <h3>
                        {producto.nombre}
                        {producto.unidades > 1 && (
                            <span style={{ fontSize: '0.85rem', color: 'var(--color-texto-light)', marginLeft: '8px', fontWeight: 'normal' }}>
                                ({producto.unidades} Uds)
                            </span>
                        )}
                    </h3>
                </div>
                
                <p className="tarjeta-desc">{producto.descripcion}</p>
                
                <div className="tarjeta-footer">
                    <span className="tarjeta-precio">{producto.precio.toFixed(2)} €</span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <BotonFavorito producto={producto} onIntentoRemover={onIntentoRemover} />
                        
                        {!isAgotado ? (
                            <button 
                                className="btn-carrito-animado"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart({
                                        ...producto,
                                        precio: Number(producto.precio),
                                        cantidad: 1 
                                    });
                                    addToast('Producto añadido a la cesta', 'success');
                                }}
                            >
                                <div className="icon-wrapper">
                                    <Plus size={20} weight="bold" color="white" className="icon-plus" />
                                    <ShoppingCart size={22} weight="fill" color="white" className="icon-cart" />
                                </div>
                            </button>
                        ) : (
                            <button 
                                className="btn-wishlist-animado"
                                onClick={handleNotificarStock}
                                title={haSolicitadoAviso ? "Aviso Solicitado" : "Avisadme cuando haya stock"}
                                disabled={haSolicitadoAviso}
                                style={{ filter: haSolicitadoAviso ? 'opacity(0.6)' : 'none', cursor: haSolicitadoAviso ? 'not-allowed' : 'pointer' }}
                            >
                                <Bell size={20} weight="bold" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
};

export default ProductCard;
