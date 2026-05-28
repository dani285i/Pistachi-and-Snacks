import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/auth/Auth';
import { useToast } from '../../context/toast/ToastContext';
import { User, EnvelopeSimple, LockKey, Eye, EyeSlash } from '@phosphor-icons/react';
import { CustomDatePicker } from '../../components/datepicker/CustomDatePicker';
import './Registro.css';

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

// esta vista es para que te crees una cuenta nueva si eres nuevo, metes tus datos y te manda al login para que entres por primera vez, como por ejemplo la tipica pantalla de crear usuario de toda la vida
const Registro = () => {
    const navigate = useNavigate();
    const { login, usuario } = useAuth();
    const { addToast } = useToast();
    const [errores, setErrores] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mostrarPassword, setMostrarPassword] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        nombre: '',
        apellidos: '',
        email: '',
        fechaNacimiento: ''
    });

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
                if (prev === 0) setDirection('left');
                else if (prev === 1) setDirection('up');
                else if (prev === 2) setDirection('right');
                else if (prev === 3) setDirection('down');
                return next;
            });
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    const validarEdad = (fecha: string) => {
        const hoy = new Date();
        const cumple = new Date(fecha);
        let edad = hoy.getFullYear() - cumple.getFullYear();
        const m = hoy.getMonth() - cumple.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) {
            edad--;
        }
        return edad >= 18;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrores([]);

        if (!formData.username || !formData.password || !formData.nombre || 
            !formData.apellidos || !formData.email || !formData.fechaNacimiento) {
            setErrores(["Todos los campos son obligatorios."]);
            return;
        }

        if (!validarEdad(formData.fechaNacimiento)) {
            setErrores(["Debes ser mayor de edad para registrarte."]);
            return;
        }

        setIsSubmitting(true);

        try {
            const respuesta = await fetch('http://localhost:9090/auth/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (respuesta.ok) {
                const dataUsuario = await respuesta.json(); 
                login(dataUsuario);
                addToast("Registro exitoso. Â¡Bienvenido al obrador!", 'success');
                navigate('/');
            } else {
                setErrores(["Error al registrar el usuario. Es posible que el correo o usuario ya existan."]);
            }
        } catch {
            setErrores(["No se pudo conectar con el servidor."]);
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
                        <h1>Crea tu Cuenta</h1>
                        <p>Ãšnete para disfrutar de nuestras delicias de pistacho.</p>
                    </div>

                    {errores.length > 0 && (
                        <div className="error-toast">
                            {errores.map((err, i) => <span key={i}>{err}<br/></span>)}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="premium-form">
                        <div className="floating-input-group">
                            <User size={22} weight="bold" className="input-icon left-icon" />
                            <input 
                                type="text" 
                                id="username" 
                                name="username"
                                autoComplete="username"
                                className={`floating-input ${formData.username.length > 0 ? 'filled' : ''}`}
                                value={formData.username}
                                onChange={e => setFormData({...formData, username: e.target.value})}
                                placeholder="Alias"
                                required
                            />
                            <label htmlFor="username" className="floating-label">Nombre de Usuario</label>
                        </div>

                        <div className="input-row-split">
                            <div className="floating-input-group">
                                <User size={22} weight="bold" className="input-icon left-icon" />
                                <input 
                                    type="text" 
                                    id="nombre" 
                                    name="nombre"
                                    autoComplete="given-name"
                                    className={`floating-input ${formData.nombre.length > 0 ? 'filled' : ''}`}
                                    value={formData.nombre}
                                    onChange={e => setFormData({...formData, nombre: e.target.value})}
                                    placeholder=" "
                                    required
                                />
                                <label htmlFor="nombre" className="floating-label">Nombre</label>
                            </div>

                            <div className="floating-input-group">
                                <User size={22} weight="bold" className="input-icon left-icon" />
                                <input 
                                    type="text" 
                                    id="apellidos" 
                                    name="apellidos"
                                    autoComplete="family-name"
                                    className={`floating-input ${formData.apellidos.length > 0 ? 'filled' : ''}`}
                                    value={formData.apellidos}
                                    onChange={e => setFormData({...formData, apellidos: e.target.value})}
                                    placeholder=" "
                                    required
                                />
                                <label htmlFor="apellidos" className="floating-label">Apellidos</label>
                            </div>
                        </div>

                        <div className="floating-input-group">
                            <EnvelopeSimple size={22} weight="bold" className="input-icon left-icon" />
                            <input 
                                type="email" 
                                id="email" 
                                name="email"
                                autoComplete="email"
                                className={`floating-input ${formData.email.length > 0 ? 'filled' : ''}`}
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                                placeholder=" "
                                required
                            />
                            <label htmlFor="email" className="floating-label">Correo ElectrÃ³nico</label>
                        </div>

                        <div className="floating-input-group">
                            <LockKey size={22} weight="bold" className="input-icon left-icon" />
                            <input 
                                type={mostrarPassword ? "text" : "password"} 
                                id="password"
                                name="password"
                                autoComplete="new-password"
                                className={`floating-input ${formData.password.length > 0 ? 'filled' : ''}`}
                                value={formData.password}
                                onChange={e => setFormData({...formData, password: e.target.value})}
                                placeholder=" "
                                required
                            />
                            <label htmlFor="password" className="floating-label">ContraseÃ±a</label>
                            
                            <button 
                                type="button" 
                                className="toggle-pwd-btn"
                                onClick={() => setMostrarPassword(!mostrarPassword)}
                                aria-label="Mostrar contraseÃ±a"
                            >
                                {mostrarPassword ? <EyeSlash size={22} weight="bold" /> : <Eye size={22} weight="bold" />}
                            </button>
                        </div>

                        <CustomDatePicker 
                            value={formData.fechaNacimiento}
                            onChange={(val) => setFormData({...formData, fechaNacimiento: val})}
                            mode="birthdate"
                            label="Fecha de Nacimiento"
                            required={true}
                        />

                        <button 
                            type="submit" 
                            className={`premium-submit-btn ${isSubmitting ? 'loading' : ''}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creando llave...' : 'Registrarse'}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>Â¿Ya tienes las llaves del obrador? <Link to="/login" className="subtle-link bold-link">Entra aquÃ­</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registro;
