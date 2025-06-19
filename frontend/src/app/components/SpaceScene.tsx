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

      {/* Planets with VARIED SIZES and UNIQUE COLOR SCHEMES */}
      {/* Gas Giant - Large and majestic */}
      <Planet 
        position={[-25, 5, 0]} 
        size={4.5} 
        color="#ff6b35" 
        type="gas" 
        name="Nebula Prime" 
      />
      
      {/* Ocean World - Medium-large with deep blues */}
      <Planet 
        position={[20, -8, 0]} 
        size={3.2} 
        color="#006994" 
        type="ocean" 
        name="Aquaria" 
      />
      
      {/* Ice Planet - Small and crystalline */}
      <Planet 
        position={[0, 18, 0]} 
        size={1.8} 
        color="#87CEEB" 
        type="ice" 
        name="Cryos" 
      />
      
      {/* Terrestrial Planet - Medium with vibrant greens */}
      <Planet 
        position={[0, -18, 0]} 
        size={2.6} 
        color="#228B22" 
        type="terrestrial" 
        name="Terra Nova" 
      />
      
      {/* Desert Planet - Medium-small with warm tones */}
      <Planet 
        position={[30, 12, 0]} 
        size={2.1} 
        color="#D2B48C" 
        type="desert" 
        name="Aridus" 
      />
      
      {/* Additional planets for more variety */}
      {/* Small Gas Giant */}
      <Planet 
        position={[-35, -15, 0]} 
        size={3.8} 
        color="#FF8C00" 
        type="gas" 
        name="Jupiter Minor" 
      />
      
      {/* Large Ocean World */}
      <Planet 
        position={[35, -20, 0]} 
        size={4.2} 
        color="#1E90FF" 
        type="ocean" 
        name="Poseidon" 
      />
      
      {/* Tiny Ice Moon */}
      <Planet 
        position={[-8, 25, 0]} 
        size={1.2} 
        color="#E0F6FF" 
        type="ice" 
        name="Frostbite" 
      />
      
      {/* Large Terrestrial */}
      <Planet 
        position={[-12, -25, 0]} 
        size={3.5} 
        color="#32CD32" 
        type="terrestrial" 
        name="Gaia" 
      />
      
      {/* Small Desert World */}
      <Planet 
        position={[40, 5, 0]} 
        size={1.6} 
        color="#F4A460" 
        type="desert" 
        name="Sandstorm" 
      />

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
  return (
    <Canvas
      camera={{ position: [0, 0, 20], fov: 75 }}
      shadows
      gl={{ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance"
      }}
    >
      <SpaceSceneContent />
    </Canvas>
  );
} 