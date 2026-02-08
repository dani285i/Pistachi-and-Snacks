import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-success mb-4 shadow">
        <div className="container">
            <Link className="navbar-brand fw-bold" to="/">
                Pistachi & Snacks
            </Link>
            
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
                <li className="nav-item">
                <Link className="nav-link" to="/">Inicio</Link>
                </li>
                <li className="nav-item">
                <Link className="nav-link" to="/productos">Menú</Link>
                </li>
            </ul>
            
            <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-light btn-sm">
                    Soy Cliente
                </Link>
                <Link to="/carrito" className="btn btn-warning btn-sm">
                    Carrito
                </Link>
            </div>
            </div>
        </div>
        </nav>
    );
};

export default Navbar;