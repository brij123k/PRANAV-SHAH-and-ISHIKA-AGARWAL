import React, { useState } from 'react';
import ScratchCard from '@/components/ScratchCard2';
import saveTheDateImage from '@/assets/save thedate.png';
import CountdownPage from "../components/Countdownpage"

const Home = () => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [hasStartedScratching, setHasStartedScratching] = useState(false);

  const handleScratchStart = () => {
    setHasStartedScratching(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white relative overflow-hidden px-0 md:px-4 pt-4 pb-4">
      {/* Top: Save the Date Image */}
      <div className="z-10 mb-12 px-4 md:px-0">
        <img 
          src={saveTheDateImage} 
          alt="Save the Date" 
          className="w-48 sm:w-64 md:w-80 h-auto object-contain"
        />
      </div>

      {/* Center: Three scratch card hearts in a row */}
      <div className="flex gap-4 sm:gap-4 items-center justify-center relative z-10 mb-6 px-4 md:px-0">
        {/* First Heart - Day */}
        <ScratchCard
          width={80}
          height={76}
          onComplete={() => setIsRevealed(true)}
          onScratchStart={handleScratchStart}
          content={
            <p 
              className="text-xl sm:text-2xl font-semibold uppercase"
              style={{ 
                color: '#000000',
                fontFamily: "'Playfair Display', 'Bodoni Moda', serif",
                letterSpacing: '0.1em',
                lineHeight: '4'
              }}
            >
              05
            </p>
          }
        />
        {/* Second Heart - Month */}
        <ScratchCard
          width={80}
          height={76}
          onComplete={() => setIsRevealed(true)}
          onScratchStart={handleScratchStart}
          content={
            <p 
              className="text-xl sm:text-2xl font-semibold uppercase"
              style={{ 
                color: '#000000',
                fontFamily: "'Playfair Display', 'Bodoni Moda', serif",
                letterSpacing: '0.1em',
                lineHeight: '1.4'
              }}
            >
              05
            </p>
          }
        />
        
        {/* Third Heart - Year */}
        <ScratchCard
          width={80}
          height={76}
          onComplete={() => setIsRevealed(true)}
          onScratchStart={handleScratchStart}
          content={
            <p 
              className="text-xl sm:text-2xl font-semibold uppercase"
              style={{ 
                color: '#000000',
                fontFamily: "'Playfair Display', 'Bodoni Moda', serif",
                letterSpacing: '0.1em',
                lineHeight: '1.4'
              }}
            >
              26
            </p>
          }
        />
      </div>

      {/* Single "Scratch to reveal" text - shows only once, disappears when any heart is scratched */}
      {!hasStartedScratching && (
        <p 
          className="text-xs sm:text-sm tracking-wide text-center z-10 animate-pulse"
          style={{ 
            color: '#C9A86A',
            fontFamily: "'Playfair Display', 'Cormorant Garamond', serif",
            marginTop: '-0.5rem',
            lineHeight: '1.6'
          }}
        >
          Scratch to reveal ✨
        </p>
      )}

      {/* We're Getting Married text */}
      <div className="text-center z-10 mt-8 sm:mt-10 px-4 md:px-0">
        <p 
          className="text-base sm:text-xl md:text-2xl tracking-[0.15em] uppercase"
          style={{ 
            color: '#5A5A5A',
            fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Didot', serif",
            fontWeight: 500,
            letterSpacing: '0.5px',
            lineHeight: '1'
          }}
        >
          WE'RE
        </p>
        <p 
          className="text-lg sm:text-2xl md:text-3xl tracking-[0.15em] uppercase mt-1"
          style={{ 
            color: '#5A5A5A',
            fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Didot', serif",
            fontWeight: 500,
            letterSpacing: '0em',
            lineHeight: '1'
          }}
        >
          GETTING MARRIED!
        </p>
      </div>

      {/* Bottom: Names */}
      <p 
        className="font-serif text-sm sm:text-xl md:text-2xl tracking-[0.15em] z-10 mb-1 mt-4 sm:mt-6 px-4 md:px-0"
        style={{ 
          color: '#7A7A7A', 
          lineHeight: '1.6',
          fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Didot', 'Bodoni Moda', serif"
        }}
      >
     
      </p>
          
      <p 
        className="text-sm sm:text-lg font-semibold tracking-wide mb-1 px-4 md:px-0"
        style={{ 
          color: '#000000', 
          lineHeight: '1.5',
          fontFamily: "'Playfair Display', 'Bodoni Moda', 'Didot', 'Cormorant Garamond', serif"
        }}
      >
    
      </p>
      
      <p 
        className="italic text-xs sm:text-base tracking-wide mb-0 px-4 md:px-0"
        style={{ 
          color: '#7A7A7A', 
          lineHeight: '1.6',
          fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Didot', 'Bodoni Moda', serif"
        }}
      >

      </p>
      
      {/* Countdown Section - pushed closer to content above */}
      <div className="mt-60">
         <CountdownPage/>
      </div>
       
    </div>
  
  );

};

export default Home;