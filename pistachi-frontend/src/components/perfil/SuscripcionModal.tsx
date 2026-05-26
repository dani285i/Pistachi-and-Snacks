import React, { useState } from 'react';
import { useAuth } from '../../context/auth/Auth';
import { X, Package, CheckCircle } from '@phosphor-icons/react';
import { useToast } from '../../context/toast/ToastContext';
import './SuscripcionModal.css';

interface Props {
    abierto: boolean;
    cerrarModal: () => void;
}

const SuscripcionModal: React.FC<Props> = ({ abierto, cerrarModal }) => {
    const { usuario, updateUsuario } = useAuth();
    const { addToast } = useToast();
    const [cargando, setCargando] = useState(false);
    
    // Si no está abierto o no hay usuario, no renderizamos nada
    if (!abierto || !usuario) return null;

    const handleActualizarPlan = async (nuevoPlan: string) => {
        try {
            setCargando(true);
            const respuesta = await fetch(`http://localhost:9090/usuarios/${usuario.id}/suscripcion`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tipoSuscripcion: nuevoPlan })
            });

            if (!respuesta.ok) throw new Error('Error al actualizar la suscripción');

            const usuarioActualizado = await respuesta.json();
            
            // Actualizamos el contexto local para que la UI reaccione
            updateUsuario({
                tipoSuscripcion: usuarioActualizado.tipoSuscripcion,
                proximaEntrega: usuarioActualizado.proximaEntrega
            });

            cerrarModal();
        } catch (error) {
            console.error(error);
            addToast("No hemos podido actualizar tu plan. Inténtalo de nuevo más tarde.", 'error');
        } finally {
            setCargando(false);
        }
    };

    const planActual = usuario.tipoSuscripcion || 'Ninguna';

    return (
        <div className="suscripcion-modal-overlay" onClick={cerrarModal}>
            <div className="suscripcion-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="btn-cerrar-modal" onClick={cerrarModal}>
                    <X size={24} weight="bold" />
                </button>

                <div className="modal-header-central">
                    <Package size={48} weight="fill" color="var(--color-dark-green)" />
                    <h2>Gestiona tu Pistachi Box</h2>
                    <p>Elige el plan que mejor se adapte a tu hambre de pistacho.</p>
                </div>

                <div className="planes-grid">
                    {/* Plan Degustación */}
                    <div className={`plan-card ${planActual === 'Degustación' ? 'plan-activo' : ''}`}>
                        {planActual === 'Degustación' && <CheckCircle size={24} weight="fill" className="check-icon" />}
                        <h3>Degustación</h3>
                        <p className="plan-precio">15€ <span>/ mes</span></p>
                        <ul className="plan-features">
                            <li>4 Snacks sorpresa</li>
                            <li>Envío estándar gratis</li>
                            <li>Soporte básico</li>
                        </ul>
                        {planActual === 'Degustación' ? (
                            <button className="btn-plan actual" disabled>Tu plan actual</button>
                        ) : (
                            <button className="btn-plan" onClick={() => handleActualizarPlan('Degustación')} disabled={cargando}>
                                Cambiar a Degustación
                            </button>
                        )}
                    </div>

                    {/* Plan Premium */}
                    <div className={`plan-card ${planActual === 'Premium' ? 'plan-activo' : ''}`}>
                        {planActual === 'Premium' && <CheckCircle size={24} weight="fill" className="check-icon" />}
                        <h3>Premium</h3>
                        <p className="plan-precio">25€ <span>/ mes</span></p>
                        <ul className="plan-features">
                            <li>8 Snacks sorpresa</li>
                            <li>Ediciones limitadas</li>
                            <li>Envío prioritario gratis</li>
                        </ul>
                        {planActual === 'Premium' ? (
                            <button className="btn-plan actual" disabled>Tu plan actual</button>
                        ) : (
                            <button className="btn-plan destacado" onClick={() => handleActualizarPlan('Premium')} disabled={cargando}>
                                Cambiar a Premium
                            </button>
                        )}
                    </div>
                </div>

                {planActual !== 'Ninguna' && (
                    <div className="modal-footer-danger">
                        <button 
                            className="btn-cancelar-suscripcion" 
                            onClick={() => handleActualizarPlan('Ninguna')}
                            disabled={cargando}
                        >
                            Cancelar mi suscripción
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuscripcionModal;
