import { motion } from 'framer-motion';

/**
 * Individual day cell in the calendar grid
 */

// Format cents to compact dollars (e.g., 62400 → "$624", 150000 → "$1.5k")
function formatCompactDollars(cents) {
  const dollars = cents / 100;
  if (dollars >= 1000) {
    return `$${(dollars / 1000).toFixed(1)}k`;
  }
  return `$${Math.round(dollars)}`;
}

// Color mapping based on spending intensity
const COLORS = {
  empty: 'bg-white/5',
  zero: 'bg-emerald-500/30 border-emerald-500/50',
  low: 'bg-emerald-400/25 border-emerald-400/40',
  medium: 'bg-yellow-400/30 border-yellow-400/50',
  high: 'bg-orange-400/35 border-orange-400/50',
  danger: 'bg-red-400/40 border-red-400/50',
  extreme: 'bg-red-500/50 border-red-500/60',
};

const TEXT_COLORS = {
  empty: 'text-text-muted',
  zero: 'text-emerald-400',
  low: 'text-emerald-300',
  medium: 'text-yellow-300',
  high: 'text-orange-300',
  danger: 'text-red-300',
  extreme: 'text-red-400',
};

export function getSpendingLevel(amount, dailyBudget, avgDaily) {
  if (amount === 0) return 'zero';
  
  const baseline = dailyBudget || avgDaily || 50;
  const percentage = (amount / baseline) * 100;
  
  if (percentage < 25) return 'low';
  if (percentage < 50) return 'medium';
  if (percentage < 75) return 'high';
  if (percentage < 100) return 'danger';
  return 'extreme';
}

export function CalendarDay({
  day,
  isCurrentMonth,
  isToday,
  isFuture,
  isSelected,
  total,
  transactionCount,
  dailyBudget,
  avgDaily,
  onSelect,
}) {
  if (!day) {
    // Empty cell for padding
    return <div className="aspect-square" />;
  }

  const level = total > 0 ? getSpendingLevel(total, dailyBudget, avgDaily) : (total === 0 && !isFuture ? 'zero' : 'empty');
  const colorClass = COLORS[level];
  const textColorClass = TEXT_COLORS[level];
  
  const isInteractive = isCurrentMonth && !isFuture;

  return (
    <motion.button
      onClick={() => isInteractive && onSelect?.()}
      disabled={!isInteractive}
      whileTap={isInteractive ? { scale: 0.95 } : {}}
      className={`
        aspect-square rounded-xl border relative
        flex flex-col items-center justify-center gap-0.5
        transition-all duration-200
        ${colorClass}
        ${!isCurrentMonth ? 'opacity-30' : ''}
        ${isFuture ? 'opacity-40 cursor-not-allowed' : ''}
        ${isInteractive ? 'cursor-pointer hover:scale-105' : ''}
        ${isSelected ? 'ring-2 ring-accent ring-offset-2 ring-offset-background scale-105' : ''}
        ${isToday ? 'ring-2 ring-white/50' : ''}
      `}
    >
      {/* Day number */}
      <span className={`text-sm font-medium ${isCurrentMonth ? 'text-text-primary' : 'text-text-muted'}`}>
        {day}
      </span>
      
      {/* Total amount (if any) */}
      {total > 0 && isCurrentMonth && (
        <span className={`text-[10px] font-medium ${textColorClass}`}>
          {formatCompactDollars(total)}
        </span>
      )}
      
      {/* Today indicator */}
      {isToday && (
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-white/30"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}

export default CalendarDay;
