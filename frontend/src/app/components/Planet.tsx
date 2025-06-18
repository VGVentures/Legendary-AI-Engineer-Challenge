'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PlanetProps {
  position: [number, number, number];
  size: number;
  color: string;
  type?: 'terrestrial' | 'gas' | 'ice' | 'ocean' | 'desert';
}

export default function Planet({ position, size, color, type = 'terrestrial' }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y += 0.002;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x += 0.001;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y += 0.005;
    }
  });

  // Create a luminous material based on planet type
  const getPlanetMaterial = () => {
    const baseColor = new THREE.Color(color);
    
    switch (type) {
      case 'gas':
        // Gas giant with intense glow
        return new THREE.MeshStandardMaterial({
          color: baseColor,
          metalness: 0.1,
          roughness: 0.8,
          emissive: baseColor,
          emissiveIntensity: 0.6,
        });
      
      case 'ice':
        // Ice planet with crystalline glow
        return new THREE.MeshStandardMaterial({
          color: new THREE.Color(0.9, 0.95, 1.0),
          metalness: 0.3,
          roughness: 0.2,
          emissive: new THREE.Color(0.8, 0.9, 1.0),
          emissiveIntensity: 0.4,
        });
      
      case 'ocean':
        // Ocean planet with deep blue glow
        return new THREE.MeshStandardMaterial({
          color: new THREE.Color(0.1, 0.3, 0.8),
          metalness: 0.2,
          roughness: 0.1,
          emissive: new THREE.Color(0.1, 0.2, 0.6),
          emissiveIntensity: 0.5,
        });
      
      case 'desert':
        // Desert planet with warm glow
        return new THREE.MeshStandardMaterial({
          color: new THREE.Color(0.8, 0.6, 0.3),
          metalness: 0.1,
          roughness: 0.9,
          emissive: new THREE.Color(0.6, 0.4, 0.2),
          emissiveIntensity: 0.3,
        });
      
      default:
        // Terrestrial planet with moderate glow
        return new THREE.MeshStandardMaterial({
          color: baseColor,
          metalness: 0.1,
          roughness: 0.7,
          emissive: baseColor,
          emissiveIntensity: 0.4,
        });
    }
  };

  return (
    <group position={position}>
      {/* Luminous core - inner glow */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[size * 0.8, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Main planet sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 32, 32]} />
        <primitive object={getPlanetMaterial()} />
      </mesh>

      {/* Intense atmospheric glow - inner layer */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[size * 1.15, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.5}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Bright atmospheric glow - middle layer */}
      <mesh>
        <sphereGeometry args={[size * 1.3, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer atmospheric glow */}
      <mesh>
        <sphereGeometry args={[size * 1.5, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.2}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Luminous ring system */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[size * 1.5, size * 2.5, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner luminous ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[size * 1.6, size * 2.0, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer luminous ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[size * 2.6, size * 3.0, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Planet's own intense light source */}
      <pointLight
        color={color}
        intensity={1.0}
        distance={size * 6}
        decay={1.5}
      />

      {/* Additional rim lighting for dramatic effect */}
      <spotLight
        color={color}
        intensity={0.5}
        distance={size * 8}
        angle={Math.PI / 4}
        penumbra={0.5}
        decay={1.5}
        position={[size * 2, size * 2, size * 2]}
        target={meshRef.current || undefined}
      />

      {/* Ambient glow around the planet */}
      <pointLight
        color={color}
        intensity={0.3}
        distance={size * 10}
        decay={2}
        position={[0, 0, 0]}
      />
    </group>
  );
} 