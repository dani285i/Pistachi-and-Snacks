import React, { useState } from 'react';
import { useAuth } from '../../context/auth/Auth';
import { useNavigate } from 'react-router-dom';
import './PistachiBox.css';

const PistachiBox: React.FC = () => {
    const { usuario } = useAuth();
    const navigate = useNavigate();
    const [planSeleccionado, setPlanSeleccionado] = useState<'Degustación' | 'Premium'>('Degustación');

    const handleSuscribir = () => {
        if (!usuario) {
            // Si no está logueado, alertar o redirigir (de momento solo un aviso o a login)
            alert('¡Debes iniciar sesión para suscribirte al club!');
            navigate('/login');
            return;
        }

        // Si está logueado, le decimos que vaya a su perfil a gestionarlo
        alert('Redirigiendo a tu Perfil para confirmar la suscripción...');
        // En una app real, podríamos abrir el perfil aquí pasándole un state o abrir un modal de Checkout
        // Por ahora, asumimos que puede ir al catálogo o le pediremos que abra su perfil.
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
