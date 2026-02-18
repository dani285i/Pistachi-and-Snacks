import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth/Auth';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const respuesta = await fetch('http://localhost:80/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (respuesta.ok) {
                const usuario = await respuesta.json();
                login(usuario);
                alert(`¡Bienvenido ${usuario.nombre}!`);
                navigate('/');
            } else {
                setError("Email o contraseña incorrectos.");
            }
        } catch (err) {
            setError("No se pudo conectar con el servidor.");
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h2>Bienvenido de Nuevo</h2>
                <p>Introduce tus credenciales para acceder</p>

                {error && <p className="error-msg" style={{ color: 'red' }}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            placeholder="usuario@pistachi.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Contraseña</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="login-btn">Entrar</button>
                </form>
            </div>
        </div>
    );
};

export default Login;