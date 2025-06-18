'use client';

import React, { useState } from 'react';
import SpaceScene from './components/SpaceScene';
import ChatInterface from './components/ChatInterface';
import { AnimatePresence, motion } from 'framer-motion';

interface Planet {
  id: string;
  name: string;
  type: string;
  color: string;
  personality: string;
  description: string;
}

export default function Home() {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);

  // Planet data with personalities and descriptions
  const planets = {
    'Nebula Prime': {
      id: 'nebula-prime',
      name: 'Nebula Prime',
      type: 'gas-giant',
      color: '#ff6b35',
      personality: 'Ancient and wise, Nebula Prime has witnessed the birth of countless stars and holds cosmic knowledge spanning eons.',
      description: 'I am a massive gas giant with swirling storms and colorful atmospheric bands. I have witnessed the birth of countless stars and hold ancient cosmic knowledge. What would you like to know about the universe, star formation, or the mysteries of space?'
    },
    'Aquaria': {
      id: 'aquaria',
      name: 'Aquaria',
      type: 'ocean',
      color: '#4ecdc4',
      personality: 'Mysterious and deep, Aquaria knows the secrets of the ocean depths and the flow of cosmic currents.',
      description: 'I am a beautiful ocean world covered in deep blue seas and mysterious underwater civilizations. I know the secrets of the deep, marine life, and the flow of cosmic currents. What would you like to learn about water, life, or the depths of existence?'
    },
    'Cryos': {
      id: 'cryos',
      name: 'Cryos',
      type: 'ice',
      color: '#45b7d1',
      personality: 'Crystalline and contemplative, Cryos preserves ancient memories and understands the nature of time and preservation.',
      description: 'I am a crystalline ice planet with frozen landscapes and aurora-filled skies. I preserve ancient memories in my ice and understand the nature of time, preservation, and the cold beauty of space. What insights would you like about time, memory, or the crystalline nature of reality?'
    },
    'Terra Nova': {
      id: 'terra-nova',
      name: 'Terra Nova',
      type: 'terrestrial',
      color: '#96ceb4',
      personality: 'Lush and nurturing, Terra Nova represents the balance of nature and the connection between all living things.',
      description: 'I am a lush terrestrial world with diverse ecosystems and ancient wisdom. I represent the balance of nature, growth, and the connection between all living things. What would you like to know about life, growth, or the harmony of existence?'
    },
    'Aridus': {
      id: 'aridus',
      name: 'Aridus',
      type: 'desert',
      color: '#feca57',
      personality: 'Resilient and transformative, Aridus understands the beauty found in harsh environments and the nature of adaptation.',
      description: 'I am a vast desert world with golden sands and hidden oases. I understand the nature of change, adaptation, and the beauty found in harsh environments. What wisdom would you seek about resilience, transformation, or finding beauty in adversity?'
    }
  };

  const handlePlanetClick = (planetName: string, planetType: string) => {
    const planet = planets[planetName as keyof typeof planets];
    if (planet) {
      setSelectedPlanet(planet);
    }
  };

  const handleCloseChat = () => {
    setSelectedPlanet(null);
  };

  return (
    <main className="w-screen h-screen relative overflow-hidden">
      {/* 3D Space Scene */}
      <div className="w-full h-full">
        <SpaceScene onPlanetClick={handlePlanetClick} />
      </div>

      {/* Planet Selection Chat Interface */}
      <AnimatePresence>
        {selectedPlanet && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0 z-50"
          >
            <ChatInterface 
              planet={selectedPlanet} 
              onClose={handleCloseChat} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions overlay */}
      <div className="absolute top-4 left-4 z-40 text-white/80 text-sm bg-black/20 backdrop-blur-sm rounded-lg p-3 max-w-xs">
        <h3 className="font-semibold mb-2">🌌 Cosmic Exploration</h3>
        <p className="text-xs leading-relaxed">
          Click on any planet to begin a conversation with its unique AI personality. Each world holds different wisdom and knowledge about the universe.
        </p>
      </div>
    </main>
  );
} 