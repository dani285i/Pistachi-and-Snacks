import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, EnvelopeSimple, Package } from '@phosphor-icons/react';
import './Exito.css';

const Exito = () => {
    const navigate = useNavigate();

    // Redirigir si acceden aquí por error sin un pedido reciente (opcional)
    useEffect(() => {
        // En una app real, validaríamos que de verdad vienen de pagar
    }, []);

    return (
        <div className="exito-wrapper">
            <div className="exito-content">
                <CheckCircle size={80} weight="fill" className="exito-icon" />
                <h1>¡Pago Exitoso!</h1>
                <p className="exito-subtitle">Tu pedido ya está en el horno mágico de Pistachi.</p>
                
                <div className="exito-details">
                    <div className="exito-step">
                        <Package size={32} weight="duotone" />
                        <div>
                            <strong>Preparando</strong>
                            <p>Estamos seleccionando los mejores snacks para ti.</p>
                        </div>
                    </div>
                    <div className="exito-step">
                        <EnvelopeSimple size={32} weight="duotone" />
                        <div>
                            <strong>Confirmación</strong>
                            <p>Te hemos enviado un email con los detalles.</p>
                        </div>
                    </div>
                </div>

                <div className="exito-actions">
                    <button className="btn-primary" onClick={() => navigate('/', { replace: true })}>
                        Ir al Inicio
                    </button>
                    <button className="btn-secondary" onClick={() => navigate('/perfil', { replace: true })}>
                        Ver mi Cartera de Tachis
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Exito;
