'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import Planet from './Planet';
import ChatInterface from './ChatInterface';

interface CelestialEntity {
  id: string;
  name: string;
  type: string;
  color: string;
  position: [number, number, number];
  size: number;
  entityType: 'planet' | 'star' | 'nebula' | 'asteroid' | 'blackhole' | 'comet';
}

const celestialEntities: CelestialEntity[] = [
  // Planets
  { id: 'terra-nova', position: [5, 0, 0] as [number, number, number], size: 0.8, color: '#4A90E2', type: 'terrestrial', name: 'Terra Nova', entityType: 'planet' },
  { id: 'nebula-prime', position: [-4, 2, 3] as [number, number, number], size: 1.2, color: '#FF6B6B', type: 'gas', name: 'Nebula Prime', entityType: 'planet' },
  { id: 'cryo-sphere', position: [3, -1, -2] as [number, number, number], size: 0.6, color: '#87CEEB', type: 'ice', name: 'Cryo Sphere', entityType: 'planet' },
  { id: 'marina-deep', position: [-2, -2, 1] as [number, number, number], size: 0.9, color: '#20B2AA', type: 'ocean', name: 'Marina Deep', entityType: 'planet' },
  { id: 'sahara-sands', position: [1, 3, -1] as [number, number, number], size: 0.7, color: '#DAA520', type: 'desert', name: 'Sahara Sands', entityType: 'planet' },
  
  // Stars
  { id: 'solaris', position: [8, 4, 2] as [number, number, number], size: 1.5, color: '#FFD700', type: 'yellow-dwarf', name: 'Solaris', entityType: 'star' },
  { id: 'nova-pulsar', position: [-6, -3, 4] as [number, number, number], size: 0.4, color: '#FF69B4', type: 'pulsar', name: 'Nova Pulsar', entityType: 'star' },
  { id: 'red-giant', position: [2, 6, -3] as [number, number, number], size: 2.0, color: '#FF4500', type: 'red-giant', name: 'Red Giant', entityType: 'star' },
  { id: 'blue-supergiant', position: [-7, 1, -4] as [number, number, number], size: 1.8, color: '#00BFFF', type: 'blue-supergiant', name: 'Blue Supergiant', entityType: 'star' },
  
  // Nebulae - repositioned away from center
  { id: 'cosmic-cloud', position: [4, 8, 2] as [number, number, number], size: 3.0, color: '#9370DB', type: 'emission', name: 'Cosmic Cloud', entityType: 'nebula' },
  { id: 'stellar-nursery', position: [-8, -6, 2] as [number, number, number], size: 2.5, color: '#FF1493', type: 'star-forming', name: 'Stellar Nursery', entityType: 'nebula' },
  { id: 'planetary-nebula', position: [6, -4, -5] as [number, number, number], size: 2.2, color: '#00CED1', type: 'planetary', name: 'Planetary Nebula', entityType: 'nebula' },
  
  // Asteroids
  { id: 'asteroid-belt', position: [4, -3, 3] as [number, number, number], size: 0.3, color: '#8B4513', type: 'carbonaceous', name: 'Asteroid Belt', entityType: 'asteroid' },
  { id: 'metallic-asteroid', position: [-3, 5, -2] as [number, number, number], size: 0.2, color: '#C0C0C0', type: 'metallic', name: 'Metallic Asteroid', entityType: 'asteroid' },
  
  // Black Holes - repositioned away from center
  { id: 'void-singularity', position: [3, -8, 2] as [number, number, number], size: 1.0, color: '#000000', type: 'stellar', name: 'Void Singularity', entityType: 'blackhole' },
  { id: 'cosmic-abyss', position: [-5, -5, -6] as [number, number, number], size: 0.8, color: '#1a1a1a', type: 'supermassive', name: 'Cosmic Abyss', entityType: 'blackhole' },
  
  // Comets
  { id: 'cosmic-wanderer', position: [7, 2, 5] as [number, number, number], size: 0.4, color: '#F0E68C', type: 'long-period', name: 'Cosmic Wanderer', entityType: 'comet' },
  { id: 'ice-traveler', position: [-1, 7, -4] as [number, number, number], size: 0.3, color: '#E6E6FA', type: 'short-period', name: 'Ice Traveler', entityType: 'comet' },
];

function SpaceEnvironment() {
  const groupRef = useRef<THREE.Group>(null);
  const [selectedEntity, setSelectedEntity] = useState<CelestialEntity | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  const handleEntityClick = (entityData: CelestialEntity) => {
    setSelectedEntity(entityData);
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setSelectedEntity(null);
  };

  return (
    <>
      <group ref={groupRef}>
        {celestialEntities.map((entity) => (
          <Planet
            key={entity.id}
            position={entity.position}
            size={entity.size}
            color={entity.color}
            type={entity.type}
            name={entity.name}
            entityType={entity.entityType}
            onPlanetClick={() => handleEntityClick(entity)}
          />
        ))}
      </group>

      {/* Chat Interface */}
      {selectedEntity && (
        <ChatInterface
          isOpen={isChatOpen}
          onClose={handleCloseChat}
          planetName={selectedEntity.name}
          planetType={selectedEntity.type}
          planetColor={selectedEntity.color}
          entityType={selectedEntity.entityType}
        />
      )}
    </>
  );
}

export default function SpaceScene() {
  const [showInstructions, setShowInstructions] = useState(true);

  return (
    <div className="w-full h-screen relative">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 75 }}
        style={{ background: 'linear-gradient(to bottom, #0a0a0a, #1a1a2e, #16213e)' }}
      >
        <ambientLight intensity={0.1} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4A90E2" />
        
        <Stars 
          radius={100} 
          depth={50} 
          count={5000} 
          factor={4} 
          saturation={0} 
          fade 
          speed={1}
        />
        
        <SpaceEnvironment />
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxDistance={25}
          minDistance={3}
        />
      </Canvas>

      {/* Instructions Overlay */}
      {showInstructions && (
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="bg-black/60 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 text-center">
            <p className="text-purple-300 text-sm">
              <span className="text-purple-400 font-semibold">✨ Interactive Space Experience:</span> Click on any celestial entity to chat with its consciousness
            </p>
            <p className="text-purple-200 text-xs mt-1">
              Planets • Stars • Nebulae • Asteroids • Black Holes • Comets
            </p>
            <button
              onClick={() => setShowInstructions(false)}
              className="mt-2 text-xs text-purple-400 hover:text-purple-300 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 