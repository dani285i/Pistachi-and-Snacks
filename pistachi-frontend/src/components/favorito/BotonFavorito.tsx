import React from 'react';
import { useFavoritos } from '../../context/favoritos/Favoritos';
import './BotonFavorito.css';

interface Props {
    producto: any;
    onIntentoRemover?: (producto: any) => void;
}

const BotonFavorito: React.FC<Props> = ({ producto, onIntentoRemover }) => {
    const { favoritos, toggleFavorito } = useFavoritos();
    const esFavorito = favoritos.some((fav: any) => fav.id === producto.id);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Evita que al dar like entres sin querer al detalle del producto
        
        // Si estamos en la página de favoritos y ya tiene like, avisamos al padre para lanzar el modal
        if (esFavorito && onIntentoRemover) {
            onIntentoRemover(producto);
        } else {
            toggleFavorito(producto);
        }
    };

    return (
        <button 
            className={`btn-corazon ${esFavorito ? 'like-activo' : ''}`}
            onClick={handleClick}
            aria-label="Añadir a favoritos"
        >
            <svg viewBox="0 0 24 24" className="corazon-svg">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
        </button>
    );
};

export default BotonFavorito;