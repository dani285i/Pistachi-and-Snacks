import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/auth/Auth';
import { useToast } from '../../context/toast/ToastContext';
import { EnvelopeSimple, LockKey, Eye, EyeSlash } from '@phosphor-icons/react';
import './Login.css';

interface Slide {
    id: number;
    url: string;
    title: string;
}

const slides: Slide[] = [
    { id: 1, url: '/img/tarta-de-queso-de-pistacho.png', title: 'Tarta de Queso con Pistacho' },
    { id: 2, url: '/img/tostada-de-pistacho.png', title: 'Tostadas con Crema' },
    { id: 3, url: '/img/napolitana-de-pistacho.png', title: 'Napolitana de Pistacho' },
    { id: 4, url: '/img/donut-de-pistacho.png', title: 'Donut de Pistacho' }
];

type Direction = 'left' | 'up' | 'right' | 'down';

const Login = () => {
    const navigate = useNavigate();
    const { login, usuario } = useAuth();
    const { addToast } = useToast();
    
    // Login states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Carousel states
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState<Direction>('left');

    useEffect(() => {
        if (usuario) {
            navigate('/');
        }
    }, [usuario, navigate]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => {
                const next = (prev + 1) % slides.length;
                
                // Set direction based on the transition rules:
                // 1 -> 2 (0 -> 1): Left
                // 2 -> 3 (1 -> 2): Up
                // 3 -> 4 (2 -> 3): Right
                // 4 -> 1 (3 -> 0): Down
                if (prev === 0) setDirection('left');
                else if (prev === 1) setDirection('up');
                else if (prev === 2) setDirection('right');
                else if (prev === 3) setDirection('down');
                
                return next;
            });
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const respuesta = await fetch('http://localhost:9090/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (respuesta.ok) {
                const dataUsuario = await respuesta.json();
                login(dataUsuario);
                addToast(`¡Bienvenido de nuevo, ${dataUsuario.nombre}!`, 'success');
                navigate('/');
            } else {
                setError("Email o contraseña incorrectos.");
            }
        } catch {
            setError("No se pudo conectar con el servidor.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-split-wrapper">
            <div className="login-image-section">
                {slides.map((slide, index) => {
                    let statusClass = 'slide-hidden';
                    if (index === currentIndex) {
                        statusClass = `slide-active slide-enter-${direction}`;
                    } else if (
                        (currentIndex === 0 && index === 3) || 
                        (index === currentIndex - 1)
                    ) {
                        statusClass = 'slide-exit';
                    }
                    
                    return (
                        <div 
                            key={slide.id} 
                            className={`carousel-slide ${statusClass}`}
                            style={{ backgroundImage: `url(${slide.url})` }}
                        />
                    );
                })}

                <div className="image-overlay">
                    <div className="brand-watermark">
                        <h2 className="fade-title" key={slides[currentIndex].id}>
                            {slides[currentIndex].title}
                        </h2>
                        <p>OBRADOR ARTESANAL</p>
                    </div>
                </div>
            </div>

            <div className="login-form-section">
                <div className="login-form-container">
                    <div className="login-header">
                        <h1>Bienvenido al Obrador</h1>
                        <p>El aroma a pistacho recién tostado te espera. Accede a tu cuenta.</p>
                    </div>

                    {error && (
                        <div className="error-toast">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="premium-form">
                        <div className="floating-input-group">
                            <EnvelopeSimple size={22} weight="bold" className="input-icon left-icon" />
                            <input 
                                type="email" 
                                id="email" 
                                className={`floating-input ${email.length > 0 ? 'filled' : ''}`}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder=" "
                                required
                            />
                            <label htmlFor="email" className="floating-label">Correo Electrónico</label>
                        </div>

                        <div className="floating-input-group">
                            <LockKey size={22} weight="bold" className="input-icon left-icon" />
                            <input 
                                type={mostrarPassword ? "text" : "password"} 
                                id="password"
                                className={`floating-input ${password.length > 0 ? 'filled' : ''}`}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder=" "
                                required
                            />
                            <label htmlFor="password" className="floating-label">Contraseña</label>
                            
                            <button 
                                type="button" 
                                className="toggle-pwd-btn"
                                onClick={() => setMostrarPassword(!mostrarPassword)}
                                aria-label="Mostrar contraseña"
                            >
                                {mostrarPassword ? <EyeSlash size={22} weight="bold" /> : <Eye size={22} weight="bold" />}
                            </button>
                        </div>

                        <div className="form-actions-row">
                            <Link to="/olvido-password" className="subtle-link">¿Olvidaste tu contraseña?</Link>
                        </div>

                        <button 
                            type="submit" 
                            className={`premium-submit-btn ${isSubmitting ? 'loading' : ''}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Accediendo...' : 'Entrar'}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>¿Aún no tienes la llave del obrador? <Link to="/registro" className="subtle-link bold-link">Regístrate aquí</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;