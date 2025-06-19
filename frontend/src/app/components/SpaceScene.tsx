'use client';

import React, { useRef, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
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
  entityType: 'planet';
}

const celestialEntities: CelestialEntity[] = [
  // 5 planets evenly spaced in a circle around the center
  // Each planet is positioned at 72 degrees apart (360° / 5 = 72°)
  // All planets are at the same distance (6 units) from center for visual balance
  
  // Terra Nova - at 0° (top) - Blue terrestrial world
  { id: 'terra-nova', position: [0, 0, -6] as [number, number, number], size: 0.8, color: '#4A90E2', type: 'terrestrial', name: 'Terra Nova', entityType: 'planet' },
  
  // Verdant Prime - at 72° (top-right) - Pink lush world
  { id: 'verdant-prime', position: [5.7, 0, -1.9] as [number, number, number], size: 1.0, color: '#FF69B4', type: 'terrestrial', name: 'Verdant Prime', entityType: 'planet' },
  
  // Cryo Sphere - at 144° (bottom-right) - Ice world
  { id: 'cryo-sphere', position: [3.5, 0, 4.9] as [number, number, number], size: 0.6, color: '#87CEEB', type: 'ice', name: 'Cryo Sphere', entityType: 'planet' },
  
  // Marina Deep - at 216° (bottom-left) - Ocean world
  { id: 'marina-deep', position: [-3.5, 0, 4.9] as [number, number, number], size: 0.9, color: '#20B2AA', type: 'ocean', name: 'Marina Deep', entityType: 'planet' },
  
  // Sahara Sands - at 288° (top-left) - Desert world
  { id: 'sahara-sands', position: [-5.7, 0, -1.9] as [number, number, number], size: 0.7, color: '#DAA520', type: 'desert', name: 'Sahara Sands', entityType: 'planet' },
];

// Camera animation component
function CameraController({ targetPlanet, isAnimating }: { targetPlanet: CelestialEntity | null, isAnimating: boolean }) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  
  useFrame(() => {
    if (targetPlanet && isAnimating) {
      // Calculate intimate zoom position (close to the planet)
      const zoomDistance = targetPlanet.size * 3; // Intimate distance based on planet size
      const targetPosition = new THREE.Vector3(...targetPlanet.position);
      
      // Smoothly animate camera to planet position
      camera.position.lerp(targetPosition.clone().add(new THREE.Vector3(0, 0, zoomDistance)), 0.02);
      camera.lookAt(targetPosition);
      
      // Update controls target
      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetPosition, 0.02);
      }
    }
  });
  
  return null;
}

function SpaceEnvironment({ onEntityClick }: { onEntityClick: (entity: CelestialEntity) => void }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
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
          onPlanetClick={() => onEntityClick(entity)}
        />
      ))}
    </group>
  );
}

export default function SpaceScene() {
  const [showInstructions, setShowInstructions] = useState(true);
  const [selectedEntity, setSelectedEntity] = useState<CelestialEntity | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleEntityClick = useCallback((entityData: CelestialEntity) => {
    setSelectedEntity(entityData);
    setIsAnimating(true);
    setIsChatOpen(true);
    
    // Stop animation after a delay to allow camera to settle
    setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
  }, []);

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setSelectedEntity(null);
    setIsAnimating(false);
  };

  return (
    <div className="w-full h-screen relative">
      <Canvas
        camera={{ position: [0, 0, 25], fov: 75 }}
        style={{ background: 'linear-gradient(to bottom, #0a0a0a, #1a1a2e, #16213e)' }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[30, 20, 20]} intensity={0.8} />
        <pointLight position={[-30, -20, -20]} intensity={0.6} />
        
        <Stars 
          radius={150} 
          depth={50} 
          count={5000} 
          factor={4} 
          saturation={0} 
          fade 
          speed={1}
        />
        
        <SpaceEnvironment onEntityClick={handleEntityClick} />
        
        <CameraController targetPlanet={selectedEntity} isAnimating={isAnimating} />
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxDistance={50}
          minDistance={5}
        />
      </Canvas>

      {/* Chat Interface - Now outside Canvas context */}
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

      {/* Instructions Overlay */}
      {showInstructions && (
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="bg-black/60 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 text-center">
            <p className="text-purple-300 text-sm">
              <span className="text-purple-400 font-semibold">✨ Interactive Space Experience:</span> Click on any planet to chat with its consciousness
            </p>
            <p className="text-purple-200 text-xs mt-1">
              Explore the 5 unique planets: Terra Nova (Blue), Verdant Prime (Pink), Cryo Sphere (Ice), Marina Deep (Ocean), Sahara Sands (Desert)
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