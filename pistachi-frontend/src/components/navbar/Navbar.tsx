import { useCart } from '../../context/carrito/Carrito';
import { useAuth } from '../../context/auth/Auth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { scroller } from 'react-scroll';
import iconoAdmin from '../../assets/favicon/web-app-manifest-512x512.png';
import './Navbar.css';

const Navbar = () => {
    const { cartItems } = useCart();
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); // Sabe en qué URL estamos exactamentente

    // CONTROL DEL LOGO: Te redirige a inicio y asegura que suba arriba del todo
    const handleLogoClick = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate('/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // CONTROL DEL BOTÓN INICIO: Si ya estás en Inicio, te sube arriba con suavidad
    const handleInicioClick = (e: React.MouseEvent) => {
        if (location.pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // CONTROL DE NOVEDADES: Scroll suave en Inicio o redirección inteligente desde otra vista
    const handleNovedadesClick = () => {
        if (location.pathname === '/') {
            scroller.scrollTo('seccion-novedad', {
                smooth: true,
                duration: 800,
                offset: -70
            });
        } else {
            navigate('/', { state: { hacerScrollANovedades: true } });
        }
    };
    
    // Calculo el total de productos sumando las cantidades del carrito
    const totalItems = cartItems.reduce((acc, item) => acc + item.cantidad, 0);

    const handleLogout = () => {
        logout();
        navigate('/');
    };
    
    return (
        <header className="navbar-wrapper">
            <nav className="navbar-glass">
                
                <div className="navbar-brand">
                    {/* Añadido el evento onClick para el Logo */}
                    <Link to="/" className="brand-logo" onClick={handleLogoClick}>
                        PISTACHI 
                        <span className="logo-anim-wrapper">
                            <span className="logo-dot">•</span>
                            <span className="logo-amp">&</span>
                        </span> 
                        SNACKS
                    </Link>
                </div>
                
                <div className="navbar-menu">
                    {/* Añadido el evento onClick para el botón Inicio */}
                    <Link to="/" className="menu-link" onClick={handleInicioClick}>Inicio</Link>
                    <span onClick={handleNovedadesClick} className="menu-link" style={{ cursor: 'pointer' }}>Novedades</span>
                    <Link to="/productos" className="menu-link">Catálogo</Link>
                    <Link to="/favoritos" className="menu-link">Favoritos</Link>
                </div>
                
                <div className="navbar-actions">
                    {usuario ? (
                        <div className="user-section">
                            {usuario?.username === 'admin' && (
                                <Link to="/admin" className="admin-badge">
                                    <img src={iconoAdmin} alt="Panel Admin" className="admin-badge-icon" />
                                    Admin
                                </Link>
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