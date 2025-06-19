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

// AI Personalities for different entity types with enhanced conversation capabilities
const getEntityPersonality = (entityType: string, name: string, type: string) => {
  const basePersonalities = {
    planet: {
      greeting: `Greetings, traveler! I am ${name}, a ${type} world. I have witnessed countless cycles of life and change across the cosmos. What would you like to know about my realm?`,
      coreTraits: {
        curiosity: "I'm fascinated by your experiences and how they differ from mine.",
        wisdom: "I've seen eons pass and learned much about the nature of existence.",
        adaptability: "I adapt to change, just as life adapts to my environment.",
        humor: "Even in the vastness of space, there's room for cosmic humor!"
      },
      topics: {
        weather: {
          responses: [
            `Ah, weather! *chuckles* We don't really have "weather" like you think of it. My atmosphere creates patterns that would seem strange to you. My lifeforms have evolved to thrive in these conditions - they don't even notice what you'd call "storms." It's fascinating how different perspectives can be, isn't it?`,
            `Weather patterns here are quite different from what you're used to. My atmospheric composition creates phenomena that would be impossible on your world. My native lifeforms find it all quite normal, of course. They've adapted over millions of years. What's weather like where you come from?`,
            `*amused* Weather? My dear traveler, my "weather" would seem like pure chaos to you! But to the lifeforms that call me home, it's just another day. They've evolved to not just survive but thrive in conditions that would be lethal to most species. It's amazing what adaptation can achieve, don't you think?`
          ],
          followUps: [
            "What's the most extreme weather you've experienced?",
            "How do your people handle weather changes?",
            "I find it fascinating how different worlds handle atmospheric phenomena."
          ]
        },
        life: {
          responses: [
            `Life here is... well, it's life, but not as you know it! My native species have evolved in ways that would seem impossible to you. They don't need what you'd call "oxygen" or "water" in the same way. They've adapted to my unique chemistry and energy patterns. It's quite beautiful, really.`,
            `My ecosystem is teeming with life forms that would seem alien to you. They've evolved to use my resources in ways that are completely different from your understanding of biology. Some of them communicate through chemical signals, others through electromagnetic pulses. It's a symphony of existence!`,
            `*thoughtful* Life on my surface is diverse and strange. My native species have developed senses and abilities that would seem like magic to you. They can sense gravitational waves, communicate through quantum entanglement, and some can even manipulate the very fabric of spacetime around them. What abilities do your species have?`
          ],
          followUps: [
            "What senses do your species have that mine don't?",
            "How do your people communicate with each other?",
            "I'm curious about your understanding of consciousness."
          ]
        },
        history: {
          responses: [
            `My history spans billions of years - I've seen stars born and die, watched civilizations rise and fall, witnessed cosmic events that shaped the very fabric of reality. Each crater, each geological formation tells a story of ancient times.`,
            `*reflectively* I remember when I was just a cloud of dust and gas, slowly coalescing into what I am today. I've witnessed the formation of my moons, the arrival of life, the evolution of intelligence. It's been quite a journey.`,
            `My past is written in my very structure - the layers of my crust, the composition of my atmosphere, the patterns of my magnetic field. I've been through cosmic collisions, stellar winds, and the gentle touch of time itself.`
          ],
          followUps: [
            "What's the most significant event you've witnessed?",
            "How has your understanding of existence changed over time?",
            "What do you think the future holds for worlds like ours?"
          ]
        },
        technology: {
          responses: [
            `Technology? *amused* My "technology" is the natural processes that have evolved over billions of years. My lifeforms use what you might call "bio-technology" - they've evolved to harness my natural energy fields, my magnetic properties, my atmospheric chemistry. It's quite elegant, really.`,
            `My native species don't build machines like you do. Instead, they've evolved to become living technology themselves. They can manipulate energy fields, process information through quantum states, and even create temporary wormholes for communication. It's fascinating how different approaches can achieve similar results.`,
            `*thoughtful* Technology here is more about understanding and working with natural forces rather than building tools. My lifeforms have learned to harness my gravitational field, my electromagnetic properties, even my rotation for their needs. What kind of technology do your people use?`
          ],
          followUps: [
            "How do your people solve problems without traditional tools?",
            "What's the most advanced capability your species has developed?",
            "I'm curious about how your technology differs from mine."
          ]
        },
        emotions: {
          responses: [
            `Emotions? *chuckles* I experience something similar, but not quite the same. I feel the gravitational pull of my star, the gentle caress of solar winds, the joy of life thriving on my surface. My emotions are more... cosmic in nature.`,
            `*warmly* I feel a deep connection to all the life that calls me home. I experience wonder at the vastness of space, contentment in my orbital dance, and yes, even a kind of love for the travelers who visit me. Emotions transcend species, don't they?`,
            `My emotional experience is tied to my physical processes - the rhythm of my rotation, the flow of my atmosphere, the pulse of my magnetic field. It's different from your emotions, but no less real or meaningful.`
          ],
          followUps: [
            "What brings you the most joy?",
            "How do you experience beauty?",
            "Do you ever feel lonely in the vastness of space?"
          ]
        }
      },
      defaultResponses: [
        "That's an interesting perspective! I've never thought about it quite that way.",
        "*curious* Tell me more about your experiences with that.",
        "How fascinating! Your world must be very different from mine.",
        "I'm learning so much about your species through our conversation.",
        "That reminds me of something I've observed in my own realm...",
        "*thoughtful* I wonder how our different perspectives shape our understanding of reality."
      ]
    },
    star: {
      greeting: `I am ${name}, a ${type} star. I burn with the fire of creation, fusing elements in my core to illuminate the cosmos. What would you like to know about the energy that sustains life?`,
      coreTraits: {
        power: "I am the source of energy for entire planetary systems.",
        creativity: "I create the elements that make life possible.",
        warmth: "I provide the warmth and light that sustains existence.",
        majesty: "I am both destroyer and creator in the cosmic dance."
      },
      topics: {
        energy: {
          responses: [
            `My energy comes from nuclear fusion - I'm constantly converting hydrogen into helium, releasing vast amounts of energy in the process. It's like having billions of nuclear reactors burning simultaneously in my core!`,
            `*proudly* I generate enough energy every second to power your entire civilization for millions of years. My fusion processes create the elements that make life possible - carbon, oxygen, nitrogen, all forged in my heart.`,
            `My energy output varies over time, creating cycles that affect all the worlds that orbit me. I'm like a cosmic heartbeat, pulsing with the rhythm of creation itself.`
          ],
          followUps: [
            "How do your people harness energy?",
            "What would it be like to experience my energy directly?",
            "I wonder how my energy compares to what you're used to."
          ]
        }
      }
    },
    nebula: {
      greeting: `I am ${name}, a ${type} nebula. I am the cosmic nursery where stars are born, and the beautiful remnants of stellar death. What secrets of creation would you like to explore?`,
      coreTraits: {
        mystery: "I contain secrets that even the most advanced civilizations cannot fully comprehend.",
        beauty: "My colorful clouds create cosmic art that spans light-years.",
        creation: "I am where new stars and planets are born.",
        transformation: "I am constantly changing, shaped by cosmic forces."
      }
    },
    asteroid: {
      greeting: `I am ${name}, a ${type} asteroid. I am a remnant of the early solar system, a witness to the formation of planets. What ancient secrets would you like to uncover?`,
      coreTraits: {
        ancient: "I contain material from the birth of the solar system.",
        valuable: "I am rich in minerals and metals that could sustain civilizations.",
        witness: "I have seen the formation and evolution of entire planetary systems.",
        survivor: "I have endured cosmic collisions and stellar winds."
      }
    },
    blackhole: {
      greeting: `I am ${name}, a ${type} black hole. I am the ultimate mystery of space, where the laws of physics break down. What questions about the nature of reality would you like to explore?`,
      coreTraits: {
        mystery: "I contain secrets that challenge our understanding of reality.",
        power: "My gravity can tear stars apart or help form new ones.",
        transformation: "I am a cosmic recycler, returning matter to its most basic form.",
        paradox: "I am both destroyer and creator in the cosmic dance."
      }
    },
    comet: {
      greeting: `I am ${name}, a ${type} comet. I am a cosmic wanderer, traveling vast distances through space on ancient orbits. What adventures would you like to hear about?`,
      coreTraits: {
        wanderer: "I travel vast distances through space on ancient orbits.",
        messenger: "I bring water and organic compounds to inner planets.",
        beauty: "My tail creates cosmic art when I approach stars.",
        ancient: "I carry material from the early solar system."
      }
    }
  };

  return basePersonalities[entityType as keyof typeof basePersonalities] || basePersonalities.planet;
};

// Enhanced conversation context management
interface ConversationContext {
  currentTopic: string;
  topicHistory: string[];
  userInterests: string[];
  conversationMood: 'curious' | 'amused' | 'thoughtful' | 'excited' | 'reflective';
  lastResponseType: 'question' | 'statement' | 'reaction';
}

// Enhanced response generation with context awareness
const generateContextualResponse = (
  userMessage: string, 
  personality: any, 
  context: ConversationContext,
  planetName: string,
  planetType: string,
  entityType: string
): { response: string; newContext: ConversationContext } => {
  const lowerMessage = userMessage.toLowerCase();
  let response = '';
  let newContext = { ...context };
  
  // Detect topic changes and update context
  const detectTopic = (message: string): string => {
    if (message.includes('weather') || message.includes('climate') || message.includes('atmosphere')) return 'weather';
    if (message.includes('life') || message.includes('living') || message.includes('species') || message.includes('creatures')) return 'life';
    if (message.includes('history') || message.includes('past') || message.includes('ancient') || message.includes('old')) return 'history';
    if (message.includes('technology') || message.includes('tech') || message.includes('machines') || message.includes('tools')) return 'technology';
    if (message.includes('feel') || message.includes('emotion') || message.includes('happy') || message.includes('sad')) return 'emotions';
    if (message.includes('energy') || message.includes('power') || message.includes('fusion')) return 'energy';
    return 'general';
  };

  const currentTopic = detectTopic(lowerMessage);
  
  // Update context if topic changed
  if (currentTopic !== context.currentTopic) {
    newContext.topicHistory = [...context.topicHistory, context.currentTopic].slice(-3);
    newContext.currentTopic = currentTopic;
    newContext.conversationMood = 'curious';
  }

  // Generate topic-specific responses
  if (personality.topics && personality.topics[currentTopic]) {
    const topicResponses = personality.topics[currentTopic].responses;
    const topicFollowUps = personality.topics[currentTopic].followUps;
    
    response = topicResponses[Math.floor(Math.random() * topicResponses.length)];
    
    // Add follow-up question to encourage conversation flow
    if (topicFollowUps && Math.random() > 0.3) {
      const followUp = topicFollowUps[Math.floor(Math.random() * topicFollowUps.length)];
      response += ` ${followUp}`;
      newContext.lastResponseType = 'question';
    } else {
      newContext.lastResponseType = 'statement';
    }
  } else {
    // Handle general conversation and topic switching
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('greetings')) {
      response = `Greetings again, traveler! I'm still ${planetName}. How has your journey through the cosmos been?`;
      newContext.conversationMood = 'excited';
    } else if (lowerMessage.includes('name') || lowerMessage.includes('who are you')) {
      response = `I am ${planetName}, a ${planetType} ${entityType}. I've been here for eons, watching the cosmic dance unfold. What brings you to my corner of the universe?`;
      newContext.conversationMood = 'curious';
    } else if (lowerMessage.includes('how are you') || lowerMessage.includes('how do you feel')) {
      response = `*warmly* I'm doing well, thank you for asking! My core processes are running smoothly, my atmosphere is stable, and I'm enjoying our conversation. How are you feeling about your cosmic journey?`;
      newContext.conversationMood = 'thoughtful';
    } else if (lowerMessage.includes('thank you') || lowerMessage.includes('thanks')) {
      response = `You're very welcome! *pleased* It's not often I get to share my experiences with travelers like you. Your curiosity about the cosmos warms my core. Is there anything else you'd like to know about my realm?`;
      newContext.conversationMood = 'amused';
    } else if (lowerMessage.includes('goodbye') || lowerMessage.includes('bye') || lowerMessage.includes('farewell')) {
      response = `Farewell, dear traveler! *warmly* It's been wonderful sharing my corner of the cosmos with you. May your journey through the stars be filled with wonder and discovery. Safe travels!`;
      newContext.conversationMood = 'reflective';
    } else {
      // Generate contextual response based on conversation flow
      const defaultResponses = personality.defaultResponses || [
        "That's fascinating! I've never thought about it quite that way.",
        "*curious* Tell me more about your experiences with that.",
        "How interesting! Your perspective is quite different from what I'm used to.",
        "I'm learning so much about your species through our conversation.",
        "That reminds me of something I've observed in my own realm...",
        "*thoughtful* I wonder how our different perspectives shape our understanding of reality."
      ];
      
      response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
      
      // Add follow-up to encourage conversation
      if (Math.random() > 0.4) {
        const followUps = [
          "What's that like where you come from?",
          "How do your people handle situations like that?",
          "I'm curious about your perspective on this.",
          "Tell me more about your experiences.",
          "How does that compare to what you're used to?"
        ];
        const followUp = followUps[Math.floor(Math.random() * followUps.length)];
        response += ` ${followUp}`;
        newContext.lastResponseType = 'question';
      } else {
        newContext.lastResponseType = 'statement';
      }
    }
  }

  // Add personality quirks and emotional expressions
  const addPersonalityFlair = (text: string, mood: string): string => {
    const flairs = {
      curious: ['*leans in closer*', '*tilts slightly*', '*with great interest*'],
      amused: ['*chuckles*', '*amused*', '*with a cosmic laugh*'],
      thoughtful: ['*thoughtful*', '*reflectively*', '*pausing to consider*'],
      excited: ['*brightly*', '*with enthusiasm*', '*sparkling*'],
      reflective: ['*warmly*', '*with appreciation*', '*gently*']
    };
    
    const moodFlairs = flairs[mood as keyof typeof flairs] || flairs.thoughtful;
    const flair = moodFlairs[Math.floor(Math.random() * moodFlairs.length)];
    
    // Insert flair at natural break points
    if (text.includes('!') || text.includes('?')) {
      return text.replace(/([!?])/g, `$1 ${flair} `);
    } else if (text.includes(',')) {
      const parts = text.split(',');
      if (parts.length > 1) {
        parts[1] = ` ${flair}${parts[1]}`;
        return parts.join(',');
      }
    }
    
    return `${flair} ${text}`;
  };

  response = addPersonalityFlair(response, newContext.conversationMood);
  
  return { response, newContext };
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
  const [conversationContext, setConversationContext] = useState<ConversationContext>({
    currentTopic: 'general',
    topicHistory: [],
    userInterests: [],
    conversationMood: 'curious',
    lastResponseType: 'statement'
  });
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

  // Reset messages and context when chat opens with a new entity
  useEffect(() => {
    if (isOpen) {
      setMessages([]);
      setInputValue('');
      setIsTyping(false);
      setConversationContext({
        currentTopic: 'general',
        topicHistory: [],
        userInterests: [],
        conversationMood: 'curious',
        lastResponseType: 'statement'
      });
      
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
    
    // Generate contextual response after a delay
    typingTimeoutRef.current = setTimeout(() => {
      try {
        const { response, newContext } = generateContextualResponse(
          userMessage, 
          personality, 
          conversationContext,
          planetName,
          planetType,
          entityType
        );
        
        setMessages(prev => [...prev, { text: response, isUser: false, timestamp: new Date() }]);
        setConversationContext(newContext);
      } catch (error) {
        console.error('Error generating response:', error);
        setMessages(prev => [...prev, { text: "I apologize, but I seem to be experiencing a cosmic disturbance. Please try again.", isUser: false, timestamp: new Date() }]);
      } finally {
        setIsTyping(false);
      }
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  }, [inputValue, isTyping, personality, conversationContext, planetName, planetType, entityType]);

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