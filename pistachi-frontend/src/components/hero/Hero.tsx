import { Suspense, useState, useEffect, lazy } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck } from '@phosphor-icons/react'
import './Hero.css'

// Carga diferida del componente pesado de 3D para no bloquear el render inicial
const LazyHeroCanvas = lazy(() => import('./HeroCanvas'))

const Hero = () => {
    const navigate = useNavigate() // 2. INICIALIZAMOS EL NAVEGADOR
    const [show3D, setShow3D] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setShow3D(true), 1500)
        return () => clearTimeout(timer)
    }, [])

    return (
        <header className="hero-section">
            <div className="hero-content">
                <div className="hero-badge-artesanal">
                    <ShieldCheck size={16} weight="bold" />
                    <span>Receta Tradicional 100% Ibérica</span>
                </div>
                
                <h1>El sabor del <br/><span className="text-highlight">Pistacho Auténtico</span></h1>
                <p>Descubre nuestra selection de bollería y snacks, elaborados cada mañana en nuestro obrador con pistacho nacional seleccionado a mano.</p>
                
                <div className="hero-action-group">
                    {/* 3. AÑADIMOS EL ONCLICK PARA REDIRIGIR AL CATÁLOGO */}
                    <button 
                        className="pistachio-button pistachio-filled" 
                        onClick={() => navigate('/productos')}
                        aria-label="Ver el catálogo"
                    >
                        <span>Ver el Catálogo</span>
                    </button>
                    
                    <button 
                        className="pistachio-button pistachio-outline"
                        aria-label="Nuestra Historia"
                    >
                        <span>Nuestra Historia</span>
                    </button>
                </div>

                <div className="hero-features">
                    <div className="feature-item">
                        <span className="feature-dot"></span>
                        <p>Horneado a diario</p>
                    </div>
                    <div className="feature-item">
                        <span className="feature-dot"></span>
                        <p>Materia prima local</p>
                    </div>
                    <div className="feature-item">
                        <span className="feature-dot"></span>
                        <p>Sin conservantes</p>
                    </div>
                </div>
            </div>

            <div className="hero-visual">
                <div className="organic-blob"></div>
                
                <div className="canvas-container" style={{ width: '100%', height: '550px', cursor: 'grab', position: 'relative', zIndex: 2 }}>
                    {show3D && (
                        <Suspense fallback={<div className="canvas-loading"></div>}>
                            <LazyHeroCanvas />
                        </Suspense>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Hero