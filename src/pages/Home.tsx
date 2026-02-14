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
    <div className="flex flex-col items-center justify-start bg-white relative overflow-hidden px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
      {/* Save the Date Image */}
      <div className="z-10 mb-6 sm:mb-8 md:mb-12">
        <img 
          src={saveTheDateImage} 
          alt="Save the Date" 
          className="w-36 sm:w-48 md:w-64 lg:w-80 h-auto object-contain"
        />
      </div>

      {/* Three scratch card hearts - responsive sizing */}
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

      {/* Scratch hint */}
      {!hasStartedScratching && (
        <p 
          className="text-[10px] sm:text-xs md:text-sm tracking-wide text-center z-10 animate-pulse mb-4 sm:mb-6"
          style={{ 
            color: '#C9A86A',
            fontFamily: "'Playfair Display', 'Cormorant Garamond', serif",
          }}
        >
          Scratch to reveal ✨
        </p>
      )}

      {/* We're Getting Married text */}
      <div className="text-center z-10 mt-2 sm:mt-4 mb-4 sm:mb-6">
        <p 
          className="text-sm sm:text-base md:text-xl lg:text-2xl tracking-[0.15em] uppercase"
          style={{ 
            color: '#5A5A5A',
            fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Didot', serif",
            fontWeight: 500,
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
          }}
        >
          GETTING MARRIED!
        </p>
      </div>
      
      {/* Countdown Section */}
      <div className="w-full mt-60 sm:mt-6 md:mt-8">
        <CountdownPage/>
      </div>
    </div>
  );
};

export default Home;