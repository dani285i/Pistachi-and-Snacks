import React from 'react';
import { useFavoritos } from '../../context/favoritos/Favoritos';
import type { ProductoFav } from '../../context/favoritos/Favoritos';
import { Heart } from '@phosphor-icons/react';
import { useToast } from '../../context/toast/ToastContext';
import './BotonFavorito.css';

interface Props {
    producto: ProductoFav;
    onIntentoRemover?: (producto: ProductoFav) => void;
}

const BotonFavorito: React.FC<Props> = ({ producto, onIntentoRemover }) => {
    const { favoritos, toggleFavorito } = useFavoritos();
    const { addToast } = useToast();
    const esFavorito = favoritos.some((fav: ProductoFav) => fav.id === producto.id);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Evita que al dar like entres sin querer al detalle del producto
        
        // Si estamos en la página de favoritos y ya tiene like, avisamos al padre para lanzar el modal
        if (esFavorito && onIntentoRemover) {
            onIntentoRemover(producto);
        } else {
            toggleFavorito(producto);
            if (!esFavorito) {
                addToast("Producto añadido a favoritos", 'success');
            } else {
                addToast("Producto eliminado de favoritos", 'info');
            }
        }
    };

    return (
        <button 
            className={`btn-corazon ${esFavorito ? 'like-activo' : ''}`}
            onClick={handleClick}
            aria-label="Añadir a favoritos"
        >
            <Heart 
                size={22} 
                weight={esFavorito ? 'fill' : 'bold'} 
                className="corazon-svg" 
            />
        </button>
    );
};

export default BotonFavorito;