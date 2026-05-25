import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stage, Center, OrbitControls, useGLTF } from '@react-three/drei'
import './Hero.css'

useGLTF.preload('/3D/DonutPistacho.glb')

const DonutModel = () => {
    // cargo el modelo tridimensional del donut con la libreria de fiber, asi le doy un toque interactivo a la portada sin perder la esencia artesanal
    const { scene } = useGLTF('/3D/DonutPistacho.glb')
    return <primitive object={scene} />
}

const Hero = () => {
    return (
        <header className="hero-section">
            <div className="hero-content">
                <div className="hero-badge-artesanal">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    <span>Receta Tradicional 100% Ibérica</span>
                </div>
                
                <h1>El sabor del <br/><span className="text-highlight">Pistacho Auténtico</span></h1>
                <p>Descubre nuestra selección de bollería y snacks, elaborados cada mañana en nuestro obrador con pistacho nacional seleccionado a mano.</p>
                
                <div className="hero-action-group">
                    {/* rediseño por completo el boton principal para que tenga la forma y el color verde intenso de un pistacho abierto y apetecible */}
                    <button className="pistachio-button pistachio-filled">
                        <span>Ver el Catálogo</span>
                    </button>
                    
                    {/* el boton secundario ahora representa la cáscara del pistacho, con un diseño hueco y elegante en tono tostado */}
                    <button className="pistachio-button pistachio-outline">
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
                    <Canvas 
                        shadows={false} 
                        dpr={[1, 1.5]} 
                        camera={{ position: [10, 6, 0], fov: 32 }} 
                        gl={{ antialias: true, powerPreference: "high-performance", alpha: true }} 
                    >
                        <Suspense fallback={null}>
                            <Stage 
                                environment="city" 
                                intensity={0.6} 
                                shadows={false}
                                adjustCamera={false} 
                            >
                                <Center>
                                    <DonutModel />
                                </Center>
                            </Stage>
                        </Suspense>

                        <OrbitControls 
                            enablePan={false}
                            enableZoom={false}
                            autoRotate={true} 
                            autoRotateSpeed={1.2} 
                            makeDefault 
                        />
                    </Canvas>
                </div>
            </div>
        </header>
    )
}

export default Hero