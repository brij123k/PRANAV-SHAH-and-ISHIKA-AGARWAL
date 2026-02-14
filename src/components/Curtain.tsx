import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import leftCurtain from "../assets/ChatGPT Image Feb 14, 2026, 02_10_27 AM.png";
import rightCurtain from "../assets/ChatGPT Image Feb 14, 2026, 02_10_31 AM.png";
import closedCurtain from "../assets/curtain (1).png";
import leftCurtainMobile from "../assets/ChatGPT Image Feb 14, 2026, 02_10_27 AM.png";
import rightCurtainMobile from "../assets/ChatGPT Image Feb 14, 2026, 02_10_31 AM.png";

interface CurtainProps {
  side: "left" | "right";
  isOpen: boolean;
}

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

const Curtain = ({ side, isOpen }: CurtainProps) => {
  const isLeft = side === "left";
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen && side === "left") {
      setShowConfetti(true);
      
      const pieces: Confetti[] = [];
      const colors = ["#FFD700", "#FFC125", "#FFDF00", "#FFE55C", "#FFEA70", "#FFF4A3"];
      const shapes = ["circle", "diamond", "star", "square"];
      
      for (let i = 0; i < 150; i++) {
        pieces.push({
          id: i,
          x: Math.random() * 100,
          y: -20,
          rotation: Math.random() * 360,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 0.8,
          size: Math.random() * 6 + 2,
          shape: shapes[Math.floor(Math.random() * shapes.length)],
        });
      }
      
      setConfetti(pieces);

      const timer = setTimeout(() => {
        setShowConfetti(false);
        setConfetti([]);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, side]);

  return (
    <>
      {/* Desktop curtain - stays fixed */}
      <motion.div
        className="hidden md:block fixed top-0 h-screen z-50 overflow-visible pointer-events-none"
        style={{
          width: "50vw",
          [isLeft ? "left" : "right"]: 0,
        }}
        initial={false}
        animate={{
          x: isOpen 
            ? (isLeft ? "-50%" : "50%")
            : 0,
        }}
        transition={{
          duration: 1.6,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        <div className="relative w-full h-full">
          <img
            src={isOpen 
              ? (isLeft ? leftCurtain : rightCurtain)
              : closedCurtain
            }
            alt={`${side} curtain`}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        </div>
      </motion.div>

      {/* Mobile curtain - scrolls with content */}
      <motion.div
        className="block md:hidden absolute top-0 z-50 overflow-visible pointer-events-none"
        style={{
          width: "50vw",
          [isLeft ? "left" : "right"]: 0,
          minHeight: "100vh",
        }}
        initial={false}
        animate={{
          x: isOpen 
            ? (isLeft ? "-5%" : "5%")
            : 0,
        }}
        transition={{
          duration: 1.6,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        <div className="relative w-full min-h-screen">
          <img
            src={isOpen 
              ? (isLeft ? leftCurtainMobile : rightCurtainMobile)
              : closedCurtain
            }
            alt={`${side} curtain`}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        </div>
      </motion.div>

      {/* Confetti - works on both mobile and desktop */}
      {showConfetti && side === "left" && (
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
    </>
  );
};

export default Curtain;