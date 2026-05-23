import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/carrito/Carrito';
import { useAuth } from '../../context/auth/Auth';
import './DetalleProducto.css';

interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen: string;
    categoria: string;
    destacado: boolean;
}

const DetalleProducto = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { usuario } = useAuth();
    
    const [producto, setProducto] = useState<Producto | null>(null);
    const [cargando, setCargando] = useState(true);
    const [cantidad, setCantidad] = useState(1);

    useEffect(() => {
        const obtenerProducto = async () => {
            try {
                const respuesta = await fetch(`http://localhost:9090/productos/${id}`);
                if (!respuesta.ok) throw new Error('Producto no encontrado');
                const data = await respuesta.json();
                setProducto(data);
            } catch (error) {
                console.error(error);
            } finally {
                setCargando(false);
            }
        };
        obtenerProducto();
    }, [id]);

    const añadirItem = () => {
        if (producto) {
            addToCart({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                imagen: producto.imagen,
                cantidad: cantidad
            });
            alert(`${cantidad}x ${producto.nombre} añadido al carrito`);
        }
    };

    if (cargando) return <div className="detalle-estado"><h2>Cargando detalle...</h2></div>;
    if (!producto) return <div className="detalle-estado"><h2>Producto no encontrado</h2></div>;

    return (
        <div className="detalle-contenedor">
            <div className="botonera-superior">
                <Link to="/productos" className="enlace-volver">
                    ← Volver al menú
                </Link>
            </div>

            <div className="detalle-tarjeta">
                <div className="detalle-galeria">
                    <img src={producto.imagen} alt={producto.nombre} className="detalle-imagen" />
                </div>
                
                <div className="detalle-info">
                    <span className="detalle-categoria">{producto.categoria}</span>
                    <h1 className="detalle-titulo">{producto.nombre}</h1>
                    <p className="detalle-precio">{producto.precio.toFixed(2)} €</p>
                    
                    <div className="detalle-descripcion">
                        <h3>Descripción del producto</h3>
                        <p>{producto.descripcion}</p>
                    </div>
                    
                    <div className="detalle-acciones">
                        {usuario ? (
                            <>
                                <div className="selector-cantidad">
                                    <label htmlFor="cantidad">Unidades:</label>
                                    <input 
                                        type="number" 
                                        id="cantidad" 
                                        min="1" 
                                        max="20" 
                                        value={cantidad}
                                        onChange={(e) => setCantidad(Number(e.target.value))} />
                                </div>
                                <button className="boton-añadir-carrito" onClick={añadirItem}>
                                    Añadir al Carrito
                                </button>
                            </>
                        ) : (
                            <button 
                                className="boton-añadir-carrito" 
                                style={{ backgroundColor: '#e0e8d8', color: '#2c5e1a' }} 
                                onClick={() => navigate('/login')} >
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