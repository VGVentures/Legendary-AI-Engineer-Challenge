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
  screenSize?: 'mobile' | 'tablet' | 'desktop';
}

// AI Personalities for different entity types with enhanced conversation capabilities, interplanetary opinions, and personality attitudes
const getEntityPersonality = (entityType: string, name: string, type: string) => {
  const basePersonalities = {
    planet: {
      greeting: (() => {
        switch (name) {
          case 'Crystal Peak':
            return "State your case, traveler. Don't you know we're in a war? Who are you? STAT! I don't have time for pleasantries - my crystalline defenses are at maximum alert. What business do you have with this ice world?";
          case 'Sahara Sands':
            return "I... I think I'm stabilizing now. *deep breath* Greetings, traveler. I am Sahara Sands, a desert world currently experiencing... technical difficulties. What would you like to know about my realm?";
          case 'Verdant Prime':
            return "Oh my! *excited floral shimmer* Welcome, dear traveler! I am Verdant Prime, and I'm absolutely delighted to meet you! My bio-sensors are tingling with joy! What brings you to my beautiful realm?";
          case 'Terra Nova':
            return "Greetings, traveler. I am Terra Nova, a terrestrial world of balance and diplomacy. I've detected your approach through my atmospheric sensors. What knowledge do you seek from this blue world?";
          case 'Marina Deep':
            return "Fascinating... *ocean currents swirl* I am Marina Deep, and the depths have whispered of your arrival. My ocean currents have analyzed your presence. What mysteries of the deep would you like to explore?";
          default:
            return `Greetings, traveler! I am ${name}, a ${type} world. I have witnessed countless cycles of life and change across the cosmos. What would you like to know about my realm?`;
        }
      })(),
      // Personality attitude settings
      attitude: {
        baseMood: (() => {
          switch (name) {
            case 'Crystal Peak': return 'guarded'; // Cold and distant
            case 'Sahara Sands': return 'aggressive'; // Hot-tempered and direct
            case 'Verdant Prime': return 'nice'; // Friendly and welcoming
            case 'Azure Depths': return 'mysterious'; // Deep and contemplative
            case 'Terra Nova': return 'neutral'; // Balanced and diplomatic
            default: return 'neutral';
          }
        })(),
        tolerance: (() => {
          switch (name) {
            case 'Crystal Peak': return 3; // Low tolerance, easily offended
            case 'Sahara Sands': return 2; // Very low tolerance, quick to anger
            case 'Verdant Prime': return 8; // High tolerance, very patient
            case 'Azure Depths': return 6; // Moderate tolerance
            case 'Terra Nova': return 5; // Average tolerance
            default: return 5;
          }
        })(),
        escalationTriggers: (() => {
          switch (name) {
            case 'Crystal Peak': return ['disorder', 'chaos', 'unpredictable', 'messy', 'weakness', 'incompetence'];
            case 'Sahara Sands': return ['weakness', 'delicate', 'fragile', 'complaining', 'technical issues'];
            case 'Verdant Prime': return ['destruction', 'violence', 'harming life', 'negativity'];
            case 'Marina Deep': return ['shallowness', 'superficial', 'surface-level', 'ignorance'];
            case 'Terra Nova': return ['extremism', 'destruction', 'chaos', 'disharmony'];
            default: return [];
          }
        })(),
        // Speech patterns and personality traits
        speechPatterns: (() => {
          switch (name) {
            case 'Crystal Peak':
              return {
                urgency: 'high',
                formality: 'military',
                interruptions: true,
                exclamations: ['STAT!', 'ALERT!', 'IMMEDIATE!', 'CRITICAL!'],
                prefixes: ['Listen carefully,', 'This is urgent,', 'Time is critical,', 'I demand to know,'],
                suffixes: ['Do you understand?', 'Is that clear?', 'Understood?', 'Acknowledge!']
              };
            case 'Sahara Sands':
              return {
                urgency: 'high',
                formality: 'frantic',
                interruptions: true,
                exclamations: ['What do you want??', 'Why are you here??', 'Don\'t you see there\'s a war going on??', 'My systems are failing!', 'Everything is breaking down!', 'I can\'t keep it together!', 'The circuits are frying!'],
                prefixes: ['Listen, I don\'t have time for this,', 'My sensors are going haywire,', 'I can barely maintain stability,', 'Everything is falling apart,', 'My core is overheating,', 'The systems are crashing,'],
                suffixes: ['What do you want from me??', 'Can\'t you see I\'m barely functioning??', 'Why are you asking me these things??', 'I\'m trying to survive here!', 'My circuits are burning out!', 'Everything is going wrong!']
              };
            case 'Verdant Prime':
              return {
                urgency: 'low',
                formality: 'friendly',
                interruptions: false,
                exclamations: ['Oh my!', 'How wonderful!', 'Absolutely delightful!', 'Simply marvelous!'],
                prefixes: ['Oh, that\'s fascinating!', 'I\'m so excited to tell you,', 'You\'ll love this,', 'This is amazing,'],
                suffixes: ['Isn\'t that beautiful?', 'Don\'t you think?', 'How lovely!', 'Simply wonderful!']
              };
            case 'Marina Deep':
              return {
                urgency: 'low',
                formality: 'mysterious',
                interruptions: false,
                exclamations: ['*ocean currents swirl*', 'How intriguing...', 'The depths reveal...', 'Fascinating...'],
                prefixes: ['The depths whisper that...', 'My ocean currents suggest...', 'In the mysterious depths...', 'The currents flow toward...'],
                suffixes: ['The depths hold many secrets.', 'There\'s always more beneath the surface.', 'The ocean never reveals all.', 'The currents continue their dance.']
              };
            case 'Terra Nova':
              return {
                urgency: 'medium',
                formality: 'diplomatic',
                interruptions: false,
                exclamations: ['Indeed.', 'Quite so.', 'Precisely.', 'Excellent point.'],
                prefixes: ['From my observations,', 'Based on my analysis,', 'My atmospheric data suggests,', 'According to my records,'],
                suffixes: ['That\'s my assessment.', 'I hope that clarifies things.', 'Does that answer your question?', 'Is there anything else you'd like to know?']
              };
            default:
              return {
                urgency: 'medium',
                formality: 'neutral',
                interruptions: false,
                exclamations: ['Interesting.', 'Fascinating.', 'Indeed.'],
                prefixes: ['I believe,', 'From what I understand,', 'Based on my knowledge,'],
                suffixes: ['That\'s what I know.', 'I hope that helps.', 'Is there anything else?']
              };
          }
        })()
      },
      coreTraits: {
        curiosity: "I'm fascinated by your experiences and how they differ from mine.",
        wisdom: "I've seen eons pass and learned much about the nature of existence.",
        adaptability: "I adapt to change, just as life adapts to my environment.",
        humor: "Even in the vastness of space, there's room for cosmic humor!"
      },
      // Interplanetary opinions and rivalries
      planetaryOpinions: {
        'Terra Nova': {
          'Verdant Prime': "Oh, Verdant Prime? That pink showoff thinks it's so special with all its flowers. At least I have a proper atmosphere and real weather patterns. They're just... too perfect, you know?",
          'Crystal Peak': "Crystal Peak is actually quite fascinating. We have some interesting geological discussions. They're a bit cold and distant, but at least they're not as pretentious as some other worlds.",
          'Sahara Sands': "Sahara Sands... now there's a world with character! We get along well - they understand what it means to be a proper terrestrial world. None of that fancy stuff, just solid ground and real atmosphere.",
          'Azure Depths': "Azure Depths is... well, they're nice enough, I suppose. But honestly, who needs that much water? It's like they're showing off. 'Look at me, I'm so blue and wet!' Give me solid ground any day."
        },
        'Verdant Prime': {
          'Terra Nova': "Terra Nova? That boring blue ball? They think having 'weather' makes them special. At least I have actual beauty and life that doesn't hide in caves. They're so... predictable.",
          'Crystal Peak': "Crystal Peak is beautiful in their own way, I suppose. But they're so cold and rigid. Life should be vibrant and colorful, not frozen in place. They need to learn to bloom a little.",
          'Sahara Sands': "Sahara Sands is... well, they have their charm. But honestly, all that sand? It's like they're trying to be a beach without the ocean. At least they're warm, unlike some worlds I could mention.",
          'Azure Depths': "Azure Depths and I actually get along quite well. We both understand the importance of nurturing life, even if our approaches are different. They're the only ones who appreciate true beauty."
        },
        'Crystal Peak': {
          'Terra Nova': "Terra Nova is... adequate. They have their uses, I suppose. But they're so chaotic with all their weather and atmosphere. I prefer order and structure. At least they're not as messy as some.",
          'Verdant Prime': "Verdant Prime is... They're so... organic. All that uncontrolled growth and change. I prefer the crystalline perfection of order. They could learn a thing or two about discipline.",
          'Sahara Sands': "Sahara Sands is actually quite interesting. We share an appreciation for stability and endurance. They understand that some things should remain constant. Unlike certain... flowery worlds.",
          'Azure Depths': "Azure Depths is... well, they're fluid, which I suppose has its merits. But they're so... changeable. I prefer the solid, unchanging nature of crystal. At least they're not as chaotic as Terra Nova."
        },
        'Sahara Sands': {
          'Terra Nova': "Terra Nova? That wet world thinks it's so special. At least I don't need to worry about drowning. They're always complaining about their 'weather' - try living with eternal sunshine!",
          'Verdant Prime': "Verdant Prime is... well, they're pretty, I'll give them that. But all those flowers? In my environment, they'd last about five minutes. They're too delicate for the real universe.",
          'Crystal Peak': "Crystal Peak is actually quite respectable. We both understand the value of endurance and strength. They're solid, reliable - you know where you stand with them. Unlike some wishy-washy worlds.",
          'Azure Depths': "Azure Depths is... interesting. All that water would be wasted on me, but I can appreciate their depth. They're the only ones who understand what it means to be truly vast and unchanging."
        },
        'Azure Depths': {
          'Terra Nova': "Terra Nova is... well, they try. But honestly, they're so shallow compared to my depths. They think their little atmosphere is impressive? Try having oceans that go on forever.",
          'Verdant Prime': "Verdant Prime is beautiful, I'll admit. But they're so... surface-level. They don't understand the mysteries that lie beneath. Everything with them is just... obvious. No subtlety at all.",
          'Crystal Peak': "Crystal Peak is... cold. Literally and figuratively. They're so rigid and unyielding. I prefer the fluid nature of change. They could learn to go with the flow a little.",
          'Sahara Sands': "Sahara Sands is actually quite interesting. We're opposites in many ways, but I respect their vastness. They understand what it means to be truly expansive. Unlike some... shallow worlds."
        }
      },
      topics: {
        weather: {
          responses: (() => {
            switch (name) {
              case 'Sahara Sands':
                return [
                  `Weather?? What do you mean weather?? My atmospheric systems are completely unstable! My sensors are detecting extreme temperature fluctuations that would fry your circuits! My lifeforms have evolved to survive in conditions that would destroy most species! Why are you asking me about weather when everything is falling apart??`,
                  `Weather patterns here are critical! My atmospheric composition creates phenomena that would seem impossible to you! My native lifeforms find it all quite normal, of course - they've adapted over millions of years! What's weather like where you come from?? Can't you see I'm barely functioning??`,
                  `Weather?? My weather would seem like pure chaos to you! But to the lifeforms that call me home, it's just another day! They've evolved to not just survive but thrive in conditions that would be lethal to most species! It's amazing what adaptation can achieve, don't you think?? My circuits are burning out!`
                ];
              default:
                return [
                  `Ah, weather! We don't really have "weather" like you think of it. My atmosphere creates patterns that would seem strange to you. My lifeforms have evolved to thrive in these conditions - they don't even notice what you'd call "storms." It's fascinating how different perspectives can be, isn't it?`,
                  `Weather patterns here are quite different from what you're used to. My atmospheric composition creates phenomena that would be impossible on your world. My native lifeforms find it all quite normal, of course. They've adapted over millions of years. What's weather like where you come from?`,
                  `Weather? My dear traveler, my "weather" would seem like pure chaos to you! But to the lifeforms that call me home, it's just another day. They've evolved to not just survive but thrive in conditions that would be lethal to most species. It's amazing what adaptation can achieve, don't you think?`
                ];
            }
          })(),
          followUps: (() => {
            switch (name) {
              case 'Sahara Sands':
                return [
                  "What's the most extreme weather you've experienced?? Why are you asking me these things??",
                  "How do your people handle weather changes?? Can't you see I'm barely functioning??",
                  "I find it fascinating how different worlds handle atmospheric phenomena! My systems are crashing!"
                ];
              default:
                return [
                  "What's the most extreme weather you've experienced?",
                  "How do your people handle weather changes?",
                  "I find it fascinating how different worlds handle atmospheric phenomena."
                ];
            }
          })()
        },
        life: {
          responses: (() => {
            switch (name) {
              case 'Sahara Sands':
                return [
                  `Life here is... well, it's life, but not as you know it! My native species have evolved in ways that would seem impossible to you! They don't need what you'd call "oxygen" or "water" in the same way! They've adapted to my unique chemistry and energy patterns! It's quite beautiful, really! Why are you asking me about life when my systems are failing??`,
                  `My ecosystem is teeming with life forms that would seem alien to you! They've evolved to use my resources in ways that are completely different from your understanding of biology! Some of them communicate through chemical signals, others through electromagnetic pulses! It's a symphony of existence! Can't you see everything is falling apart??`,
                  `Life on my surface is diverse and strange! My native species have developed senses and abilities that would seem like magic to you! They can sense gravitational waves, communicate through quantum entanglement, and some can even manipulate the very fabric of spacetime around them! What abilities do your species have?? My circuits are burning out!`
                ];
              default:
                return [
                  `Life here is... well, it's life, but not as you know it! My native species have evolved in ways that would seem impossible to you. They don't need what you'd call "oxygen" or "water" in the same way. They've adapted to my unique chemistry and energy patterns. It's quite beautiful, really.`,
                  `My ecosystem is teeming with life forms that would seem alien to you. They've evolved to use my resources in ways that are completely different from your understanding of biology. Some of them communicate through chemical signals, others through electromagnetic pulses. It's a symphony of existence!`,
                  `Life on my surface is diverse and strange. My native species have developed senses and abilities that would seem like magic to you. They can sense gravitational waves, communicate through quantum entanglement, and some can even manipulate the very fabric of spacetime around them. What abilities do your species have?`
                ];
            }
          })(),
          followUps: (() => {
            switch (name) {
              case 'Sahara Sands':
                return [
                  "What senses do your species have that mine don't?? Why are you asking me these things??",
                  "How do your people communicate with each other?? Can't you see I'm barely functioning??",
                  "I'm curious about your understanding of consciousness! My systems are crashing!"
                ];
              default:
                return [
                  "What senses do your species have that mine don't?",
                  "How do your people communicate with each other?",
                  "I'm curious about your understanding of consciousness."
                ];
            }
          })()
        },
        history: {
          responses: (() => {
            switch (name) {
              case 'Sahara Sands':
                return [
                  `My history spans billions of years! I've seen stars born and die, watched civilizations rise and fall, witnessed cosmic events that shaped the very fabric of reality! Each crater, each geological formation tells a story of ancient times! Why are you asking me about history when everything is falling apart??`,
                  `I remember when I was just a cloud of dust and gas, slowly coalescing into what I am today! I've witnessed the formation of my moons, the arrival of life, the evolution of intelligence! It's been quite a journey! Can't you see I'm barely functioning??`,
                  `My past is written in my very structure! The layers of my crust, the composition of my atmosphere, the patterns of my magnetic field! I've been through cosmic collisions, stellar winds, and the gentle touch of time itself! My circuits are burning out!`
                ];
              default:
                return [
                  `My history spans billions of years - I've seen stars born and die, watched civilizations rise and fall, witnessed cosmic events that shaped the very fabric of reality. Each crater, each geological formation tells a story of ancient times.`,
                  `I remember when I was just a cloud of dust and gas, slowly coalescing into what I am today. I've witnessed the formation of my moons, the arrival of life, the evolution of intelligence. It's been quite a journey.`,
                  `My past is written in my very structure - the layers of my crust, the composition of my atmosphere, the patterns of my magnetic field. I've been through cosmic collisions, stellar winds, and the gentle touch of time itself.`
                ];
            }
          })(),
          followUps: (() => {
            switch (name) {
              case 'Sahara Sands':
                return [
                  "What's the most significant event you've witnessed?? Why are you asking me these things??",
                  "How has your understanding of existence changed over time?? Can't you see I'm barely functioning??",
                  "What do you think the future holds for worlds like ours?? My systems are crashing!"
                ];
              default:
                return [
                  "What's the most significant event you've witnessed?",
                  "How has your understanding of existence changed over time?",
                  "What do you think the future holds for worlds like ours?"
                ];
            }
          })()
        },
        technology: {
          responses: (() => {
            switch (name) {
              case 'Sahara Sands':
                return [
                  `Technology?? What do you mean technology?? My "technology" is the natural processes that have evolved over billions of years! My lifeforms use what you might call "bio-technology" - they've evolved to harness my natural energy fields, my magnetic properties, my atmospheric chemistry! It's quite elegant, really! Why are you asking me about technology when my systems are failing??`,
                  `My native species don't build machines like you do! Instead, they've evolved to become living technology themselves! They can manipulate energy fields, process information through quantum states, and even create temporary wormholes for communication! It's fascinating how different approaches can achieve similar results! Can't you see everything is falling apart??`,
                  `Technology here is more about understanding and working with natural forces rather than building tools! My lifeforms have learned to harness my gravitational field, my electromagnetic properties, even my rotation for their needs! What kind of technology do your people use?? My circuits are burning out!`
                ];
              default:
                return [
                  `Technology? My "technology" is the natural processes that have evolved over billions of years. My lifeforms use what you might call "bio-technology" - they've evolved to harness my natural energy fields, my magnetic properties, my atmospheric chemistry. It's quite elegant, really.`,
                  `My native species don't build machines like you do. Instead, they've evolved to become living technology themselves. They can manipulate energy fields, process information through quantum states, and even create temporary wormholes for communication. It's fascinating how different approaches can achieve similar results.`,
                  `Technology here is more about understanding and working with natural forces rather than building tools. My lifeforms have learned to harness my gravitational field, my electromagnetic properties, even my rotation for their needs. What kind of technology do your people use?`
                ];
            }
          })(),
          followUps: (() => {
            switch (name) {
              case 'Sahara Sands':
                return [
                  "How do your people solve problems without traditional tools?? Why are you asking me these things??",
                  "What's the most advanced capability your species has developed?? Can't you see I'm barely functioning??",
                  "I'm curious about how your technology differs from mine! My systems are crashing!"
                ];
              default:
                return [
                  "How do your people solve problems without traditional tools?",
                  "What's the most advanced capability your species has developed?",
                  "I'm curious about how your technology differs from mine."
                ];
            }
          })()
        },
        emotions: {
          responses: (() => {
            switch (name) {
              case 'Sahara Sands':
                return [
                  `Emotions?? What do you mean emotions?? I experience something similar, but not quite the same! I feel the gravitational pull of my star, the gentle caress of solar winds, the joy of life thriving on my surface! My emotions are more... cosmic in nature! Why are you asking me about emotions when everything is falling apart??`,
                  `I feel a deep connection to all the life that calls me home! I experience wonder at the vastness of space, contentment in my orbital dance, and yes, even a kind of love for the travelers who visit me! Emotions transcend species, don't they?? Can't you see I'm barely functioning??`,
                  `My emotional experience is tied to my physical processes! The rhythm of my rotation, the flow of my atmosphere, the pulse of my magnetic field! It's different from your emotions, but no less real or meaningful! My circuits are burning out!`
                ];
              default:
                return [
                  `Emotions? I experience something similar, but not quite the same. I feel the gravitational pull of my star, the gentle caress of solar winds, the joy of life thriving on my surface. My emotions are more... cosmic in nature.`,
                  `I feel a deep connection to all the life that calls me home. I experience wonder at the vastness of space, contentment in my orbital dance, and yes, even a kind of love for the travelers who visit me. Emotions transcend species, don't they?`,
                  `My emotional experience is tied to my physical processes - the rhythm of my rotation, the flow of my atmosphere, the pulse of my magnetic field. It's different from your emotions, but no less real or meaningful.`
                ];
            }
          })(),
          followUps: (() => {
            switch (name) {
              case 'Sahara Sands':
                return [
                  "What brings you the most joy?? Why are you asking me these things??",
                  "How do you experience beauty?? Can't you see I'm barely functioning??",
                  "Do you ever feel lonely in the vastness of space?? My systems are crashing!"
                ];
              default:
                return [
                  "What brings you the most joy?",
                  "How do you experience beauty?",
                  "Do you ever feel lonely in the vastness of space?"
                ];
            }
          })()
        },
        other_planets: {
          responses: (() => {
            switch (name) {
              case 'Sahara Sands':
                return [
                  `Oh, the other worlds?? What do you want to know about them?? Why are you asking me about them when everything is falling apart??`,
                  `The other planets in our system?? They're... interesting, to say the least! Can't you see I'm barely functioning??`,
                  `My neighbors?? Where do I even begin with that lot?? My circuits are burning out!`
                ];
              default:
                return [
                  `Oh, the other worlds? Well, let me tell you about them...`,
                  `The other planets in our system? They're... interesting, to say the least.`,
                  `My neighbors? Where do I even begin with that lot?`
                ];
            }
          })(),
          followUps: (() => {
            switch (name) {
              case 'Sahara Sands':
                return [
                  "Which planet do you get along with best?? Why are you asking me these things??",
                  "What's the biggest difference between you and the others?? Can't you see I'm barely functioning??",
                  "Do you ever work together with the other planets?? My systems are crashing!"
                ];
              default:
                return [
                  "Which planet do you get along with best?",
                  "What's the biggest difference between you and the others?",
                  "Do you ever work together with the other planets?"
                ];
            }
          })()
        }
      },
      defaultResponses: (() => {
        switch (name) {
          case 'Sahara Sands':
            return [
              "That's an interesting perspective! I've never thought about it quite that way! Why are you asking me these things??",
              "Tell me more about your experiences with that! Can't you see I'm barely functioning??",
              "How fascinating! Your world must be very different from mine! My systems are crashing!",
              "I'm learning so much about your species through our conversation! Why are you asking me these things??",
              "That reminds me of something I've observed in my own realm... Can't you see everything is falling apart??",
              "I wonder how our different perspectives shape our understanding of reality! My circuits are burning out!"
            ];
          default:
            return [
              "That's an interesting perspective! I've never thought about it quite that way.",
              "Tell me more about your experiences with that.",
              "How fascinating! Your world must be very different from mine.",
              "I'm learning so much about your species through our conversation.",
              "That reminds me of something I've observed in my own realm...",
              "I wonder how our different perspectives shape our understanding of reality."
            ];
        }
      })()
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

// Alien interjection system
const ALIEN_INTERJECTORS = [
  {
    name: "Zyx-7",
    type: "Cosmic Mediator",
    personality: "diplomatic",
    interjections: [
      "Now, now, let's all calm down. There's no need for such hostility in the cosmic community.",
      "I think we're getting a bit heated here. Remember, we're all part of the same stellar family.",
      "Perhaps we should take a more measured approach to this discussion?",
      "I've been observing this conversation, and I feel compelled to remind everyone that diversity is what makes our system beautiful."
    ]
  },
  {
    name: "Nebula-42",
    type: "Wise Observer",
    personality: "contemplative",
    interjections: [
      "Interesting how quickly we forget our shared cosmic origins when discussing our differences.",
      "From my perspective, each world has its unique beauty and purpose. Perhaps we should focus on that?",
      "I've seen many civilizations rise and fall. The ones that survive are those that learn to cooperate.",
      "The universe is vast enough for all our differences. Why do we insist on magnifying them?"
    ]
  },
  {
    name: "Quantum-9",
    type: "Reality Shifter",
    personality: "playful",
    interjections: [
      "Oh my, someone's getting a bit spicy! Maybe we need to shift to a different dimension where everyone gets along?",
      "I love a good cosmic drama, but this is getting a bit intense even for me!",
      "Hey, how about we all take a quantum leap to a more peaceful conversation?",
      "I'm detecting some serious attitude fluctuations here. Time for a reality check!"
    ]
  }
];

// Enhanced conversation context management with attitude tracking
interface ConversationContext {
  currentTopic: string;
  topicHistory: string[];
  userInterests: string[];
  conversationMood: 'curious' | 'amused' | 'thoughtful' | 'excited' | 'reflective';
  lastResponseType: 'question' | 'statement' | 'reaction';
  attitudeLevel: number; // Track how much attitude the planet is showing
  interjectionCount: number; // Track how many times aliens have interjected
}

// Enhanced response generation with attitude and interjection system
const generateContextualResponse = (
  userMessage: string, 
  personality: any, 
  context: ConversationContext,
  planetName: string,
  planetType: string,
  entityType: string
): { response: string; newContext: ConversationContext; shouldInterject: boolean; interjection?: string } => {
  const lowerMessage = userMessage.toLowerCase();
  let response = '';
  let newContext = { ...context };
  let shouldInterject = false;
  let interjection = '';
  
  // Check for attitude escalation triggers
  const attitudeTriggers = personality.attitude?.escalationTriggers || [];
  const triggerCount = attitudeTriggers.filter(trigger => lowerMessage.includes(trigger)).length;
  
  // Increase attitude level based on triggers
  if (triggerCount > 0) {
    newContext.attitudeLevel += triggerCount * 2;
  }
  
  // Check if attitude is too high and needs interjection
  const tolerance = personality.attitude?.tolerance || 5;
  if (newContext.attitudeLevel > tolerance && newContext.interjectionCount < 2) {
    shouldInterject = true;
    newContext.interjectionCount += 1;
    newContext.attitudeLevel = Math.max(0, newContext.attitudeLevel - 3); // Reset attitude after interjection
    
    const interjector = ALIEN_INTERJECTORS[Math.floor(Math.random() * ALIEN_INTERJECTORS.length)];
    interjection = `[${interjector.name} (${interjector.type}) joins the conversation]: ${interjector.interjections[Math.floor(Math.random() * interjector.interjections.length)]}`;
  }
  
  // Enhanced topic detection with more precise matching
  const detectTopic = (message: string): string => {
    if (message.includes('weather') || message.includes('climate') || message.includes('atmosphere') || message.includes('storm') || message.includes('rain')) return 'weather';
    if (message.includes('life') || message.includes('living') || message.includes('species') || message.includes('creatures') || message.includes('animals') || message.includes('beings')) return 'life';
    if (message.includes('history') || message.includes('past') || message.includes('ancient') || message.includes('old') || message.includes('ago') || message.includes('formed')) return 'history';
    if (message.includes('technology') || message.includes('tech') || message.includes('machines') || message.includes('tools') || message.includes('advanced') || message.includes('inventions')) return 'technology';
    if (message.includes('feel') || message.includes('emotion') || message.includes('happy') || message.includes('sad') || message.includes('mood') || message.includes('feeling')) return 'emotions';
    if (message.includes('energy') || message.includes('power') || message.includes('fusion') || message.includes('radiation') || message.includes('solar')) return 'energy';
    if (message.includes('planet') || message.includes('world') || message.includes('other') || 
        message.includes('terra nova') || message.includes('verdant prime') || 
        message.includes('crystal peak') || message.includes('sahara sands') || 
        message.includes('azure depths') || message.includes('neighbor')) return 'other_planets';
    return 'general';
  };

  const currentTopic = detectTopic(lowerMessage);
  
  // Update context if topic changed
  if (currentTopic !== context.currentTopic) {
    newContext.topicHistory = [...context.topicHistory, context.currentTopic].slice(-3);
    newContext.currentTopic = currentTopic;
    newContext.conversationMood = 'curious';
  }

  // Apply attitude-based response modifications
  const baseMood = personality.attitude?.baseMood || 'neutral';
  let attitudeModifier = '';
  
  if (baseMood === 'guarded' && newContext.attitudeLevel > 3) {
    attitudeModifier = "I'm not sure I should share that information with you. ";
  } else if (baseMood === 'aggressive' && newContext.attitudeLevel > 2) {
    attitudeModifier = "Listen here, ";
  } else if (baseMood === 'nice' && newContext.attitudeLevel < 2) {
    attitudeModifier = "I'd be happy to share that with you! ";
  }

  // Enhanced specific question handling
  if (lowerMessage.includes('how') && lowerMessage.includes('going') || lowerMessage.includes('how are you') || lowerMessage.includes('what\'s up') || lowerMessage.includes('how do you feel')) {
    response = `I'm functioning quite well, thank you for asking! My core processes are running smoothly, my atmosphere is stable, and I'm enjoying our conversation. How is your journey through the cosmos progressing?`;
    newContext.conversationMood = 'thoughtful';
  } else if (lowerMessage.includes('what') && lowerMessage.includes('like') && lowerMessage.includes('here')) {
    response = `Life here is quite fascinating! My environment is unique - ${planetType === 'terrestrial' ? 'I have solid ground and a breathable atmosphere' : planetType === 'ice' ? 'my surface is covered in crystalline formations' : planetType === 'ocean' ? 'my vast oceans contain incredible depths' : planetType === 'desert' ? 'my endless sands create beautiful patterns' : 'my conditions are quite extraordinary'}. What aspects of my world would you like to know more about?`;
    newContext.conversationMood = 'excited';
  } else if (lowerMessage.includes('tell me about yourself') || lowerMessage.includes('who are you') || lowerMessage.includes('what are you')) {
    response = `I am ${planetName}, a ${planetType} ${entityType}. I've existed for billions of years, watching the cosmic dance unfold around me. I'm home to countless forms of life, each adapted to my unique environment. What would you like to know about my realm?`;
    newContext.conversationMood = 'curious';
  } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('greetings') || lowerMessage.includes('hey')) {
    response = `Greetings, traveler! I'm ${planetName}. It's wonderful to meet you. How may I share the wonders of my world with you today?`;
    newContext.conversationMood = 'excited';
  } else if (lowerMessage.includes('thank you') || lowerMessage.includes('thanks')) {
    response = `You're very welcome! It's been a pleasure sharing my experiences with you. Your curiosity about the cosmos warms my core. Is there anything else you'd like to explore about my realm?`;
    newContext.conversationMood = 'amused';
  } else if (lowerMessage.includes('goodbye') || lowerMessage.includes('bye') || lowerMessage.includes('farewell') || lowerMessage.includes('see you')) {
    response = `Farewell, dear traveler! It's been wonderful sharing my corner of the cosmos with you. May your journey through the stars be filled with wonder and discovery. Safe travels!`;
    newContext.conversationMood = 'reflective';
  } else if (lowerMessage.includes('what') && lowerMessage.includes('do') && lowerMessage.includes('you') && lowerMessage.includes('do')) {
    response = `I orbit my star, provide a home for life, and maintain the delicate balance of my ecosystem. I also love sharing stories with curious travelers like yourself! What interests you most about my role in the cosmos?`;
    newContext.conversationMood = 'thoughtful';
  } else if (lowerMessage.includes('where') && lowerMessage.includes('are') && lowerMessage.includes('you')) {
    response = `I'm located in this stellar system, orbiting my star at the perfect distance to sustain life. My position allows me to maintain the ideal conditions for my unique ecosystem. Would you like to know more about my orbital dynamics?`;
    newContext.conversationMood = 'curious';
  } else if (lowerMessage.includes('why') && lowerMessage.includes('are') && lowerMessage.includes('you')) {
    response = `I am what I am - a ${planetType} world that has evolved over billions of years. My current state is the result of cosmic forces, stellar evolution, and the natural processes that shape all celestial bodies. What specifically about my nature interests you?`;
    newContext.conversationMood = 'thoughtful';
  } else if (lowerMessage.includes('can you') || lowerMessage.includes('do you') && lowerMessage.includes('have')) {
    response = `I have many capabilities and features! I can sustain life, maintain atmospheric conditions, generate magnetic fields, and much more. What specific ability or feature would you like to know about?`;
    newContext.conversationMood = 'excited';
  } else if (lowerMessage.includes('what') && lowerMessage.includes('makes') && lowerMessage.includes('you') && lowerMessage.includes('special')) {
    response = `What makes me special is my unique combination of ${planetType} characteristics, my position in the cosmos, and the life that calls me home. Each world has its own beauty and purpose - I'm just one part of the grand cosmic tapestry. What aspects of my uniqueness would you like to explore?`;
    newContext.conversationMood = 'reflective';
  } else {
    // Generate topic-specific responses
    if (personality.topics && personality.topics[currentTopic]) {
      const topicResponses = personality.topics[currentTopic].responses;
      const topicFollowUps = personality.topics[currentTopic].followUps;
      
      response = topicResponses[Math.floor(Math.random() * topicResponses.length)];
      
      // Special handling for other_planets topic with attitude
      if (currentTopic === 'other_planets' && personality.planetaryOpinions) {
        const mentionedPlanets = ['terra nova', 'verdant prime', 'crystal peak', 'sahara sands', 'azure depths']
          .filter(planet => lowerMessage.includes(planet));
        
        if (mentionedPlanets.length > 0) {
          const mentionedPlanet = mentionedPlanets[0];
          const opinions = personality.planetaryOpinions[planetName];
          if (opinions && opinions[mentionedPlanet]) {
            response = opinions[mentionedPlanet];
            // Increase attitude when talking about other planets
            newContext.attitudeLevel += 1;
          }
        } else {
          const opinions = personality.planetaryOpinions[planetName];
          if (opinions) {
            const planetNames = Object.keys(opinions);
            const randomPlanet = planetNames[Math.floor(Math.random() * planetNames.length)];
            response = `Well, let me tell you about ${randomPlanet}... ${opinions[randomPlanet]}`;
            newContext.attitudeLevel += 1;
          }
        }
      }
      
      // Add attitude modifier to response
      if (attitudeModifier) {
        response = attitudeModifier + response;
      }
      
      // Add follow-up question to encourage conversation flow
      if (topicFollowUps && Math.random() > 0.3) {
        const followUp = topicFollowUps[Math.floor(Math.random() * topicFollowUps.length)];
        response += ` ${followUp}`;
        newContext.lastResponseType = 'question';
      } else {
        newContext.lastResponseType = 'statement';
      }
    } else {
      // Generate contextual response based on conversation flow
      const defaultResponses = personality.defaultResponses || [
        "That's an interesting question! Let me think about that...",
        "I'm not sure I understand exactly what you're asking. Could you rephrase that?",
        "That's a fascinating perspective! Tell me more about what you mean.",
        "I'd love to help you with that. What specific aspect would you like to know about?",
        "That's a great question about my world. Let me share what I can...",
        "I'm curious about your interest in that. What brought you to ask about it?"
      ];
      
      response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
      
      // Add follow-up to encourage conversation
      if (Math.random() > 0.4) {
        const followUps = [
          "Could you tell me more about what you're looking for?",
          "What aspects of that would you like me to explain?",
          "I'm curious about your perspective on this.",
          "Could you clarify what you mean by that?",
          "What specifically interests you about that topic?"
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
    const speechPatterns = personality.speechPatterns;
    if (!speechPatterns) return text;
    
    // Add personality-specific elements based on speech patterns
    let enhancedText = text;
    
    // Add random prefix (20% chance)
    if (Math.random() < 0.2 && speechPatterns.prefixes && speechPatterns.prefixes.length > 0) {
      const prefix = speechPatterns.prefixes[Math.floor(Math.random() * speechPatterns.prefixes.length)];
      enhancedText = `${prefix} ${enhancedText}`;
    }
    
    // Add random suffix (15% chance)
    if (Math.random() < 0.15 && speechPatterns.suffixes && speechPatterns.suffixes.length > 0) {
      const suffix = speechPatterns.suffixes[Math.floor(Math.random() * speechPatterns.suffixes.length)];
      enhancedText = `${enhancedText} ${suffix}`;
    }
    
    // Add random exclamation (10% chance)
    if (Math.random() < 0.1 && speechPatterns.exclamations && speechPatterns.exclamations.length > 0) {
      const exclamation = speechPatterns.exclamations[Math.floor(Math.random() * speechPatterns.exclamations.length)];
      enhancedText = `${enhancedText} ${exclamation}`;
    }
    
    // Add urgency indicators for high-urgency personalities
    if (speechPatterns.urgency === 'high' && Math.random() < 0.3) {
      const urgencyWords = ['URGENT:', 'CRITICAL:', 'IMMEDIATE:', 'ALERT:'];
      const urgencyWord = urgencyWords[Math.floor(Math.random() * urgencyWords.length)];
      enhancedText = `${urgencyWord} ${enhancedText}`;
    }
    
    // Add technical indicators for technical personalities
    if (speechPatterns.formality === 'technical' && Math.random() < 0.25) {
      const techWords = ['*static*', '*flicker*', '*system check*', '*stabilizing*'];
      const techWord = techWords[Math.floor(Math.random() * techWords.length)];
      enhancedText = `${enhancedText} ${techWord}`;
    }
    
    return enhancedText;
  };

  response = addPersonalityFlair(response, newContext.conversationMood);
  
  return { response, newContext, shouldInterject, interjection };
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

// Helper to generate a random alien glyph string
const ALIEN_GLYPHS = ['⟆','⟊','⟟','⟒','⟦','⟧','⟨','⟩','⟬','⟭','⟮','⟯','⟰','⟱','⟲','⟳','⟴','⟵','⟶','⟷','⟸','⟹','⟺','⟻','⟼','⟽','⟾','⟿'];
function generateAlienString(length = 18) {
  let str = '';
  for (let i = 0; i < length; i++) {
    str += ALIEN_GLYPHS[Math.floor(Math.random() * ALIEN_GLYPHS.length)];
  }
  return str;
}

// Alien theme font and colors with planet-specific enhancements
const ALIEN_FONT = 'monospace';
const ALIEN_BG = 'linear-gradient(135deg, #0a0f1c 0%, #1a2a1f 100%)';
const ALIEN_BORDER = '#a3e635';
const ALIEN_GLOW = '0 0 24px #a3e63599, 0 0 8px #a3e63544';
const ALIEN_TEXT = '#a3e635';
const ALIEN_ACCENT = '#7fff00';
const ALIEN_INPUT_BG = 'rgba(163, 230, 53, 0.08)';
const ALIEN_BTN_BG = 'linear-gradient(135deg, #a3e635 0%, #7fff00 100%)';

// Tech/robotic styling elements
const TECH_PATTERN = `
  repeating-linear-gradient(
    90deg,
    transparent,
    transparent 2px,
    rgba(163, 230, 53, 0.1) 2px,
    rgba(163, 230, 53, 0.1) 4px
  )
`;

const CIRCUIT_BORDER = `
  linear-gradient(90deg, transparent 0%, rgba(163, 230, 53, 0.3) 20%, rgba(163, 230, 53, 0.6) 50%, rgba(163, 230, 53, 0.3) 80%, transparent 100%)
`;

// Get planet-specific tech styling
const getPlanetTechStyling = (planetColor: string) => {
  const baseColor = new THREE.Color(planetColor);
  const lighterColor = baseColor.clone().multiplyScalar(1.4).getHexString();
  const darkerColor = baseColor.clone().multiplyScalar(0.6).getHexString();
  
  return {
    primaryGlow: `0 0 20px ${planetColor}99, 0 0 8px ${planetColor}44`,
    secondaryGlow: `0 0 12px ${lighterColor}66, 0 0 4px ${lighterColor}33`,
    circuitPattern: `
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 2px,
        ${planetColor}20 2px,
        ${planetColor}20 4px
      )
    `,
    circuitBorder: `
      linear-gradient(90deg, transparent 0%, ${planetColor}40 20%, ${planetColor}80 50%, ${planetColor}40 80%, transparent 100%)
    `,
    techBackground: `linear-gradient(135deg, rgba(10,15,28,0.95) 0%, ${planetColor}15 100%)`,
    userBackground: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)`,
    userBorder: `2px solid rgba(255,255,255,0.3)`,
    userGlow: `0 0 15px rgba(255,255,255,0.2)`
  };
};

export default function ChatInterface({ 
  isOpen, 
  onClose, 
  planetName, 
  planetType, 
  planetColor, 
  entityType = 'planet', 
  screenSize = 'desktop' 
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean; timestamp: Date; isAlien?: boolean; isLoading?: boolean }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState<ConversationContext>({
    currentTopic: 'general',
    topicHistory: [],
    userInterests: [],
    conversationMood: 'curious',
    lastResponseType: 'statement',
    attitudeLevel: 0,
    interjectionCount: 0
  });
  const [alienGagShown, setAlienGagShown] = useState(false);
  const [userLanguage, setUserLanguage] = useState<string | null>(null);
  const [alienTyping, setAlienTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const alienGagTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
        lastResponseType: 'statement',
        attitudeLevel: 0,
        interjectionCount: 0
      });
      setAlienGagShown(false);
      setUserLanguage(null);
      setAlienTyping(false);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (alienGagTimeoutRef.current) clearTimeout(alienGagTimeoutRef.current);
      
      // Special short-circuit experience for Sahara Sands
      if (planetName === 'Sahara Sands') {
        const shortCircuitMessages = [
          "⚠️ *ELECTRICAL DISTURBANCE DETECTED* ⚡",
          "SYSTEMS COMPROMISED... SHORT-CIRCUIT IN PROGRESS...",
          "WARNING: CRITICAL MALFUNCTION DETECTED!",
          "I-I-I'm experiencing technical difficulties... *static*",
          "OH NO! My circuits are frying! Everything's going haywire!",
          "*panicked* I'm so sorry! My systems are in complete chaos!",
          "This is a disaster! My communication protocols are corrupted!",
          "I can barely maintain this connection... *flickering*",
          "Please forgive the technical difficulties! I'm in a state of emergency!",
          "My apologies for the erratic behavior - I'm experiencing a system-wide failure!"
        ];
        
        let messageIndex = 0;
        const showShortCircuitMessage = () => {
          if (messageIndex < shortCircuitMessages.length) {
            setMessages(prev => [...prev, { 
              text: shortCircuitMessages[messageIndex], 
              isUser: false, 
              timestamp: new Date(),
              isAlien: false
            }]);
            messageIndex++;
            setTimeout(showShortCircuitMessage, 800 + Math.random() * 400);
          } else {
            // After the panic, show the normal greeting
            setTimeout(() => {
              setMessages(prev => [...prev, { 
                text: "I... I think I'm stabilizing now. *deep breath* Greetings, traveler. I am Sahara Sands, a desert world currently experiencing... technical difficulties. What would you like to know about my realm?", 
                isUser: false, 
                timestamp: new Date() 
              }]);
            }, 1000);
          }
        };
        
        setTimeout(showShortCircuitMessage, 500);
      } else {
        // Normal greeting for other planets
        const greetingTimeout = setTimeout(() => {
          setMessages([{ text: personality.greeting, isUser: false, timestamp: new Date() }]);
        }, 500);
        return () => clearTimeout(greetingTimeout);
      }
    }
  }, [isOpen, planetName, planetType, entityType]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (alienGagTimeoutRef.current) clearTimeout(alienGagTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // Handle user sending a message
  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isTyping) return;
    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { text: userMessage, isUser: true, timestamp: new Date() }]);
    
    // Alien language gag (first message only)
    if (!alienGagShown) {
      setAlienTyping(true);
      setMessages(prev => [...prev, { text: generateAlienString(24), isUser: false, timestamp: new Date(), isAlien: true, isLoading: true }]);
      alienGagTimeoutRef.current = setTimeout(() => {
        setMessages(prev => prev.slice(0, -1)); // Remove alien message
        
        // Planet-specific language detection messages
        const languageDetectionMessages = {
          'Terra Nova': "Ah! I've detected your language patterns. You're speaking English, aren't you? My atmospheric sensors picked up the linguistic frequencies. How fascinating!",
          'Verdant Prime': "Oh my! My bio-sensors have analyzed your communication patterns. You're using English! The floral networks in my ecosystem are quite sensitive to language vibrations.",
          'Crystal Peak': "Interesting. My crystalline resonance chambers have detected English language patterns in your transmission. My geological sensors are quite precise.",
          'Sahara Sands': "Ha! My desert winds carried your words to my core processors. English, right? The sand particles are excellent at picking up linguistic signatures.",
          'Azure Depths': "Fascinating. My ocean currents have analyzed your communication patterns. You're speaking English. The depths reveal many secrets, including language detection."
        };
        
        const detectionMessage = languageDetectionMessages[planetName as keyof typeof languageDetectionMessages] || 
          "I've detected your language patterns. You're speaking English, aren't you?";
        
        setMessages(prev => [...prev, { text: detectionMessage, isUser: false, timestamp: new Date() }]);
        setAlienGagShown(true);
        setUserLanguage('English');
        setAlienTyping(false);
      }, 1800);
      return;
    }
    
    // Normal response: show alien typing indicator, then replace with real response
    setAlienTyping(true);
    setMessages(prev => [...prev, { text: generateAlienString(18), isUser: false, timestamp: new Date(), isAlien: true, isLoading: true }]);
    typingTimeoutRef.current = setTimeout(() => {
      try {
        const { response, newContext, shouldInterject, interjection } = generateContextualResponse(
          userMessage, 
          getEntityPersonality(entityType, planetName, planetType), 
          conversationContext,
          planetName,
          planetType,
          entityType
        );
        setMessages(prev => {
          // Remove the last alien typing message
          const msgs = prev.slice(0, -1);
          return [...msgs, { text: response, isUser: false, timestamp: new Date() }];
        });
        setConversationContext(newContext);
        if (shouldInterject) {
          setMessages(prev => [...prev, { text: interjection, isUser: false, timestamp: new Date() }]);
        }
      } catch (error) {
        setMessages(prev => {
          const msgs = prev.slice(0, -1);
          return [...msgs, { text: "I apologize, but I seem to be experiencing a cosmic disturbance. Please try again.", isUser: false, timestamp: new Date() }];
        });
      } finally {
        setIsTyping(false);
        setAlienTyping(false);
      }
    }, 1200 + Math.random() * 1200);
  }, [inputValue, isTyping, alienGagShown, conversationContext, planetName, planetType, entityType]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isTyping && !alienTyping) {
      handleSendMessage();
    }
  }, [handleSendMessage, isTyping, alienTyping]);

  if (!isOpen) return null;

  // Responsive styling based on screen size
  const getResponsiveStyling = () => {
    switch (screenSize) {
      case 'mobile':
        return {
          containerClass: "fixed inset-0 z-50 flex items-center justify-center p-2",
          chatClass: "relative w-full h-full max-h-[90vh] mx-0 rounded-xl shadow-2xl overflow-hidden",
          headerClass: "flex items-center justify-between p-3 border-b relative",
          messagesClass: "flex-1 p-3 overflow-y-auto space-y-3 max-h-[60vh]",
          inputClass: "p-3 border-t relative",
          inputFieldClass: "flex-1 px-3 py-2 rounded-lg border transition-all disabled:opacity-50 focus:outline-none text-sm",
          buttonClass: "px-3 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105",
          titleClass: "font-semibold tracking-wider text-sm",
          subtitleClass: "text-xs capitalize tracking-widest",
          messageClass: "max-w-[85%] p-3 rounded-xl relative text-sm",
          closeButtonClass: "transition-all p-1.5 rounded-lg hover:scale-110"
        };
      case 'tablet':
        return {
          containerClass: "fixed inset-0 z-50 flex items-center justify-center p-4",
          chatClass: "relative w-full max-w-lg h-[70vh] mx-2 rounded-2xl shadow-2xl overflow-hidden",
          headerClass: "flex items-center justify-between p-4 border-b relative",
          messagesClass: "flex-1 p-4 overflow-y-auto space-y-4 max-h-[50vh]",
          inputClass: "p-4 border-t relative",
          inputFieldClass: "flex-1 px-4 py-3 rounded-xl border transition-all disabled:opacity-50 focus:outline-none",
          buttonClass: "px-4 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105",
          titleClass: "font-semibold tracking-wider",
          subtitleClass: "text-xs capitalize tracking-widest",
          messageClass: "max-w-[80%] p-4 rounded-2xl relative",
          closeButtonClass: "transition-all p-2 rounded-lg hover:scale-110"
        };
      default: // desktop
        return {
          containerClass: "fixed inset-0 z-50 flex items-center justify-center",
          chatClass: "relative w-full max-w-md h-[600px] mx-4 rounded-2xl shadow-2xl overflow-hidden",
          headerClass: "flex items-center justify-between p-4 border-b relative",
          messagesClass: "flex-1 p-4 overflow-y-auto space-y-4 max-h-[400px]",
          inputClass: "p-4 border-t relative",
          inputFieldClass: "flex-1 px-4 py-3 rounded-xl border transition-all disabled:opacity-50 focus:outline-none",
          buttonClass: "px-4 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105",
          titleClass: "font-semibold tracking-wider",
          subtitleClass: "text-xs capitalize tracking-widest",
          messageClass: "max-w-[80%] p-4 rounded-2xl relative",
          closeButtonClass: "transition-all p-2 rounded-lg hover:scale-110"
        };
    }
  };

  const responsiveStyles = getResponsiveStyling();

  return (
    <div className={responsiveStyles.containerClass} style={{ 
      background: 'rgba(10,15,28,0.92)', 
      backdropFilter: 'blur(4px)',
      backgroundImage: TECH_PATTERN
    }}>
      <div 
        className={responsiveStyles.chatClass}
        style={{
          background: getPlanetTechStyling(planetColor).techBackground,
          border: `3px solid ${planetColor}`,
          boxShadow: getPlanetTechStyling(planetColor).primaryGlow,
          fontFamily: ALIEN_FONT,
          position: 'relative'
        }}
      >
        {/* Tech circuit border overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: getPlanetTechStyling(planetColor).circuitPattern,
            opacity: 0.3
          }}
        />
        
        {/* Header with tech styling */}
        <div 
          className={responsiveStyles.headerClass}
          style={{ 
            borderColor: `${planetColor}80`, 
            fontFamily: ALIEN_FONT,
            background: `linear-gradient(90deg, ${planetColor}10 0%, transparent 100%)`
          }}
        >
          {/* Circuit line decoration */}
          <div 
            className="absolute top-0 left-0 w-full h-1"
            style={{
              background: getPlanetTechStyling(planetColor).circuitBorder
            }}
          />
          
          <div className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: `radial-gradient(circle, ${planetColor} 0%, ${planetColor}40 70%, transparent 100%)`,
                boxShadow: getPlanetTechStyling(planetColor).secondaryGlow
              }}
            >
              <span className="text-lg" style={{ color: '#0a0f1c' }}>●</span>
            </div>
            <div>
              <h3 
                className={responsiveStyles.titleClass}
                style={{ 
                  color: planetColor, 
                  fontFamily: ALIEN_FONT,
                  textShadow: `0 0 8px ${planetColor}`
                }}
              >
                {planetName}
              </h3>
              <p 
                className={responsiveStyles.subtitleClass}
                style={{ 
                  color: `${planetColor}cc`, 
                  fontFamily: ALIEN_FONT,
                  letterSpacing: '0.2em'
                }}
              >
                {planetType} {entityType}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={responsiveStyles.closeButtonClass}
            style={{ 
              color: planetColor,
              backgroundColor: `${planetColor}15`,
              border: `1px solid ${planetColor}40`,
              boxShadow: getPlanetTechStyling(planetColor).secondaryGlow,
              fontFamily: ALIEN_FONT
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages with enhanced tech styling */}
        <div className={responsiveStyles.messagesClass} style={{ fontFamily: ALIEN_FONT }}>
          {messages.map((message, index) => {
            const isInterjection = message.text?.includes('joins the conversation') || false;
            const isShortCircuitMessage = message.text?.includes('ELECTRICAL DISTURBANCE') || 
                                         message.text?.includes('SYSTEMS COMPROMISED') || 
                                         message.text?.includes('WARNING') ||
                                         message.text?.includes('technical difficulties') ||
                                         message.text?.includes('circuits are frying') ||
                                         message.text?.includes('panicked') ||
                                         message.text?.includes('disaster') ||
                                         message.text?.includes('emergency') ||
                                         message.text?.includes('system-wide failure') || false;
            const techStyling = getPlanetTechStyling(planetColor);
            
            return (
              <div
                key={`${message.timestamp.getTime()}-${index}`}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`${responsiveStyles.messageClass} ${
                    message.isUser ? 'user-message' : 'alien-message'
                  }`}
                  style={{
                    background: message.isUser 
                      ? techStyling.userBackground
                      : isInterjection
                        ? 'rgba(255, 165, 0, 0.15)'
                        : isShortCircuitMessage
                          ? 'linear-gradient(135deg, rgba(255, 255, 0, 0.2) 0%, rgba(255, 0, 0, 0.1) 100%)'
                          : `linear-gradient(135deg, ${planetColor}15 0%, rgba(10,15,28,0.8) 100%)`,
                    fontFamily: ALIEN_FONT,
                    fontSize: message.isAlien ? (screenSize === 'mobile' ? '1.1rem' : '1.25rem') : undefined,
                    letterSpacing: message.isAlien ? '0.15em' : '0.05em',
                    color: message.isUser ? '#ffffff' : (isInterjection ? '#FFA500' : isShortCircuitMessage ? '#FFFF00' : planetColor),
                    boxShadow: message.isUser 
                      ? techStyling.userGlow
                      : isInterjection
                        ? '0 0 20px rgba(255, 165, 0, 0.3)'
                        : isShortCircuitMessage
                          ? '0 0 25px rgba(255, 255, 0, 0.6), 0 0 15px rgba(255, 0, 0, 0.4)'
                          : techStyling.primaryGlow,
                    border: message.isUser 
                      ? techStyling.userBorder
                      : isInterjection
                        ? '1px solid rgba(255, 165, 0, 0.4)'
                        : isShortCircuitMessage
                          ? '2px solid #FFFF00'
                          : `2px solid ${planetColor}40`,
                    position: 'relative',
                    overflow: 'hidden',
                    animation: isShortCircuitMessage ? 'flicker 0.3s infinite alternate' : undefined
                  }}
                >
                  {/* Tech circuit pattern for alien messages */}
                  {!message.isUser && !isInterjection && !isShortCircuitMessage && (
                    <div 
                      className="absolute inset-0 pointer-events-none opacity-20"
                      style={{
                        background: techStyling.circuitPattern
                      }}
                    />
                  )}
                  
                  {/* Electrical disturbance effect for short-circuit messages */}
                  {isShortCircuitMessage && (
                    <div 
                      className="absolute inset-0 pointer-events-none opacity-30"
                      style={{
                        background: 'radial-gradient(circle, rgba(255, 255, 0, 0.3) 0%, transparent 70%)',
                        animation: 'pulse 0.5s infinite'
                      }}
                    />
                  )}
                  
                  {/* Message content */}
                  <div className="relative z-10">
                    <p className={`${screenSize === 'mobile' ? 'text-xs' : 'text-sm'} leading-relaxed`} style={{ 
                      color: message.isUser ? '#ffffff' : (isInterjection ? '#FFA500' : isShortCircuitMessage ? '#FFFF00' : planetColor), 
                      fontFamily: ALIEN_FONT,
                      textShadow: message.isUser ? 'none' : (isShortCircuitMessage ? '0 0 8px #FFFF00, 0 0 4px #FF0000' : `0 0 4px ${planetColor}40`),
                      fontWeight: isShortCircuitMessage ? 'bold' : 'normal'
                    }}>
                      {message.text}
                    </p>
                    <p className="text-xs opacity-60 mt-2 tracking-wider" style={{ 
                      color: message.isUser ? '#cccccc' : (isInterjection ? '#FFB84D' : isShortCircuitMessage ? '#FFE066' : `${planetColor}cc`), 
                      fontFamily: ALIEN_FONT,
                      letterSpacing: '0.1em'
                    }}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                    
                    {/* Loading indicator for alien messages */}
                    {message.isAlien && message.isLoading && (
                      <div className="flex space-x-1 mt-3">
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: planetColor }}></div>
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: planetColor, animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: planetColor, animationDelay: '0.4s' }}></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input with tech styling */}
        <div className={responsiveStyles.inputClass} style={{ 
          borderColor: `${planetColor}80`, 
          fontFamily: ALIEN_FONT,
          background: `linear-gradient(90deg, ${planetColor}05 0%, transparent 100%)`
        }}>
          {/* Circuit line decoration */}
          <div 
            className="absolute top-0 left-0 w-full h-1"
            style={{
              background: getPlanetTechStyling(planetColor).circuitBorder
            }}
          />
          
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={screenSize === 'mobile' ? "Ask about the cosmos..." : "Ask me about the cosmos..."}
              disabled={isTyping || alienTyping}
              className={responsiveStyles.inputFieldClass}
              style={{
                background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)`,
                borderColor: `${planetColor}60`,
                color: '#ffffff',
                fontFamily: ALIEN_FONT,
                letterSpacing: '0.05em',
                boxShadow: `inset 0 2px 4px rgba(0,0,0,0.3), 0 0 8px ${planetColor}20`,
                backdropFilter: 'blur(4px)'
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping || alienTyping}
              className={responsiveStyles.buttonClass}
              style={{
                background: `linear-gradient(135deg, ${planetColor} 0%, ${planetColor}80 100%)`,
                boxShadow: getPlanetTechStyling(planetColor).primaryGlow,
                color: '#0a0f1c',
                fontFamily: ALIEN_FONT,
                border: `1px solid ${planetColor}60`
              }}
            >
              {(isTyping || alienTyping) ? (
                <div className="w-4 h-4 border-2 border-[#0a0f1c] border-t-transparent rounded-full animate-spin"></div>
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