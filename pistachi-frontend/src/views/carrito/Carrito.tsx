import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/carrito/Carrito';
import './Carrito.css';

const Carrito = () => {
    const { cartItems, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();
    const navigate = useNavigate(); 
    const handleEliminar = (id: number, nombre: string) => {
        const confirmar = window.confirm(`¿Estás seguro de que deseas eliminar "${nombre}" del carrito?`);
        if (confirmar) {
            removeFromCart(id);
        }
    };

    const restarCantidad = (id: number, cantidadActual: number) => {
        if (cantidadActual > 1) {
            updateQuantity(id, cantidadActual - 1);
        }
    };

    const sumarCantidad = (id: number, cantidadActual: number) => {
        if (cantidadActual < 20) {
            updateQuantity(id, cantidadActual + 1);
        }
    };

    const handleFinalizarCompra = () => {
        alert("¡Compra Realizada!");
        clearCart();
        navigate('/productos');
    };

    if (cartItems.length === 0) {
        return (
            <div className="carrito-vacio">
                <h2>Tu carrito está vacío</h2>
                <p>Parece que aún no has añadido ninguna de nuestras delicias.</p>
                <Link to="/productos" className="btn-volver">Ir al menú</Link>
            </div>
        );
    }

    return (
        <div className="carrito-contenedor">
            <h1>Tu Carrito</h1>
            
            <div className="carrito-lista">
                {cartItems.map((item) => (
                    <div key={item.id} className="carrito-item">
                        <img src={item.imagen} alt={item.nombre} className="carrito-img" />
                        
                        <div className="carrito-info">
                            <h3>{item.nombre}</h3>
                            <p className="carrito-precio">{item.precio.toFixed(2)} €</p>
                        </div>

                        <div className="carrito-acciones">
                            <div className="control-cantidad">
                                <button 
                                    className="btn-cantidad" 
                                    onClick={() => restarCantidad(item.id, item.cantidad)}
                                    disabled={item.cantidad <= 1} >
                                    -
                                </button>
                                <span className="cantidad-numero">{item.cantidad}</span>
                                <button 
                                    className="btn-cantidad" 
                                    onClick={() => sumarCantidad(item.id, item.cantidad)} >
                                    +
                                </button>
                            </div>
                            
                            <button 
                                onClick={() => handleEliminar(item.id, item.nombre)}
                                className="btn-eliminar">
                                Eliminar
                            </button>
                        </div>
                        
                        <div className="carrito-subtotal">
                            <p>Subtotal: {(item.precio * item.cantidad).toFixed(2)} €</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="carrito-resumen">
                <h2>Total: {getTotal().toFixed(2)} €</h2>
                <button className="btn-comprar" onClick={handleFinalizarCompra}>
                    Finalizar Compra
                </button>
            </div>
        </div>
    );
};

export default Carrito;