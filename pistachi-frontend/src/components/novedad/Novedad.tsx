import React, { useEffect, useState } from 'react'
import './Novedad.css'

interface Producto {
    id: number
    nombre: string
    precio: number
    imagen: string
    descripcion: string
}

const Novedad: React.FC = () => {
    // mantengo el id del producto objetivo para seguir llamando a la novedad desde la base de datos
    const idProductoTarget = 6 

    const [producto, setProducto] = useState<Producto | null>(null)
    const [cargando, setCargando] = useState<boolean>(true)

    useEffect(() => {
        const obtenerProductoNovedad = async () => {
            try {
                setCargando(true)
                const respuesta = await fetch(`http://localhost:9090/productos/${idProductoTarget}`)
                
                if (!respuesta.ok) {
                    throw new Error('No se pudo recuperar la novedad')
                }

                const datos = await respuesta.json()
                setProducto(datos)
            } catch (error) {
                console.error("error al cargar la novedad", error)
            } finally {
                setCargando(false)
            }
        }

        obtenerProductoNovedad()
    }, [idProductoTarget])

    if (cargando || !producto) {
        return (
            <section className="novedad-premium skeleton-loader">
                <p>Horneando la novedad del mes...</p>
            </section>
        )
    }

    return (
        <section className="novedad-premium">
            <div className="novedad-image-column">
                
                <img 
                    src="/img/novedades/crema-de-pistacho-novedad.png"
                    alt={`Foto de ${producto.nombre}`} 
                    className="novedad-img"
                />
            </div>

            <div className="novedad-text-column">
                <div className="novedad-content-inner">
                    <div className="novedad-badge">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                        <span>Creación Exclusiva</span>
                    </div>
                    
                    <h2 className="novedad-title">{producto.nombre}</h2>
                    <p className="novedad-description">{producto.descripcion || 'Un tarro de crema untable elaborada con pistachos seleccionados, ideal para desayunos y repostería.'}</p>
                    
                    <div className="novedad-price-row">
                        <span className="novedad-price">{producto.precio.toFixed(2)} €</span>
                        <button 
                            className="novedad-action-btn"
                            onClick={() => window.location.href = `/producto/${producto.id}`}
                        >
                            Descubrir
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Novedad