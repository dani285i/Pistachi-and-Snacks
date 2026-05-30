import { useCart } from '../../context/carrito/Carrito';
import { useNavigate } from 'react-router-dom';
import { Basket, Trash, ArrowRight, Lock } from '@phosphor-icons/react';
import './Carrito.css';

interface CartItemExtra {
    unidades?: number;
    categoria?: string;
}

const Carrito = () => {
    const { cartItems, removeFromCart, updateQuantity } = useCart();
    const navigate = useNavigate();

    // Cálculos a prueba de fallos para evitar el NaN
    const subtotal = cartItems.reduce((acc, item) => {
        const precioSeguro = Number(item.precio) || 0;
        const cantidadSegura = Number(item.cantidad) || 1;
        return acc + (precioSeguro * cantidadSegura);
    }, 0);

    const costeEnvio = subtotal >= 30 || subtotal === 0 ? 0 : 2.99;
    const totalSeguro = subtotal + costeEnvio;

    // Función de pedido movida a Checkout.tsx

    if (cartItems.length === 0) {
        return (
            <div className="carrito-vacio-wrapper">
                <div className="carrito-vacio-content">
                    <Basket size={64} weight="light" color="#AAB3A6" />
                    <h2>Tu bandeja está vacía</h2>
                    <p>Parece que aún no has seleccionado ninguna de nuestras delicias artesanales.</p>
                    <button className="btn-volver-vitrina" onClick={() => navigate('/productos')}>
                        Explorar el Catálogo
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="carrito-layout">
            <header className="carrito-header-global">
                <h1>Tu Pedido</h1>
                <p>Revisa tu selección antes de que encendamos el horno</p>
            </header>

            <div className="carrito-grid">
                {/* COLUMNA IZQUIERDA: LISTA DE PRODUCTOS */}
                <section className="carrito-lista">
                    {cartItems.map((item) => {
                        const precioItem = Number(item.precio) || 0;
                        const cantidadItem = Number(item.cantidad) || 1;

                        return (
                            <article key={item.id} className="carrito-item-card">
                                <div className="item-imagen-box">
                                    <img src={item.imagen} alt={item.nombre} />
                                </div>

                                <div className="item-info">
                                    <h3>
                                        {item.nombre}
                                        {(item as CartItemExtra).unidades && (item as CartItemExtra).unidades! > 1 && (
                                            <span style={{ fontSize: '0.85rem', color: '#888', marginLeft: '8px', fontWeight: 'normal' }}>
                                                ({(item as CartItemExtra).unidades} Uds)
                                            </span>
                                        )}
                                    </h3>
                                    <span className="item-categoria">{(item as CartItemExtra).categoria || 'Artesanal'}</span>
                                    <div className="item-controles">
                                        <div className="selector-cantidad">
                                            <button onClick={() => updateQuantity(item.id, cantidadItem - 1)}>-</button>
                                            <span className="cantidad-numero">{cantidadItem}</span>
                                            <button onClick={() => updateQuantity(item.id, cantidadItem + 1)}>+</button>
                                        </div>
                                        <button className="btn-eliminar-item" onClick={() => removeFromCart(item.id)}>
                                            <Trash size={18} weight="bold" />
                                        </button>
                                    </div>
                                </div>

                                <div className="item-precio-total">
                                    {(precioItem * cantidadItem).toFixed(2)} €
                                </div>
                            </article>
                        );
                    })}
                </section>

                {/* COLUMNA DERECHA: EL TICKET DEL OBRADOR */}
                <aside className="carrito-ticket-wrapper">
                    <div className="ticket-obrador">
                        <div className="ticket-header">
                            <h3>Resumen del Pedido</h3>
                        </div>

                        <div className="ticket-body">
                            <div className="ticket-fila">
                                <span>Subtotal</span>
                                <span>{subtotal.toFixed(2)} €</span>
                            </div>
                            <div className="ticket-fila">
                                <span>Envío recién Horneado</span>
                                <span>{costeEnvio === 0 ? '¡Gratis!' : `${costeEnvio.toFixed(2)} €`}</span>
                            </div>

                            {subtotal < 30 && (
                                <div className="barra-envio-gratis">
                                    <p>Te faltan <strong>{(30 - subtotal).toFixed(2)} €</strong> para envío gratis.</p>
                                    <div className="barra-progreso-bg">
                                        <div className="barra-progreso-fill" style={{ width: `${(subtotal / 30) * 100}%` }}></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="ticket-footer">
                            <div className="ticket-fila total">
                                <span>Total a pagar</span>
                                <span>{totalSeguro.toFixed(2)} €</span>
                            </div>
                            
                            <button className="btn-hornear-pedido" onClick={() => navigate('/checkout')}>
                                Procesar Pedido
                                <ArrowRight size={20} weight="bold" />
                            </button>

                            <p className="ticket-seguridad" style={{ marginTop: '20px' }}>
                                <Lock size={14} weight="bold" />
                                Pago seguro encriptado
                            </p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Carrito;