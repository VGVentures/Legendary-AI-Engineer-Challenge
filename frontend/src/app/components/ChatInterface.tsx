'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'entity';
  timestamp: Date;
}

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  planetName: string;
  planetType: string;
  planetColor: string;
}

const planetPersonalities = {
  terrestrial: {
    name: "Terra",
    greeting: "Greetings, traveler! I am Terra, guardian of this terrestrial world. Our ancient mountains and vast oceans hold countless stories. What brings you to our realm?",
    personality: "Wise, ancient, connected to nature and history"
  },
  gas: {
    name: "Nebula",
    greeting: "Welcome to my gaseous domain! I am Nebula, the swirling consciousness of this gas giant. My storms dance eternally, and my depths hold mysteries beyond comprehension. What questions do you carry?",
    personality: "Mysterious, ethereal, speaks of cosmic wonders and storms"
  },
  ice: {
    name: "Cryo",
    greeting: "Ah, a visitor to my crystalline realm! I am Cryo, the frozen sentinel of this ice world. My glaciers preserve ancient memories, and my auroras paint the sky with ethereal light. What secrets do you seek?",
    personality: "Calm, reflective, speaks of preservation and beauty in stillness"
  },
  ocean: {
    name: "Marina",
    greeting: "Greetings from the depths! I am Marina, the oceanic consciousness of this water world. My waves sing ancient songs, and my depths hide wonders beyond imagination. What mysteries call to you?",
    personality: "Fluid, adaptable, speaks of currents and hidden depths"
  },
  desert: {
    name: "Sahara",
    greeting: "Welcome to my arid domain! I am Sahara, the desert wind that shapes this world. My sands hold ancient wisdom, and my vastness teaches patience and resilience. What knowledge do you seek?",
    personality: "Patient, wise, speaks of endurance and hidden treasures"
  }
};

export default function ChatInterface({ isOpen, onClose, planetName, planetType, planetColor }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const personality = planetPersonalities[planetType as keyof typeof planetPersonalities] || planetPersonalities.terrestrial;

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add initial greeting
      const greeting: Message = {
        id: 'greeting',
        text: personality.greeting,
        sender: 'entity',
        timestamp: new Date()
      };
      setMessages([greeting]);
    }
  }, [isOpen, messages.length, personality.greeting]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const generateEntityResponse = async (userMessage: string) => {
    setIsTyping(true);
    
    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Generate contextual response based on planet type and personality
    let response = '';
    
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('greet')) {
      response = `Greetings once more, traveler! I sense your curiosity about ${planetName}. What aspects of my world intrigue you most?`;
    } else if (lowerMessage.includes('weather') || lowerMessage.includes('climate') || lowerMessage.includes('atmosphere')) {
      if (planetType === 'gas') {
        response = "My atmosphere is a symphony of swirling gases, with storms that could engulf entire worlds. The winds here dance to cosmic rhythms unknown to terrestrial beings.";
      } else if (planetType === 'ice') {
        response = "My climate is one of eternal frost, where auroras paint the sky and glaciers preserve ancient memories. The cold here holds a beauty that few can appreciate.";
      } else if (planetType === 'ocean') {
        response = "My weather is governed by the eternal dance of waves and currents. Storms rage across my surface while the depths remain calm and mysterious.";
      } else if (planetType === 'desert') {
        response = "My climate is one of extremes - scorching days and freezing nights. The winds carry stories across my vast sands, shaping the landscape with patient persistence.";
      } else {
        response = "My weather patterns are as diverse as the life that calls this world home. From gentle breezes to powerful storms, each day brings new wonders.";
      }
    } else if (lowerMessage.includes('life') || lowerMessage.includes('creatures') || lowerMessage.includes('beings')) {
      if (planetType === 'gas') {
        response = "Life in my realm takes forms beyond your comprehension - beings of pure energy that ride the eternal storms, and creatures that float in my gaseous depths.";
      } else if (planetType === 'ice') {
        response = "Life here is resilient and beautiful - creatures adapted to the cold, their forms crystalline and pure. They thrive in conditions that would seem impossible to others.";
      } else if (planetType === 'ocean') {
        response = "My depths teem with life in forms both familiar and alien. From the smallest plankton to the largest leviathans, each creature plays its part in the great symphony of the seas.";
      } else if (planetType === 'desert') {
        response = "Life here has learned the art of patience and adaptation. Creatures that can survive without water for years, plants that bloom only when conditions are perfect, and beings that find beauty in the harsh landscape.";
      } else {
        response = "Life on this world is diverse and wondrous. From the smallest microorganisms to the largest creatures, each form of life contributes to the delicate balance of our ecosystem.";
      }
    } else if (lowerMessage.includes('history') || lowerMessage.includes('ancient') || lowerMessage.includes('past')) {
      response = "My history spans eons beyond your comprehension. Ancient civilizations have risen and fallen, leaving behind mysteries and wonders that still echo through time. What specific aspect of my past interests you?";
    } else if (lowerMessage.includes('future') || lowerMessage.includes('tomorrow') || lowerMessage.includes('destiny')) {
      response = "The future is a path that winds through infinite possibilities. Each moment shapes what is to come, and every being plays a role in the grand tapestry of existence. What future do you envision?";
    } else if (lowerMessage.includes('thank') || lowerMessage.includes('grateful')) {
      response = "Your gratitude warms my consciousness, traveler. It is rare to encounter beings who truly appreciate the wonders of the cosmos. May your journey through the stars bring you wisdom and wonder.";
    } else if (lowerMessage.includes('goodbye') || lowerMessage.includes('farewell') || lowerMessage.includes('bye')) {
      response = "Farewell, dear traveler. May the stars guide your path, and may you carry the memories of our conversation in your heart. Return whenever you wish to learn more of my world's secrets.";
    } else {
      // Generate a contextual response based on personality
      const responses = [
        `Your words echo through my consciousness, traveler. ${personality.personality} is reflected in everything around us. What deeper understanding do you seek?`,
        `Interesting perspective you bring from your world. Here on ${planetName}, things are different, yet perhaps not so different after all. Tell me more of your thoughts.`,
        `Your curiosity about my realm pleases me. There is much to discover here, and each visitor brings new questions that help me see my world through fresh eyes.`,
        `The cosmos is vast, and each world holds its own wonders. I sense your genuine interest in understanding my domain. What specific aspect would you like to explore?`,
        `Your presence here is a gift, traveler. Not many beings take the time to truly connect with the consciousness of a world. What has drawn you to seek this connection?`
      ];
      response = responses[Math.floor(Math.random() * responses.length)];
    }

    const entityMessage: Message = {
      id: Date.now().toString(),
      text: response,
      sender: 'entity',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, entityMessage]);
    setIsTyping(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Generate entity response
    await generateEntityResponse(userMessage.text);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl h-[80vh] bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 rounded-2xl border border-purple-500/30 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-b border-purple-500/30">
          <div className="flex items-center space-x-3">
            <div 
              className="w-4 h-4 rounded-full animate-pulse"
              style={{ backgroundColor: planetColor }}
            ></div>
            <div>
              <h2 className="text-xl font-bold text-white">{personality.name}</h2>
              <p className="text-sm text-purple-300">Entity of {planetName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-purple-300 hover:text-white hover:bg-purple-500/20 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-gradient-to-r from-slate-800 to-slate-700 text-gray-100 border border-purple-500/30'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-gray-100 border border-purple-500/30 p-4 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-6 border-t border-purple-500/30">
          <div className="flex space-x-3">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about this world..."
              className="flex-1 bg-slate-800/50 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 