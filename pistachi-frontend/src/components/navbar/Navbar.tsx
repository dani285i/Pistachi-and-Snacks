import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => (
    
    <nav className="nav-container">

        <div className="nav-content">

            <Link to="/" className="nav-logo">PISTACHI <span>&</span> SNACKS</Link>
            
            <div className="nav-links">
                <Link to="/">Inicio</Link>
                <Link to="/productos">Catálogo</Link>
            </div>
            
            <div className="nav-actions">
                <Link to="/login" className="login-link">Acceso</Link>
                <Link to="/carrito" className="cart-button">Carrito (0)</Link>
            </div>

        </div>

    </nav>
);

export default Navbar;