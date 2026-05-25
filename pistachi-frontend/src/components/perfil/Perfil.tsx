import React from 'react';
import { useAuth } from '../../context/auth/Auth';
import { useNavigate } from 'react-router-dom';
import './Perfil.css';

interface PerfilProps {
    abierto: boolean;
    cerrarPerfil: () => void;
}

const Perfil: React.FC<PerfilProps> = ({ abierto, cerrarPerfil }) => {
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();

    // Dejamos solo este array vacío para forzar a que salga el estado del "hambre de pistacho"
    const pedidos: any[] = [];

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
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                <div className="perfil-scroll-area">
                    {/* Tarjeta de Tachi Points */}
                    <section className="tarjeta-premium oscura">
                        <span className="tarjeta-label">Tus Tachi Points</span>
                        <h3>2,450 Tachis</h3>
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
                                <span className="badge-activo">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                    Activo
                                </span>
                                <button className="btn-gestionar">Gestionar</button>
                            </div>
                        </div>
                        <div className="suscripcion-footer">
                            <span>Siguiente entrega: <strong>27 Julio, 2026</strong></span>
                        </div>
                    </section>

                    {/* Historial de Pedidos */}
                    <section className="tarjeta-premium tabla-pedidos-container">
                        <h3>Order History</h3>
                        
                        {pedidos.length === 0 ? (
                            <div className="pedidos-vacios">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#AAB3A6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icono-hambre">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                                    <line x1="9" y1="9" x2="9.01" y2="9"></line>
                                    <line x1="15" y1="9" x2="15.01" y2="9"></line>
                                </svg>
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
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Perfil;