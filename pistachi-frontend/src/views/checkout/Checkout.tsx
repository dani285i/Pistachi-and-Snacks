import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/carrito/Carrito';
import { useAuth } from '../../context/auth/Auth';
import { useToast } from '../../context/toast/ToastContext';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { MapPin, CreditCard, PaypalLogo } from '@phosphor-icons/react';
import './Checkout.css';

const Checkout = () => {
    const { cartItems, clearCart } = useCart();
    const { usuario } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();

    const [metodoPago, setMetodoPago] = useState<'stripe' | 'paypal'>('stripe');
    const [procesando, setProcesando] = useState(false);

    // Formulario State
    const [form, setForm] = useState({
        nombre: usuario?.nombre || '',
        direccion: '',
        ciudad: ''
    });

    if (cartItems.length === 0) {
        navigate('/productos');
        return null;
    }

    const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.precio) * Number(item.cantidad)), 0);
    const costeEnvio = subtotal >= 30 ? 0 : 4.99;
    const totalSeguro = subtotal + costeEnvio;

    const handlePagoSeguro = async () => {
        if (!form.nombre || !form.direccion || !form.ciudad) {
            addToast("⚠️ Por favor, rellena todos los detalles del envío antes de pagar.");
            return;
        }

        setProcesando(true);
        try {
            const pedidoPayload = {
                usuarioId: usuario?.id || 1,
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
                addToast("🎉 ¡Pago exitoso! Tu pedido está en el horno.");
                clearCart();
                navigate('/productos');
            } else {
                addToast("❌ Hubo un error al procesar el pedido.");
            }
        } catch (error) {
            console.error(error);
            addToast("❌ Error de conexión al procesar el pago.");
        } finally {
            setProcesando(false);
        }
    };

    return (
        <div className="checkout-wrapper">
            <header className="checkout-header">
                <h1>Pago y Transacción</h1>
            </header>

            <div className="checkout-grid">
                {/* COLUMNA IZQUIERDA: Formularios */}
                <div className="checkout-formularios">
                    
                    {/* Detalles del Envío */}
                    <section className="checkout-seccion">
                        <h2>Detalles del Envío</h2>
                        
                        <div className="form-group">
                            <label>Nombre Completo</label>
                            <input 
                                type="text" 
                                className="form-input" 
                                placeholder="Mónica Pérez Sueiro" 
                                value={form.nombre}
                                onChange={(e) => setForm({...form, nombre: e.target.value})}
                            />
                        </div>

                        <div className="form-group">
                            <label>Dirección y Código Postal</label>
                            <input 
                                type="text" 
                                className="form-input" 
                                placeholder="Calle..., Avenida..., Nº123" 
                                value={form.direccion}
                                onChange={(e) => setForm({...form, direccion: e.target.value})}
                            />
                        </div>

                        <div className="form-group">
                            <label>Ciudad</label>
                            <div className="input-icon-wrapper">
                                <MapPin size={20} weight="bold" className="input-icon" />
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    placeholder="Seleccionar Ciudad..." 
                                    value={form.ciudad}
                                    onChange={(e) => setForm({...form, ciudad: e.target.value})}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Métodos de Pago */}
                    <section className="checkout-seccion">
                        <h2>Métodos de Pago</h2>
                        <p style={{ color: '#555', marginBottom: '20px', fontSize: '0.9rem' }}>Escoge tu método de pago</p>

                        <div className="payment-methods-grid">
                            
                            {/* Opción Stripe */}
                            <label className={`payment-method-card ${metodoPago === 'stripe' ? 'active' : ''}`}>
                                <input 
                                    type="radio" 
                                    name="metodoPago" 
                                    className="payment-radio" 
                                    checked={metodoPago === 'stripe'}
                                    onChange={() => setMetodoPago('stripe')}
                                />
                                <div className="payment-info">
                                    <div className="payment-info-title">
                                        Stripe
                                    </div>
                                    <div className="payment-info-subtitle">Tarjeta de Crédito o Débito</div>
                                </div>
                                <CreditCard size={32} weight="bold" className="payment-icon" />
                            </label>

                            {/* Opción PayPal */}
                            <label className={`payment-method-card ${metodoPago === 'paypal' ? 'active' : ''}`}>
                                <input 
                                    type="radio" 
                                    name="metodoPago" 
                                    className="payment-radio" 
                                    checked={metodoPago === 'paypal'}
                                    onChange={() => setMetodoPago('paypal')}
                                />
                                <div className="payment-info">
                                    <div className="payment-info-title">
                                        PayPal
                                    </div>
                                    <div className="payment-info-subtitle">Rápido y Seguro</div>
                                </div>
                                <PaypalLogo size={32} weight="fill" className="payment-icon" />
                            </label>
                        </div>

                        {/* Botón Pagar Dinámico */}
                        <div className="pasarela-wrapper">
                            {metodoPago === 'stripe' ? (
                                <button className="btn-pagar-ahora" onClick={handlePagoSeguro} disabled={procesando}>
                                    <CreditCard size={24} weight="bold" />
                                    {procesando ? 'Procesando pago...' : 'Pagar Ahora'}
                                </button>
                            ) : (
                                <PayPalScriptProvider options={{ clientId: "test", currency: "EUR" }}>
                                    <PayPalButtons 
                                        style={{ layout: "horizontal", color: "gold", shape: "pill", height: 50 }} 
                                        createOrder={(_data, actions) => {
                                            if (!form.nombre || !form.direccion || !form.ciudad) {
                                                addToast("⚠️ Rellena los datos de envío primero.");
                                                return Promise.reject();
                                            }
                                            return actions.order.create({
                                                intent: "CAPTURE",
                                                purchase_units: [{ amount: { currency_code: "EUR", value: totalSeguro.toFixed(2) } }]
                                            });
                                        }}
                                        onApprove={async (_data, actions) => {
                                            if(actions.order) {
                                                await actions.order.capture();
                                                handlePagoSeguro();
                                            }
                                        }}
                                    />
                                </PayPalScriptProvider>
                            )}
                        </div>

                    </section>
                </div>

                {/* COLUMNA DERECHA: Resumen del Pedido */}
                <aside className="checkout-resumen">
                    <h2>Resumen del Pedido</h2>

                    <div className="resumen-lista">
                        {cartItems.map(item => (
                            <div className="resumen-item" key={item.id}>
                                <div className="resumen-item-info">
                                    <span className="resumen-item-nombre">{item.nombre}</span>
                                    <span className="resumen-item-uds">Uds: {item.cantidad}</span>
                                </div>
                                <span className="resumen-item-precio">{(Number(item.precio) * Number(item.cantidad)).toFixed(2)} €</span>
                            </div>
                        ))}
                    </div>

                    <div className="resumen-totales">
                        <div className="resumen-fila">
                            <span>Subtotal</span>
                            <span>{subtotal.toFixed(2)} €</span>
                        </div>
                        <div className="resumen-fila">
                            <span>Envío</span>
                            <span>{costeEnvio === 0 ? 'GRATIS' : `${costeEnvio.toFixed(2)} €`}</span>
                        </div>
                        <div className="resumen-fila total">
                            <span>Total</span>
                            <span>{totalSeguro.toFixed(2)} €</span>
                        </div>
                    </div>
                </aside>

            </div>
        </div>
    );
};

export default Checkout;
