'use client';

import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PlanetProps {
  position: [number, number, number];
  size: number;
  color: string;
  type?: string;
  name: string;
  entityType?: 'planet' | 'star' | 'nebula' | 'asteroid' | 'blackhole' | 'comet';
  onPlanetClick?: () => void;
}

// Utility to generate a canvas-based texture for different entity types
function useEntityTexture(entityType: string, type: string, color: string, size: number) {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    if (entityType === 'star') {
      // Star texture - bright center with rays
      const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
      grad.addColorStop(0, '#FFFFFF');
      grad.addColorStop(0.1, color);
      grad.addColorStop(0.3, color);
      grad.addColorStop(0.7, color + '80');
      grad.addColorStop(1, 'transparent');
      
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);
      
      // Add star rays
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const x1 = 256 + Math.cos(angle) * 50;
        const y1 = 256 + Math.sin(angle) * 50;
        const x2 = 256 + Math.cos(angle) * 200;
        const y2 = 256 + Math.sin(angle) * 200;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    } else if (entityType === 'nebula') {
      // Nebula texture - swirling clouds
      const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
      grad.addColorStop(0, color + 'FF');
      grad.addColorStop(0.3, color + 'CC');
      grad.addColorStop(0.6, color + '88');
      grad.addColorStop(1, 'transparent');
      
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);
      
      // Add swirling patterns
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const radius = Math.random() * 100 + 20;
        const alpha = Math.random() * 0.5 + 0.1;
        
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (entityType === 'blackhole') {
      // Black hole texture - dark center with accretion disk
      const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
      grad.addColorStop(0, '#000000');
      grad.addColorStop(0.1, '#1a1a1a');
      grad.addColorStop(0.3, '#333333');
      grad.addColorStop(0.7, '#666666');
      grad.addColorStop(1, 'transparent');
      
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);
      
      // Add accretion disk
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 3;
      for (let i = 0; i < 3; i++) {
        const radius = 100 + i * 30;
        ctx.beginPath();
        ctx.arc(256, 256, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (entityType === 'comet') {
      // Comet texture - icy core with tail
      const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 100);
      grad.addColorStop(0, '#FFFFFF');
      grad.addColorStop(0.3, color);
      grad.addColorStop(1, 'transparent');
      
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);
      
      // Add comet tail
      const tailGrad = ctx.createLinearGradient(256, 256, 0, 256);
      tailGrad.addColorStop(0, color + 'FF');
      tailGrad.addColorStop(1, 'transparent');
      
      ctx.fillStyle = tailGrad;
      ctx.fillRect(0, 200, 256, 112);
    } else if (entityType === 'asteroid') {
      // Asteroid texture - rocky surface
      const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
      grad.addColorStop(0, color);
      grad.addColorStop(0.7, color);
      grad.addColorStop(1, '#333333');
      
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);
      
      // Add craters and surface details
      for (let i = 0; i < 15; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const radius = Math.random() * 30 + 5;
        const alpha = Math.random() * 0.5 + 0.1;
        
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#222222';
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Planet texture (default)
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
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    
    return texture;
  }, [entityType, type, color, size]);
}

// Enhanced animated colors function
const getAnimatedColors = (entityType: string, type: string, time: number) => {
  if (entityType === 'star') {
    const starColors = {
      'yellow-dwarf': ['#FFD700', '#FFA500', '#FF8C00', '#FFD700'],
      'pulsar': ['#FF69B4', '#FF1493', '#FF007F', '#FF69B4'],
      'red-giant': ['#FF4500', '#FF6347', '#FF4500', '#FF6347'],
      'blue-supergiant': ['#00BFFF', '#1E90FF', '#4169E1', '#00BFFF']
    };
    const colors = starColors[type as keyof typeof starColors] || starColors['yellow-dwarf'];
    const phase = (time * 0.2) % colors.length;
    const index1 = Math.floor(phase);
    const index2 = (index1 + 1) % colors.length;
    const t = phase - index1;
    
    return colors.map((_, i) => {
      const color1 = new THREE.Color(colors[(index1 + i) % colors.length]);
      const color2 = new THREE.Color(colors[(index2 + i) % colors.length]);
      return color1.clone().lerp(color2, t);
    });
  } else if (entityType === 'nebula') {
    const nebulaColors = {
      'emission': ['#9370DB', '#8A2BE2', '#9400D3', '#9370DB'],
      'star-forming': ['#FF1493', '#FF69B4', '#FFB6C1', '#FF1493'],
      'planetary': ['#00CED1', '#40E0D0', '#48D1CC', '#00CED1']
    };
    const colors = nebulaColors[type as keyof typeof nebulaColors] || nebulaColors['emission'];
    const phase = (time * 0.1) % colors.length;
    const index1 = Math.floor(phase);
    const index2 = (index1 + 1) % colors.length;
    const t = phase - index1;
    
    return colors.map((_, i) => {
      const color1 = new THREE.Color(colors[(index1 + i) % colors.length]);
      const color2 = new THREE.Color(colors[(index2 + i) % colors.length]);
      return color1.clone().lerp(color2, t);
    });
  } else if (entityType === 'blackhole') {
    return [
      new THREE.Color('#000000'),
      new THREE.Color('#1a1a1a'),
      new THREE.Color('#333333'),
      new THREE.Color('#FFD700'),
      new THREE.Color('#FFA500')
    ];
  } else if (entityType === 'comet') {
    return [
      new THREE.Color('#FFFFFF'),
      new THREE.Color('#F0E68C'),
      new THREE.Color('#E6E6FA'),
      new THREE.Color('#FFFFFF'),
      new THREE.Color('#F0E68C')
    ];
  } else if (entityType === 'asteroid') {
    return [
      new THREE.Color('#8B4513'),
      new THREE.Color('#A0522D'),
      new THREE.Color('#CD853F'),
      new THREE.Color('#8B4513'),
      new THREE.Color('#A0522D')
    ];
  } else {
    // Planet colors (existing logic)
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
  }
};

export default function Planet({ position, size, color, type = 'terrestrial', name, entityType = 'planet', onPlanetClick }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [state, setState] = useState<{ clock?: { elapsedTime: number } }>({});

  const texture = useEntityTexture(entityType, type, color, size);
  const animatedColors = getAnimatedColors(entityType, type, state?.clock?.elapsedTime || 0);

  // Animation frame updates - simplified to prevent crashes
  useFrame((state) => {
    setState({ clock: state.clock });
    
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.008; // Normal planet rotation
      meshRef.current.rotation.x += 0.004; // Normal planet rotation
    }
  });

  const handleClick = (event: any) => {
    event.stopPropagation();
    setClicked(true);
    setTimeout(() => setClicked(false), 300);
    if (onPlanetClick) {
      onPlanetClick();
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
    document.body.style.cursor = 'default';
  };

  // Special effects for different entity types
  const renderSpecialEffects = () => {
    if (entityType === 'star') {
      return (
        <>
          {/* Star corona */}
          {[1.2, 1.4, 1.6, 1.8, 2.0].map((scale, index) => (
            <mesh key={`corona-${index}`}>
              <sphereGeometry args={[size * scale, 32, 32]} />
              <meshBasicMaterial
                color={animatedColors[index % animatedColors.length]}
                transparent
                opacity={0.3 - index * 0.05}
                blending={THREE.AdditiveBlending}
                side={THREE.BackSide}
              />
            </mesh>
          ))}
          
          {/* Star flares */}
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const x = Math.cos(angle) * size * 2;
            const z = Math.sin(angle) * size * 2;
            
            return (
              <mesh key={`flare-${i}`} position={[x, 0, z]}>
                <planeGeometry args={[size * 0.5, size * 2]} />
                <meshBasicMaterial
                  color={animatedColors[i % animatedColors.length]}
                  transparent
                  opacity={0.6}
                  blending={THREE.AdditiveBlending}
                  side={THREE.DoubleSide}
                />
              </mesh>
            );
          })}
        </>
      );
    } else if (entityType === 'nebula') {
      return (
        <>
          {/* Nebula clouds */}
          {Array.from({ length: 15 }, (_, i) => {
            const angle = (i / 15) * Math.PI * 2;
            const radius = size * 1.5 + Math.random() * size;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = (Math.random() - 0.5) * size * 0.5;
            
            return (
              <mesh key={`cloud-${i}`} position={[x, y, z]}>
                <sphereGeometry args={[size * 0.3, 16, 16]} />
                <meshBasicMaterial
                  color={animatedColors[i % animatedColors.length]}
                  transparent
                  opacity={0.4}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>
            );
          })}
        </>
      );
    } else if (entityType === 'blackhole') {
      return (
        <>
          {/* Event horizon */}
          <mesh>
            <sphereGeometry args={[size * 1.1, 32, 32]} />
            <meshBasicMaterial
              color="#000000"
              transparent
              opacity={0.8}
              side={THREE.BackSide}
            />
          </mesh>
          
          {/* Accretion disk */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[size * 1.2, size * 2.5, 64]} />
            <meshBasicMaterial
              color="#FFD700"
              transparent
              opacity={0.7}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
        </>
      );
    } else if (entityType === 'comet') {
      return (
        <>
          {/* Comet tail */}
          <mesh position={[-size * 2, 0, 0]}>
            <cylinderGeometry args={[0, size * 0.5, size * 4, 8]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.6}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
        </>
      );
    }
    
    return null;
  };

  return (
    <group ref={groupRef} position={position}>
      {/* Main Entity Body */}
      <mesh 
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        scale={clicked ? 1.1 : hovered ? 1.05 : 1}
      >
        <sphereGeometry args={[size, 128, 128]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Enhanced 3D Detail Layer - creates more depth */}
      <mesh>
        <sphereGeometry args={[size * 1.02, 96, 96]} />
        <meshBasicMaterial
          color={animatedColors[0]}
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>

      {/* Secondary Detail Layer */}
      <mesh>
        <sphereGeometry args={[size * 1.05, 64, 64]} />
        <meshBasicMaterial
          color={animatedColors[1]}
          transparent
          opacity={0.2}
          wireframe
        />
      </mesh>

      {/* Special Effects */}
      {renderSpecialEffects()}

      {/* Atmospheric Haze Layers - creates depth and atmosphere */}
      <mesh 
        userData={{ isAtmosphericHaze: true }}
      >
        <sphereGeometry args={[size * 1.2, 32, 32]} />
        <meshBasicMaterial
          color={animatedColors[0]}
          transparent
          opacity={0.04}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Enhanced Luminous Core - creates the vibrant yellow center point */}
      {[0.15, 0.25, 0.35, 0.45, 0.6, 0.8, 1.0].map((scale, index) => (
        <mesh key={`core-${index}`}>
          <sphereGeometry args={[size * scale, 24 + index * 4, 24 + index * 4]} />
          <meshBasicMaterial
            color={animatedColors[index % animatedColors.length]}
            transparent
            opacity={0.9 - index * 0.12}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {/* Pulsing Core Effect */}
      {[0.2, 0.4, 0.6].map((scale, index) => (
        <mesh key={`pulse-${index}`}>
          <sphereGeometry args={[size * scale, 32, 32]} />
          <meshBasicMaterial
            color={animatedColors[0]}
            transparent
            opacity={0.4 - index * 0.1}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {/* Enhanced Core Energy Particles - more vibrant center point effect */}
      {Array.from({ length: 35 }, (_, i) => {
        const angle = (i / 35) * Math.PI * 2;
        const radius = size * 0.3 + Math.random() * size * 0.4;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (Math.random() - 0.5) * size * 0.3;
        
        return (
          <mesh key={`core-particle-${i}`} position={[x, y, z]}>
            <sphereGeometry args={[0.02 + Math.random() * 0.01, 8, 8]} />
            <meshBasicMaterial
              color={animatedColors[i % animatedColors.length]}
              transparent
              opacity={0.8 + Math.random() * 0.2}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        );
      })}

      {/* Inner Core Glow */}
      {[0.1, 0.15, 0.2].map((scale, index) => (
        <mesh key={`inner-glow-${index}`}>
          <sphereGeometry args={[size * scale, 16, 16]} />
          <meshBasicMaterial
            color="#FFFF00"
            transparent
            opacity={1.0 - index * 0.3}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {/* Enhanced Hover Effect */}
      {hovered && (
        <>
          {/* Outer Hover Ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[size * 1.4, size * 1.6, 64]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
          
          {/* Hover Glow */}
          <mesh>
            <sphereGeometry args={[size * 1.3, 32, 32]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.2}
              side={THREE.BackSide}
            />
          </mesh>
        </>
      )}

      {/* Click Animation Effect */}
      {clicked && (
        <mesh>
          <sphereGeometry args={[size * 1.5, 32, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.4}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </group>
  );
} 