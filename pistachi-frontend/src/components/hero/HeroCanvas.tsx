import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stage, Center, OrbitControls, useGLTF } from '@react-three/drei'

const DonutModel = () => {
    // Drei's useGLTF will automatically use the default Google CDN Draco decoder
    const { scene } = useGLTF('/3D/DonutPistacho.glb')
    return <primitive object={scene} />
}

const HeroCanvas = () => {
    return (
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
    )
}

export default HeroCanvas
