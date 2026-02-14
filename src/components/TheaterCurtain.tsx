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

// Confetti interface
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

const TheaterCurtain = ({ isOpen = false, onOpen, currentPage = 0 }: TheaterCurtainProps) => {
  const [phase, setPhase] = useState<"closed" | "opening" | "open">("closed");
  const [showContent, setShowContent] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Confetti state
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

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

  // Function to create and show confetti
  const triggerConfetti = useCallback(() => {
    setShowConfetti(true);
    
    // Create confetti pieces
    const pieces: Confetti[] = [];
    const colors = ["#FFD700", "#FFC125", "#FFDF00", "#FFE55C", "#FFEA70", "#FFF4A3"];
    const shapes = ["circle", "diamond", "star", "square"];
    
    for (let i = 0; i < 200; i++) { // Increased count for better coverage
      pieces.push({
        id: i,
        x: Math.random() * 100,
        y: -20,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5, // Shorter delay for more immediate effect
        size: Math.random() * 8 + 3, // Slightly larger
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      });
    }
    
    setConfetti(pieces);
  }, []);

  const handleClick = useCallback(() => {
    if (phase !== "closed") return;
    
    // Start opening
    setPhase("opening");
    
    // Trigger confetti immediately on click (when video starts)
    triggerConfetti();
    
    if (videoRef.current && !videoError) {
      videoRef.current.play().catch(error => {
        console.log("Video play failed:", error);
      });
    }
    
    // Show content after delay
    setTimeout(() => setShowContent(true), 800);
    
    // Call onOpen prop if provided
    onOpen?.();
  }, [phase, onOpen, videoError, triggerConfetti]);

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
      
      // Keep confetti going for a bit longer after image is fully shown
      // This helps mask any transition flicker
      
      // Hide confetti after 5 seconds from when image is fully loaded
      const timer = setTimeout(() => {
        setShowConfetti(false);
        setConfetti([]);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Pre-load the image to ensure it's ready
  const [imageLoaded, setImageLoaded] = useState(false);
  
  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = curtainOpenImage;
  }, []);

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
            opacity: imageLoaded ? 1 : 0, // Fade in when loaded
            transition: 'opacity 0.3s ease-in-out',
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

      {/* Invitation Content - with reduced mobile font sizes and fixed desktop layout */}
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
          <div className="flex flex-col items-center justify-center min-h-screen px-3 sm:px-6 md:px-8 py-2 sm:py-12 md:py-16 text-center w-full">
            {/* Prayer text - smaller on mobile */}
            <motion.div
              className="mb-4 sm:mb-6 md:mb-8 lg:mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={showContent ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <p 
                className="pt-44 font-serif-elegant text-[12px] xs:text-[9px] sm:text-[10px] md:text-xs lg:text-sm tracking-[0.2em] xs:tracking-[0.22em] sm:tracking-[0.25em] md:tracking-[0.3em] lg:tracking-[0.35em] text-gray-700 sm:text-muted-foreground leading-tight uppercase"
                style={{
                  textShadow: "0 2px 8px rgba(255,255,255,0.8), 0 2px 12px rgba(0,0,0,0.5)",
                }}
              >
                THIS IS WHERE
              </p>
              <p 
                className="font-serif-elegant text-[12px] xs:text-[9px] sm:text-[10px] md:text-xs lg:text-sm tracking-[0.2em] xs:tracking-[0.22em] sm:tracking-[0.25em] md:tracking-[0.3em] lg:tracking-[0.35em] text-gray-700 sm:text-muted-foreground leading-tight uppercase"
                style={{
                  textShadow: "0 2px 8px rgba(255,255,255,0.8), 0 2px 12px rgba(0,0,0,0.5)",
                }}
              >
                OUR FOREVER BEGINS.
              </p>
            </motion.div>

            {/* Names section - FIXED for desktop */}
            <motion.div
              className="flex flex-col items-center justify-center gap-0 w-full max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={showContent ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              {/* PRANAV SHAH - UPDATED with increased font sizes for 372px-700px */}
              <motion.h1
                className="text-[28px] xs:text-[20px] sm:text-[24px] md:text-[32px] lg:text-[42px] xl:text-[52px] 2xl:text-[62px] leading-tight md:leading-normal lg:leading-relaxed break-words max-w-full px-2 whitespace-nowrap md:whitespace-normal"
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

              {/* "and" image - FIXED visibility for desktop */}
              <motion.div
                className="flex-shrink-0 relative z-10 -mb-2 xs:-mb-3 sm:-mb-4 md:-mb-6 lg:-mb-8 xl:-mb-10"
                initial={{ opacity: 0 }}
                animate={showContent ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 1.5 }}
              >
                <img 
                  src={andImage} 
                  alt="and" 
                  className="w-20 xs:w-16 sm:w-20 md:w-28 lg:w-36 xl:w-44 2xl:w-52 h-auto object-contain mx-auto"
                  style={{
                    filter: 'opacity(0.9) drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                    display: 'block', // Ensure it's displayed as block
                    visibility: 'visible', // Force visibility
                  }}
                />
              </motion.div>

              {/* ISHIKA AGARWAL - UPDATED with increased font sizes for 372px-700px */}
              <motion.h1
                className="text-[28px] xs:text-[20px] sm:text-[24px] md:text-[32px] lg:text-[42px] xl:text-[52px] 2xl:text-[62px] leading-tight md:leading-normal lg:leading-relaxed break-words max-w-full px-2 whitespace-nowrap md:whitespace-normal"
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

      {/* Confetti - starts immediately on click and continues through transition */}
      {showConfetti && (
        <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden">
          {confetti.map((piece) => {
            const getShapeStyle = () => {
              switch (piece.shape) {
                case "circle":
                  return { borderRadius: "50%" };
                case "diamond":
                  return { 
                    borderRadius: "0%",
                    transform: "rotate(45deg)",
                    clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
                  };
                case "star":
                  return {
                    clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"
                  };
                case "square":
                default:
                  return { borderRadius: "0%" };
              }
            };

            return (
              <motion.div
                key={piece.id}
                className="absolute"
                style={{
                  left: `${piece.x}%`,
                  width: `${piece.size}px`,
                  height: `${piece.size}px`,
                  backgroundColor: piece.color,
                  boxShadow: `0 0 ${piece.size * 2}px ${piece.color}`,
                  ...getShapeStyle(),
                }}
                initial={{
                  y: piece.y,
                  rotate: 0,
                  opacity: 1,
                  scale: 0,
                }}
                animate={{
                  y: ["0vh", "120vh"],
                  rotate: [0, piece.rotation * 3, piece.rotation * 6],
                  x: [0, Math.random() * 60 - 30, Math.random() * 80 - 40],
                  opacity: [0, 1, 1, 0.8, 0],
                  scale: [0, 1, 1, 0.8, 0.5],
                }}
                transition={{
                  duration: 3.5 + Math.random() * 2.5,
                  delay: piece.delay,
                  ease: "easeIn",
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TheaterCurtain;