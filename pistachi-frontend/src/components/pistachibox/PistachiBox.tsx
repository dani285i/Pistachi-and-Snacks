import React, { useState } from 'react';
import { useAuth } from '../../context/auth/Auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/toast/ToastContext';
import './PistachiBox.css';

const PistachiBox: React.FC = () => {
    const { usuario } = useAuth();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [planSeleccionado, setPlanSeleccionado] = useState<'Degustación' | 'Premium'>('Degustación');

    const handleSuscribir = () => {
        if (!usuario) {
            addToast('¡Debes iniciar sesión para suscribirte al club!', 'error');
            navigate('/login');
            return;
        }

        addToast('Redirigiendo a tu Perfil para confirmar la suscripción...', 'info');
    };

    return (
        <section className="pistachibox-container">
            <div className="pistachibox-image-col">
                {/* Imagen del placeholder (se usará una foto estética real) */}
                <img 
                    src="https://images.unsplash.com/photo-1620189507195-68309c04c4d0?q=80&w=800&auto=format&fit=crop" 
                    alt="Pistachi Box Mensual" 
                    className="pistachibox-img"
                />
            </div>

            <div className="pistachibox-content-col">
                <span className="pistachibox-subtitle">CLUB DE SUSCRIPCIÓN</span>
                <h2 className="pistachibox-title">La Pistachi Box Mensual</h2>
                <p className="pistachibox-desc">
                    Recibe cada mes una selección sorpresa de nuestras mejores creaciones, ediciones limitadas y snacks exclusivos directamente en tu puerta. Cancela cuando quieras.
                </p>

                <div className="pistachibox-plans">
                    <div 
                        className={`pistachibox-plan ${planSeleccionado === 'Degustación' ? 'activo' : ''}`}
                        onClick={() => setPlanSeleccionado('Degustación')}
                    >
                        <strong>Caja Degustación</strong>
                        <span>15€ / mes</span>
                    </div>
                    <div 
                        className={`pistachibox-plan ${planSeleccionado === 'Premium' ? 'activo' : ''}`}
                        onClick={() => setPlanSeleccionado('Premium')}
                    >
                        <strong>Caja Premium</strong>
                        <span>25€ / mes</span>
                    </div>
                </div>

                <button className="pistachibox-btn" onClick={handleSuscribir}>
                    Suscribirme a Caja {planSeleccionado}
                </button>
            </div>
        </section>
    );
};

export default PistachiBox;
