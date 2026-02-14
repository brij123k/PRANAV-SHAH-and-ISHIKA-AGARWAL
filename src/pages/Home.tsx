import React, { useState } from 'react';
import ScratchCard from '@/components/ScratchCard2';
import saveTheDateImage from '@/assets/save thedate.png';
import CountdownPage from "../components/Countdownpage";

const Home = () => {
  const [hasStartedScratching, setHasStartedScratching] = useState(false);

  const handleScratchStart = () => {
    setHasStartedScratching(true);
  };

  return (
    <div className="flex flex-col items-center justify-start bg-white relative overflow-hidden w-full py-8 sm:py-12 md:py-16">
      {/* Save the Date Image - INCREASED SIZE */}
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
          onComplete={() => {}}
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
          onComplete={() => {}}
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
          onComplete={() => {}}
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

      {/* Scratch hint - FIXED: Use opacity and visibility to maintain layout */}
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
      
      {/* Countdown Section */}
      <div className="w-full mt-64 sm:mt-8 md:mt-10">
        <CountdownPage/>
      </div>
    </div>
  );
};

export default Home;