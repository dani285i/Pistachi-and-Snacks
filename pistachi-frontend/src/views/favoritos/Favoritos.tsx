import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavoritos } from '../../context/favoritos/Favoritos';
import BotonFavorito from '../../components/favorito/BotonFavorito';
import './Favoritos.css';

const Favoritos = () => {
    const { favoritos, removerFavorito } = useFavoritos();
    const navigate = useNavigate();
    
    // Estados para controlar el modal
    const [productoSeleccionado, setProductoSeleccionado] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);

    // Esta función se la pasamos al botón para que no borre directo, sino que avise
    const intentarRemover = (producto: any) => {
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
                    {favoritos.map((p: any) => (
                        <article key={p.id} className="tarjeta-obrador" onClick={() => navigate(`/producto/${p.id}`)}>
                            <div className="tarjeta-img-box">
                                <img src={p.imagen} alt={p.nombre} className="tarjeta-img" />
                            </div>
                            <div className="tarjeta-body">
                                <div className="tarjeta-header-info">
                                    <span className="categoria-badge">{p.categoria}</span>
                                    <h3>{p.nombre}</h3>
                                </div>
                                <p className="tarjeta-desc">{p.descripcion}</p>
                                <div className="tarjeta-footer">
                                    <span className="tarjeta-precio">{p.precio.toFixed(2)} €</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        {/* Aquí pasamos el onIntentoRemover para activar el modal */}
                                        <BotonFavorito producto={p} onIntentoRemover={intentarRemover} />
                                        <button className="boton-detalles-premium">Ver detalles</button>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {/* MODAL DE CONFIRMACIÓN */}
            {modalVisible && (
                <div className="modal-overlay" onClick={() => setModalVisible(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#2A3B24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="cara-triste-svg">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
                            <line x1="9" y1="9" x2="9.01" y2="9"></line>
                            <line x1="15" y1="9" x2="15.01" y2="9"></line>
                        </svg>
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