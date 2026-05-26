import React from 'react';
import { useAuth } from '../../context/auth/Auth';
import { useNavigate } from 'react-router-dom';
import { X, Clock, Cookie, SignOut, WarningCircle } from '@phosphor-icons/react';
import SuscripcionModal from './SuscripcionModal';
import './Perfil.css';

interface PerfilProps {
    abierto: boolean;
    cerrarPerfil: () => void;
}

const Perfil: React.FC<PerfilProps> = ({ abierto, cerrarPerfil }) => {
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();
    const [modalSuscripcionAbierto, setModalSuscripcionAbierto] = React.useState(false);

    // Dejamos solo este array vacío para forzar a que salga el estado del "hambre de pistacho"
    const pedidos: { id: string, fecha: string, total: number, estado: string }[] = [];

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
                    <section className="tarjeta-premium oscura">
                        <span className="tarjeta-label">Tus Tachi Points</span>
                        <h3>{usuario?.tachis || 0} Tachis</h3>
                        <p>¡Obtén más comprando nuestros productos!</p>
                    </section>

                    {/* Tarjeta de Suscripción */}
                    <section className="tarjeta-premium clara">
                        <div className="suscripcion-header">
                            <div>
                                <span className="tarjeta-label oscuro">Pistachi Box Subscription</span>
                                <p>Tu subscripción mensual de snacks a domicilio</p>
                            </div>
                            <div className="suscripcion-acciones">
                                {usuario?.tipoSuscripcion ? (
                                    <span className="badge-activo">
                                        <Clock size={14} weight="bold" />
                                        Activo ({usuario.tipoSuscripcion})
                                    </span>
                                ) : (
                                    <span className="badge-inactivo" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', color: '#7a7a7a', background: '#eae7e0', padding: '5px 10px', borderRadius: '20px', fontWeight: 'bold' }}>
                                        <WarningCircle size={14} weight="bold" />
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

            {/* Modal de Suscripción */}
            <SuscripcionModal 
                abierto={modalSuscripcionAbierto} 
                cerrarModal={() => setModalSuscripcionAbierto(false)} 
            />
        </>
    );
};

export default Perfil;