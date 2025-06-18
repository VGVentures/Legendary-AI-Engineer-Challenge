'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Planet from './Planet';

// Enhanced mystical aurora strips with better 3D depth
function AuroraStrips() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += 0.0012;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.25) * 3;
    }
  });

  const strips = [];
  for (let i = 0; i < 8; i++) {
    const x = (i - 4) * 18;
    const height = 60 + Math.random() * 40;
    const width = 12 + Math.random() * 8;
    
    strips.push(
      <mesh
        key={i}
        position={[x, 0, -50]}
      >
        <planeGeometry args={[width, height, 1, 8]} />
        <meshBasicMaterial
          color={i % 4 === 0 ? '#00ff88' : i % 4 === 1 ? '#0088ff' : i % 4 === 2 ? '#8800ff' : '#ff0088'}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
    );
  }

  return (
    <group ref={groupRef}>
      {strips}
    </group>
  );
}

// Enhanced realistic stars with twinkling effects
function RealisticStars() {
  const starsRef = useRef<THREE.Points>(null);
  const starCount = 3000;
  
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  const sizes = new Float32Array(starCount);
  const twinkleSpeeds = new Float32Array(starCount);
  
  for (let i = 0; i < starCount; i++) {
    // Position stars in a sphere
    const radius = 100 + Math.random() * 100;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
    
    // Vary star colors - mostly white/blue with some yellow/orange
    const colorChoice = Math.random();
    if (colorChoice < 0.7) {
      // White/blue stars (most common)
      const blueTint = 0.8 + Math.random() * 0.2;
      colors[i * 3] = 0.9 + Math.random() * 0.1;     // R
      colors[i * 3 + 1] = 0.9 + Math.random() * 0.1; // G
      colors[i * 3 + 2] = blueTint;                   // B
    } else if (colorChoice < 0.85) {
      // Yellow stars
      colors[i * 3] = 1.0;     // R
      colors[i * 3 + 1] = 0.9 + Math.random() * 0.1; // G
      colors[i * 3 + 2] = 0.6 + Math.random() * 0.2; // B
    } else if (colorChoice < 0.95) {
      // Orange stars
      colors[i * 3] = 1.0;     // R
      colors[i * 3 + 1] = 0.7 + Math.random() * 0.2; // G
      colors[i * 3 + 2] = 0.4 + Math.random() * 0.2; // B
    } else {
      // Red stars (rare)
      colors[i * 3] = 1.0;     // R
      colors[i * 3 + 1] = 0.4 + Math.random() * 0.3; // G
      colors[i * 3 + 2] = 0.2 + Math.random() * 0.2; // B
    }
    
    // Vary star sizes
    sizes[i] = 0.5 + Math.random() * 2.5;
    
    // Vary twinkle speeds
    twinkleSpeeds[i] = 0.5 + Math.random() * 2;
  }

  useFrame((state) => {
    if (starsRef.current) {
      const material = starsRef.current.material as THREE.PointsMaterial;
      const positions = starsRef.current.geometry.attributes.position.array as Float32Array;
      
      // Update star brightness for twinkling effect
      for (let i = 0; i < starCount; i++) {
        const time = state.clock.elapsedTime * twinkleSpeeds[i];
        const twinkle = 0.3 + 0.7 * Math.sin(time) * Math.sin(time * 1.5);
        
        // Apply twinkling to opacity
        if (material.opacity !== undefined) {
          material.opacity = twinkle;
        }
      }
      
      // Gentle rotation
      starsRef.current.rotation.y += 0.0001;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={starCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={starCount}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={starCount}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1}
        vertexColors
        transparent
        opacity={1}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </points>
  );
}

// Bright nearby stars with lens flare effect
function BrightStars() {
  const brightStarsRef = useRef<THREE.Group>(null);
  const brightStarCount = 50;
  
  const brightStars = [];
  for (let i = 0; i < brightStarCount; i++) {
    const radius = 80 + Math.random() * 60;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    
    const size = 2 + Math.random() * 4;
    const twinkleSpeed = 1 + Math.random() * 3;
    
    brightStars.push(
      <mesh key={i} position={[x, y, z]}>
        <sphereGeometry args={[size, 8, 8]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.8}
        />
      </mesh>
    );
  }

  useFrame((state) => {
    if (brightStarsRef.current) {
      brightStarsRef.current.children.forEach((star, index) => {
        const material = star.material as THREE.MeshBasicMaterial;
        const time = state.clock.elapsedTime * (1 + index * 0.1);
        const twinkle = 0.4 + 0.6 * Math.sin(time) * Math.sin(time * 1.3);
        material.opacity = twinkle;
      });
    }
  });

  return (
    <group ref={brightStarsRef}>
      {brightStars}
    </group>
  );
}

// Enhanced floating particles with better 3D distribution
function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 200;
  
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 300;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 300;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 300;
    
    const colorChoice = Math.random();
    if (colorChoice < 0.25) {
      colors[i * 3] = 0.0;     // Emerald green
      colors[i * 3 + 1] = 1.0;
      colors[i * 3 + 2] = 0.5;
    } else if (colorChoice < 0.5) {
      colors[i * 3] = 0.2;     // Ocean blue
      colors[i * 3 + 1] = 0.8;
      colors[i * 3 + 2] = 1.0;
    } else if (colorChoice < 0.75) {
      colors[i * 3] = 0.8;     // Mystical purple
      colors[i * 3 + 1] = 0.2;
      colors[i * 3 + 2] = 1.0;
    } else {
      colors[i * 3] = 1.0;     // Cosmic pink
      colors[i * 3 + 1] = 0.0;
      colors[i * 3 + 2] = 0.8;
    }
  }

  useFrame(() => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0006;
      particlesRef.current.rotation.x += 0.0003;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={2.5}
        vertexColors
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
      />
    </points>
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

      {/* Mystical aurora effect in background */}
      <mesh position={[0, 0, -50]} rotation={[0, 0, 0]}>
        <planeGeometry args={[200, 100]} />
        <meshBasicMaterial
          color="#00ff88"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Additional aurora layers for depth */}
      <mesh position={[0, 0, -45]} rotation={[0, 0, Math.PI / 8]}>
        <planeGeometry args={[180, 80]} />
        <meshBasicMaterial
          color="#0088ff"
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[0, 0, -40]} rotation={[0, 0, -Math.PI / 6]}>
        <planeGeometry args={[160, 60]} />
        <meshBasicMaterial
          color="#8800ff"
          transparent
          opacity={0.06}
          side={THREE.DoubleSide}
        />
      </mesh>

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