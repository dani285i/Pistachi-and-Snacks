import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

    useEffect(() => {
        const obtenerProducto = async () => {
            try {
                const respuesta = await fetch(`http://localhost:80/productos/${id}`);
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
                cantidad: 1
            });
            alert(`${producto.nombre} añadido al carrito`);
        }
    };

    if (cargando) return <div>Cargando detalle...</div>;
    if (!producto) return <div>Producto no encontrado</div>;

    return (
        <div className="detalle-container">
            <div className="detalle-imagen">
                <img src={producto.imagen} alt={producto.nombre} />
            </div>
            <div className="detalle-info">
                <h2>{producto.nombre}</h2>
                <p className="categoria">Categoría: {producto.categoria}</p>
                <p className="descripcion">{producto.descripcion}</p>
                <p className="precio">{producto.precio.toFixed(2)} €</p>
                
                <div className="acciones">
                    {usuario ? (
                        <button className="btn-añadir" onClick={añadirItem}>Añadir al Carrito</button>
                    ) : (
                        <button className="btn-login" onClick={() => navigate('/login')}>Inicia sesión para comprar</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetalleProducto;