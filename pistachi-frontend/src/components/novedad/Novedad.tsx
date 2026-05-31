import React, { useEffect, useState } from 'react'
import { Star, ArrowRight } from '@phosphor-icons/react'
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
                    src="/img/novedades/crema-de-pistacho-novedad.webp"
                    alt={`Foto de ${producto.nombre}`} 
                    className="novedad-img"
                />
            </div>

            <div className="novedad-text-column">
                <div className="novedad-content-inner">
                    <div className="novedad-badge">
                        <Star size={18} weight="fill" />
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
                            <ArrowRight size={20} weight="bold" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Novedad