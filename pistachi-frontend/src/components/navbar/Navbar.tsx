import { Link } from 'react-router-dom';
import { useCart } from '../../context/carrito/Carrito';
import { useAuth } from '../../context/auth/Auth';
import './Navbar.css';

const Navbar = () => {
    const { cartItems } = useCart();
    const { usuario, logout } = useAuth();
    const totalItems = cartItems.reduce((acc, item) => acc + item.cantidad, 0);
    
    return (
        <nav className="nav-container">
            <div className="nav-content">
                <Link to="/" className="nav-logo">PISTACHI <span>&</span> SNACKS</Link>
                
                <div className="nav-links">
                    <Link to="/">Inicio</Link>
                    <Link to="/productos">Catálogo</Link>
                </div>
                
                <div className="nav-actions">
                    {usuario ? (
                        <>
                            <span className="user-welcome">Hola, {usuario.nombre}</span>
                            <button onClick={logout} className="logout-btn">Salir</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="login-link">Entrar</Link>
                            <Link to="/registro" className="signin-link">Registrarse</Link>
                        </>
                    )}
                    
                    <Link to="/carrito" className="cart-button" style={{ position: 'relative' }}>
                        Carrito
                        <span className="carrito-contador">{totalItems}</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;