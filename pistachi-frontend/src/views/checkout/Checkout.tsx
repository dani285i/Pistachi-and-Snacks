import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/carrito/Carrito';
import { useAuth } from '../../context/auth/Auth';
import { useToast } from '../../context/toast/ToastContext';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { MapPin } from '@phosphor-icons/react';
import './Checkout.css';

const Checkout = () => {
    const { cartItems, clearCart } = useCart();
    const { usuario } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();

    // Formulario State
    const [form, setForm] = useState({
        nombre: usuario?.nombre || '',
        direccion: '',
        codigoPostal: '',
        ciudad: ''
    });

    const [codigosValidos, setCodigosValidos] = useState<{codigo: string, descripcion: string}[]>([]);
    
    // Fetch códigos válidos cuando cambia el concello
    useEffect(() => {
        if (form.ciudad) {
            fetch(`http://localhost:9090/codigos-postales?concello=${encodeURIComponent(form.ciudad)}`)
                .then(res => res.json())
                .then(data => setCodigosValidos(data))
                .catch(err => console.error("Error al obtener códigos postales:", err));
        } else {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCodigosValidos([]);
        }
    }, [form.ciudad]);

    const isCodigoValido = form.codigoPostal.length === 5 && codigosValidos.some(cp => cp.codigo === form.codigoPostal);

    if (cartItems.length === 0) {
        navigate('/productos');
        return null;
    }

    const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.precio) * Number(item.cantidad)), 0);
    const costeEnvio = subtotal >= 30 ? 0 : 4.99;
    const totalSeguro = subtotal + costeEnvio;

    const handlePagoSeguro = async () => {
        if (!form.nombre || !form.direccion || !form.codigoPostal || !form.ciudad) {
            addToast("⚠️ Por favor, rellena todos los detalles del envío antes de pagar.");
            return;
        }

        if (!isCodigoValido) {
            addToast("❌ El código postal introducido no es válido para el concello seleccionado.");
            return;
        }

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

                        <div className="form-row" style={{ display: 'flex', gap: '20px' }}>
                            <div className="form-group" style={{ flex: 1, position: 'relative' }}>
                                <label>Código Postal</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    placeholder="Ej. 15004" 
                                    value={form.codigoPostal}
                                    onChange={(e) => setForm({...form, codigoPostal: e.target.value})}
                                />
                                {form.codigoPostal.length === 5 && form.ciudad && (
                                    <div style={{ marginTop: '8px', fontSize: '0.8rem', fontWeight: 600, color: isCodigoValido ? '#28a745' : '#dc3545' }}>
                                        {isCodigoValido 
                                            ? "✅ Este Código Postal es correcto para el Concello seleccionado" 
                                            : "❌ Este Código Postal no es correcto para el Concello Seleccionado"}
                                    </div>
                                )}
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Dirección</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    placeholder="Calle..., Avenida..., Nº123" 
                                    value={form.direccion}
                                    onChange={(e) => setForm({...form, direccion: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Selecciona tu Concello</label>
                            <div className="input-icon-wrapper">
                                <MapPin size={20} weight="bold" className="input-icon" />
                                <select 
                                    className="form-input" 
                                    value={form.ciudad}
                                    onChange={(e) => setForm({...form, ciudad: e.target.value})}
                                >
                                    <option value="" disabled>Selecciona tu Concello...</option>
                                    <option value="A Coruña">A Coruña</option>
                                    <option value="Culleredo">Culleredo</option>
                                    <option value="Oleiros">Oleiros</option>
                                    <option value="Cambre">Cambre</option>
                                    <option value="Bergondo">Bergondo</option>
                                    <option value="Betanzos">Betanzos</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Métodos de Pago */}
                    <section className="checkout-seccion">
                        <h2>Pago Seguro</h2>
                        <p style={{ color: '#555', marginBottom: '20px', fontSize: '0.9rem' }}>Finaliza tu pedido con PayPal</p>

                        <div className="pasarela-wrapper" style={{ marginTop: 0, borderTop: 'none', paddingTop: 0 }}>
                            <PayPalScriptProvider options={{ clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || "test", currency: "EUR" }}>
                                <PayPalButtons 
                                    disabled={!isCodigoValido}
                                    style={{ layout: "horizontal", color: "gold", shape: "pill", height: 50 }} 
                                    createOrder={(_data, actions) => {
                                        if (!form.nombre || !form.direccion || !form.codigoPostal || !form.ciudad) {
                                            addToast("⚠️ Rellena los datos de envío primero.");
                                            return Promise.reject();
                                        }
                                        if (!isCodigoValido) {
                                            addToast("❌ El código postal introducido no es válido para el concello seleccionado.");
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
