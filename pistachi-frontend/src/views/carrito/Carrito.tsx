import { useCart } from '../../context/carrito/Carrito';
import { useAuth } from '../../context/auth/Auth';
import { useToast } from '../../context/toast/Toast';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import './Carrito.css';

const Carrito = () => {
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
    const { usuario } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();

    const [mostrarPasarela, setMostrarPasarela] = useState(false);
    const [procesando, setProcesando] = useState(false);

    // Cálculos a prueba de fallos para evitar el NaN
    const subtotal = cartItems.reduce((acc, item) => {
        const precioSeguro = Number(item.precio) || 0;
        const cantidadSegura = Number(item.cantidad) || 1;
        return acc + (precioSeguro * cantidadSegura);
    }, 0);

    const costeEnvio = subtotal >= 30 || subtotal === 0 ? 0 : 4.99;
    const totalSeguro = subtotal + costeEnvio;

    // Función principal para registrar la venta en la Base de Datos
    const confirmarPedidoBackend = async () => {
        setProcesando(true);
        try {
            const pedidoPayload = {
                usuarioId: usuario?.id || 1, // Fallback al admin si por algún motivo no hay id
                total: totalSeguro,
                lineas: cartItems.map(item => ({
                    productoId: item.id,
                    cantidad: item.cantidad,
                    precioUnitario: item.precio
                }))
            };

            const respuesta = await fetch('http://localhost:9090/pedidos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pedidoPayload)
            });

            if (respuesta.ok) {
                addToast("🎉 ¡Pago recibido! Hemos empezado a hornear tu pedido.");
                clearCart();
                navigate('/productos');
            } else {
                addToast("❌ Hubo un error al registrar el pedido en el sistema.");
            }
        } catch (error) {
            console.error(error);
            addToast("❌ Error de conexión al procesar el pedido.");
        } finally {
            setProcesando(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="carrito-vacio-wrapper">
                <div className="carrito-vacio-content">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#AAB3A6" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
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
                                        {(item as any).unidades > 1 && (
                                            <span style={{ fontSize: '0.85rem', color: '#888', marginLeft: '8px', fontWeight: 'normal' }}>
                                                ({(item as any).unidades} Uds)
                                            </span>
                                        )}
                                    </h3>
                                    <span className="item-categoria">{(item as any).categoria || 'Artesanal'}</span>
                                    <div className="item-controles">
                                        <div className="selector-cantidad">
                                            <button onClick={() => updateQuantity(item.id, cantidadItem - 1)} disabled={mostrarPasarela}>-</button>
                                            <span className="cantidad-numero">{cantidadItem}</span>
                                            <button onClick={() => updateQuantity(item.id, cantidadItem + 1)} disabled={mostrarPasarela}>+</button>
                                        </div>
                                        <button className="btn-eliminar-item" onClick={() => removeFromCart(item.id)} disabled={mostrarPasarela}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
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
                                <span>Envío en frío</span>
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
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                            </button>

                            <p className="ticket-seguridad" style={{ marginTop: '20px' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
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