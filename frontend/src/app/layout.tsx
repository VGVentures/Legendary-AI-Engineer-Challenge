import type { Metadata } from 'next'
import { Orbitron, Space_Grotesk } from 'next/font/google'
import './globals.css'

const orbitron = Orbitron({ subsets: ['latin'] })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Interface',
  description: 'Where Past Meets Future',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${orbitron.className} bg-deep-space text-white min-h-screen relative overflow-hidden`}>
        {/* Base Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-deep-space via-plasma-purple/20 to-deep-space z-0" />
        
        {/* Stars Background */}
        <div className="fixed inset-0 stars-bg z-1" />
        
        {/* Northern Lights */}
        <div className="fixed inset-0 aurora-borealis z-2" />
        
        {/* Planets - Adjusted for better depth */}
        <div className="fixed -bottom-[50px] -right-[50px] w-[800px] h-[800px] planet-glow opacity-70 z-4" />
        <div className="fixed top-[100px] -left-[100px] w-[600px] h-[600px] planet-glow-2 opacity-65 z-4" />
        <div className="fixed -bottom-[150px] left-[200px] w-[500px] h-[500px] planet-glow-3 opacity-60 z-4" />
        
        {/* Mystical Surface */}
        <div className="fixed inset-0 mystical-surface z-3" />
        
        {/* Mist Layers */}
        <div className="fixed inset-0 navigation-mist z-5" />
        <div className="fixed inset-0 mist-overlay z-5" />
        
        {/* Gradient Particles */}
        <div className="fixed inset-0 bg-gradient-radial from-neon-pink/5 via-electric-blue/5 to-transparent pointer-events-none z-6" />
        
        {/* Shooting Stars - Behind Chat */}
        <div className="shooting-stars-back z-7">
          <div className="orb-1"></div>
          <div className="orb-2"></div>
          <div className="orb-7"></div>
        </div>

        {/* Shooting Stars - Middle Layer */}
        <div className="shooting-stars-mid z-8">
          <div className="orb-3"></div>
          <div className="orb-4"></div>
          <div className="orb-8"></div>
          <div className="orb-9"></div>
        </div>

        {/* Shooting Stars - Front Layer */}
        <div className="shooting-stars-front z-45">
          <div className="orb-5"></div>
          <div className="orb-6"></div>
          <div className="orb-10"></div>
        </div>
        
        {/* Main Content - Highest z-index */}
        <div className="relative z-50">
          {children}
        </div>
      </body>
    </html>
  )
} 