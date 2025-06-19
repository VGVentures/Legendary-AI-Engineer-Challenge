'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Planet from './Planet';

// Beautiful cosmic nebulae component
function CosmicNebulae() {
  const nebulaeRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (nebulaeRef.current) {
      nebulaeRef.current.rotation.y = Math.sin(time * 0.005) * 0.02;
      nebulaeRef.current.rotation.z = Math.cos(time * 0.003) * 0.01;
    }
  });

  return (
    <group ref={nebulaeRef} position={[0, 0, -80]}>
      {/* Primary nebula - large and colorful */}
      <mesh>
        <sphereGeometry args={[60, 32, 32]} />
        <meshBasicMaterial
          color="#ff69b4"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      
      {/* Secondary nebula - different color */}
      <mesh position={[20, -10, -20]}>
        <sphereGeometry args={[40, 32, 32]} />
        <meshBasicMaterial
          color="#4169e1"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      
      {/* Tertiary nebula - purple */}
      <mesh position={[-30, 15, -40]}>
        <sphereGeometry args={[35, 32, 32]} />
        <meshBasicMaterial
          color="#9370db"
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// Animated cosmic clouds
function CosmicClouds() {
  const cloudsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (cloudsRef.current) {
      cloudsRef.current.children.forEach((cloud, index) => {
        const speed = 0.001 + (index * 0.0005);
        cloud.position.x += Math.sin(time * speed) * 0.02;
        cloud.position.y += Math.cos(time * speed * 0.7) * 0.015;
        cloud.rotation.z += 0.001;
      });
    }
  });

  const cloudColors = ['#ff69b4', '#4169e1', '#9370db', '#ffa500', '#32cd32'];
  
  return (
    <group ref={cloudsRef}>
      {Array.from({ length: 20 }, (_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 200 - 50
          ]}
        >
          <sphereGeometry args={[Math.random() * 8 + 2, 16, 16]} />
          <meshBasicMaterial
            color={cloudColors[i % cloudColors.length]}
            transparent
            opacity={0.08}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// Shooting stars
function ShootingStars() {
  const starsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (starsRef.current) {
      starsRef.current.children.forEach((star, index) => {
        const speed = 0.5 + (index * 0.1);
        star.position.x += speed;
        star.position.y -= speed * 0.3;
        
        if (star.position.x > 100) {
          star.position.x = -100;
          star.position.y = Math.random() * 100 - 50;
        }
      });
    }
  });

  return (
    <group ref={starsRef}>
      {Array.from({ length: 15 }, (_, i) => (
        <mesh
          key={i}
          position={[
            Math.random() * 200 - 100,
            Math.random() * 100 - 50,
            -30
          ]}
        >
          <sphereGeometry args={[0.5, 8, 8]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

// Enhanced space scene with unified blending
function SpaceSceneContent() {
  return (
    <>
      {/* Beautiful gradient ambient lighting */}
      <ambientLight intensity={0.04} color="#001122" />
      
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
        position={[-20, -20, -15]} 
        intensity={0.2} 
        color="#4a90e2"
      />
      
      {/* Colored rim lighting */}
      <directionalLight 
        position={[0, 0, 20]} 
        intensity={0.3} 
        color="#ff6b35"
      />

      {/* Beautiful starfield */}
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={1}
      />

      {/* Cosmic nebulae */}
      <CosmicNebulae />
      
      {/* Animated cosmic clouds */}
      <CosmicClouds />
      
      {/* Shooting stars */}
      <ShootingStars />

      {/* Planets */}
      <Planet position={[-15, 0, 0]} size={3} color="#ff6b35" type="gas" name="Nebula Prime" />
      <Planet position={[15, 0, 0]} size={2.5} color="#4ecdc4" type="ocean" name="Aquaria" />
      <Planet position={[0, 12, 0]} size={2} color="#45b7d1" type="ice" name="Cryos" />
      <Planet position={[0, -12, 0]} size={2.8} color="#96ceb4" type="terrestrial" name="Terra Nova" />
      <Planet position={[25, 8, 0]} size={1.8} color="#feca57" type="desert" name="Aridus" />

      {/* Camera controls */}
      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        autoRotate={true}
        autoRotateSpeed={0.5}
        maxDistance={50}
        minDistance={5}
      />
    </>
  );
}

export default function SpaceScene() {
  // Detect if running on Windows (but not Safari)
  const isWindows = typeof window !== 'undefined' && 
    window.navigator.userAgent.includes('Windows') && 
    !window.navigator.userAgent.includes('Safari');

  return (
    <Canvas
      camera={{ position: [0, 0, 20], fov: 75 }}
      shadows
      gl={{ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance",
        // Windows-specific WebGL context settings
        ...(isWindows && {
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false,
          depth: true,
          stencil: false,
          premultipliedAlpha: false,
        })
      }}
      // Windows-specific canvas settings
      {...(isWindows && {
        onCreated: ({ gl }) => {
          // Optimize WebGL context for Windows
          gl.setClearColor(0x000000, 0);
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.2;
        }
      })}
    >
      <SpaceSceneContent />
    </Canvas>
  );
} 