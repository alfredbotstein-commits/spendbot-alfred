import { motion } from 'framer-motion';
import { forwardRef } from 'react';

/**
 * GlassCard - A modern glassmorphism card component
 * 
 * Features:
 * - Frosted glass effect with backdrop blur
 * - Subtle border glow
 * - Hover animations
 * - Multiple variants for different contexts
 */

export const GlassCard = forwardRef(function GlassCard({ 
  children, 
  className = '', 
  variant = 'default',
  hover = true,
  glow = false,
  glowColor = 'accent',
  padding = 'default',
  onClick,
  as = 'div',
  ...props 
}, ref) {
  const Component = motion[as] || motion.div;
  
  const variants = {
    default: 'bg-white/[0.03] border-white/[0.08]',
    elevated: 'bg-white/[0.05] border-white/[0.12]',
    accent: 'bg-accent/[0.08] border-accent/[0.2]',
    success: 'bg-success/[0.08] border-success/[0.2]',
    warning: 'bg-warning/[0.08] border-warning/[0.2]',
    danger: 'bg-danger/[0.08] border-danger/[0.2]',
    gradient: 'bg-gradient-to-br from-white/[0.05] to-white/[0.02] border-white/[0.1]',
  };

  const glowColors = {
    accent: 'shadow-[0_0_30px_rgba(99,102,241,0.15)]',
    success: 'shadow-[0_0_30px_rgba(16,185,129,0.15)]',
    warning: 'shadow-[0_0_30px_rgba(245,158,11,0.15)]',
    danger: 'shadow-[0_0_30px_rgba(239,68,68,0.15)]',
  };

  const paddings = {
    none: '',
    sm: 'p-3',
    default: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  return (
    <Component
      ref={ref}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl border backdrop-blur-xl
        ${variants[variant]}
        ${paddings[padding]}
        ${glow ? glowColors[glowColor] : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      whileHover={hover ? { 
        scale: 1.02,
        borderColor: 'rgba(255,255,255,0.15)',
      } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      {...props}
    >
      {/* Inner shine effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </Component>
  );
});

/**
 * GlassCardShimmer - A shimmering loading state for glass cards
 */
export function GlassCardShimmer({ className = '', height = 'h-32' }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl ${height} ${className}`}>
      <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08]" />
      <div className="absolute inset-0 shimmer-effect" />
    </div>
  );
}

/**
 * BentoGrid - A responsive grid for dashboard cards
 */
export function BentoGrid({ children, className = '' }) {
  return (
    <div className={`grid grid-cols-2 gap-3 ${className}`}>
      {children}
    </div>
  );
}

/**
 * BentoItem - An item in the bento grid with various spans
 */
export function BentoItem({ 
  children, 
  span = 1, 
  className = '',
  ...props 
}) {
  const spanClasses = {
    1: 'col-span-1',
    2: 'col-span-2',
    'full': 'col-span-2',
  };

  return (
    <GlassCard 
      className={`${spanClasses[span]} ${className}`}
      {...props}
    >
      {children}
    </GlassCard>
  );
}
