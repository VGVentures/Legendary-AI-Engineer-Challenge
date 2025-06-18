'use client';

import React, { useRef, useMemo } from 'react';
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
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const cloudRef = useRef<THREE.Mesh>(null);

  // Create realistic planet texture
  const planetTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Base color
    const baseColor = new THREE.Color(color);
    ctx.fillStyle = `rgb(${Math.floor(baseColor.r * 255)}, ${Math.floor(baseColor.g * 255)}, ${Math.floor(baseColor.b * 255)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add terrain variations based on planet type
    switch (type) {
      case 'terrestrial':
        // Add continents and oceans
        for (let i = 0; i < 8; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const radius = 20 + Math.random() * 60;
          
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
          const variation = 0.3 + Math.random() * 0.4;
          gradient.addColorStop(0, `rgb(${Math.floor(baseColor.r * 255 * variation)}, ${Math.floor(baseColor.g * 255 * variation)}, ${Math.floor(baseColor.b * 255 * variation)})`);
          gradient.addColorStop(1, 'transparent');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      
      case 'gas':
        // Add swirling bands
        for (let i = 0; i < 6; i++) {
          const y = (i / 6) * canvas.height;
          const height = 20 + Math.random() * 40;
          
          const gradient = ctx.createLinearGradient(0, y, 0, y + height);
          const variation = 0.4 + Math.random() * 0.6;
          gradient.addColorStop(0, `rgb(${Math.floor(baseColor.r * 255 * variation)}, ${Math.floor(baseColor.g * 255 * variation)}, ${Math.floor(baseColor.b * 255 * variation)})`);
          gradient.addColorStop(1, 'transparent');
          
          ctx.fillStyle = gradient;
          ctx.fillRect(0, y, canvas.width, height);
        }
        break;
      
      case 'ice':
        // Add ice caps and polar regions
        const iceColor = new THREE.Color(0.9, 0.95, 1.0);
        ctx.fillStyle = `rgb(${Math.floor(iceColor.r * 255)}, ${Math.floor(iceColor.g * 255)}, ${Math.floor(iceColor.b * 255)})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height * 0.15);
        ctx.fillRect(0, canvas.height * 0.85, canvas.width, canvas.height * 0.15);
        break;
      
      case 'ocean':
        // Add ocean currents and waves
        for (let i = 0; i < 12; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const radius = 30 + Math.random() * 80;
          
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
          const variation = 0.6 + Math.random() * 0.4;
          gradient.addColorStop(0, `rgb(${Math.floor(baseColor.r * 255 * variation)}, ${Math.floor(baseColor.g * 255 * variation)}, ${Math.floor(baseColor.b * 255 * variation)})`);
          gradient.addColorStop(1, 'transparent');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      
      case 'desert':
        // Add sand dunes and desert features
        for (let i = 0; i < 15; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const width = 20 + Math.random() * 60;
          const height = 10 + Math.random() * 30;
          
          const gradient = ctx.createLinearGradient(x, y, x + width, y);
          const variation = 0.5 + Math.random() * 0.5;
          gradient.addColorStop(0, `rgb(${Math.floor(baseColor.r * 255 * variation)}, ${Math.floor(baseColor.g * 255 * variation)}, ${Math.floor(baseColor.b * 255 * variation)})`);
          gradient.addColorStop(1, 'transparent');
          
          ctx.fillStyle = gradient;
          ctx.fillRect(x, y, width, height);
        }
        break;
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    return texture;
  }, [color, type]);

  // Create normal map for surface detail
  const normalMap = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    
    // Create noise pattern for surface roughness
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const noise = Math.random();
      imageData.data[i] = noise * 255;     // R
      imageData.data[i + 1] = noise * 255; // G
      imageData.data[i + 2] = 255;         // B (normal map convention)
      imageData.data[i + 3] = 255;         // A
    }
    ctx.putImageData(imageData, 0, 0);
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  // Create cloud texture
  const cloudTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    
    // Create cloud patterns
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = 10 + Math.random() * 40;
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += 0.001;
      atmosphereRef.current.rotation.z += 0.0005;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x += 0.001;
    }
    if (cloudRef.current) {
      cloudRef.current.rotation.y += 0.003;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0005;
    }
  });

  // Create atmospheric particles
  const particleCount = 50;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  
  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2;
    const radius = size * 1.3 + Math.random() * size * 0.7;
    const height = (Math.random() - 0.5) * size * 0.4;
    
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = height;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
    
    // Use planet color with variations
    const colorObj = new THREE.Color(color);
    colors[i * 3] = colorObj.r * (0.7 + Math.random() * 0.6);
    colors[i * 3 + 1] = colorObj.g * (0.7 + Math.random() * 0.6);
    colors[i * 3 + 2] = colorObj.b * (0.7 + Math.random() * 0.6);
    
    sizes[i] = size * 0.05 + Math.random() * size * 0.1;
  }

  return (
    <group position={position}>
      {/* Main planet with realistic materials */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 64, 64]} />
        <meshPhysicalMaterial 
          map={planetTexture}
          normalMap={normalMap}
          normalScale={[0.1, 0.1]}
          metalness={0.1}
          roughness={0.8}
          clearcoat={0.3}
          clearcoatRoughness={0.2}
          envMapIntensity={0.5}
        />
      </mesh>

      {/* Cloud layer */}
      <mesh ref={cloudRef}>
        <sphereGeometry args={[size * 1.02, 32, 32]} />
        <meshBasicMaterial
          map={cloudTexture}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Atmospheric scattering - inner layer */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[size * 1.05, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Atmospheric scattering - outer layer */}
      <mesh>
        <sphereGeometry args={[size * 1.15, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.08}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Ring system with multiple layers */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[size * 1.4, size * 2.5, 128]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[size * 1.5, size * 2.0, 128]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[size * 2.6, size * 3.0, 128]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Atmospheric particles */}
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
          <bufferAttribute
            attach="attributes-size"
            count={particleCount}
            array={sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1}
          vertexColors
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          sizeAttenuation={true}
        />
      </points>

      {/* Planet's own light source */}
      <pointLight
        color={color}
        intensity={0.3}
        distance={size * 4}
        decay={2}
      />

      {/* Rim lighting for dramatic effect */}
      <spotLight
        color={color}
        intensity={0.2}
        distance={size * 6}
        angle={Math.PI / 4}
        penumbra={0.5}
        decay={2}
        position={[size * 2, size * 2, size * 2]}
        target={meshRef.current || undefined}
      />
    </group>
  );
} 