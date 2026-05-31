import { useState, useEffect } from 'react';
import { useCart } from '../../context/carrito/Carrito';
import { useToast } from '../../context/toast/ToastContext';
import { useAuth } from '../../context/auth/Auth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { scroller } from 'react-scroll';
import { ShoppingCart, List, X } from '@phosphor-icons/react';
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
    
    // ESTADO PARA EL MENÚ MÓVIL
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (location.hash === '#perfil') {
            setPerfilAbierto(true);
            navigate(location.pathname, { replace: true });
        }
    }, [location.hash, navigate, location.pathname]);

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

    // CERRAR MENU AL CAMBIAR DE RUTA
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // BLOQUEAR SCROLL CUANDO EL MENÚ MÓVIL ESTÁ ABIERTO
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

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
        setIsMobileMenuOpen(false);
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
                    
                    <div className={`navbar-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                        <div className="menu-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
                            <X size={28} weight="bold" />
                        </div>
                        <Link to="/" className="menu-link" onClick={handleInicioClick}>Inicio</Link>
                        <span onClick={handleNovedadesClick} className="menu-link" style={{ cursor: 'pointer' }}>Novedades</span>
                        <Link to="/productos" className="menu-link">Catálogo</Link>
                        <Link to="/favoritos" className="menu-link">Favoritos</Link>
                        
                        {/* ACCIONES DE USUARIO EN MÓVIL (dentro del menú) */}
                        <div className="mobile-only-actions">
                            {usuario ? (
                                <div className="user-section-mobile">
                                    <button 
                                        className="etiqueta-bandeja" 
                                        onClick={() => { setPerfilAbierto(true); setIsMobileMenuOpen(false); }}
                                    >
                                        <span className="etiqueta-texto">Mi Bandeja</span>
                                        <strong className="etiqueta-nombre">{usuario.nombre}</strong>
                                    </button>
                                    {usuario?.username === 'admin' && (
                                        <Link to="/admin" className="admin-badge">
                                            <img src={iconoAdmin} alt="Panel Admin" className="admin-badge-icon" />
                                            Admin
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <div className="auth-section-mobile">
                                    <Link to="/login" className="action-btn login-btn">Entrar</Link>
                                    <Link to="/registro" className="action-btn register-btn">Registro</Link>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="navbar-actions">
                        <div className="desktop-only-actions">
                            {usuario ? (
                                <div className="user-section">
                                    {usuario?.username === 'admin' && (
                                        <Link to="/admin" className="admin-badge">
                                            <img src={iconoAdmin} alt="Panel Admin" className="admin-badge-icon" />
                                            Admin
                                        </Link>
                                    )}
                                    
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
                        </div>
                        
                        <div className="tools-section">
                            {usuario && (
                                <div className="points-badge desktop-only-points">
                                    <img src={iconoAdmin} alt="Tachis" style={{ width: '18px', height: '18px', objectFit: 'contain' }} />
                                    <span>{Number(usuario.tachis || 0).toLocaleString('de-DE')} Tachis</span>
                                </div>
                            )}
                            
                            <Link to="/carrito" className="cart-badge-btn" aria-label="Carrito de compras">
                                <ShoppingCart size={20} weight="bold" />
                                {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
                            </Link>

                            <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(true)} aria-label="Abrir menú">
                                <List size={28} weight="bold" />
                            </button>
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