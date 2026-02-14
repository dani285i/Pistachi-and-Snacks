import './Login.css';

const Login = () => (

    <div className="login-page">

        <div className="login-card">
            
        <h2>Bienvenido de Nuevo</h2>
        <p>Introduce tus credenciales para acceder</p>

        <form>

            <div className="input-group">
                <label>Email</label>
                <input type="email" placeholder="usuario@pistachi.com" />
            </div>

            <div className="input-group">
                <label>Contraseña</label>
                <input type="password" placeholder="••••••••" />
            </div>

            <button type="submit" className="login-btn">Entrar</button>

        </form>

        </div>

    </div>

);

export default Login;