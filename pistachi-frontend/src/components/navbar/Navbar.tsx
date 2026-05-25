
import { useCart } from '../../context/carrito/Carrito';
import { useAuth } from '../../context/auth/Auth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { scroller } from 'react-scroll';
import './Navbar.css';

const Navbar = () => {
    const { cartItems } = useCart();
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); // Sabe en qué URL estamos

    const handleNovedadesClick = () => {
        if (location.pathname === '/') {
            // Si ya estamos en inicio, hacemos el scroll suave directamente
            scroller.scrollTo('seccion-novedad', {
                smooth: true,
                duration: 800,
                offset: -70
            });
        } else {
            // Si estamos en otra página, volvemos a inicio pasándole un "aviso" por el estado
            navigate('/', { state: { hacerScrollANovedades: true } });
        }
    };
    
    // calculo el total de productos sumando las cantidades del carrito para mostrarlo en el indicador visual, asi el cliente siempre sabe cuanto lleva
    const totalItems = cartItems.reduce((acc, item) => acc + item.cantidad, 0);

    const handleLogout = () => {
        // limpio la sesion actual y mando al usuario al inicio de golpe, cortando el acceso de raiz
        logout();
        navigate('/');
    };
    
    return (
        <header className="navbar-wrapper">
            <nav className="navbar-glass">
                
                <div className="navbar-brand">
                    <Link to="/" className="brand-logo">
                        PISTACHI 
                        {/* creo un contenedor relativo para meter los dos simbolos y alternarlos con css puro al hacer hover */}
                        <span className="logo-anim-wrapper">
                            <span className="logo-dot">•</span>
                            <span className="logo-amp">&</span>
                        </span> 
                        SNACKS
                    </Link>
                </div>
                
                <div className="navbar-menu">
                    <Link to="/" className="menu-link">Inicio</Link>
                    <span onClick={handleNovedadesClick} className="menu-link" style={{ cursor: 'pointer' }}>Novedades</span>
                    <Link to="/productos" className="menu-link">Catálogo</Link>
                    <Link to="/favoritos" className="menu-link">Favoritos</Link>
                </div>
                
                <div className="navbar-actions">
                    {usuario ? (
                        <div className="user-section">
                            {/* verifico si es el jefe para mostrarle el pase vip al panel de control, de lo contrario le oculto este boton */}
                            {usuario?.username === 'admin' && (
                                <Link to="/admin" className="admin-badge">Admin</Link>
                            )}
                            <span className="user-greeting">Hola, <strong>{usuario.nombre}</strong></span>
                            <button onClick={handleLogout} className="action-btn logout-btn">
                                Salir
                            </button>
                        </div>
                    ) : (
                        <div className="auth-section">
                            <Link to="/login" className="action-btn login-btn">Entrar</Link>
                            <Link to="/registro" className="action-btn register-btn">Registro</Link>
                        </div>
                    )}
                    
                    <div className="tools-section">
                        {usuario && (
                            <div className="points-badge">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-88a8,8,0,0,1-8,8H136v24a8,8,0,0,1-16,0V136H96a8,8,0,0,1,0-16h24V96a8,8,0,0,1,16,0v24h24A8,8,0,0,1,168,128Z"></path></svg>
                                <span>0 Tachis</span>
                            </div>
                        )}
                        
                        <Link to="/carrito" className="cart-badge-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 256 256"><path d="M216,72H56L59.86,149.25A24,24,0,0,0,83.82,168h96.36a24,24,0,0,0,23.96-18.75ZM62.4,208a16,16,0,1,1,16-16A16,16,0,0,1,62.4,208Zm128,0a16,16,0,1,1,16-16A16,16,0,0,1,190.4,208ZM24,40H40l4.33,21.64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="20"></path></svg>
                            <span className="cart-count">{totalItems}</span>
                        </Link>
                    </div>
                </div>

            </nav>
        </header>
    );
}

export default Navbar;