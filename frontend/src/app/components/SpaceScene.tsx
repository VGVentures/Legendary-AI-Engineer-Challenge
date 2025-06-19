'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import Planet from './Planet';
import ChatInterface from './ChatInterface';

interface PlanetData {
  name: string;
  type: string;
  color: string;
}

const planets = [
  { position: [5, 0, 0] as [number, number, number], size: 0.8, color: '#4A90E2', type: 'terrestrial' as const, name: 'Terra Nova' },
  { position: [-4, 2, 3] as [number, number, number], size: 1.2, color: '#FF6B6B', type: 'gas' as const, name: 'Nebula Prime' },
  { position: [3, -1, -2] as [number, number, number], size: 0.6, color: '#87CEEB', type: 'ice' as const, name: 'Cryo Sphere' },
  { position: [-2, -2, 1] as [number, number, number], size: 0.9, color: '#20B2AA', type: 'ocean' as const, name: 'Marina Deep' },
  { position: [1, 3, -1] as [number, number, number], size: 0.7, color: '#DAA520', type: 'desert' as const, name: 'Sahara Sands' },
];

function SpaceEnvironment() {
  const groupRef = useRef<THREE.Group>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  const handlePlanetClick = (planetData: PlanetData) => {
    setSelectedPlanet(planetData);
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setSelectedPlanet(null);
  };

  return (
    <>
      <group ref={groupRef}>
        {planets.map((planet, index) => (
          <Planet
            key={index}
            position={planet.position}
            size={planet.size}
            color={planet.color}
            type={planet.type}
            name={planet.name}
            onPlanetClick={handlePlanetClick}
          />
        ))}
      </group>

      {/* Chat Interface */}
      {selectedPlanet && (
        <ChatInterface
          isOpen={isChatOpen}
          onClose={handleCloseChat}
          planetName={selectedPlanet.name}
          planetType={selectedPlanet.type}
          planetColor={selectedPlanet.color}
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
        camera={{ position: [0, 0, 10], fov: 75 }}
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
          maxDistance={20}
          minDistance={3}
        />
      </Canvas>

      {/* Instructions Overlay */}
      {showInstructions && (
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="bg-black/60 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 text-center">
            <p className="text-purple-300 text-sm">
              <span className="text-purple-400 font-semibold">✨ Interactive Experience:</span> Click on any planet to chat with its entity
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