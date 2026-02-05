import { motion } from 'framer-motion';

/**
 * AnimatedBackground - Beautiful animated gradient backgrounds
 * 
 * Creates a subtle, mesmerizing background effect that adds depth
 * without being distracting.
 */

export function AnimatedBackground({ 
  variant = 'default',
  intensity = 'medium',
  children,
  className = '',
}) {
  const intensityValues = {
    low: { opacity: 0.3, blur: '100px' },
    medium: { opacity: 0.5, blur: '120px' },
    high: { opacity: 0.7, blur: '80px' },
  };

  const { opacity, blur } = intensityValues[intensity];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {variant === 'default' && (
          <>
            <motion.div
              className="absolute w-[500px] h-[500px] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)',
                filter: `blur(${blur})`,
                opacity,
                top: '-20%',
                left: '-10%',
              }}
              animate={{
                x: [0, 50, 0],
                y: [0, 30, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute w-[400px] h-[400px] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)',
                filter: `blur(${blur})`,
                opacity,
                bottom: '-10%',
                right: '-10%',
              }}
              animate={{
                x: [0, -40, 0],
                y: [0, -50, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </>
        )}

        {variant === 'success' && (
          <>
            <motion.div
              className="absolute w-[400px] h-[400px] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(16,185,129,0.4) 0%, transparent 70%)',
                filter: `blur(${blur})`,
                opacity,
                top: '-15%',
                right: '-5%',
              }}
              animate={{
                x: [0, -30, 0],
                y: [0, 40, 0],
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </>
        )}

        {variant === 'warning' && (
          <motion.div
            className="absolute w-[350px] h-[350px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(245,158,11,0.35) 0%, transparent 70%)',
              filter: `blur(${blur})`,
              opacity,
              top: '10%',
              left: '-5%',
            }}
            animate={{
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {variant === 'mesh' && (
          <>
            <motion.div
              className="absolute w-[600px] h-[600px] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 60%)',
                filter: `blur(${blur})`,
                opacity,
                top: '-30%',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [opacity, opacity * 0.7, opacity],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute w-[300px] h-[300px] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)',
                filter: `blur(${blur})`,
                opacity,
                bottom: '10%',
                left: '-5%',
              }}
              animate={{
                x: [0, 60, 0],
                y: [0, -30, 0],
              }}
              transition={{
                duration: 22,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute w-[250px] h-[250px] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(34,211,238,0.2) 0%, transparent 70%)',
                filter: `blur(${blur})`,
                opacity,
                bottom: '30%',
                right: '-5%',
              }}
              animate={{
                x: [0, -40, 0],
                y: [0, 40, 0],
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

/**
 * MeshGradient - A CSS mesh gradient background
 */
export function MeshGradient({ className = '' }) {
  return (
    <div 
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        background: `
          radial-gradient(at 40% 20%, rgba(99,102,241,0.15) 0px, transparent 50%),
          radial-gradient(at 80% 0%, rgba(139,92,246,0.1) 0px, transparent 50%),
          radial-gradient(at 0% 50%, rgba(236,72,153,0.08) 0px, transparent 50%),
          radial-gradient(at 80% 50%, rgba(34,211,238,0.08) 0px, transparent 50%),
          radial-gradient(at 0% 100%, rgba(16,185,129,0.1) 0px, transparent 50%)
        `,
      }}
    />
  );
}

/**
 * GridPattern - A subtle grid pattern overlay
 */
export function GridPattern({ className = '' }) {
  return (
    <div 
      className={`absolute inset-0 pointer-events-none opacity-[0.02] ${className}`}
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
      }}
    />
  );
}

/**
 * NoiseTexture - A subtle noise texture overlay for depth
 */
export function NoiseTexture({ opacity = 0.03, className = '' }) {
  return (
    <div 
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}
