'use client';

import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PlanetProps {
  position: [number, number, number];
  size: number;
  color: string;
  type?: 'terrestrial' | 'gas' | 'ice' | 'ocean' | 'desert';
  name: string;
  onPlanetClick: (planetName: string, planetType: string) => void;
}

export default function Planet({ position, size, color, type = 'terrestrial', name, onPlanetClick }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const sparklesRef = useRef<THREE.Group>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Create sparkle particles for the rings
  const sparkles = useMemo(() => {
    const particles = [];
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const radius = size * (1.8 + Math.random() * 0.8);
      const height = (Math.random() - 0.5) * size * 0.3;
      
      particles.push({
        position: [
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        ],
        size: Math.random() * 0.3 + 0.1,
        speed: Math.random() * 0.02 + 0.01,
        angle: angle,
        radius: radius,
        twinkle: Math.random() * Math.PI * 2
      });
    }
    return particles;
  }, [size]);

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
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += 0.001;
    }
    
    // Animate sparkles
    if (sparklesRef.current) {
      sparklesRef.current.children.forEach((sparkle, index) => {
        const particle = sparkles[index];
        particle.angle += particle.speed;
        particle.twinkle += 0.1;
        
        sparkle.position.x = Math.cos(particle.angle) * particle.radius;
        sparkle.position.z = Math.sin(particle.angle) * particle.radius;
        
        const twinkleIntensity = 0.5 + 0.5 * Math.sin(particle.twinkle);
        if (sparkle instanceof THREE.Mesh && sparkle.material) {
          (sparkle.material as THREE.Material).opacity = twinkleIntensity * 0.8;
        }
      });
    }

    // Hover animation - scale up when hovered
    if (meshRef.current) {
      const targetScale = isHovered ? 1.1 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }

    // Click animation - pulse effect
    if (isClicked && meshRef.current) {
      const pulseScale = 1.0 + 0.2 * Math.sin(state.clock.elapsedTime * 10);
      meshRef.current.scale.setScalar(pulseScale);
    }
  });

  // Handle click events
  const handleClick = () => {
    setIsClicked(true);
    onPlanetClick(name, type);
    
    // Reset click state after animation
    setTimeout(() => {
      setIsClicked(false);
    }, 500);
  };

  // Handle hover events
  const handlePointerOver = () => {
    setIsHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setIsHovered(false);
    document.body.style.cursor = 'default';
  };

  // Create enhanced planet material with better blending
  const getPlanetMaterial = () => {
    const baseColor = new THREE.Color(color);
    
    switch (type) {
      case 'gas':
        return new THREE.MeshPhysicalMaterial({
          color: baseColor,
          metalness: 0.1,
          roughness: 0.8,
          emissive: baseColor,
          emissiveIntensity: 0.6,
          clearcoat: 0.3,
          clearcoatRoughness: 0.2,
          transmission: 0.1,
          thickness: 0.5,
        });
      
      case 'ice':
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0.9, 0.95, 1.0),
          metalness: 0.3,
          roughness: 0.2,
          emissive: new THREE.Color(0.8, 0.9, 1.0),
          emissiveIntensity: 0.4,
          clearcoat: 0.8,
          clearcoatRoughness: 0.1,
          transmission: 0.2,
          thickness: 0.3,
        });
      
      case 'ocean':
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0.1, 0.3, 0.8),
          metalness: 0.2,
          roughness: 0.1,
          emissive: new THREE.Color(0.1, 0.2, 0.6),
          emissiveIntensity: 0.5,
          clearcoat: 0.9,
          clearcoatRoughness: 0.05,
          transmission: 0.3,
          thickness: 0.4,
        });
      
      case 'desert':
        return new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0.8, 0.6, 0.3),
          metalness: 0.1,
          roughness: 0.9,
          emissive: new THREE.Color(0.6, 0.4, 0.2),
          emissiveIntensity: 0.3,
          clearcoat: 0.1,
          clearcoatRoughness: 0.8,
        });
      
      default:
        return new THREE.MeshPhysicalMaterial({
          color: baseColor,
          metalness: 0.1,
          roughness: 0.7,
          emissive: baseColor,
          emissiveIntensity: 0.4,
          clearcoat: 0.2,
          clearcoatRoughness: 0.5,
        });
    }
  };

  return (
    <group position={position}>
      {/* Luminous core - inner glow with additive blending */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[size * 0.8, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Main planet sphere with enhanced material - CLICKABLE */}
      <mesh 
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <primitive object={getPlanetMaterial()} />
      </mesh>

      {/* Enhanced atmospheric layers with multiple blending modes */}
      <group>
        {/* Inner atmospheric glow - Additive blending */}
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

        {/* Middle atmospheric glow - Screen blending for softer effect */}
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

        {/* Outer atmospheric glow - Normal blending for realistic falloff */}
        <mesh>
          <sphereGeometry args={[size * 1.5, 16, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.2}
            side={THREE.BackSide}
            blending={THREE.NormalBlending}
          />
        </mesh>

        {/* Additional atmospheric scattering layer */}
        <mesh>
          <sphereGeometry args={[size * 1.7, 16, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.1}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Rim lighting effect - bright edge glow */}
        <mesh>
          <sphereGeometry args={[size * 1.02, 16, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.4}
            side={THREE.FrontSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Enhanced ring system with multiple blending layers */}
      <group>
        {/* Main luminous ring - Additive blending */}
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

        {/* Inner luminous ring - Screen blending for softer glow */}
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

        {/* Outer luminous ring - Normal blending for realistic edge */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * 2.6, size * 3.0, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
            blending={THREE.NormalBlending}
          />
        </mesh>

        {/* Additional ring layer for depth */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * 2.0, size * 2.2, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Sparkle particles around the rings with enhanced blending */}
      <group ref={sparklesRef}>
        {sparkles.map((particle, index) => (
          <mesh key={index} position={particle.position as [number, number, number]}>
            <sphereGeometry args={[particle.size, 8, 8]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.8}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>

      {/* Additional bright sparkles with screen blending */}
      <group>
        {sparkles.slice(0, 15).map((particle, index) => (
          <mesh 
            key={`bright-${index}`} 
            position={[
              particle.position[0] * 1.1,
              particle.position[1] * 1.2,
              particle.position[2] * 1.1
            ]}
          >
            <sphereGeometry args={[particle.size * 1.5, 6, 6]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.6}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>

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