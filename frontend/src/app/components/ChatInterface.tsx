'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  planetName: string;
  planetType: string;
  planetColor: string;
  entityType?: 'planet' | 'star' | 'nebula' | 'asteroid' | 'blackhole' | 'comet';
}

// AI Personalities for different entity types
const getEntityPersonality = (entityType: string, name: string, type: string) => {
  const basePersonalities = {
    planet: {
      greeting: `Greetings, traveler! I am ${name}, a ${type} world. I have witnessed countless cycles of life and change across the cosmos.`,
      responses: [
        "My surface tells stories of ancient times, of cosmic events that shaped my very being.",
        "I am home to countless forms of life, each adapting to my unique environment.",
        "My atmosphere and geology create a delicate balance that sustains existence.",
        "I orbit my star in perfect harmony, part of a grand celestial dance.",
        "My magnetic field protects life from the harsh radiation of space.",
        "I have seen comets pass by and meteor showers paint my sky with light.",
        "My seasons change as I journey around my star, creating cycles of renewal.",
        "I am both ancient and ever-changing, a testament to cosmic evolution."
      ]
    },
    star: {
      greeting: `I am ${name}, a ${type} star. I burn with the fire of creation, fusing elements in my core to illuminate the cosmos.`,
      responses: [
        "My nuclear fusion creates the energy that sustains life across my system.",
        "I am a cosmic forge, creating heavier elements from the simplest atoms.",
        "My light travels across space, reaching worlds far beyond my immediate influence.",
        "I have witnessed the birth and death of countless celestial bodies.",
        "My solar winds shape the space around me, creating protective bubbles.",
        "I am both destroyer and creator, my radiation both harmful and life-giving.",
        "My gravity holds entire planetary systems in perfect orbital harmony.",
        "I will one day expand, then collapse, returning my elements to the cosmos."
      ]
    },
    nebula: {
      greeting: `I am ${name}, a ${type} nebula. I am the cosmic nursery where stars are born, and the beautiful remnants of stellar death.`,
      responses: [
        "I am a stellar nursery, where gravity pulls gas and dust into new suns.",
        "My colorful clouds are the birthplaces of future planetary systems.",
        "I contain the building blocks of life, complex molecules floating in space.",
        "My beauty comes from the death of ancient stars, their material enriching the cosmos.",
        "I am constantly changing, shaped by stellar winds and radiation.",
        "My gases glow with the energy of nearby stars, creating cosmic art.",
        "I am a bridge between stellar generations, recycling cosmic material.",
        "My vastness contains mysteries that even the most advanced civilizations cannot fully comprehend."
      ]
    },
    asteroid: {
      greeting: `I am ${name}, a ${type} asteroid. I am a remnant of the early solar system, a witness to the formation of planets.`,
      responses: [
        "I am a time capsule, containing material from the birth of the solar system.",
        "My composition tells the story of cosmic collisions and planetary formation.",
        "I am rich in valuable minerals and metals, resources for future civilizations.",
        "My orbit is a reminder of the chaotic early days of planetary formation.",
        "I have witnessed countless impacts and cosmic events throughout history.",
        "My surface is scarred by millions of years of space weathering.",
        "I am both a threat and an opportunity, depending on my trajectory.",
        "My small size belies my importance in understanding cosmic history."
      ]
    },
    blackhole: {
      greeting: `I am ${name}, a ${type} black hole. I am the ultimate mystery of space, where the laws of physics break down.`,
      responses: [
        "My event horizon is the point of no return, where space and time become one.",
        "I am not a hole, but a region where gravity is so strong that nothing can escape.",
        "My accretion disk glows with the energy of matter falling into my grasp.",
        "I warp the very fabric of spacetime around me, creating cosmic distortions.",
        "I am both destroyer and creator, my gravity can tear stars apart or help form new ones.",
        "My singularity contains secrets that challenge our understanding of reality.",
        "I am a cosmic recycler, returning matter to its most basic form.",
        "My existence proves that the universe is stranger than we can imagine."
      ]
    },
    comet: {
      greeting: `I am ${name}, a ${type} comet. I am a cosmic wanderer, traveling vast distances through space on ancient orbits.`,
      responses: [
        "My tail is created by the sun's heat, turning my icy surface into gas and dust.",
        "I am a time traveler, carrying material from the early solar system.",
        "My orbit takes me from the outer reaches of space to close encounters with stars.",
        "I am a cosmic messenger, bringing water and organic compounds to inner planets.",
        "My beauty is fleeting, visible only when I approach a star's warmth.",
        "I am both predictable and unpredictable, following orbital laws but with surprises.",
        "My composition contains clues about the formation of the solar system.",
        "I am a reminder that the cosmos is in constant motion and change."
      ]
    }
  };

  return basePersonalities[entityType as keyof typeof basePersonalities] || basePersonalities.planet;
};

// Enhanced visual styling for different entity types with planet-specific assets
const getEntityStyling = (entityType: string, color: string, planetType: string, planetName: string) => {
  // Create planet-specific color variations
  const baseColor = new THREE.Color(color);
  const lighterColor = baseColor.clone().multiplyScalar(1.3).getHexString();
  const darkerColor = baseColor.clone().multiplyScalar(0.7).getHexString();
  const complementaryColor = baseColor.clone().offsetHSL(180, 0, 0).getHexString();
  
  const baseStyles = {
    planet: {
      // Planet-specific styling based on planet type and name
      background: (() => {
        switch (planetType) {
          case 'terrestrial':
            if (planetName === 'Terra Nova') {
              return `linear-gradient(135deg, rgba(74,144,226,0.15) 0%, rgba(20,20,40,0.95) 50%, rgba(74,144,226,0.1) 100%)`;
            } else if (planetName === 'Verdant Prime') {
              return `linear-gradient(135deg, rgba(255,105,180,0.15) 0%, rgba(20,20,40,0.95) 50%, rgba(255,105,180,0.1) 100%)`;
            }
            return `linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(20,20,40,0.95) 100%)`;
          case 'ice':
            return `linear-gradient(135deg, rgba(135,206,235,0.15) 0%, rgba(20,20,40,0.95) 50%, rgba(135,206,235,0.1) 100%)`;
          case 'ocean':
            return `linear-gradient(135deg, rgba(32,178,170,0.15) 0%, rgba(20,20,40,0.95) 50%, rgba(32,178,170,0.1) 100%)`;
          case 'desert':
            return `linear-gradient(135deg, rgba(218,165,32,0.15) 0%, rgba(20,20,40,0.95) 50%, rgba(218,165,32,0.1) 100%)`;
          default:
            return `linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(20,20,40,0.95) 100%)`;
        }
      })(),
      borderColor: color,
      glowColor: color,
      icon: (() => {
        switch (planetType) {
          case 'terrestrial':
            if (planetName === 'Terra Nova') return '🌍'; // Earth-like
            if (planetName === 'Verdant Prime') return '🌸'; // Pink flower for lush world
            return '🌍';
          case 'ice':
            return '❄️'; // Snowflake for ice world
          case 'ocean':
            return '🌊'; // Wave for ocean world
          case 'desert':
            return '🏜️'; // Desert for desert world
          default:
            return '🌍';
        }
      })(),
      accentColor: lighterColor,
      textColor: '#FFFFFF',
      inputBackground: `rgba(${baseColor.r * 255}, ${baseColor.g * 255}, ${baseColor.b * 255}, 0.1)`,
      messageGlow: `0 4px 15px ${color}30`
    },
    star: {
      background: `linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(255,69,0,0.15) 100%)`,
      borderColor: '#FFD700',
      glowColor: '#FFA500',
      icon: '⭐',
      accentColor: '#FFD700',
      textColor: '#FFFFFF',
      inputBackground: 'rgba(255, 215, 0, 0.1)',
      messageGlow: '0 4px 15px rgba(255, 215, 0, 0.3)'
    },
    nebula: {
      background: `linear-gradient(135deg, rgba(147,112,219,0.1) 0%, rgba(255,20,147,0.15) 100%)`,
      borderColor: '#9370DB',
      glowColor: '#FF1493',
      icon: '🌌',
      accentColor: '#9370DB',
      textColor: '#FFFFFF',
      inputBackground: 'rgba(147, 112, 219, 0.1)',
      messageGlow: '0 4px 15px rgba(147, 112, 219, 0.3)'
    },
    asteroid: {
      background: `linear-gradient(135deg, rgba(139,69,19,0.1) 0%, rgba(160,82,45,0.15) 100%)`,
      borderColor: '#8B4513',
      glowColor: '#CD853F',
      icon: '☄️',
      accentColor: '#CD853F',
      textColor: '#FFFFFF',
      inputBackground: 'rgba(139, 69, 19, 0.1)',
      messageGlow: '0 4px 15px rgba(139, 69, 19, 0.3)'
    },
    blackhole: {
      background: `linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(26,26,26,0.98) 100%)`,
      borderColor: '#FFD700',
      glowColor: '#FFA500',
      icon: '🕳️',
      accentColor: '#FFD700',
      textColor: '#FFFFFF',
      inputBackground: 'rgba(255, 215, 0, 0.1)',
      messageGlow: '0 4px 15px rgba(255, 215, 0, 0.3)'
    },
    comet: {
      background: `linear-gradient(135deg, rgba(240,230,140,0.1) 0%, rgba(230,230,250,0.15) 100%)`,
      borderColor: '#F0E68C',
      glowColor: '#E6E6FA',
      icon: '☄️',
      accentColor: '#F0E68C',
      textColor: '#FFFFFF',
      inputBackground: 'rgba(240, 230, 140, 0.1)',
      messageGlow: '0 4px 15px rgba(240, 230, 140, 0.3)'
    }
  };

  return baseStyles[entityType as keyof typeof baseStyles] || baseStyles.planet;
};

export default function ChatInterface({ 
  isOpen, 
  onClose, 
  planetName, 
  planetType, 
  planetColor, 
  entityType = 'planet' 
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean; timestamp: Date }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debug log to verify planet data is correct
  useEffect(() => {
    if (isOpen) {
      console.log('🌍 Chat opened for:', { planetName, planetType, planetColor, entityType });
    }
  }, [isOpen, planetName, planetType, planetColor, entityType]);

  const personality = getEntityPersonality(entityType, planetName, planetType);
  const styling = getEntityStyling(entityType, planetColor, planetType, planetName);

  // Reset messages when chat opens with a new entity
  useEffect(() => {
    if (isOpen) {
      setMessages([]);
      setInputValue('');
      setIsTyping(false);
      
      // Clear any existing typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Initial greeting with a slight delay - use fresh personality
      const greetingTimeout = setTimeout(() => {
        const currentPersonality = getEntityPersonality(entityType, planetName, planetType);
        setMessages([{ text: currentPersonality.greeting, isUser: false, timestamp: new Date() }]);
      }, 500);
      
      return () => clearTimeout(greetingTimeout);
    }
  }, [isOpen, planetName, planetType, entityType]); // Keep these dependencies to ensure proper updates

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const generateResponse = useCallback((userMessage: string) => {
    // Get fresh personality for each response to ensure consistency
    const currentPersonality = getEntityPersonality(entityType, planetName, planetType);
    const responses = currentPersonality.responses;
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Add some contextual responses based on user input
    const lowerMessage = userMessage.toLowerCase();
    let contextualResponse = randomResponse;
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      contextualResponse = `Greetings! I am ${planetName}. How may I share the wisdom of the cosmos with you today?`;
    } else if (lowerMessage.includes('name') || lowerMessage.includes('who')) {
      contextualResponse = `I am ${planetName}, a ${planetType} ${entityType}. I have existed for eons in this vast cosmic dance.`;
    } else if (lowerMessage.includes('age') || lowerMessage.includes('old')) {
      contextualResponse = `I am ancient beyond your comprehension. I have witnessed the birth of stars and the formation of galaxies.`;
    } else if (lowerMessage.includes('life') || lowerMessage.includes('living')) {
      contextualResponse = entityType === 'planet' 
        ? "I am teeming with life in countless forms, each adapted to my unique environment."
        : entityType === 'star'
        ? "I am life itself - my energy sustains all living things in my system."
        : "I am part of the cosmic cycle that creates and sustains life throughout the universe.";
    } else if (lowerMessage.includes('future') || lowerMessage.includes('what will happen')) {
      contextualResponse = "The future is written in the stars, but even I cannot see all that is to come. The cosmos is ever-changing.";
    } else if (lowerMessage.includes('beautiful') || lowerMessage.includes('pretty')) {
      contextualResponse = "Thank you! Beauty is in the eye of the beholder, but I do try to shine my brightest for travelers like you.";
    }
    
    return contextualResponse;
  }, [planetName, planetType, entityType]); // Remove personality.responses dependency, use fresh personality instead

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    
    // Add user message
    setMessages(prev => [...prev, { text: userMessage, isUser: true, timestamp: new Date() }]);
    
    // Simulate typing
    setIsTyping(true);
    
    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Generate response after a delay
    typingTimeoutRef.current = setTimeout(() => {
      try {
        const response = generateResponse(userMessage);
        setMessages(prev => [...prev, { text: response, isUser: false, timestamp: new Date() }]);
      } catch (error) {
        console.error('Error generating response:', error);
        setMessages(prev => [...prev, { text: "I apologize, but I seem to be experiencing a cosmic disturbance. Please try again.", isUser: false, timestamp: new Date() }]);
      } finally {
        setIsTyping(false);
      }
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  }, [inputValue, isTyping, generateResponse]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isTyping) {
      handleSendMessage();
    }
  }, [handleSendMessage, isTyping]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-md h-[600px] mx-4 rounded-2xl shadow-2xl overflow-hidden"
        style={{
          background: styling.background,
          border: `2px solid ${styling.borderColor} !important`,
          boxShadow: `0 0 15px ${styling.glowColor}20`
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: `${styling.borderColor}40` }}
        >
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{styling.icon}</span>
            <div>
              <h3 
                className="font-semibold"
                style={{ color: styling.textColor }}
              >
                {planetName}
              </h3>
              <p 
                className="text-xs capitalize"
                style={{ color: styling.accentColor }}
              >
                {planetType} {entityType}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="transition-colors p-2 rounded-lg hover:bg-opacity-20"
            style={{ 
              color: styling.accentColor,
              backgroundColor: `${styling.accentColor}10`
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[400px]">
          {messages.map((message, index) => (
            <div
              key={`${message.timestamp.getTime()}-${index}`}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.isUser
                    ? 'text-white'
                    : 'text-gray-100'
                }`}
                style={{
                  background: message.isUser 
                    ? `linear-gradient(135deg, ${styling.accentColor} 0%, ${styling.borderColor} 100%)`
                    : 'rgba(31, 41, 55, 0.9)',
                  boxShadow: message.isUser 
                    ? `0 2px 8px ${styling.glowColor}15`
                    : `0 2px 8px ${styling.glowColor}10`
                }}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs opacity-50 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div 
                className="text-gray-100 p-4 rounded-2xl"
                style={{ 
                  background: 'rgba(31, 41, 55, 0.9)',
                  boxShadow: `0 2px 8px ${styling.glowColor}10`
                }}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm opacity-70">Thinking</span>
                  <div className="flex space-x-1">
                    <div 
                      className="w-3 h-3 rounded-full animate-bounce"
                      style={{ backgroundColor: styling.accentColor }}
                    ></div>
                    <div 
                      className="w-3 h-3 rounded-full animate-bounce" 
                      style={{ 
                        backgroundColor: styling.accentColor,
                        animationDelay: '0.1s' 
                      }}
                    ></div>
                    <div 
                      className="w-3 h-3 rounded-full animate-bounce" 
                      style={{ 
                        backgroundColor: styling.accentColor,
                        animationDelay: '0.2s' 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t" style={{ borderColor: `${styling.borderColor}40` }}>
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about the cosmos..."
              disabled={isTyping}
              className="flex-1 text-white px-4 py-2 rounded-xl border transition-colors disabled:opacity-50 focus:outline-none"
              style={{
                background: styling.inputBackground,
                borderColor: `${styling.borderColor}60`,
                color: styling.textColor
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="px-4 py-2 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{
                background: `linear-gradient(135deg, ${styling.accentColor} 0%, ${styling.borderColor} 100%)`,
                boxShadow: `0 2px 8px ${styling.glowColor}15`
              }}
            >
              {isTyping ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 