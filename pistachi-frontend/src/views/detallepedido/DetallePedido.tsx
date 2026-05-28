import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowsClockwise, Confetti } from '@phosphor-icons/react';
import { useAuth } from '../../context/auth/Auth';
import faviconTachi from '../../assets/favicon/pistachi-favicon.png';
import { StatusPill } from '../../components/statuspill/StatusPill';
import './DetallePedido.css';

interface LineaPedido {
    id: number;
    producto: {
        id: number;
        nombre: string;
        precio: number;
    };
    cantidad: number;
    precioUnitario: number;
}

interface Pedido {
    id: number;
    usuarioId: number;
    fecha: string;
    total: number;
    estado: string;
    lineas: LineaPedido[];
    tachisGenerados?: number;
}

// este componente es literalmente el ticket de compra en pantalla, recibe la id del pedido por la url, hace un fetch al backend para sacar que has comprado y te dibuja un ticket con sonido de impresora de bar y todo, como por ejemplo animando los tirones de papel
const DetallePedido: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { usuario } = useAuth();
    const navigate = useNavigate();
    const [pedido, setPedido] = useState<Pedido | null>(null);
    const [cliente, setCliente] = useState<{nombre: string, apellidos: string, email: string} | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [animationKey, setAnimationKey] = useState(0);

    const isPrintingRef = React.useRef(false);

    const playAnimation = () => {
        if (isPrintingRef.current) return;
        isPrintingRef.current = true;

        const audio = new Audio('/sounds/sonido-impresora-ticket.mp3');
        audio.volume = 0.5;
        
        audio.onended = () => {
            isPrintingRef.current = false;
        };
        
        audio.play().catch(e => {
            console.log("Autoplay bloqueado por el navegador:", e);
            isPrintingRef.current = false;
        });
        setAnimationKey(prev => prev + 1);
    };

    useEffect(() => {
        playAnimation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const fetchPedido = async () => {
            try {
                const sesionString = sessionStorage.getItem('user_session');
                const token = sesionString ? JSON.parse(sesionString).token : '';

                const response = await fetch(`http://localhost:9090/pedidos/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setPedido(data);

                    // Fetch details of the customer who made the order
                    const userResponse = await fetch(`http://localhost:9090/auth/usuarios/${data.usuarioId}`);
                    if (userResponse.ok) {
                        const userData = await userResponse.json();
                        setCliente({ nombre: userData.nombre, apellidos: userData.apellidos, email: userData.email });
                    }
                } else {
                    setError("No se pudo cargar el pedido.");
                }
            } catch {
                setError("Error de conexión al obtener el pedido.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPedido();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="detalle-pedido-container loading-container">
                <p>Imprimiendo ticket...</p>
            </div>
        );
    }

    if (error || !pedido) {
        return (
            <div className="detalle-pedido-container error-container">
                <p>{error || "Pedido no encontrado"}</p>
                <button onClick={() => navigate('/')} className="btn-volver">Volver al Inicio</button>
            </div>
        );
    }

    const subtotal = pedido.lineas.reduce((acc, linea) => acc + (linea.cantidad * linea.precioUnitario), 0);
    const envio = subtotal >= 30 ? 0 : 4.99;
    
    // Calculamos si hubo descuento con tachis
    const calculoPrevio = subtotal + envio;
    const descuento = Math.max(0, calculoPrevio - pedido.total);

    // Fecha aproximada (sumamos 2 días)
    const fechaPedido = new Date(pedido.fecha);
    const fechaEntrega = new Date(fechaPedido);
    fechaEntrega.setDate(fechaEntrega.getDate() + 2);

    return (
        <div className="detalle-pedido-container">
            <div className="fondo-imprimiendo">
                <span className="texto">Imprimiendo ticket</span>
                <span className="puntos">
                    <span>.</span><span>.</span><span>.</span>
                </span>
            </div>

            <div className="ticket-wrapper" key={animationKey}>
                <div className="ticket">
                    <div className="ticket-top-edge"></div>
                    
                    <div className="ticket-header">
                        <img src={faviconTachi} alt="Pistachi & Snacks" className="ticket-logo" />
                        <h2>Pistachi & Snacks</h2>
                        <p className="ticket-date">{fechaPedido.toLocaleDateString()} {fechaPedido.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        <p className="ticket-order-id">TICKET #{pedido.id.toString().padStart(6, '0')}</p>
                    </div>

                    <div className="ticket-divider"></div>

                    <div className="ticket-user-info">
                        <h3>DATOS DEL CLIENTE</h3>
                        <p><strong>Usuario:</strong> {cliente ? `${cliente.nombre} ${cliente.apellidos}` : 'Cargando...'}</p>
                        <p><strong>Email:</strong> {cliente ? cliente.email : 'Cargando...'}</p>
                    </div>

                    <div className="ticket-divider"></div>

                    <div className="ticket-items">
                        <h3>DETALLE DE COMPRA</h3>
                        <div className="items-table">
                            <div className="items-header">
                                <span>CANT</span>
                                <span>CONCEPTO</span>
                                <span>IMPORTE</span>
                            </div>
                            {pedido.lineas.map(linea => (
                                <div key={linea.id} className="item-row">
                                    <span className="item-qty">{linea.cantidad}x</span>
                                    <span className="item-name">{linea.producto.nombre}</span>
                                    <span className="item-total">{(linea.cantidad * linea.precioUnitario).toFixed(2)}€</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="ticket-divider"></div>

                    <div className="ticket-totals">

                        <div className="total-row">
                            <span>SUBTOTAL:</span>
                            <span>{subtotal.toFixed(2)}€</span>
                        </div>
                        <div className="total-row">
                            <span>ENVÍO:</span>
                            <span>{envio === 0 ? 'GRATIS' : `${envio.toFixed(2)}€`}</span>
                        </div>
                        {descuento > 0 && (
                            <div className="total-row discount">
                                <span>TACHI POINTS:</span>
                                <span>-{descuento.toFixed(2)}€</span>
                            </div>
                        )}
                        <div className="total-row final-total">
                            <span>TOTAL PAGADO:</span>
                            <span>{pedido.total.toFixed(2)}€</span>
                        </div>
                    </div>

                    <div className="ticket-divider"></div>

                    <div className="ticket-footer-info">
                        <div style={{ marginBottom: '15px' }}>
                            <StatusPill status={pedido.estado} />
                        </div>
                        <p><strong>ENTREGA ESTIMADA:</strong></p>
                        <p className="delivery-date">{fechaEntrega.toLocaleDateString()}</p>
                    </div>
                    
                    <div className="ticket-divider dashed"></div>

                    {pedido.tachisGenerados !== undefined && pedido.tachisGenerados > 0 && (
                        <div className="ticket-tachis-earned">
                            <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <Confetti size={20} color="#ffb300" weight="fill" />
                                ¡Has ganado Tachis con esta compra!
                                <Confetti size={20} color="#ffb300" weight="fill" />
                            </p>
                            <p className="tachis-text">
                                +{pedido.tachisGenerados} <img src={faviconTachi} alt="Tachis" className="tachis-icon-inline" />
                            </p>
                        </div>
                    )}

                    <div className="ticket-thanks">
                        <p>¡Gracias por tu compra!</p>
                        <p>Visítanos de nuevo pronto</p>
                        <p className="barcode">|| | | ||| | || | || | |||</p>
                    </div>

                    <div className="ticket-bottom-extension"></div>
                </div>
            </div>

            <button 
                className="btn-replay-animacion" 
                onClick={playAnimation}
                title="Volver a imprimir ticket"
            >
                <ArrowsClockwise size={28} weight="bold" />
            </button>
        </div>
    );
};

export default DetallePedido;
