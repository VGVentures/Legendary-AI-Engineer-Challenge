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
  onPlanetClick?: (planetData: { name: string; type: string; color: string }) => void;
}

// Utility to generate a canvas-based texture for planet surfaces
function usePlanetTexture(type: string, color: string, size: number) {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(256, 256, 80, 256, 256, 256);
    
    let colors: string[];
    switch (type) {
      case 'gas':
        colors = ['#FF6B35', '#F7931E', '#FFD23F', '#FF6B35'];
        break;
      case 'ice':
        colors = ['#87CEEB', '#B0E0E6', '#E0F6FF', '#87CEEB'];
        break;
      case 'ocean':
        colors = ['#006994', '#0099CC', '#00BFFF', '#006994'];
        break;
      case 'desert':
        colors = ['#D2691E', '#CD853F', '#F4A460', '#DEB887'];
        break;
      default: // terrestrial
        colors = ['#228B22', '#32CD32', '#90EE90', '#228B22'];
    }
    
    grad.addColorStop(0, colors[0]);
    grad.addColorStop(0.3, colors[1]);
    grad.addColorStop(0.7, colors[2]);
    grad.addColorStop(1, colors[3]);
    
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
    
    // Add some texture variation
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const radius = Math.random() * 20 + 5;
      const alpha = Math.random() * 0.3 + 0.1;
      
      ctx.globalAlpha = alpha;
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    
    return texture;
  }, [type, color, size]);
}

// Enhanced animated colors function
const getAnimatedColors = (type: string, time: number) => {
  const baseColors = {
    terrestrial: ['#228B22', '#32CD32', '#90EE90', '#98FB98', '#00FF7F'],
    gas: ['#FF6B35', '#F7931E', '#FFD23F', '#FFA500', '#FF8C00'],
    ice: ['#87CEEB', '#B0E0E6', '#E0F6FF', '#F0F8FF', '#ADD8E6'],
    ocean: ['#006994', '#0099CC', '#00BFFF', '#1E90FF', '#4169E1'],
    desert: ['#D2691E', '#CD853F', '#F4A460', '#DEB887', '#D2B48C']
  };
  
  const colors = baseColors[type as keyof typeof baseColors] || baseColors.terrestrial;
  const phase = (time * 0.1) % colors.length;
  const index1 = Math.floor(phase);
  const index2 = (index1 + 1) % colors.length;
  const t = phase - index1;
  
  return colors.map((_, i) => {
    const color1 = new THREE.Color(colors[(index1 + i) % colors.length]);
    const color2 = new THREE.Color(colors[(index2 + i) % colors.length]);
    return color1.clone().lerp(color2, t);
  });
};

export default function Planet({ position, size, color, type = 'terrestrial', name, onPlanetClick }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const texture = usePlanetTexture(type, color, size);
  
  const getRingConfig = (planetType: string) => {
    const configs = {
      gas: {
        colors: ['#FFD700', '#FFA500', '#FF6347', '#FF4500'],
        opacity: 0.8,
        particleCount: 100,
        sparkleCount: 50
      },
      ice: {
        colors: ['#87CEEB', '#B0E0E6', '#E0F6FF', '#F0F8FF'],
        opacity: 0.6,
        particleCount: 80,
        sparkleCount: 40
      },
      ocean: {
        colors: ['#00BFFF', '#1E90FF', '#4169E1', '#0000CD'],
        opacity: 0.7,
        particleCount: 90,
        sparkleCount: 45
      },
      desert: {
        colors: ['#D2691E', '#CD853F', '#F4A460', '#DEB887'],
        opacity: 0.5,
        particleCount: 70,
        sparkleCount: 35
      },
      terrestrial: {
        colors: ['#32CD32', '#90EE90', '#98FB98', '#00FF7F'],
        opacity: 0.4,
        particleCount: 60,
        sparkleCount: 30
      }
    };
    return configs[planetType as keyof typeof configs] || configs.terrestrial;
  };

  const ringConfig = getRingConfig(type);
  const animatedColors = getAnimatedColors(type, 0); // We'll update this in useFrame

  const handleClick = (event: any) => {
    event.stopPropagation();
    if (onPlanetClick) {
      onPlanetClick({ name, type, color });
    }
  };

  const handlePointerOver = (event: any) => {
    event.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (event: any) => {
    event.stopPropagation();
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  return (
    <>
      {/* Main Planet Body with Animated Gradient */}
      <mesh 
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[size, 64, 64]} />
        <meshPhysicalMaterial
          map={texture}
          emissive={new THREE.Color(animatedColors[0])}
          emissiveIntensity={0.8}
          clearcoat={0.9}
          clearcoatRoughness={0.1}
          transmission={0.2}
          thickness={0.8}
          roughness={0.2}
          metalness={0.2}
        />
      </mesh>

      {/* Enhanced Atmospheric Glow with Animated Colors - MUCH BRIGHTER */}
      {[1.1, 1.3, 1.5, 1.7, 1.9, 2.1, 2.3].map((scale, index) => (
        <mesh key={`atmosphere-${index}`} position={position}>
          <sphereGeometry args={[size * scale, 32, 32]} />
          <meshBasicMaterial
            color={animatedColors[index % animatedColors.length]}
            transparent
            opacity={0.3 - index * 0.04}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
          />
        </mesh>
      ))}

      {/* BRIGHT Luminous Core - ENHANCED MULTI-LAYER */}
      {/* Innermost Bright Core - Pulsing */}
      <mesh position={position}>
        <sphereGeometry args={[size * 0.25, 16, 16]} />
        <meshBasicMaterial
          color={animatedColors[0]}
          transparent
          opacity={1.0}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Ultra Bright Core Center */}
      <mesh position={position}>
        <sphereGeometry args={[size * 0.3, 18, 18]} />
        <meshBasicMaterial
          color={animatedColors[1]}
          transparent
          opacity={1.0}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Bright Core Layer 2 */}
      <mesh position={position}>
        <sphereGeometry args={[size * 0.4, 20, 20]} />
        <meshBasicMaterial
          color={animatedColors[2]}
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Bright Core Layer 3 */}
      <mesh position={position}>
        <sphereGeometry args={[size * 0.5, 22, 22]} />
        <meshBasicMaterial
          color={animatedColors[3]}
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Bright Core Layer 4 */}
      <mesh position={position}>
        <sphereGeometry args={[size * 0.6, 24, 24]} />
        <meshBasicMaterial
          color={animatedColors[4]}
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Bright Core Layer 5 */}
      <mesh position={position}>
        <sphereGeometry args={[size * 0.7, 26, 26]} />
        <meshBasicMaterial
          color={animatedColors[0]}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Additional Bright Inner Glow */}
      <mesh position={position}>
        <sphereGeometry args={[size * 0.8, 28, 28]} />
        <meshBasicMaterial
          color={animatedColors[1]}
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Extra Luminous Core Halo */}
      <mesh position={position}>
        <sphereGeometry args={[size * 0.9, 30, 30]} />
        <meshBasicMaterial
          color={animatedColors[2]}
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Core Energy Particles */}
      {Array.from({ length: 50 }, (_, i) => {
        const angle = (i / 50) * Math.PI * 2;
        const radius = size * 0.4 + Math.random() * size * 0.3;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (Math.random() - 0.5) * size * 0.2;
        
        return (
          <mesh key={`core-particle-${i}`} position={[position[0] + x, position[1] + y, position[2] + z]}>
            <sphereGeometry args={[0.015, 6, 6]} />
            <meshBasicMaterial
              color={animatedColors[i % animatedColors.length]}
              transparent
              opacity={0.9}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        );
      })}

      {/* Ring System with Multiple Layers */}
      {[1.5, 1.8, 2.1, 2.4].map((ringScale, ringIndex) => (
        <mesh key={`ring-${ringIndex}`} position={position} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * ringScale, size * (ringScale + 0.1), 64]} />
          <meshBasicMaterial
            color={ringConfig.colors[ringIndex % ringConfig.colors.length]}
            transparent
            opacity={ringConfig.opacity * (1 - ringIndex * 0.2)}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Ring Particles */}
      {Array.from({ length: ringConfig.particleCount }, (_, i) => {
        const angle = (i / ringConfig.particleCount) * Math.PI * 2;
        const radius = size * 2 + Math.random() * size * 0.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (Math.random() - 0.5) * size * 0.1;
        
        return (
          <mesh key={`particle-${i}`} position={[position[0] + x, position[1] + y, position[2] + z]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial
              color={ringConfig.colors[i % ringConfig.colors.length]}
              transparent
              opacity={0.8}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        );
      })}

      {/* Orbiting Sparkles */}
      {Array.from({ length: ringConfig.sparkleCount }, (_, i) => {
        const angle = (i / ringConfig.sparkleCount) * Math.PI * 2;
        const radius = size * 2.5 + Math.random() * size * 0.3;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (Math.random() - 0.5) * size * 0.2;
        
        return (
          <mesh key={`sparkle-${i}`} position={[position[0] + x, position[1] + y, position[2] + z]}>
            <sphereGeometry args={[0.01, 6, 6]} />
            <meshBasicMaterial
              color={ringConfig.colors[i % ringConfig.colors.length]}
              transparent
              opacity={0.9}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        );
      })}

      {/* Enhanced Glow Spheres - MUCH BRIGHTER */}
      {[0.7, 0.9, 1.1, 1.3, 1.5].map((glowScale, glowIndex) => (
        <mesh key={`glow-${glowIndex}`} position={position}>
          <sphereGeometry args={[size * glowScale, 24, 24]} />
          <meshBasicMaterial
            color={animatedColors[glowIndex % animatedColors.length]}
            transparent
            opacity={0.4 - glowIndex * 0.05}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
          />
        </mesh>
      ))}

      {/* Hover Effect */}
      {hovered && (
        <mesh position={position}>
          <sphereGeometry args={[size * 1.2, 32, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </>
  );
} 