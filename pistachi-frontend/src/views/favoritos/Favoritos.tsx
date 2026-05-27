import { useState } from 'react';

import { useFavoritos } from '../../context/favoritos/Favoritos';
import type { ProductoFav } from '../../context/favoritos/Favoritos';
import ProductCard from '../../components/productcard/ProductCard';
import { SmileySad } from '@phosphor-icons/react';
import './Favoritos.css';

const Favoritos = () => {
    const { favoritos, removerFavorito } = useFavoritos();
    
    // Estados para controlar el modal
    const [productoSeleccionado, setProductoSeleccionado] = useState<ProductoFav | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    // Esta función se la pasamos al botón para que no borre directo, sino que avise
    const intentarRemover = (producto: ProductoFav) => {
        setProductoSeleccionado(producto);
        setModalVisible(true);
    };

    const confirmarRemocion = () => {
        if (productoSeleccionado) {
            removerFavorito(productoSeleccionado.id);
        }
        setModalVisible(false);
        setProductoSeleccionado(null);
    };

    return (
        <div className="catalogo-wrapper">
            <header className="catalogo-cabecera">
                <span className="subtitulo-obrador">Tus Selecciones</span>
                <h1>Tus Delicias Favoritas</h1>
            </header>

            {favoritos.length === 0 ? (
                <div className="status-container">Aún no has guardado ninguna delicia. ¡Ve al catálogo a explorar!</div>
            ) : (
                <div className="rejilla-catalogo">
                    {favoritos.map((p: ProductoFav) => (
                        <ProductCard key={p.id} producto={p as unknown as import('../../components/productcard/ProductCard').ProductoData} onIntentoRemover={intentarRemover} />
                    ))}
                </div>
            )}

            {/* MODAL DE CONFIRMACIÓN */}
            {modalVisible && (
                <div className="modal-overlay" onClick={() => setModalVisible(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <SmileySad size={80} weight="light" color="var(--color-dark-green)" className="cara-triste-svg" />
                        <h3>¿Estás seguro?</h3>
                        <p>¿De verdad quieres sacar de favoritos esta delicia?</p>
                        <div className="modal-botones">
                            <button className="btn-cancelar" onClick={() => setModalVisible(false)}>Mejor lo dejo</button>
                            <button className="btn-confirmar" onClick={confirmarRemocion}>Sí, quitar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Favoritos;