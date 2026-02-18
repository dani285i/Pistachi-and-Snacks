import { Link } from 'react-router-dom';
import { useCart } from '../../context/carrito/Carrito';
import './Navbar.css';

const Navbar = () => {

    const { cartItems } = useCart();
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
                    <Link to="/login" className="login-link">Acceso</Link>
                    
                    <Link to="/carrito" className="cart-button" style={{ position: 'relative' }}>
                        Carrito
                        {/* Ahora el contador se renderiza siempre, mostrando 0 por defecto */}
                        <span className="carrito-contador">{totalItems}</span>
                    </Link>
                </div>

            </div>

        </nav>
    );
}

export default Navbar;