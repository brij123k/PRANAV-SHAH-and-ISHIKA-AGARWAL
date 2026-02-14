import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import curtainVideo from "@/assets/curtain-video.mp4";
import curtainOpenImage from "@/assets/curtain-open.jpg";
import andImage from "@/assets/and (1).png";

interface TheaterCurtainProps {
  isOpen?: boolean;
  onOpen?: () => void;
  currentPage?: number;
}

const TheaterCurtain = ({ isOpen = false, onOpen, currentPage = 0 }: TheaterCurtainProps) => {
  const [phase, setPhase] = useState<"closed" | "opening" | "open">("closed");
  const [showContent, setShowContent] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Preload the open curtain image immediately
  useEffect(() => {
    const img = new Image();
    img.src = curtainOpenImage;
  }, []);

  // FIXED: Use stable height approach - no fluctuations
  useEffect(() => {
    const setStableHeight = () => {
      if (containerRef.current) {
        containerRef.current.style.height = `${window.innerHeight}px`;
      }
    };

    setStableHeight();
    
    // Only update on orientation change, not on scroll
    window.addEventListener('orientationchange', setStableHeight);
    
    return () => window.removeEventListener('orientationchange', setStableHeight);
  }, []);

  // Handle initial video load without auto-play issues
  useEffect(() => {
    if (videoRef.current && !videoError) {
      // Set video to first frame but don't autoplay
      videoRef.current.load();
      
      // Mark initial load as complete after a short delay
      const timer = setTimeout(() => {
        setIsInitialLoad(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [videoError]);

  const handleVideoError = useCallback(() => {
    console.log("Video failed to load");
    setVideoError(true);
    setIsInitialLoad(false);
  }, []);

  const handleClick = useCallback(() => {
    if (phase !== "closed") return;
    
    // Start opening
    setPhase("opening");
    if (videoRef.current && !videoError) {
      videoRef.current.play().catch(error => {
        console.log("Video play failed:", error);
      });
    }
    setTimeout(() => setShowContent(true), 800);
    
    // Call onOpen prop if provided
    onOpen?.();
  }, [phase, onOpen, videoError]);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || phase !== "opening") return;
    if (video.duration - video.currentTime < 0.3) {
      setPhase("open");
    }
  }, [phase]);

  const handleVideoEnd = useCallback(() => {
    setPhase("open");
  }, []);

  useEffect(() => {
    if (phase === "open") {
      requestAnimationFrame(() => setShowContent(true));
    }
  }, [phase]);

  return (
    <div
      ref={containerRef}
      className="relative w-full cursor-pointer overflow-hidden"
      onClick={handleClick}
      style={{ 
        height: '100vh',
        position: 'relative',
        backgroundColor: '#000', // Fallback color
      }}
    >
      {/* Video - shows during closed and opening phases */}
      {(phase === "closed" || phase === "opening") && !videoError && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src={curtainVideo}
          muted
          playsInline
          preload="auto"
          loop={phase === "closed"}
          onEnded={handleVideoEnd}
          onTimeUpdate={handleTimeUpdate}
          onError={handleVideoError}
          // REMOVED autoPlay prop
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
          }}
        />
      )}

      {/* Fallback curtain image if video fails */}
      {(phase === "closed" || phase === "opening") && videoError && (
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${curtainOpenImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      )}

      {/* Static open curtain image - shows when fully open */}
      {phase === "open" && (
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${curtainOpenImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      )}

      {/* CLICK ANYWHERE TO OPEN text - shown only when closed */}
      {phase === "closed" && !isInitialLoad && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <p
            className="text-xs sm:text-sm md:text-base lg:text-lg tracking-widest uppercase animate-pulse px-4 text-center"
            style={{
              color: "hsl(45, 80%, 70%)",
              textShadow: "0 2px 10px rgba(0,0,0,0.8)",
              fontFamily: "'Georgia', serif",
              letterSpacing: '0.2em',
            }}
          >
            CLICK ANYWHERE TO OPEN
          </p>
        </div>
      )}

      {/* Loading state - optional, shows nothing during initial load */}
      {phase === "closed" && isInitialLoad && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          {/* Optionally show nothing or a loading indicator */}
        </div>
      )}

      {/* Invitation Content - with reduced mobile font sizes */}
      {showContent && (
        <motion.div
          className="absolute inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: showContent ? 1 : 0,
            y: currentPage && currentPage > 0 ? "-100vh" : 0
          }}
          transition={{ 
            opacity: { duration: 1.2, delay: 0.4, ease: "easeOut" },
            y: { duration: 1.6, ease: [0.25, 0.1, 0.25, 1] }
          }}
        >
          <div className="flex flex-col items-center justify-center min-h-screen px-3 sm:px-6 md:px-8 py-2 sm:py-12 md:py-16 text-center">
            {/* Prayer text - smaller on mobile */}
            <motion.div
              className="mb-4 sm:mb-6 md:mb-8 lg:mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={showContent ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <p 
                className="font-serif-elegant text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs lg:text-sm tracking-[0.2em] xs:tracking-[0.22em] sm:tracking-[0.25em] md:tracking-[0.3em] lg:tracking-[0.35em] text-gray-700 sm:text-muted-foreground leading-tight uppercase"
                style={{
                  textShadow: "0 2px 8px rgba(255,255,255,0.8), 0 2px 12px rgba(0,0,0,0.5)",
                }}
              >
                THIS IS WHERE
              </p>
              <p 
                className="font-serif-elegant text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs lg:text-sm tracking-[0.2em] xs:tracking-[0.22em] sm:tracking-[0.25em] md:tracking-[0.3em] lg:tracking-[0.35em] text-gray-700 sm:text-muted-foreground leading-tight uppercase"
                style={{
                  textShadow: "0 2px 8px rgba(255,255,255,0.8), 0 2px 12px rgba(0,0,0,0.5)",
                }}
              >
                OUR FOREVER BEGINS.
              </p>
            </motion.div>

            {/* Names section */}
            <motion.div
              className="flex flex-col items-center justify-center gap-0 w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={showContent ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              {/* PRANAV SHAH */}
              <motion.h1
                className="text-[18px] xs:text-[20px] sm:text-[24px] md:text-[28px] lg:text-4xl xl:text-5xl 2xl:text-6xl leading-tight break-words max-w-full px-2"
                style={{ 
                  fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Libre Baskerville', serif",
                  color: '#2d2d2d',
                  fontWeight: 400,
                  letterSpacing: '0.03em',
                  textShadow: "0 2px 10px rgba(255,255,255,0.9), 0 4px 15px rgba(0,0,0,0.4)",
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={showContent ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 1, delay: 1.1, ease: "easeOut" }}
              >
                PRANAV SHAH
              </motion.h1>

              {/* "and" image */}
              <motion.div
                className="flex-shrink-0 relative z-10 -mb-2 xs:-mb-3 sm:-mb-4 md:-mb-5 lg:-mb-6 xl:-mb-8"
                initial={{ opacity: 0 }}
                animate={showContent ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 1.5 }}
              >
                <img 
                  src={andImage} 
                  alt="and" 
                  className="w-14 xs:w-16 sm:w-20 md:w-24 lg:w-32 xl:w-40 2xl:w-48 h-auto object-contain mx-auto"
                  style={{
                    filter: 'opacity(0.9) drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                  }}
                />
              </motion.div>

              {/* ISHIKA AGARWAL */}
              <motion.h1
                className="text-[18px] xs:text-[20px] sm:text-[24px] md:text-[28px] lg:text-4xl xl:text-5xl 2xl:text-6xl leading-tight break-words max-w-full px-2"
                style={{ 
                  fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Libre Baskerville', serif",
                  color: '#2d2d2d',
                  fontWeight: 400,
                  letterSpacing: '0.03em',
                  textShadow: "0 2px 10px rgba(255,255,255,0.9), 0 4px 15px rgba(0,0,0,0.4)",
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={showContent ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 1, delay: 1.7, ease: "easeOut" }}
              >
                ISHIKA AGARWAL
              </motion.h1>
            </motion.div>

            {/* Save the Date - empty div */}
            <motion.div
              className="mt-4 xs:mt-5 sm:mt-6 md:mt-8 lg:mt-10 xl:mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={showContent ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 2.0 }}
            >
              {/* Empty */}
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TheaterCurtain;