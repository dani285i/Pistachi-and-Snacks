import React from 'react';
import { useNavigate } from 'react-router-dom';
import BotonFavorito from '../favorito/BotonFavorito';
import { useCart } from '../../context/carrito/Carrito';
import { useToast } from '../../context/toast/ToastContext';
import { Plus, ShoppingCart, Bell } from '@phosphor-icons/react';
import '../../views/producto/Producto.css'; // Mantenemos los estilos originales

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
}

const ProductCard: React.FC<ProductCardProps> = ({ producto }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { addToast } = useToast();

    return (
        <article 
            className="tarjeta-obrador" 
            onClick={() => navigate(`/producto/${producto.id}`)}
        >
            <div className="tarjeta-img-box">
                <img src={producto.imagen} alt={producto.nombre} className="tarjeta-img" />
                {producto.destacado && <span className="craft-badge">Top Ventas</span>}
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
                        <BotonFavorito producto={producto} />
                        
                        {producto.stock > 0 ? (
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
                                onClick={(e) => {
                                    e.stopPropagation();
                                    addToast(`🔔 Te enviaremos un email cuando repongamos stock de '${producto.nombre}'.`);
                                }}
                                title="Avisadme cuando haya stock"
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
