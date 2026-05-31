import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-section">
                    <h2>Pistachi & Snacks</h2>
                    <p>Tu rincón favorito para disfrutar de las mejores delicias artesanales con el toque inconfundible del pistacho.</p>
                </div>
                
                <div className="footer-section">
                    <h2>Contacto</h2>
                    <p><strong>Dirección:</strong> Calle Sebastián Martínez Risco, 12, C.P. 15009, A Coruña.</p>
                    <p><strong>Teléfono:</strong> +34 981 123 456</p>
                    <p><strong>Redes Sociales:</strong> @Pistachi&Snacks</p>
                </div>
            </div>
            
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Pistachi & Snacks. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;