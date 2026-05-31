import { Link, useLocation } from 'react-router-dom';
import { CaretRight, House } from '@phosphor-icons/react';
import './Breadcrumbs.css';

const routeNames: Record<string, string> = {
    '': 'Inicio',
    'productos': 'Catálogo de Delicias',
    'producto': 'Productos',
    'carrito': 'Tu Bandeja',
    'checkout': 'Pago Seguro',
    'exito': 'Pedido Confirmado',
    'favoritos': 'Tus Favoritos',
    'login': 'Acceder',
    'registro': 'Crear Cuenta',
    'admin': 'Panel de Control'
};

const Breadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    // Ocultar breadcrumbs en la home para que no sea redundante
    if (pathnames.length === 0) {
        return null;
    }

    return (
        <nav className="breadcrumbs-container">
            <ol className="breadcrumbs-list">
                <li className="breadcrumb-item">
                    <Link to="/" className="breadcrumb-link home-link">
                        <House size={18} weight="fill" />
                        <span>Inicio</span>
                    </Link>
                </li>
                
                {pathnames.map((value, index) => {
                    const isLast = index === pathnames.length - 1;
                    let to = `/${pathnames.slice(0, index + 1).join('/')}`;
                    if (value === 'producto') to = '/productos';
                    if (value === 'pedido') to = '/#perfil';
                    
                    // Manejar rutas dinámicas como /producto/1 o /pedido/5
                    let displayName = routeNames[value];
                    if (!displayName) {
                        if (pathnames[index - 1] === 'producto') displayName = 'Detalle de Producto';
                        else if (pathnames[index - 1] === 'pedido') displayName = 'Detalle de Pedido';
                        else if (value === 'pedido') displayName = 'Perfil';
                        else displayName = value.charAt(0).toUpperCase() + value.slice(1); // Fallback
                    }

                    return (
                        <li key={to} className="breadcrumb-item">
                            <CaretRight size={14} className="breadcrumb-separator" weight="bold" />
                            {isLast ? (
                                <span className="breadcrumb-current">{displayName}</span>
                            ) : (
                                <Link to={to} className="breadcrumb-link">
                                    {displayName}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
