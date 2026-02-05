import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = ['#6366F1', '#A855F7', '#EC4899', '#F97316', '#22C55E', '#3B82F6'];
const EMOJIS = ['💰', '✨', '🎉', '💸', '🤑', '⭐'];

// Pre-calculated animation values are passed as props to avoid impure render
function Particle({ x, startY, endX, endY, rotation, duration, emoji, delay, color }) {
  return (
    <motion.div
      initial={{ 
        x, 
        y: startY,
        opacity: 1,
        scale: 0,
        rotate: 0
      }}
      animate={{ 
        x: endX,
        y: endY,
        opacity: [1, 1, 0],
        scale: [0, 1.5, 1],
        rotate: rotation
      }}
      transition={{ 
        duration,
        delay: delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="fixed text-2xl pointer-events-none z-50"
      style={{ color }}
    >
      {emoji ? emoji : '●'}
    </motion.div>
  );
}

// Generate particles outside of component to avoid impure render
function generateParticles(emoji) {
  const particles = [];
  const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 200;
  const startY = typeof window !== 'undefined' ? window.innerHeight / 2 : 400;
  const endY = typeof window !== 'undefined' ? -window.innerHeight - 100 : -500;
  
  for (let i = 0; i < 20; i++) {
    const x = centerX + (Math.random() - 0.5) * 100;
    particles.push({
      id: i,
      x,
      startY,
      endX: x + (Math.random() - 0.5) * 200,
      endY,
      rotation: Math.random() * 720 - 360,
      duration: 1.5 + Math.random() * 0.5,
      emoji: i < 5 ? emoji : (Math.random() > 0.5 ? EMOJIS[Math.floor(Math.random() * EMOJIS.length)] : null),
      delay: Math.random() * 0.2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    });
  }
  return particles;
}

export function Confetti({ show, emoji }) {
  const [particles, setParticles] = useState([]);
  const hasTriggered = useRef(false);
  
  useEffect(() => {
    if (show && !hasTriggered.current) {
      hasTriggered.current = true;
      
      // Use requestAnimationFrame to schedule state update after render
      const frameId = requestAnimationFrame(() => {
        setParticles(generateParticles(emoji));
      });
      
      // Clear after animation
      const timer = setTimeout(() => {
        setParticles([]);
        hasTriggered.current = false;
      }, 2500);
      
      return () => {
        cancelAnimationFrame(frameId);
        clearTimeout(timer);
      };
    }
    
    if (!show) {
      hasTriggered.current = false;
    }
  }, [show, emoji]);
  
  return (
    <AnimatePresence>
      {particles.map(particle => (
        <Particle key={particle.id} {...particle} />
      ))}
    </AnimatePresence>
  );
}

// Simple success checkmark with ring animation
export function SuccessCheck({ category }) {
  return (
    <motion.div className="flex flex-col items-center gap-4">
      <div className="relative">
        {/* Outer ring */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 rounded-full border-4 border-success"
          style={{ width: 100, height: 100 }}
        />
        
        {/* Inner glow */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-[100px] h-[100px] rounded-full bg-success/20 flex items-center justify-center"
        >
          <motion.span
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: 'spring',
              stiffness: 200,
              damping: 15,
              delay: 0.2 
            }}
            className="text-5xl"
          >
            {category?.emoji || '✓'}
          </motion.span>
        </motion.div>
      </div>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-success font-semibold text-lg"
      >
        Expense Added!
      </motion.p>
    </motion.div>
  );
}
