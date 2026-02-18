import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './Registro.css';

const Registro = () => {
    const navigate = useNavigate();
    const [errores, setErrores] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        nombre: '',
        apellidos: '',
        email: '',
        fechaNacimiento: ''
    });

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

        try {
            const respuesta = await fetch('http://localhost:80/auth/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (respuesta.ok) {
                alert("¡Registro exitoso!");
                navigate('/');
            } else {
                setErrores(["Error al registrar el usuario. Inténtalo de nuevo."]);
            }
        } catch (error) {
            setErrores(["No se pudo conectar con el servidor."]);
        }
    };
    
    return (
        <div className="registro-page">
            <div className="registro-card">
                <h2>Crea tu cuenta</h2>
                <p>Únete para disfrutar de nuestras delicias de pistacho.</p>

                {errores.length > 0 && (
                    <div className="error-container">
                        {errores.map((err, i) => <p key={i} className="error-msg">{err}</p>)}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Nombre de Usuario</label>
                        <input type="text" value={formData.username} 
                            onChange={e => setFormData({...formData, username: e.target.value})} />
                    </div>
                    <div className="input-row">
                        <div className="input-group">
                            <label>Nombre</label>
                            <input type="text" value={formData.nombre} 
                                onChange={e => setFormData({...formData, nombre: e.target.value})} />
                        </div>
                        <div className="input-group">
                            <label>Apellidos</label>
                            <input type="text" value={formData.apellidos} 
                                onChange={e => setFormData({...formData, apellidos: e.target.value})} />
                        </div>
                    </div>
                    <div className="input-group">
                        <label>Email</label>
                        <input type="email" value={formData.email} 
                            onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div className="input-group">
                        <label>Contraseña</label>
                        <input type="password" value={formData.password} 
                            onChange={e => setFormData({...formData, password: e.target.value})} />
                    </div>
                    <div className="input-group">
                        <label>Fecha de Nacimiento</label>
                        <input type="date" value={formData.fechaNacimiento} 
                            onChange={e => setFormData({...formData, fechaNacimiento: e.target.value})} />
                    </div>
                    <button type="submit" className="registro-btn">Registrarse</button>
                </form>
            </div>
        </div>
    );
};

export default Registro;