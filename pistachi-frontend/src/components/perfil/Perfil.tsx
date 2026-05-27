import React from 'react';
import { useAuth } from '../../context/auth/Auth';
import { useNavigate } from 'react-router-dom';
import { X, Clock, Cookie, SignOut, WarningCircle } from '@phosphor-icons/react';
import SuscripcionModal from './SuscripcionModal';
import iconoAdmin from '../../assets/favicon/web-app-manifest-512x512.png';
import './Perfil.css';

interface PerfilProps {
    abierto: boolean;
    cerrarPerfil: () => void;
}

const Perfil: React.FC<PerfilProps> = ({ abierto, cerrarPerfil }) => {
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();
    const [modalSuscripcionAbierto, setModalSuscripcionAbierto] = React.useState(false);
    const [modalConfirmarSalir, setModalConfirmarSalir] = React.useState(false);

    const [pedidos, setPedidos] = React.useState<{ id: string, fecha: string, total: number, estado: string }[]>([]);

    React.useEffect(() => {
        if (abierto && usuario?.id) {
            // Se asume que el token puede ser necesario (aunque en PedidoController no parece estricto, es mejor enviarlo)
            const sesionString = localStorage.getItem('user_session');
            const token = sesionString ? JSON.parse(sesionString).token : '';
            
            fetch(`http://localhost:9090/pedidos/usuario/${usuario.id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(res => {
                if (!res.ok) throw new Error("Error en la respuesta");
                return res.json();
            })
            .then(data => {
                // Formateamos la fecha para que quede bonita (ej: "27 de mayo de 2026")
                const formated = data.map((p: any) => ({
                    ...p,
                    fecha: new Date(p.fecha).toLocaleDateString('es-ES', { 
                        day: 'numeric', month: 'short', year: 'numeric' 
                    })
                }));
                // Ordenamos del más reciente al más antiguo
                formated.sort((a: any, b: any) => b.id - a.id);
                setPedidos(formated);
            })
            .catch(err => console.error("Error al cargar historial de pedidos:", err));
        }
    }, [abierto, usuario]);

    const getClaseSuscripcion = (tipo: string | undefined) => {
        if (!tipo || tipo.toLowerCase() === 'ninguna') return 'ninguna';
        if (tipo === 'Degustación') return 'degustacion';
        if (tipo === 'Premium') return 'premium';
        return 'ninguna';
    };

    const getEstadoClass = (estado: string) => {
        switch (estado) {
            case 'Cancelado': return 'estado-cancelado';
            case 'En Proceso': return 'estado-proceso';
            case 'En Tránsito': return 'estado-transito';
            case 'Entregado': return 'estado-entregado';
            default: return '';
        }
    };

    const handleLogout = () => {
        setModalConfirmarSalir(true);
    };

    const confirmarLogout = () => {
        setModalConfirmarSalir(false);
        logout();
        cerrarPerfil();
    };

    return (
        <>
            {/* El fondo oscuro que difumina la tienda cuando la bandeja sale */}
            <div className={`perfil-overlay ${abierto ? 'activo' : ''}`} onClick={cerrarPerfil}></div>
            
            {/* La Bandeja en sí */}
            <aside className={`perfil-bandeja ${abierto ? 'abierta' : ''}`}>
                <div className="perfil-header">
                    <div>
                        <h2>¡Bienvenido, {usuario?.nombre || 'Daniel'}!</h2>
                        <p>Gestiona tu cuenta y echa un vistazo a tus pedidos</p>
                    </div>
                    <button className="btn-cerrar-bandeja" onClick={cerrarPerfil}>
                        <X size={24} weight="bold" />
                    </button>
                </div>

                <div className="perfil-scroll-area">
                    {/* Tarjeta de Tachi Points */}
                    <section className="tarjeta-premium tachis-card">
                        <span className="tarjeta-label">Tus Tachi Points</span>
                        <h3>
                            <img src={iconoAdmin} alt="Tachis" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                            {Number(usuario?.tachis || 0).toLocaleString('de-DE')} Tachis
                        </h3>
                        <p>¡Obtén más comprando nuestros productos!</p>
                    </section>

                    {/* Tarjeta de Suscripción */}
                    <section className="tarjeta-premium clara">
                        <div className="suscripcion-header">
                            <div>
                                <span className="tarjeta-label oscuro" style={{ display: 'block' }}>Pistachi Box Subscription</span>
                                <span className={`badge-suscripcion ${getClaseSuscripcion(usuario?.tipoSuscripcion)}`}>
                                    {usuario?.tipoSuscripcion && usuario.tipoSuscripcion !== 'Ninguna' ? usuario.tipoSuscripcion : 'NINGUNA'}
                                </span>
                                <p>Tu subscripción mensual de snacks a domicilio</p>
                            </div>
                            <div className="suscripcion-acciones">
                                {usuario?.tipoSuscripcion && usuario.tipoSuscripcion !== 'Ninguna' ? (
                                    <span className="badge-activo" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', color: '#2ECC71', background: '#D5F5E3', padding: '5px 10px', borderRadius: '20px', fontWeight: 'bold' }}>
                                        <Clock size={14} weight="bold" />
                                        Activo
                                    </span>
                                ) : (
                                    <span className="badge-inactivo" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', color: '#7a7a7a', background: '#eae7e0', padding: '5px 10px', borderRadius: '20px', fontWeight: 'bold' }}>
                                        <X size={14} weight="bold" />
                                        Inactivo
                                    </span>
                                )}
                                <button className="btn-gestionar" onClick={() => setModalSuscripcionAbierto(true)}>
                                    Gestionar
                                </button>
                            </div>
                        </div>
                        <div className="suscripcion-footer">
                            <span>Siguiente entrega: <strong>{usuario?.proximaEntrega ? new Date(usuario.proximaEntrega).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : 'No programada'}</strong></span>
                        </div>
                    </section>

                    {/* Historial de Pedidos */}
                    <section className="tarjeta-premium tabla-pedidos-container">
                        <h3>Order History</h3>
                        
                        {pedidos.length === 0 ? (
                            <div className="pedidos-vacios">
                                <Cookie size={48} weight="light" color="#AAB3A6" className="icono-hambre" />
                                <h4>Mmmmm...</h4>
                                <p>Veo que aún no te entró el hambre de pistacho...</p>
                                <button 
                                    className="btn-ir-catalogo" 
                                    onClick={() => {
                                        cerrarPerfil();
                                        navigate('/productos');
                                    }}
                                >
                                    Ir a ver las golosadas
                                </button>
                            </div>
                        ) : (
                            <table className="tabla-pedidos">
                                <thead>
                                    <tr>
                                        <th>Order Number</th>
                                        <th>Date</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pedidos.map((pedido, index) => (
                                        <tr key={index}>
                                            <td><strong>{pedido.id}</strong></td>
                                            <td>{pedido.fecha}</td>
                                            <td>{pedido.total}€</td>
                                            <td>
                                                <span className={`estado-badge ${getEstadoClass(pedido.estado)}`}>
                                                    {pedido.estado}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </section>
                </div>

                <div className="perfil-footer">
                    <button className="btn-salir-cuenta" onClick={handleLogout}>
                        Cerrar Sesión
                        <SignOut size={18} weight="bold" />
                    </button>
                </div>
            </aside>

            {/* Modal de Suscripción flotante */}
            <SuscripcionModal 
                abierto={modalSuscripcionAbierto} 
                cerrarModal={() => setModalSuscripcionAbierto(false)} 
                perfilAbierto={abierto}
            />

            {/* Modal Confirmar Salir */}
            {modalConfirmarSalir && (
                <div className="modal-overlay activo" style={{ zIndex: 10002 }}>
                    <div className="glass-modal" style={{ maxWidth: '400px', textAlign: 'center', background: '#FDFBF7', padding: '30px', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                        <WarningCircle size={80} weight="fill" color="#E74C3C" style={{ margin: '0 auto 20px auto' }} />
                        <h2 style={{ color: '#121619', margin: '0 0 15px 0' }}>¿Cerrar sesión?</h2>
                        <p style={{ color: '#666', marginBottom: '25px', lineHeight: '1.5' }}>
                            ¿Estás seguro de que quieres salir de tu cuenta?
                        </p>
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                            <button 
                                onClick={() => setModalConfirmarSalir(false)} 
                                style={{ padding: '10px 20px', borderRadius: '50px', border: '1px solid #121619', background: 'transparent', color: '#121619', cursor: 'pointer', fontWeight: 600, transition: 'all 0.3s' }}
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={confirmarLogout} 
                                style={{ padding: '10px 20px', borderRadius: '50px', border: 'none', background: '#E74C3C', color: 'white', cursor: 'pointer', fontWeight: 600, transition: 'all 0.3s' }}
                            >
                                Sí, cerrar sesión
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Perfil;