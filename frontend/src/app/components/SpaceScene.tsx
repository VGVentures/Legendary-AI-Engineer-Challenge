'use client';

import React, { useRef, useState } from 'react';
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

// Custom camera controller component with enhanced zoom and orbit functionality
function CameraController({ 
  targetPosition, 
  isZooming, 
  isChatOpen 
}: { 
  targetPosition: [number, number, number] | null, 
  isZooming: boolean,
  isChatOpen: boolean 
}) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const orbitAngleRef = useRef(0);
  const zoomProgressRef = useRef(0);
  const initialCameraPositionRef = useRef<THREE.Vector3 | null>(null);
  const initialTargetRef = useRef<THREE.Vector3 | null>(null);
  const baseOrbitPositionRef = useRef<THREE.Vector3 | null>(null);
  
  useFrame((state) => {
    if (isZooming && targetPosition && controlsRef.current) {
      const target = new THREE.Vector3(...targetPosition);
      
      // Store initial positions on first zoom
      if (initialCameraPositionRef.current === null) {
        initialCameraPositionRef.current = camera.position.clone();
        initialTargetRef.current = controlsRef.current.target.clone();
        zoomProgressRef.current = 0;
        orbitAngleRef.current = 0;
      }
      
      // Smooth zoom progress
      zoomProgressRef.current = Math.min(zoomProgressRef.current + 0.02, 1);
      
      // Calculate zoom distance based on planet size (closer for smaller planets)
      const planetSize = celestialEntities.find(e => 
        e.position[0] === targetPosition[0] && 
        e.position[1] === targetPosition[1] && 
        e.position[2] === targetPosition[2]
      )?.size || 0.8;
      const zoomDistance = 3 + (planetSize * 2); // Closer for larger planets
      
      // Calculate camera position for zoom
      const zoomCameraPosition = target.clone().add(new THREE.Vector3(0, 1.5, zoomDistance));
      
      // Smooth camera movement to zoom position
      if (initialCameraPositionRef.current) {
        camera.position.lerpVectors(initialCameraPositionRef.current, zoomCameraPosition, zoomProgressRef.current);
        controlsRef.current.target.lerpVectors(initialTargetRef.current!, target, zoomProgressRef.current);
      }
      
      // Once zoomed in and chat is open, maintain close position with some movement
      if (zoomProgressRef.current >= 1 && isChatOpen) {
        // Store base orbit position if not set
        if (baseOrbitPositionRef.current === null) {
          baseOrbitPositionRef.current = camera.position.clone();
        }
        
        // Allow very slow automatic orbiting
        orbitAngleRef.current += 0.003; // Even slower rotation
        
        const orbitRadius = zoomDistance;
        const orbitHeight = 1.5;
        
        // Calculate base orbit position
        const orbitX = target.x + Math.cos(orbitAngleRef.current) * orbitRadius;
        const orbitZ = target.z + Math.sin(orbitAngleRef.current) * orbitRadius;
        const orbitY = target.y + orbitHeight;
        
        const baseOrbitPosition = new THREE.Vector3(orbitX, orbitY, orbitZ);
        baseOrbitPositionRef.current = baseOrbitPosition;
        
        // Keep camera close to base orbit position but allow some drift
        camera.position.lerp(baseOrbitPosition, 0.01); // Very gentle pull back to base position
        controlsRef.current.target.lerp(target, 0.02);
        
        // Enable limited controls but with constraints
        controlsRef.current.enablePan = true;
        controlsRef.current.enableZoom = true;
        controlsRef.current.enableRotate = true;
        
        // Constrain movement to stay close to planet
        const distanceFromTarget = camera.position.distanceTo(target);
        const maxDistance = zoomDistance * 1.5; // Allow some movement but not too far
        
        if (distanceFromTarget > maxDistance) {
          // Pull camera back towards planet if it gets too far
          const direction = camera.position.clone().sub(target).normalize();
          const constrainedPosition = target.clone().add(direction.multiplyScalar(maxDistance));
          camera.position.lerp(constrainedPosition, 0.1);
        }
        
        // Keep minimum distance
        const minDistance = zoomDistance * 0.8;
        if (distanceFromTarget < minDistance) {
          const direction = camera.position.clone().sub(target).normalize();
          const constrainedPosition = target.clone().add(direction.multiplyScalar(minDistance));
          camera.position.lerp(constrainedPosition, 0.1);
        }
      }
    } else {
      // Reset when not zooming
      if (initialCameraPositionRef.current !== null) {
        initialCameraPositionRef.current = null;
        initialTargetRef.current = null;
        baseOrbitPositionRef.current = null;
        zoomProgressRef.current = 0;
        orbitAngleRef.current = 0;
        
        // Re-enable full controls
        if (controlsRef.current) {
          controlsRef.current.enablePan = true;
          controlsRef.current.enableZoom = true;
          controlsRef.current.enableRotate = true;
        }
      }
    }
  });

  return (
    <OrbitControls 
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      maxDistance={isChatOpen ? 8 : 50} // Limit max distance when chatting
      minDistance={isChatOpen ? 2 : 3} // Keep closer minimum when chatting
      dampingFactor={0.05}
      enableDamping={true}
    />
  );
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
  const [targetPosition, setTargetPosition] = useState<[number, number, number] | null>(null);
  const [isZooming, setIsZooming] = useState(false);

  const handleEntityClick = (entityData: CelestialEntity) => {
    setSelectedEntity(entityData);
    setIsChatOpen(true);
    
    // Set target position for camera zoom
    setTargetPosition(entityData.position);
    setIsZooming(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setSelectedEntity(null);
    
    // Reset camera zoom
    setIsZooming(false);
    setTargetPosition(null);
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
        
        <CameraController 
          targetPosition={targetPosition} 
          isZooming={isZooming} 
          isChatOpen={isChatOpen}
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