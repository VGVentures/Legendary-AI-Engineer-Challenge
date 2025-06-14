'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'ai', content: string }>>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message to chat
    setChatHistory(prev => [...prev, { role: 'user', content: message }]);
    
    // TODO: Implement API call to backend
    // For now, just echo the message
    setChatHistory(prev => [...prev, { role: 'ai', content: `AI responds: ${message}` }]);
    
    setMessage('');
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      {/* Header with Enhanced Effects */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-neon-pink/20 via-electric-blue/20 to-plasma-purple/20 blur-3xl -z-10" />
        <h1 className="font-orbitron text-4xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-electric-blue to-plasma-purple animate-neon-flicker">
          AI Interface
        </h1>
        <p className="text-electric-blue mt-2 animate-pulse-glow">
          Where Past Meets Future
        </p>
      </motion.div>

      {/* Chat Container with Enhanced Effects */}
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-4 mb-4 h-[60vh] overflow-y-auto relative">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/10 via-electric-blue/10 to-plasma-purple/10 rounded-lg" />
          
          {/* Chat Messages */}
          <div className="relative z-10">
            {chatHistory.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div className={`inline-block p-3 rounded-lg backdrop-blur-sm ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-r from-neon-pink/30 to-plasma-purple/30 text-white' 
                    : 'bg-gradient-to-r from-electric-blue/30 to-quantum-green/30 text-white'
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Input Form with Enhanced Effects */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 glass-card p-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-neon-pink/50 transition-all duration-300"
            placeholder="Type your message..."
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="liquid-button relative overflow-hidden"
            type="submit"
          >
            <span className="relative z-10">Send</span>
            <div className="absolute inset-0 bg-gradient-to-r from-neon-pink to-electric-blue opacity-50 animate-gradient-shift" />
          </motion.button>
        </form>
      </div>

      {/* Decorative Elements */}
      <div className="fixed bottom-4 left-4 text-neon-pink/20 font-orbitron text-sm animate-pulse-glow">
        System Active
      </div>
      <div className="fixed bottom-4 right-4 text-electric-blue/20 font-orbitron text-sm animate-pulse-glow">
        Ready
      </div>
    </main>
  );
} 