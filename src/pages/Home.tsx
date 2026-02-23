import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import ScratchCard from '@/components/ScratchCard2';
import saveTheDateImage from '@/assets/save thedate.png';
import CountdownPage from "../components/Countdownpage";

interface Confetti {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  delay: number;
  size: number;
  shape: string;
}

const Home = () => {
  const [hasStartedScratching, setHasStartedScratching] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const triggerConfetti = useCallback(() => {
    setShowConfetti(true);

    const pieces: Confetti[] = [];
    const colors = ['#FFD700', '#FFC125', '#FFDF00', '#FFE55C', '#FFEA70', '#FFF4A3'];
    const shapes = ['circle', 'diamond', 'star', 'square'];

    for (let i = 0; i < 200; i++) {
      pieces.push({
        id: i,
        x: Math.random() * 100,
        y: -20,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        size: Math.random() * 8 + 3,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      });
    }

    setConfetti(pieces);

    setTimeout(() => {
      setShowConfetti(false);
      setConfetti([]);
    }, 5000);
  }, []);

  // Called when each individual heart is fully scratched
  const handleHeartComplete = useCallback(() => {
    setCompletedCount(prev => {
      const newCount = prev + 1;
      if (newCount === 3) {
        triggerConfetti();
      }
      return newCount;
    });
  }, [triggerConfetti]);

  const handleScratchStart = () => {
    setHasStartedScratching(true);
  };

  const getShapeStyle = (shape: string): React.CSSProperties => {
    switch (shape) {
      case 'circle':
        return { borderRadius: '50%' };
      case 'diamond':
        return {
          borderRadius: '0%',
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        };
      case 'star':
        return {
          clipPath:
            'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
        };
      case 'square':
      default:
        return { borderRadius: '0%' };
    }
  };

  return (
    <div className="flex flex-col items-center justify-start bg-white relative overflow-hidden w-full py-8 sm:py-12 md:py-16">
      {/* Save the Date Image */}
      <div className="z-10 mb-12 sm:mb-8 md:mb-12">
        <img 
          src={saveTheDateImage} 
          alt="Save the Date" 
          className="w-48 sm:w-64 md:w-80 lg:w-96 h-auto object-contain"
        />
      </div>

      {/* Three scratch card hearts */}
      <div className="flex gap-2 sm:gap-3 md:gap-4 items-center justify-center relative z-10 mb-3 sm:mb-4">
        {/* First Heart - Day */}
        <ScratchCard
          width={window.innerWidth < 640 ? 70 : 80}
          height={window.innerWidth < 640 ? 66 : 76}
          onComplete={handleHeartComplete}
          onScratchStart={handleScratchStart}
          content={
            <p 
              className="text-lg sm:text-xl md:text-2xl font-semibold uppercase"
              style={{ 
                color: '#000000',
                fontFamily: "'Playfair Display', 'Bodoni Moda', serif",
                letterSpacing: '0.1em',
              }}
            >
              05
            </p>
          }
        />
        
        {/* Second Heart - Month */}
        <ScratchCard
          width={window.innerWidth < 640 ? 70 : 80}
          height={window.innerWidth < 640 ? 66 : 76}
          onComplete={handleHeartComplete}
          onScratchStart={handleScratchStart}
          content={
            <p 
              className="text-lg sm:text-xl md:text-2xl font-semibold uppercase"
              style={{ 
                color: '#000000',
                fontFamily: "'Playfair Display', 'Bodoni Moda', serif",
                letterSpacing: '0.1em',
              }}
            >
              05
            </p>
          }
        />
        
        {/* Third Heart - Year */}
        <ScratchCard
          width={window.innerWidth < 640 ? 70 : 80}
          height={window.innerWidth < 640 ? 66 : 76}
          onComplete={handleHeartComplete}
          onScratchStart={handleScratchStart}
          content={
            <p 
              className="text-lg sm:text-xl md:text-2xl font-semibold uppercase"
              style={{ 
                color: '#000000',
                fontFamily: "'Playfair Display', 'Bodoni Moda', serif",
                letterSpacing: '0.1em',
              }}
            >
              26
            </p>
          }
        />
      </div>

      {/* Scratch hint */}
      <div 
        className="text-[10px] sm:text-xs md:text-sm tracking-wide text-center z-10 mb-4 sm:mb-6"
        style={{ 
          color: '#C9A86A',
          fontFamily: "'Playfair Display', 'Cormorant Garamond', serif",
          lineHeight: '4',
          opacity: hasStartedScratching ? 0 : 1,
          visibility: hasStartedScratching ? 'hidden' : 'visible',
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
          height: 'auto',
          minHeight: hasStartedScratching ? '40px' : 'auto',
        }}
      >
        Scratch to reveal ✨
      </div>

      {/* We're Getting Married text */}
      <div className="text-center z-10 mt-1 sm:mt-2 mb-2 sm:mb-4">
        <p 
          className="text-sm sm:text-base md:text-xl lg:text-2xl tracking-[0.15em] uppercase"
          style={{ 
            color: '#5A5A5A',
            fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Didot', serif",
            fontWeight: 500,
            letterSpacing: '0px',
            lineHeight: '0.5'
          }}
        >
          WE'RE
        </p>
        <p 
          className="text-base sm:text-lg md:text-2xl lg:text-3xl tracking-[0.15em] uppercase mt-1"
          style={{ 
            color: '#5A5A5A',
            fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Didot', serif",
            fontWeight: 500,
            letterSpacing: '0px',
            lineHeight: '1.2'
          }}
        >
          GETTING MARRIED!
        </p>
      </div>

      {/* Scroll Down Indicator */}
      <div
        className="z-10 flex flex-col items-center mt-4"
        style={{ pointerEvents: 'none' }}
      >
        <span
          style={{
            color: '#C9A86A',
            fontFamily: "'Playfair Display', 'Cormorant Garamond', serif",
            fontSize: '10px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            opacity: 0.8,
          }}
        >
          Scroll
        </span>
        <div className="flex flex-col items-center" style={{ gap: '2px', marginTop: '4px' }}>
          {[0, 1, 2].map((i) => (
            <svg
              key={i}
              width="16"
              height="10"
              viewBox="0 0 16 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                animation: 'scrollBounce 1.5s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`,
                opacity: 0,
              }}
            >
              <path
                d="M1 1L8 8L15 1"
                stroke="#C9A86A"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scrollBounce {
          0%   { opacity: 0; transform: translateY(-4px); }
          50%  { opacity: 1; transform: translateY(0px); }
          100% { opacity: 0; transform: translateY(4px); }
        }
      `}</style>
      
      {/* Countdown Section */}
      <div className="w-full mt-64 sm:mt-8 md:mt-10">
        <CountdownPage/>
      </div>

      {/* Full-screen falling confetti — fires only when all 3 hearts are scratched */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
          {confetti.map((piece) => (
            <motion.div
              key={piece.id}
              className="absolute"
              style={{
                left: `${piece.x}%`,
                width: `${piece.size}px`,
                height: `${piece.size}px`,
                backgroundColor: piece.color,
                boxShadow: `0 0 ${piece.size * 2}px ${piece.color}`,
                ...getShapeStyle(piece.shape),
              }}
              initial={{
                y: piece.y,
                rotate: 0,
                opacity: 1,
                scale: 0,
              }}
              animate={{
                y: ['0vh', '120vh'],
                rotate: [0, piece.rotation * 3, piece.rotation * 6],
                x: [0, Math.random() * 60 - 30, Math.random() * 80 - 40],
                opacity: [0, 1, 1, 0.8, 0],
                scale: [0, 1, 1, 0.8, 0.5],
              }}
              transition={{
                duration: 3.5 + Math.random() * 2.5,
                delay: piece.delay,
                ease: 'easeIn',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;