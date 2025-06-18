'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Planet from './Planet';

// Realistic Aurora Borealis component
function AuroraBorealis() {
  const auroraRef = useRef<THREE.Group>(null);
  const curtainRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (auroraRef.current) {
      auroraRef.current.rotation.y = Math.sin(time * 0.1) * 0.1;
    }

    // Animate individual aurora curtains
    curtainRefs.current.forEach((curtain, index) => {
      if (curtain) {
        const speed = 0.5 + index * 0.2;
        const amplitude = 0.3 + index * 0.1;
        
        // Wave-like movement
        curtain.position.y = Math.sin(time * speed) * amplitude;
        curtain.rotation.z = Math.sin(time * speed * 0.5) * 0.1;
        
        // Color shift
        const material = curtain.material as THREE.MeshBasicMaterial;
        if (material) {
          const hue = (0.4 + Math.sin(time * 0.3 + index) * 0.1) % 1;
          material.color.setHSL(hue, 0.8, 0.6);
        }
      }
    });
  });

  return (
    <group ref={auroraRef} position={[0, 0, -30]}>
      {/* Multiple aurora curtains for depth and realism */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => (curtainRefs.current[i] = el)}
          position={[
            (i - 4) * 15,
            Math.sin(i * 0.5) * 10,
            -i * 2
          ]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <planeGeometry args={[8, 40, 8, 16]} />
          <meshBasicMaterial
            color={`hsl(${140 + i * 10}, 70%, 60%)`}
            transparent
            opacity={0.3 - i * 0.02}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {/* Additional flowing aurora strips */}
      {Array.from({ length: 6 }, (_, i) => (
        <mesh
          key={`strip-${i}`}
          position={[
            (i - 3) * 20 + Math.sin(i) * 5,
            Math.cos(i * 0.8) * 15,
            -10 - i * 3
          ]}
          rotation={[0, 0, Math.PI / 2 + Math.sin(i) * 0.2]}
        >
          <planeGeometry args={[4, 30, 4, 12]} />
          <meshBasicMaterial
            color={`hsl(${160 + i * 15}, 80%, 70%)`}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {/* Vertical aurora pillars */}
      {Array.from({ length: 5 }, (_, i) => (
        <mesh
          key={`pillar-${i}`}
          position={[
            (i - 2) * 25,
            Math.sin(i * 1.2) * 8,
            -15
          ]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <planeGeometry args={[6, 35, 6, 14]} />
          <meshBasicMaterial
            color={`hsl(${150 + i * 8}, 75%, 65%)`}
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {/* Ambient aurora glow */}
      <mesh position={[0, 0, -20]}>
        <sphereGeometry args={[50, 16, 16]} />
        <meshBasicMaterial
          color="#00ff88"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// Enhanced space scene with better 3D lighting and depth
function SpaceSceneContent() {
  return (
    <>
      {/* Reduced ambient lighting to make planet glow more dramatic */}
      <ambientLight intensity={0.02} color="#001122" />
      
      {/* Main directional light for dramatic shadows */}
      <directionalLight 
        position={[20, 20, 15]} 
        intensity={0.6} 
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      
      {/* Fill light from opposite side */}
      <directionalLight 
        position={[-15, -15, -10]} 
        intensity={0.2} 
        color="#224466"
      />
      
      {/* Rim lighting for dramatic edge highlights */}
      <directionalLight 
        position={[0, 0, 20]} 
        intensity={0.3} 
        color="#446688"
      />

      {/* Realistic Aurora Borealis */}
      <AuroraBorealis />

      {/* Enhanced starfield with more stars */}
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={0.5}
      />

      {/* Additional bright stars */}
      <Stars 
        radius={80} 
        depth={30} 
        count={200} 
        factor={8} 
        saturation={0.5} 
        fade 
        speed={1}
      />

      {/* Floating cosmic particles */}
      {Array.from({ length: 100 }, (_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 200
          ]}
        >
          <sphereGeometry args={[Math.random() * 0.5 + 0.1, 8, 8]} />
          <meshBasicMaterial
            color={`hsl(${200 + Math.random() * 60}, 70%, 60%)`}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}

      {/* Realistic planets with enhanced lighting */}
      <Planet 
        position={[-15, 5, 0]} 
        size={3} 
        color="#ff6b35" 
        type="gas"
      />
      
      <Planet 
        position={[15, -8, 0]} 
        size={2.5} 
        color="#4ecdc4" 
        type="ocean"
      />
      
      <Planet 
        position={[0, 12, 0]} 
        size={2} 
        color="#45b7d1" 
        type="ice"
      />
      
      <Planet 
        position={[-8, -12, 0]} 
        size={1.8} 
        color="#96ceb4" 
        type="terrestrial"
      />
      
      <Planet 
        position={[8, 8, 0]} 
        size={1.5} 
        color="#feca57" 
        type="desert"
      />
    </>
  );
}

export default function SpaceScene() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 50], fov: 75 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          shadowMap: true,
          shadowMapType: THREE.PCFSoftShadowMap
        }}
        shadows
        style={{ 
          background: 'radial-gradient(ellipse at center, #000011 0%, #000055 25%, #000033 50%, #000022 75%, #000000 100%)'
        }}
      >
        <SpaceSceneContent />
        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
          maxDistance={200}
          minDistance={20}
        />
      </Canvas>
    </div>
  );
} 