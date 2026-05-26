import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/carrito/Carrito';
import { useAuth } from '../../context/auth/Auth';
import { useToast } from '../../context/toast/Toast';
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
                                onClick={() => addToast(`🔔 Te enviaremos un email cuando repongamos stock de '${producto.nombre}'.`)}
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
                                    addToast(`'${producto.nombre}' añadido al carrito`);
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