'use client';

import React, { useRef, useState, useEffect } from 'react';
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

// Responsive planet positioning based on screen size
const getResponsivePlanetPositions = (screenSize: 'mobile' | 'tablet' | 'desktop') => {
  const baseDistance = screenSize === 'mobile' ? 4 : screenSize === 'tablet' ? 5 : 6;
  const heightOffset = screenSize === 'mobile' ? 0.5 : 0;
  
  return [
    // Terra Nova - at 0° (top) - Blue terrestrial world
    { id: 'terra-nova', position: [0, heightOffset, -baseDistance] as [number, number, number], size: screenSize === 'mobile' ? 0.6 : screenSize === 'tablet' ? 0.7 : 0.8, color: '#4A90E2', type: 'terrestrial', name: 'Terra Nova', entityType: 'planet' as const },
    
    // Verdant Prime - at 72° (top-right) - Pink lush world
    { id: 'verdant-prime', position: [baseDistance * 0.95, heightOffset, -baseDistance * 0.31] as [number, number, number], size: screenSize === 'mobile' ? 0.8 : screenSize === 'tablet' ? 0.9 : 1.0, color: '#FF69B4', type: 'terrestrial', name: 'Verdant Prime', entityType: 'planet' as const },
    
    // Cryo Sphere - at 144° (bottom-right) - Ice world
    { id: 'cryo-sphere', position: [baseDistance * 0.59, heightOffset, baseDistance * 0.81] as [number, number, number], size: screenSize === 'mobile' ? 0.4 : screenSize === 'tablet' ? 0.5 : 0.6, color: '#87CEEB', type: 'ice', name: 'Cryo Sphere', entityType: 'planet' as const },
    
    // Marina Deep - at 216° (bottom-left) - Ocean world
    { id: 'marina-deep', position: [-baseDistance * 0.59, heightOffset, baseDistance * 0.81] as [number, number, number], size: screenSize === 'mobile' ? 0.7 : screenSize === 'tablet' ? 0.8 : 0.9, color: '#20B2AA', type: 'ocean', name: 'Marina Deep', entityType: 'planet' as const },
    
    // Sahara Sands - at 288° (top-left) - Desert world
    { id: 'sahara-sands', position: [-baseDistance * 0.95, heightOffset, -baseDistance * 0.31] as [number, number, number], size: screenSize === 'mobile' ? 0.5 : screenSize === 'tablet' ? 0.6 : 0.7, color: '#DAA520', type: 'desert', name: 'Sahara Sands', entityType: 'planet' as const },
  ];
};

// Custom camera controller component with enhanced zoom and orbit functionality
function CameraController({ 
  targetPosition, 
  isZooming, 
  isChatOpen,
  screenSize
}: { 
  targetPosition: [number, number, number] | null, 
  isZooming: boolean,
  isChatOpen: boolean,
  screenSize: 'mobile' | 'tablet' | 'desktop'
}) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const orbitAngleRef = useRef(0);
  const zoomProgressRef = useRef(0);
  const initialCameraPositionRef = useRef<THREE.Vector3 | null>(null);
  const initialTargetRef = useRef<THREE.Vector3 | null>(null);
  const baseOrbitPositionRef = useRef<THREE.Vector3 | null>(null);
  
  // Responsive camera settings
  const getResponsiveCameraSettings = () => {
    switch (screenSize) {
      case 'mobile':
        return {
          maxDistance: isChatOpen ? 6 : 30,
          minDistance: isChatOpen ? 1.5 : 2,
          zoomDistance: 2.5,
          orbitHeight: 1.2
        };
      case 'tablet':
        return {
          maxDistance: isChatOpen ? 7 : 40,
          minDistance: isChatOpen ? 2 : 2.5,
          zoomDistance: 3.5,
          orbitHeight: 1.3
        };
      default: // desktop
        return {
          maxDistance: isChatOpen ? 8 : 50,
          minDistance: isChatOpen ? 2 : 3,
          zoomDistance: 3 + (targetPosition ? 2 : 0),
          orbitHeight: 1.5
        };
    }
  };
  
  const cameraSettings = getResponsiveCameraSettings();
  
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
      
      // Calculate zoom distance based on planet size and screen size
      const planetSize = getResponsivePlanetPositions(screenSize).find(e => 
        e.position[0] === targetPosition[0] && 
        e.position[1] === targetPosition[1] && 
        e.position[2] === targetPosition[2]
      )?.size || 0.8;
      const zoomDistance = cameraSettings.zoomDistance + (planetSize * 1.5);
      
      // Calculate camera position for zoom
      const zoomCameraPosition = target.clone().add(new THREE.Vector3(0, cameraSettings.orbitHeight, zoomDistance));
      
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
        const orbitHeight = cameraSettings.orbitHeight;
        
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
      maxDistance={cameraSettings.maxDistance}
      minDistance={cameraSettings.minDistance}
      dampingFactor={0.05}
      enableDamping={true}
    />
  );
}

function SpaceEnvironment({ 
  onEntityClick, 
  screenSize 
}: { 
  onEntityClick: (entity: CelestialEntity) => void;
  screenSize: 'mobile' | 'tablet' | 'desktop';
}) {
  const groupRef = useRef<THREE.Group>(null);
  const celestialEntities = getResponsivePlanetPositions(screenSize);

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
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  // Responsive screen size detection
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    handleResize(); // Set initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive camera settings
  const getResponsiveCameraConfig = () => {
    switch (screenSize) {
      case 'mobile':
        return { position: [0, 0, 20], fov: 70 };
      case 'tablet':
        return { position: [0, 0, 22], fov: 72 };
      default: // desktop
        return { position: [0, 0, 25], fov: 75 };
    }
  };

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

  const cameraConfig = getResponsiveCameraConfig();

  return (
    <div className="w-full h-screen relative">
      <Canvas
        camera={cameraConfig}
        style={{ background: 'linear-gradient(to bottom, #0a0a0a, #1a1a2e, #16213e)' }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[30, 20, 20]} intensity={0.8} />
        <pointLight position={[-30, -20, -20]} intensity={0.6} />
        
        <Stars 
          radius={screenSize === 'mobile' ? 100 : screenSize === 'tablet' ? 120 : 150} 
          depth={screenSize === 'mobile' ? 30 : screenSize === 'tablet' ? 40 : 50} 
          count={screenSize === 'mobile' ? 3000 : screenSize === 'tablet' ? 4000 : 5000} 
          factor={4} 
          saturation={0} 
          fade 
          speed={1}
        />
        
        <SpaceEnvironment onEntityClick={handleEntityClick} screenSize={screenSize} />
        
        <CameraController 
          targetPosition={targetPosition} 
          isZooming={isZooming} 
          isChatOpen={isChatOpen}
          screenSize={screenSize}
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
          screenSize={screenSize}
        />
      )}

      {/* Responsive Instructions Overlay */}
      {showInstructions && (
        <div className="absolute top-2 left-2 right-2 sm:top-4 sm:left-4 sm:right-4 z-10">
          <div className="bg-black/60 backdrop-blur-sm border border-purple-500/30 rounded-lg p-3 sm:p-4 text-center">
            <p className="text-purple-300 text-xs sm:text-sm">
              <span className="text-purple-400 font-semibold">✨ Interactive Space Experience:</span> 
              <span className="hidden sm:inline"> Click on any planet to chat with its consciousness</span>
              <span className="sm:hidden"> Tap any planet to chat</span>
            </p>
            <p className="text-purple-200 text-xs mt-1 hidden sm:block">
              Explore the 5 unique planets: Terra Nova (Blue), Verdant Prime (Pink), Cryo Sphere (Ice), Marina Deep (Ocean), Sahara Sands (Desert)
            </p>
            <p className="text-purple-200 text-xs mt-1 sm:hidden">
              Explore 5 unique planets with distinct personalities
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