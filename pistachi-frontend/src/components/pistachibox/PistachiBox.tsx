import React, { useState } from 'react';
import { useAuth } from '../../context/auth/Auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/toast/ToastContext';
import SuscripcionModal from '../perfil/SuscripcionModal';
import './PistachiBox.css';

const PistachiBox: React.FC = () => {
    const { usuario } = useAuth();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [planSeleccionado, setPlanSeleccionado] = useState<'Degustación' | 'Premium'>('Degustación');
    const [animClass, setAnimClass] = useState<string>('anim-zoom-in');
    const [animKey, setAnimKey] = useState<number>(0);
    const [modalSuscripcionAbierto, setModalSuscripcionAbierto] = useState(false);

    const handleSelectPlan = (plan: 'Degustación' | 'Premium') => {
        setPlanSeleccionado(plan);
        const anims = ['anim-zoom-in', 'anim-slide-fade', 'anim-rotate-fade', 'anim-blur-fade'];
        const randomAnim = anims[Math.floor(Math.random() * anims.length)];
        setAnimClass(randomAnim);
        setAnimKey(prev => prev + 1);
    };

    const handleSuscribir = () => {
        if (!usuario) {
            addToast('¡Debes iniciar sesión para suscribirte al club!', 'error');
            navigate('/login');
            return;
        }

        setModalSuscripcionAbierto(true);
    };

    return (
        <section className="pistachibox-container">
            <div className={`pistachibox-image-col ${planSeleccionado === 'Premium' ? 'premium-view' : 'degustacion-view'}`}>
                {/* Imagen del placeholder (se usará una foto estética real) */}
                <img 
                    key={animKey}
                    src={planSeleccionado === 'Degustación' ? '/img/menu-degustacion.png' : '/img/menu-premium.png'} 
                    alt={`Pistachi Box ${planSeleccionado}`} 
                    className={`pistachibox-img ${animClass}`}
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
                        onClick={() => handleSelectPlan('Degustación')}
                    >
                        <strong>Caja Degustación</strong>
                        <span>15€ / mes</span>
                    </div>
                    <div 
                        className={`pistachibox-plan ${planSeleccionado === 'Premium' ? 'activo' : ''}`}
                        onClick={() => handleSelectPlan('Premium')}
                    >
                        <strong>Caja Premium</strong>
                        <span>25€ / mes</span>
                    </div>
                </div>

                <button className="pistachibox-btn" onClick={handleSuscribir}>
                    Suscribirme a Caja {planSeleccionado}
                </button>
            </div>

            <SuscripcionModal 
                abierto={modalSuscripcionAbierto} 
                cerrarModal={() => setModalSuscripcionAbierto(false)} 
                perfilAbierto={false}
            />
        </section>
    );
};

export default PistachiBox;
