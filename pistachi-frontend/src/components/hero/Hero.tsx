import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stage, Center, OrbitControls, useGLTF } from '@react-three/drei'
import './Hero.css'

useGLTF.preload('/3D/DonutPistacho.glb')

const DonutModel = () => {
    const { scene } = useGLTF('/3D/DonutPistacho.glb')
    return <primitive object={scene} />
}

const Hero = () => {
    return (
        <header className="hero-section">
            <div className="hero-content">
                <span className="hero-tag">Calidad Premium</span>
                <h1>Lo Mejor en Comidas Sabor <br/><span>Pistacho</span></h1>
                <p>Descubre nuestros productos con toppings de Pistacho seleccionados a mano y hechos artesanalmente.</p>
                <button className="hero-cta">Explorar Selección</button>
            </div>

            <div className="hero-visual">
                <div className="hero-circle"></div>
                
                <div className="canvas-container" style={{ width: '100%', height: '500px', cursor: 'grab' }}>
                    <Canvas 
                        shadows 
                        dpr={[1, 2]} 
                        camera={{ position: [10, 6, 0], fov: 30 }} 
                        gl={{ antialias: true, preserveDrawingBuffer: true }} >
                        <Suspense fallback={null}>
                            <Stage 
                                environment="city" 
                                intensity={0.7} 
                                shadows={false}
                                adjustCamera={false} >
                                <Center>
                                    <DonutModel />
                                </Center>
                            </Stage>
                        </Suspense>

                        <OrbitControls 
                            enablePan={false}
                            enableZoom={false}
                            autoRotate={true} 
                            autoRotateSpeed={2} 
                            makeDefault 
                        />
                    </Canvas>
                </div>
            </div>
        </header>
    )
}

export default Hero