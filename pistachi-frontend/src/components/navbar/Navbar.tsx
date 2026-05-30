import { useState, useEffect } from 'react';
import { useCart } from '../../context/carrito/Carrito';
import { useToast } from '../../context/toast/ToastContext';
import { useAuth } from '../../context/auth/Auth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { scroller } from 'react-scroll';
import { ShoppingCart } from '@phosphor-icons/react';
import iconoAdmin from '../../assets/favicon/web-app-manifest-512x512.png';
import Perfil from '../perfil/Perfil';
import './Navbar.css';

const Navbar = () => {
    const { cartItems, validarInventario } = useCart();
    const { addToast } = useToast();
    const { usuario } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // ESTADO PARA ABRIR/CERRAR LA BANDEJA DEL PERFIL
    const [perfilAbierto, setPerfilAbierto] = useState(false);

    // VALIDACION DE INVENTARIO PARA CARRITO
    useEffect(() => {
        const handleEviction = (e: any) => {
            addToast(`El producto "${e.detail}" que tenías en el carrito, acaba de agotarse`, 'error');
        };
        window.addEventListener('cartItemEvicted', handleEviction);
        
        // Fetch products to validate on mount and on route change
        fetch('http://localhost:9090/productos')
            .then(res => res.json())
            .then(data => validarInventario(data))
            .catch(err => console.error("Error fetching products for cart validation", err));

        return () => window.removeEventListener('cartItemEvicted', handleEviction);
    }, [location.pathname]); // Validar cada vez que cambiamos de página

    // CONTROL DEL LOGO
    const handleLogoClick = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate('/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // CONTROL DEL BOTÓN INICIO
    const handleInicioClick = (e: React.MouseEvent) => {
        if (location.pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // CONTROL DE NOVEDADES
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
    
    return (
        <>
            <header className="navbar-wrapper">
                <nav className="navbar-glass">
                    
                    <div className="navbar-brand">
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
                                
                                {/* LA NUEVA ETIQUETA INNOVADORA DE ACCESO AL PERFIL */}
                                <button 
                                    className="etiqueta-bandeja" 
                                    onClick={() => setPerfilAbierto(true)}
                                >
                                    <span className="etiqueta-texto">Mi Bandeja</span>
                                    <strong className="etiqueta-nombre">{usuario.nombre}</strong>
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
                                    <img src={iconoAdmin} alt="Tachis" style={{ width: '18px', height: '18px', objectFit: 'contain' }} />
                                    <span>{Number(usuario.tachis || 0).toLocaleString('de-DE')} Tachis</span>
                                </div>
                            )}
                            
                            <Link to="/carrito" className="cart-badge-btn">
                                <ShoppingCart size={20} weight="bold" />
                                <span className="cart-count">{totalItems}</span>
                            </Link>
                        </div>
                    </div>

                </nav>
            </header>

            {/* Inyectamos el panel del perfil fuera del flujo normal para que flote por encima */}
            <Perfil abierto={perfilAbierto} cerrarPerfil={() => setPerfilAbierto(false)} />
        </>
    );
}

export default Navbar;