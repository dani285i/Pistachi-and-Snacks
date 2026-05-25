import React from 'react';
import { useNavigate } from 'react-router-dom';
import BotonFavorito from '../favorito/BotonFavorito';
import { useCart } from '../../context/carrito/Carrito';
import { useToast } from '../../context/toast/Toast';
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
                        
                        <button 
                            className="btn-carrito-animado"
                            onClick={(e) => {
                                e.stopPropagation();
                                addToCart({
                                    ...producto,
                                    precio: Number(producto.precio),
                                    cantidad: 1 
                                });
                                addToast(`'${producto.nombre}' añadido al carrito con éxito`);
                            }}
                        >
                            <div className="icon-wrapper">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="icon-plus">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                
                                <svg width="22" height="22" viewBox="0 0 256 256" fill="none" stroke="white" strokeWidth="20" className="icon-cart">
                                    <path d="M216,72H56L59.86,149.25A24,24,0,0,0,83.82,168h96.36a24,24,0,0,0,23.96-18.75ZM62.4,208a16,16,0,1,1,16-16A16,16,0,0,1,62.4,208Zm128,0a16,16,0,1,1,16-16A16,16,0,0,1,190.4,208ZM24,40H40l4.33,21.64"></path>
                                </svg>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default ProductCard;
