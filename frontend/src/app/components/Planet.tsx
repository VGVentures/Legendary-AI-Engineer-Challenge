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
}

// Utility to generate a canvas-based texture for planet surfaces
function usePlanetTexture(type: string, color: string, size: number) {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;
    
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 1024, 1024);
    
    let colors: string[];
    let features: any;
    
    switch (type) {
      case 'gas':
        colors = ['#FF6B35', '#FF8E53', '#FFB366', '#FFD700', '#FFA500', '#FF4500'];
        features = {
          bands: true,
          storms: true,
          swirls: true,
          spots: true
        };
        break;
      case 'ice':
        colors = ['#87CEEB', '#B0E0E6', '#E0F6FF', '#F0F8FF', '#ADD8E6', '#FFFFFF'];
        features = {
          cracks: true,
          crystals: true,
          snow: true,
          glaciers: true
        };
        break;
      case 'ocean':
        colors = ['#006994', '#1E90FF', '#00BFFF', '#87CEEB', '#4682B4', '#000080'];
        features = {
          waves: true,
          islands: true,
          currents: true,
          depths: true
        };
        break;
      case 'terrestrial':
        colors = ['#228B22', '#32CD32', '#90EE90', '#98FB98', '#7CFC00', '#006400'];
        features = {
          continents: true,
          mountains: true,
          forests: true,
          rivers: true
        };
        break;
      case 'desert':
        colors = ['#D2B48C', '#F4A460', '#DEB887', '#DAA520', '#B8860B', '#8B4513'];
        features = {
          dunes: true,
          rocks: true,
          canyons: true,
          oasis: true
        };
        break;
      default:
        colors = [color, color, color, color, color, color];
        features = {};
    }
    
    // Create base gradient with VARIED INTENSITY
    const grad = ctx.createRadialGradient(512, 512, 100, 512, 512, 512);
    grad.addColorStop(0, colors[0]);
    grad.addColorStop(0.15, colors[1]);
    grad.addColorStop(0.35, colors[2]);
    grad.addColorStop(0.55, colors[3]);
    grad.addColorStop(0.75, colors[4]);
    grad.addColorStop(1, colors[5]);
    
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);
    
    // Add planet-specific features with VARIED INTENSITY
    if (features.bands) {
      // Gas giant bands - MORE VARIED
      for (let i = 0; i < 10; i++) {
        const y = 80 + i * 90;
        const height = 50 + Math.random() * 60;
        const bandColor = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillStyle = bandColor;
        ctx.globalAlpha = 0.6 + Math.random() * 0.3;
        ctx.fillRect(0, y, 1024, height);
      }
    }
    
    if (features.storms) {
      // Storm systems - MORE VARIED SIZES
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        const radius = 15 + Math.random() * 80;
        const stormColor = `hsl(${200 + Math.random() * 60}, 70%, 25% + Math.random() * 20%)`;
        
        ctx.globalAlpha = 0.4 + Math.random() * 0.4;
        ctx.fillStyle = stormColor;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    if (features.swirls) {
      // Swirling patterns - MORE VARIED
      for (let i = 0; i < 25; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        const radius = 25 + Math.random() * 70;
        
        ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.lineWidth = 2 + Math.random() * 4;
        ctx.globalAlpha = 0.3 + Math.random() * 0.3;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    
    if (features.continents) {
      // Terrestrial continents - MORE VARIED SIZES
      for (let i = 0; i < 12; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        const size = 40 + Math.random() * 180;
        const continentColor = `hsl(${100 + Math.random() * 50}, 60%, 25% + Math.random() * 20%)`;
        
        ctx.globalAlpha = 0.7 + Math.random() * 0.2;
        ctx.fillStyle = continentColor;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    if (features.mountains) {
      // Mountain ranges - MORE VARIED
      for (let i = 0; i < 18; i++) {
        const startX = Math.random() * 1024;
        const startY = Math.random() * 1024;
        const length = 80 + Math.random() * 250;
        
        ctx.strokeStyle = `hsl(${60 + Math.random() * 30}, 40%, 20% + Math.random() * 15%)`;
        ctx.lineWidth = 3 + Math.random() * 4;
        ctx.globalAlpha = 0.6 + Math.random() * 0.3;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX + length, startY + Math.random() * 120 - 60);
        ctx.stroke();
      }
    }
    
    if (features.dunes) {
      // Desert dunes - MORE VARIED
      for (let i = 0; i < 35; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        const width = 60 + Math.random() * 150;
        const height = 15 + Math.random() * 50;
        
        ctx.fillStyle = `hsl(${45 + Math.random() * 20}, 50%, 55% + Math.random() * 15%)`;
        ctx.globalAlpha = 0.5 + Math.random() * 0.3;
        ctx.beginPath();
        ctx.ellipse(x, y, width, height, Math.random() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    if (features.cracks) {
      // Ice cracks - MORE VARIED
      for (let i = 0; i < 40; i++) {
        const startX = Math.random() * 1024;
        const startY = Math.random() * 1024;
        const length = 40 + Math.random() * 180;
        
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1 + Math.random() * 3;
        ctx.globalAlpha = 0.7 + Math.random() * 0.2;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX + length, startY + Math.random() * 120 - 60);
        ctx.stroke();
      }
    }
    
    if (features.waves) {
      // Ocean waves - MORE VARIED
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        const radius = 25 + Math.random() * 100;
        
        ctx.strokeStyle = `hsl(${220 + Math.random() * 30}, 60%, 45% + Math.random() * 15%)`;
        ctx.lineWidth = 2 + Math.random() * 4;
        ctx.globalAlpha = 0.4 + Math.random() * 0.3;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    
    // Add atmospheric scattering and surface details
    for (let i = 0; i < 2000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const radius = Math.random() * 4;
      const alpha = Math.random() * 0.15;
      
      ctx.globalAlpha = alpha;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Add some darker spots for depth
    for (let i = 0; i < 500; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const radius = Math.random() * 6;
      const alpha = Math.random() * 0.2;
      
      ctx.globalAlpha = alpha;
      ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, [type, color, size]);
}

// Animated gradient colors for different planet types - ENHANCED with VARIED HUES
const getAnimatedColors = (type: string, time: number) => {
  const speed = 0.0005; // Slower animation for more dramatic effect
  const t = time * speed;
  
  switch (type) {
    case 'gas':
      // Gas giants: Orange to red to gold variations
      return [
        `hsl(${25 + Math.sin(t) * 15}, 100%, 60%)`,
        `hsl(${35 + Math.sin(t + 1.5) * 20}, 90%, 65%)`,
        `hsl(${45 + Math.sin(t + 3) * 25}, 85%, 70%)`,
        `hsl(${55 + Math.sin(t + 4.5) * 15}, 80%, 75%)`,
        `hsl(${65 + Math.sin(t + 6) * 10}, 75%, 80%)`
      ];
    case 'ice':
      // Ice planets: Blue to cyan to white variations
      return [
        `hsl(${190 + Math.sin(t) * 30}, 80%, 70%)`,
        `hsl(${200 + Math.sin(t + 2) * 25}, 70%, 75%)`,
        `hsl(${210 + Math.sin(t + 4) * 20}, 60%, 80%)`,
        `hsl(${220 + Math.sin(t + 6) * 15}, 50%, 85%)`,
        `hsl(${230 + Math.sin(t + 8) * 10}, 40%, 90%)`
      ];
    case 'ocean':
      // Ocean worlds: Deep blue to turquoise variations
      return [
        `hsl(${210 + Math.sin(t) * 40}, 90%, 35%)`,
        `hsl(${220 + Math.sin(t + 2.5) * 35}, 80%, 45%)`,
        `hsl(${230 + Math.sin(t + 5) * 30}, 70%, 55%)`,
        `hsl(${240 + Math.sin(t + 7.5) * 25}, 60%, 65%)`,
        `hsl(${250 + Math.sin(t + 10) * 20}, 50%, 75%)`
      ];
    case 'terrestrial':
      // Terrestrial planets: Green to emerald to forest variations
      return [
        `hsl(${110 + Math.sin(t) * 35}, 85%, 35%)`,
        `hsl(${120 + Math.sin(t + 2) * 30}, 80%, 45%)`,
        `hsl(${130 + Math.sin(t + 4) * 25}, 75%, 55%)`,
        `hsl(${140 + Math.sin(t + 6) * 20}, 70%, 65%)`,
        `hsl(${150 + Math.sin(t + 8) * 15}, 65%, 75%)`
      ];
    case 'desert':
      // Desert worlds: Sand to gold to amber variations
      return [
        `hsl(${35 + Math.sin(t) * 25}, 75%, 55%)`,
        `hsl(${40 + Math.sin(t + 2.5) * 20}, 70%, 60%)`,
        `hsl(${45 + Math.sin(t + 5) * 15}, 65%, 65%)`,
        `hsl(${50 + Math.sin(t + 7.5) * 10}, 60%, 70%)`,
        `hsl(${55 + Math.sin(t + 10) * 5}, 55%, 75%)`
      ];
    default:
      return ['#888', '#999', '#aaa', '#bbb', '#ccc'];
  }
};

export default function Planet({ position, size, color, type = 'terrestrial', name }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = usePlanetTexture(type, color, size);
  const [animatedColors, setAnimatedColors] = useState(() => getAnimatedColors(type, 0));
  
  // Unique rotation speeds for different planet types
  const getRotationSpeed = (planetType: string) => {
    switch (planetType) {
      case 'gas': return 0.008; // Fast rotation like Jupiter
      case 'ice': return 0.003; // Slow rotation like Pluto
      case 'ocean': return 0.006; // Medium rotation like Earth
      case 'terrestrial': return 0.005; // Earth-like rotation
      case 'desert': return 0.004; // Mars-like rotation
      default: return 0.005;
    }
  };
  
  // Unique atmospheric effects for each planet type
  const getAtmosphericLayers = (planetType: string) => {
    switch (planetType) {
      case 'gas':
        return [1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.4, 2.6]; // Many thick layers
      case 'ice':
        return [1.1, 1.2, 1.3, 1.4]; // Thin, crisp layers
      case 'ocean':
        return [1.15, 1.3, 1.45, 1.6, 1.75, 1.9]; // Moist, humid layers
      case 'terrestrial':
        return [1.1, 1.25, 1.4, 1.55, 1.7, 1.85]; // Earth-like atmosphere
      case 'desert':
        return [1.1, 1.2, 1.3, 1.4, 1.5]; // Dry, dusty atmosphere
      default:
        return [1.2, 1.4, 1.6, 1.8];
    }
  };
  
  // Special effects for each planet type
  const getSpecialEffects = (planetType: string) => {
    switch (planetType) {
      case 'gas':
        return {
          hasRings: true,
          hasStorms: true,
          hasSpots: true,
          hasSwirls: true
        };
      case 'ice':
        return {
          hasRings: false,
          hasCrystals: true,
          hasSnow: true,
          hasGlaciers: true
        };
      case 'ocean':
        return {
          hasRings: false,
          hasWaves: true,
          hasIslands: true,
          hasCurrents: true
        };
      case 'terrestrial':
        return {
          hasRings: false,
          hasClouds: true,
          hasMountains: true,
          hasForests: true
        };
      case 'desert':
        return {
          hasRings: false,
          hasDust: true,
          hasCanyons: true,
          hasOasis: true
        };
      default:
        return { hasRings: false };
    }
  };
  
  const getRingConfig = (planetType: string) => {
    switch (planetType) {
      case 'gas':
        return {
          colors: ['#FFD700', '#FFA500', '#FF6347', '#FF4500', '#FF8C00'],
          sparkleCount: 200,
          particleCount: 100,
          opacity: 0.8,
          width: 2.0
        };
      case 'ocean':
        return {
          colors: ['#00BFFF', '#1E90FF', '#4169E1', '#6A5ACD', '#9370DB'],
          sparkleCount: 180,
          particleCount: 90,
          opacity: 0.7,
          width: 1.5
        };
      case 'ice':
        return {
          colors: ['#F0F8FF', '#E0F6FF', '#B0E0E6', '#87CEEB', '#ADD8E6'],
          sparkleCount: 150,
          particleCount: 75,
          opacity: 0.6,
          width: 1.2
        };
      case 'terrestrial':
        return {
          colors: ['#32CD32', '#228B22', '#90EE90', '#98FB98', '#7CFC00'],
          sparkleCount: 160,
          particleCount: 80,
          opacity: 0.7,
          width: 1.8
        };
      case 'desert':
        return {
          colors: ['#DAA520', '#B8860B', '#F4A460', '#DEB887', '#D2B48C'],
          sparkleCount: 140,
          particleCount: 70,
          opacity: 0.6,
          width: 1.3
        };
      default:
        return {
          colors: ['#888', '#999', '#aaa', '#bbb', '#ccc'],
          sparkleCount: 100,
          particleCount: 50,
          opacity: 0.5,
          width: 1.5
        };
    }
  };

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += getRotationSpeed(type);
    }
    
    // Update animated colors for smooth transitions
    const newColors = getAnimatedColors(type, state.clock.elapsedTime);
    setAnimatedColors(newColors);
  });

  const ringConfig = getRingConfig(type);
  const atmosphericLayers = getAtmosphericLayers(type);
  const specialEffects = getSpecialEffects(type);

  return (
    <>
      {/* Main Planet Body with Animated Gradient */}
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[size, 64, 64]} />
        <meshPhysicalMaterial
          map={texture}
          emissive={new THREE.Color(animatedColors[0])}
          emissiveIntensity={1.5}
          clearcoat={0.9}
          clearcoatRoughness={0.1}
          transmission={0.3}
          thickness={1.0}
          roughness={0.1}
          metalness={0.3}
        />
      </mesh>

      {/* Enhanced Atmospheric Glow with Animated Colors - MUCH BRIGHTER */}
      {atmosphericLayers.map((scale, index) => (
        <mesh key={`atmosphere-${index}`} position={position}>
          <sphereGeometry args={[size * scale, 32, 32]} />
          <meshBasicMaterial
            color={animatedColors[index % animatedColors.length]}
            transparent
            opacity={0.8 - index * 0.08}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
          />
        </mesh>
      ))}

      {/* Special Atmospheric Effects for Each Planet Type */}
      {specialEffects.hasClouds && (
        // Terrestrial planet clouds
        <>
          {[1.05, 1.08, 1.11, 1.14].map((cloudScale, cloudIndex) => (
            <mesh key={`cloud-${cloudIndex}`} position={position}>
              <sphereGeometry args={[size * cloudScale, 24, 24]} />
              <meshBasicMaterial
                color={`hsl(${200 + cloudIndex * 10}, 30%, 80%)`}
                transparent
                opacity={0.3 - cloudIndex * 0.05}
                blending={THREE.NormalBlending}
                side={THREE.FrontSide}
              />
            </mesh>
          ))}
        </>
      )}

      {specialEffects.hasStorms && (
        // Gas giant storm systems
        <>
          {[1.15, 1.25, 1.35].map((stormScale, stormIndex) => (
            <mesh key={`storm-${stormIndex}`} position={position}>
              <sphereGeometry args={[size * stormScale, 20, 20]} />
              <meshBasicMaterial
                color={`hsl(${220 + stormIndex * 20}, 80%, 30%)`}
                transparent
                opacity={0.4 - stormIndex * 0.1}
                blending={THREE.AdditiveBlending}
                side={THREE.FrontSide}
              />
            </mesh>
          ))}
        </>
      )}

      {specialEffects.hasDust && (
        // Desert planet dust storms
        <>
          {[1.12, 1.18, 1.24].map((dustScale, dustIndex) => (
            <mesh key={`dust-${dustIndex}`} position={position}>
              <sphereGeometry args={[size * dustScale, 28, 28]} />
              <meshBasicMaterial
                color={`hsl(${45 + dustIndex * 5}, 40%, 60%)`}
                transparent
                opacity={0.25 - dustIndex * 0.05}
                blending={THREE.NormalBlending}
                side={THREE.FrontSide}
              />
            </mesh>
          ))}
        </>
      )}

      {specialEffects.hasCrystals && (
        // Ice planet crystal formations
        <>
          {[1.08, 1.12, 1.16].map((crystalScale, crystalIndex) => (
            <mesh key={`crystal-${crystalIndex}`} position={position}>
              <sphereGeometry args={[size * crystalScale, 16, 16]} />
              <meshBasicMaterial
                color={`hsl(${200 + crystalIndex * 15}, 50%, 90%)`}
                transparent
                opacity={0.2 - crystalIndex * 0.05}
                blending={THREE.AdditiveBlending}
                side={THREE.FrontSide}
              />
            </mesh>
          ))}
        </>
      )}

      {specialEffects.hasWaves && (
        // Ocean planet wave patterns
        <>
          {[1.06, 1.09, 1.12].map((waveScale, waveIndex) => (
            <mesh key={`wave-${waveIndex}`} position={position}>
              <sphereGeometry args={[size * waveScale, 32, 32]} />
              <meshBasicMaterial
                color={`hsl(${220 + waveIndex * 10}, 60%, 50%)`}
                transparent
                opacity={0.15 - waveIndex * 0.03}
                blending={THREE.NormalBlending}
                side={THREE.FrontSide}
              />
            </mesh>
          ))}
        </>
      )}

      {/* BRIGHT Luminous Core - ENHANCED MULTI-LAYER - MUCH LARGER */}
      {/* Innermost Bright Core */}
      <mesh position={position}>
        <sphereGeometry args={[size * 0.5, 16, 16]} />
        <meshBasicMaterial
          color={animatedColors[0]}
          transparent
          opacity={1.0}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Bright Core Layer 2 */}
      <mesh position={position}>
        <sphereGeometry args={[size * 0.6, 18, 18]} />
        <meshBasicMaterial
          color={animatedColors[1]}
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Bright Core Layer 3 */}
      <mesh position={position}>
        <sphereGeometry args={[size * 0.7, 20, 20]} />
        <meshBasicMaterial
          color={animatedColors[2]}
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Bright Core Layer 4 */}
      <mesh position={position}>
        <sphereGeometry args={[size * 0.8, 22, 22]} />
        <meshBasicMaterial
          color={animatedColors[3]}
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Bright Core Layer 5 */}
      <mesh position={position}>
        <sphereGeometry args={[size * 0.9, 24, 24]} />
        <meshBasicMaterial
          color={animatedColors[4]}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Additional Bright Inner Glow */}
      <mesh position={position}>
        <sphereGeometry args={[size * 1.0, 26, 26]} />
        <meshBasicMaterial
          color={animatedColors[0]}
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Extra Bright Core Glow */}
      <mesh position={position}>
        <sphereGeometry args={[size * 1.1, 28, 28]} />
        <meshBasicMaterial
          color={animatedColors[1]}
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Enhanced Ring System with Dynamic Effects */}
      {specialEffects.hasRings && (
        <>
          {/* Multiple Ring Layers with Different Properties */}
          {[1.5, 1.8, 2.1, 2.4, 2.7].map((ringScale, ringIndex) => (
            <mesh key={`ring-${ringIndex}`} position={position} rotation-x={Math.PI / 2}>
              <ringGeometry args={[size * ringScale, size * (ringScale + 0.3), 64]} />
              <meshBasicMaterial
                color={ringConfig.colors[ringIndex % ringConfig.colors.length]}
                transparent
                opacity={ringConfig.opacity - ringIndex * 0.1}
                blending={THREE.AdditiveBlending}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
          
          {/* Ring Particles and Sparkles */}
          {Array.from({ length: ringConfig.particleCount }).map((_, particleIndex) => {
            const angle = (particleIndex / ringConfig.particleCount) * Math.PI * 2;
            const radius = size * (1.6 + Math.random() * 1.2);
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            return (
              <mesh key={`particle-${particleIndex}`} position={[position[0] + x, position[1], position[2] + z]}>
                <sphereGeometry args={[0.1 + Math.random() * 0.2, 8, 8]} />
                <meshBasicMaterial
                  color={ringConfig.colors[particleIndex % ringConfig.colors.length]}
                  transparent
                  opacity={0.8}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>
            );
          })}
          
          {/* Orbiting Sparkles */}
          {Array.from({ length: ringConfig.sparkleCount }).map((_, sparkleIndex) => {
            const angle = (sparkleIndex / ringConfig.sparkleCount) * Math.PI * 2;
            const radius = size * (1.5 + Math.random() * 1.5);
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = (Math.random() - 0.5) * size * 0.3;
            
            return (
              <mesh key={`sparkle-${sparkleIndex}`} position={[position[0] + x, position[1] + y, position[2] + z]}>
                <sphereGeometry args={[0.05 + Math.random() * 0.1, 6, 6]} />
                <meshBasicMaterial
                  color={ringConfig.colors[sparkleIndex % ringConfig.colors.length]}
                  transparent
                  opacity={0.9}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>
            );
          })}
        </>
      )}

      {/* Special Gas Giant Storm Spots */}
      {specialEffects.hasSpots && (
        <>
          {[1.02, 1.04, 1.06].map((spotScale, spotIndex) => (
            <mesh key={`spot-${spotIndex}`} position={position}>
              <sphereGeometry args={[size * spotScale, 12, 12]} />
              <meshBasicMaterial
                color={`hsl(${180 + spotIndex * 30}, 90%, 25%)`}
                transparent
                opacity={0.6 - spotIndex * 0.15}
                blending={THREE.NormalBlending}
                side={THREE.FrontSide}
              />
            </mesh>
          ))}
        </>
      )}

      {/* Special Gas Giant Swirl Patterns */}
      {specialEffects.hasSwirls && (
        <>
          {[1.1, 1.2, 1.3].map((swirlScale, swirlIndex) => (
            <mesh key={`swirl-${swirlIndex}`} position={position}>
              <sphereGeometry args={[size * swirlScale, 18, 18]} />
              <meshBasicMaterial
                color={`hsl(${40 + swirlIndex * 20}, 80%, 60%)`}
                transparent
                opacity={0.3 - swirlIndex * 0.08}
                blending={THREE.AdditiveBlending}
                side={THREE.FrontSide}
              />
            </mesh>
          ))}
        </>
      )}

      {/* Enhanced Glow Spheres - MUCH BRIGHTER */}
      {[0.8, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0].map((glowScale, glowIndex) => (
        <mesh key={`glow-${glowIndex}`} position={position}>
          <sphereGeometry args={[size * glowScale, 24, 24]} />
          <meshBasicMaterial
            color={animatedColors[glowIndex % animatedColors.length]}
            transparent
            opacity={0.6 - glowIndex * 0.08}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
          />
        </mesh>
      ))}

      {/* Extra Bright Outer Halo */}
      <mesh position={position}>
        <sphereGeometry args={[size * 2.2, 32, 32]} />
        <meshBasicMaterial
          color={animatedColors[0]}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Super Bright Outer Halo */}
      <mesh position={position}>
        <sphereGeometry args={[size * 2.8, 32, 32]} />
        <meshBasicMaterial
          color={animatedColors[1]}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Ring System - ENHANCED with VARIED SIZES and COLORS */}
      {type === 'gas' && (
        <>
          {/* Primary ring - LARGER and more prominent for gas giants */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <ringGeometry args={[size * 1.8, size * 2.2, 64]} />
            <meshBasicMaterial
              color={animatedColors[0]}
              transparent
              opacity={0.4}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
          
          {/* Secondary ring - VARIED SIZE */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <ringGeometry args={[size * 2.4, size * 2.8, 64]} />
            <meshBasicMaterial
              color={animatedColors[1]}
              transparent
              opacity={0.3}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
          
          {/* Outer ring - EVEN LARGER */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <ringGeometry args={[size * 3.0, size * 3.5, 64]} />
            <meshBasicMaterial
              color={animatedColors[2]}
              transparent
              opacity={0.25}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
        </>
      )}
      
      {type === 'terrestrial' && (
        <>
          {/* Terrestrial rings - SMALLER and more subtle */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <ringGeometry args={[size * 1.4, size * 1.7, 64]} />
            <meshBasicMaterial
              color={animatedColors[0]}
              transparent
              opacity={0.25}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
          
          {/* Secondary terrestrial ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <ringGeometry args={[size * 1.9, size * 2.1, 64]} />
            <meshBasicMaterial
              color={animatedColors[1]}
              transparent
              opacity={0.2}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
        </>
      )}
      
      {type === 'ice' && (
        <>
          {/* Ice planet rings - CRYSTALLINE and bright */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <ringGeometry args={[size * 1.6, size * 1.9, 64]} />
            <meshBasicMaterial
              color={animatedColors[0]}
              transparent
              opacity={0.35}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
          
          {/* Secondary ice ring - BRIGHTER */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <ringGeometry args={[size * 2.1, size * 2.4, 64]} />
            <meshBasicMaterial
              color={animatedColors[1]}
              transparent
              opacity={0.3}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
        </>
      )}
      
      {type === 'ocean' && (
        <>
          {/* Ocean planet rings - FLUID and flowing */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <ringGeometry args={[size * 1.5, size * 1.8, 64]} />
            <meshBasicMaterial
              color={animatedColors[0]}
              transparent
              opacity={0.3}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
          
          {/* Secondary ocean ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <ringGeometry args={[size * 2.0, size * 2.3, 64]} />
            <meshBasicMaterial
              color={animatedColors[1]}
              transparent
              opacity={0.25}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
        </>
      )}
      
      {type === 'desert' && (
        <>
          {/* Desert planet rings - DUSTY and warm */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <ringGeometry args={[size * 1.3, size * 1.6, 64]} />
            <meshBasicMaterial
              color={animatedColors[0]}
              transparent
              opacity={0.2}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
          
          {/* Secondary desert ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <ringGeometry args={[size * 1.8, size * 2.0, 64]} />
            <meshBasicMaterial
              color={animatedColors[1]}
              transparent
              opacity={0.15}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
        </>
      )}
    </>
  );
} 