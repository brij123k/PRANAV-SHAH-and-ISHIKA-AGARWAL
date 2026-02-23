import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import goldenGlitterHeart from '@/assets/golden-glitter-heart8.png';
import whiteHeart from '@/assets/white_hart1.png';

interface GlitterParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  life: number;
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

interface ScratchCardProps {
  width?: number;
  height?: number;
  onComplete?: () => void;
  onScratchStart?: () => void;
  content?: React.ReactNode;
}

const ScratchCard: React.FC<ScratchCardProps> = ({
  width = 280,
  height = 260,
  onComplete,
  onScratchStart,
  content,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const [particles, setParticles] = useState<GlitterParticle[]>([]);
  const particleIdRef = useRef(0);
  const animationFrameRef = useRef<number>();
  const scratchStartedRef = useRef(false);

  // Confetti state
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const heartPath = `
    M ${width/2} ${height * 0.92}
    C ${width * 0.15} ${height * 0.65} ${width * 0.05} ${height * 0.4} ${width * 0.05} ${height * 0.3}
    C ${width * 0.05} ${height * 0.12} ${width * 0.2} ${height * 0.05} ${width * 0.35} ${height * 0.05}
    C ${width * 0.45} ${height * 0.05} ${width * 0.48} ${height * 0.12} ${width/2} ${height * 0.2}
    C ${width * 0.52} ${height * 0.12} ${width * 0.55} ${height * 0.05} ${width * 0.65} ${height * 0.05}
    C ${width * 0.8} ${height * 0.05} ${width * 0.95} ${height * 0.12} ${width * 0.95} ${height * 0.3}
    C ${width * 0.95} ${height * 0.4} ${width * 0.85} ${height * 0.65} ${width/2} ${height * 0.92}
    Z
  `;

  // Trigger falling confetti — same style as TheaterCurtain
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

    // Auto-hide after animation completes
    setTimeout(() => {
      setShowConfetti(false);
      setConfetti([]);
    }, 5000);
  }, []);

  // Spawn glitter particles while scratching
  const spawnGlitter = useCallback((x: number, y: number) => {
    const newParticles: GlitterParticle[] = [];
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 2;
      newParticles.push({
        id: particleIdRef.current++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: Math.random() * 4 + 2,
        opacity: 1,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 20,
        life: 1,
      });
    }
    setParticles(prev => [...prev.slice(-50), ...newParticles]);
  }, []);

  // Animate glitter particles
  useEffect(() => {
    if (particles.length === 0) return;
    const animate = () => {
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.15,
            rotation: p.rotation + p.rotationSpeed,
            life: p.life - 0.02,
            opacity: p.life,
          }))
          .filter(p => p.life > 0)
      );
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [particles.length]);

  // Initialize canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    const img = new Image();
    img.src = goldenGlitterHeart;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      const path = new Path2D(heartPath);
      ctx.save();
      ctx.clip(path);
      const highlightGradient = ctx.createLinearGradient(0, 0, width * 0.5, height * 0.5);
      highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
      highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
      highlightGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = highlightGradient;
      ctx.fill(path);
      ctx.restore();
    };
  }, [width, height, heartPath]);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  const getPosition = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
    spawnGlitter(x, y);
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    let transparentPixels = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparentPixels++;
    }
    const percent = (transparentPixels / (pixels.length / 4)) * 100;
    setScratchPercent(percent);
    if (percent > 50 && !isRevealed) {
      setIsRevealed(true);
      onComplete?.();
    }
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsScratching(true);
    const pos = getPosition(e);
    scratch(pos.x, pos.y);

    // Trigger confetti only once on very first scratch
    if (!scratchStartedRef.current) {
      scratchStartedRef.current = true;
      triggerConfetti();
      onScratchStart?.();
    }
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isScratching) return;
    e.preventDefault();
    const pos = getPosition(e);
    scratch(pos.x, pos.y);
  };

  const handleEnd = () => {
    setIsScratching(false);
  };

  // Confetti shape styles — identical to TheaterCurtain
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
    <>
      <div className="relative select-none" style={{ width, height }}>
        {/* Background with revealed content */}
        <div className="absolute inset-0">
          <img
            src={whiteHeart}
            alt="Heart background"
            className="absolute inset-0 w-full h-full object-contain"
          />
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-2"
            style={{ clipPath: `path('${heartPath}')` }}
          >
            {content}
          </div>
        </div>

        {/* Scratch overlay canvas */}
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="absolute inset-0 cursor-pointer touch-none z-20"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />

        {/* Glitter particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute pointer-events-none z-30"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity,
              transform: `rotate(${particle.rotation}deg)`,
              background: 'linear-gradient(135deg, #D4C4A8, #C9B896, #B8A67D)',
              borderRadius: particle.size > 3 ? '2px' : '50%',
              boxShadow: '0 0 4px rgba(201, 184, 150, 0.8)',
            }}
          />
        ))}
      </div>

      {/* Full-screen falling confetti overlay — same as TheaterCurtain */}
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
    </>
  );
};

export default ScratchCard;