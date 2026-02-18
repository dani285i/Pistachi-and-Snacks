import React from 'react';
import './Novedad.css';

const Novedad: React.FC = () => {
    const producto = {
        nombre: "Crema de Pistacho",
        precio: "8,95 €"
    };

    return (
        <section className="novedad-fullscreen">
            <div className="novedad-left">
                <img 
                    src="/img/crema-de-pistacho-novedad.png" 
                    alt={`Bote de ${producto.nombre}`} 
                    className="novedad-hero-image"
                />
            </div>
            
            <div className="novedad-right">
                <h1 className="novedad-alert">¡NOVEDAD!</h1>
                <h2 className="novedad-hero-title">{producto.nombre}</h2>
                <span className="novedad-hero-price">{producto.precio}</span>
                
                <button className="novedad-hero-button">Ver más</button>
            </div>
        </section>
    );
};

export default Novedad;