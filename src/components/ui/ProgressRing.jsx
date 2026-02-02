import { motion } from 'framer-motion';
import { useMemo } from 'react';

/**
 * ProgressRing - An animated circular progress indicator
 * 
 * Perfect for budget progress, goals, and completion percentages.
 * Features smooth animations and customizable colors.
 */

export function ProgressRing({
  progress = 0, // 0-100
  size = 120,
  strokeWidth = 8,
  color = 'accent',
  trackColor = 'rgba(255,255,255,0.1)',
  showPercentage = true,
  animate = true,
  children,
  className = '',
}) {
  const colors = {
    accent: '#6366F1',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    gradient: 'url(#progressGradient)',
  };

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference;

  // Auto-select color based on progress
  const autoColor = useMemo(() => {
    if (color !== 'auto') return colors[color] || color;
    if (progress >= 100) return colors.danger;
    if (progress >= 80) return colors.warning;
    return colors.success;
  }, [progress, color]);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Gradient definition */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>

        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />

        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={autoColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: animate ? offset : circumference }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          style={{
            filter: `drop-shadow(0 0 6px ${autoColor}40)`,
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (showPercentage && (
          <motion.span
            className="text-lg font-semibold text-text-primary"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            {Math.round(progress)}%
          </motion.span>
        ))}
      </div>
    </div>
  );
}

/**
 * MiniProgressBar - A compact horizontal progress bar
 */
export function MiniProgressBar({
  progress = 0,
  color = 'accent',
  height = 4,
  showGlow = true,
  className = '',
}) {
  const colors = {
    accent: 'bg-accent',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
  };

  const glowColors = {
    accent: 'shadow-[0_0_10px_rgba(99,102,241,0.5)]',
    success: 'shadow-[0_0_10px_rgba(16,185,129,0.5)]',
    warning: 'shadow-[0_0_10px_rgba(245,158,11,0.5)]',
    danger: 'shadow-[0_0_10px_rgba(239,68,68,0.5)]',
  };

  // Auto-select color based on progress
  const autoColor = useMemo(() => {
    if (color !== 'auto') return color;
    if (progress >= 100) return 'danger';
    if (progress >= 80) return 'warning';
    return 'success';
  }, [progress, color]);

  return (
    <div 
      className={`w-full bg-white/10 rounded-full overflow-hidden ${className}`}
      style={{ height }}
    >
      <motion.div
        className={`h-full rounded-full ${colors[autoColor]} ${showGlow ? glowColors[autoColor] : ''}`}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(progress, 100)}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  );
}

/**
 * SparklineChart - A mini line chart for trends
 */
export function SparklineChart({
  data = [],
  width = 100,
  height = 32,
  color = '#6366F1',
  fillOpacity = 0.2,
  strokeWidth = 2,
  animate = true,
  className = '',
}) {
  if (data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg width={width} height={height} className={className}>
      {/* Fill area */}
      <motion.polygon
        points={areaPoints}
        fill={color}
        fillOpacity={fillOpacity}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Line */}
      <motion.polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: animate ? 1 : 0, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />

      {/* End dot */}
      <motion.circle
        cx={width}
        cy={height - ((data[data.length - 1] - min) / range) * (height - 4) - 2}
        r={3}
        fill={color}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
      />
    </svg>
  );
}

/**
 * StatNumber - Animated number display
 */
export function StatNumber({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 1,
  className = '',
}) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {prefix}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration }}
      >
        {typeof value === 'number' ? value.toFixed(decimals) : value}
      </motion.span>
      {suffix}
    </motion.span>
  );
}
