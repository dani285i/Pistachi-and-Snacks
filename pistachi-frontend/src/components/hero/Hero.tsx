import './Hero.css';

const Hero = () => (
    
    <header className="hero-section">

        <div className="hero-content">

            <span className="hero-tag">Calidad Premium</span>

            <h1>Lo Mejor en Comidas Sabor <br/><span>Pistacho</span></h1>

            <p>Descubre nuestros productos con toppings de Pistacho seleccionados a mano y hechos artesanalmente.</p>

            <button className="hero-cta">Explorar Selección</button>

        </div>

        <div className="hero-visual">

            <div className="hero-circle"></div>

            <img src='#' alt='Imagen de pistacho' />

        </div>

    </header>

);

export default Hero;