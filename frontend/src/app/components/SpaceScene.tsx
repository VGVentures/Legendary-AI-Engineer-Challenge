'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Planet from './Planet';

// Beautiful cosmic nebulae component with enhanced blending
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
      {/* Primary nebula - large and colorful with enhanced blending */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[150, 32, 32]} />
        <meshBasicMaterial
          color="#ff3366"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Secondary nebula - different color with seamless blending */}
      <mesh position={[30, -20, -10]}>
        <sphereGeometry args={[120, 32, 32]} />
        <meshBasicMaterial
          color="#3366ff"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Tertiary nebula - purple tones with organic blending */}
      <mesh position={[-40, 25, -15]}>
        <sphereGeometry args={[100, 32, 32]} />
        <meshBasicMaterial
          color="#9933ff"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Cosmic dust clouds with enhanced integration */}
      <mesh position={[20, 40, -20]}>
        <sphereGeometry args={[80, 24, 24]} />
        <meshBasicMaterial
          color="#ffaa33"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Deep space glow with organic blending */}
      <mesh position={[0, 0, -50]}>
        <sphereGeometry args={[200, 32, 32]} />
        <meshBasicMaterial
          color="#001122"
          transparent
          opacity={0.25}
          side={THREE.BackSide}
          blending={THREE.NormalBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Additional blending layers for seamless integration */}
      <mesh position={[15, -30, -25]}>
        <sphereGeometry args={[90, 24, 24]} />
        <meshBasicMaterial
          color="#33ffaa"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[-25, -15, -30]}>
        <sphereGeometry args={[70, 20, 20]} />
        <meshBasicMaterial
          color="#ff8833"
          transparent
          opacity={0.07}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// Animated cosmic clouds with enhanced blending
function CosmicClouds() {
  const cloudsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (cloudsRef.current) {
      cloudsRef.current.children.forEach((child, index) => {
        child.position.x += Math.sin(time * 0.01 + index) * 0.01;
        child.position.y += Math.cos(time * 0.008 + index) * 0.005;
        child.rotation.z += 0.001;
      });
    }
  });

  return (
    <group ref={cloudsRef}>
      {Array.from({ length: 25 }, (_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 400,
            (Math.random() - 0.5) * 400,
            (Math.random() - 0.5) * 200 - 100
          ]}
        >
          <sphereGeometry args={[Math.random() * 30 + 10, 16, 16]} />
          <meshBasicMaterial
            color={['#ff3366', '#3366ff', '#9933ff', '#ffaa33', '#33ffaa', '#ff8833', '#88ff33'][Math.floor(Math.random() * 7)]}
            transparent
            opacity={0.03 + Math.random() * 0.08}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// Realistic Aurora Borealis component with enhanced blending
function AuroraBorealis() {
  const auroraRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (auroraRef.current) {
      auroraRef.current.rotation.y = Math.sin(time * 0.01) * 0.01;
    }
  });

  return (
    <group ref={auroraRef} position={[0, 0, -40]}>
      {/* Main aurora curtain with enhanced blending */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0, 0, 120, 8, 60, true]} />
        <meshBasicMaterial
          color="#00ff88"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Second aurora curtain with seamless integration */}
      <mesh position={[10, 0, -5]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0, 0, 100, 8, 50, true]} />
        <meshBasicMaterial
          color="#00ffaa"
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Third aurora curtain with organic blending */}
      <mesh position={[-15, 0, -10]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0, 0, 110, 8, 55, true]} />
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Bright aurora highlights with enhanced integration */}
      <mesh position={[5, 0, -2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0, 0, 90, 8, 45, true]} />
        <meshBasicMaterial
          color="#00ff88"
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Ambient glow background with organic blending */}
      <mesh position={[0, 0, -25]}>
        <sphereGeometry args={[100, 20, 20]} />
        <meshBasicMaterial
          color="#00ff88"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Additional blending layers for seamless integration */}
      <mesh position={[8, -5, -8]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0, 0, 85, 8, 42, true]} />
        <meshBasicMaterial
          color="#00ffcc"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[-12, 8, -12]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0, 0, 95, 8, 47, true]} />
        <meshBasicMaterial
          color="#00ddff"
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// Animated shooting stars with enhanced blending
function ShootingStars() {
  const starsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (starsRef.current) {
      starsRef.current.children.forEach((child, index) => {
        child.position.x += 0.5;
        child.position.y -= 0.3;
        child.position.z += 0.2;
        
        // Reset position when star goes off screen
        if (child.position.x > 200) {
          child.position.set(
            -200,
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 200
          );
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
            (Math.random() - 0.5) * 400,
            (Math.random() - 0.5) * 400,
            (Math.random() - 0.5) * 400
          ]}
        >
          <sphereGeometry args={[Math.random() * 0.8 + 0.2, 8, 8]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// Enhanced space scene with unified blending
function SpaceSceneContent({ onPlanetClick }: { onPlanetClick: (planetName: string, planetType: string) => void }) {
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

      {/* Beautiful cosmic background elements with unified blending */}
      <CosmicNebulae />
      <CosmicClouds />
      <ShootingStars />

      {/* Realistic Aurora Borealis */}
      <AuroraBorealis />

      {/* Enhanced starfield with better integration */}
      <Stars 
        radius={150} 
        depth={80} 
        count={5000} 
        factor={6} 
        saturation={0.1} 
        fade 
        speed={0.8}
      />

      {/* Additional bright nearby stars with enhanced blending */}
      {Array.from({ length: 80 }, (_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 300,
            (Math.random() - 0.5) * 300,
            (Math.random() - 0.5) * 300
          ]}
        >
          <sphereGeometry args={[Math.random() * 0.8 + 0.1, 8, 8]} />
          <meshBasicMaterial
            color={['#ffffff', '#ffffaa', '#ffaa88', '#aaccff', '#ff88aa', '#88ffaa', '#ffcc88'][Math.floor(Math.random() * 7)]}
            transparent
            opacity={0.7 + Math.random() * 0.2}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Floating cosmic particles with enhanced blending */}
      {Array.from({ length: 150 }, (_, i) => (
        <mesh
          key={`particle-${i}`}
          position={[
            (Math.random() - 0.5) * 400,
            (Math.random() - 0.5) * 400,
            (Math.random() - 0.5) * 400
          ]}
        >
          <sphereGeometry args={[Math.random() * 0.4 + 0.05, 6, 6]} />
          <meshBasicMaterial
            color={['#4488ff', '#ff4488', '#88ff44', '#ff8844', '#8844ff', '#ffaa44', '#44ffaa'][Math.floor(Math.random() * 7)]}
            transparent
            opacity={0.3 + Math.random() * 0.4}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Planets with enhanced blending and click functionality */}
      <Planet 
        position={[-8, 3, 0]} 
        size={1.2} 
        color="#ff6b35" 
        type="gas" 
        name="Nebula Prime"
        onPlanetClick={onPlanetClick}
      />
      <Planet 
        position={[6, -2, 0]} 
        size={0.8} 
        color="#4ecdc4" 
        type="ocean" 
        name="Aquaria"
        onPlanetClick={onPlanetClick}
      />
      <Planet 
        position={[0, 8, 0]} 
        size={1.0} 
        color="#45b7d1" 
        type="ice" 
        name="Cryos"
        onPlanetClick={onPlanetClick}
      />
      <Planet 
        position={[-4, -6, 0]} 
        size={0.6} 
        color="#96ceb4" 
        type="terrestrial" 
        name="Terra Nova"
        onPlanetClick={onPlanetClick}
      />
      <Planet 
        position={[10, 5, 0]} 
        size={0.9} 
        color="#feca57" 
        type="desert" 
        name="Aridus"
        onPlanetClick={onPlanetClick}
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

interface SpaceSceneProps {
  onPlanetClick: (planetName: string, planetType: string) => void;
}

export default function SpaceScene({ onPlanetClick }: SpaceSceneProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 75 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        shadows
      >
        <SpaceSceneContent onPlanetClick={onPlanetClick} />
      </Canvas>
    </div>
  );
} 