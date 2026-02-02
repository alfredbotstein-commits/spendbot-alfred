import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { formatCurrency } from '../utils/format';

/**
 * Budget Health Meter - A dramatic visualization of your budget status
 * 
 * Because numbers are boring but DRAMA is engaging.
 */

const HEALTH_STATES = {
  thriving: {
    id: 'thriving',
    label: 'THRIVING',
    emoji: '🌟',
    color: 'text-green-400',
    bgColor: 'from-green-500/20 to-emerald-500/20',
    borderColor: 'border-green-500/30',
    message: "You're absolutely CRUSHING it! The budget is thriving!",
    robot: "I'm so proud I could malfunction. 🥲",
    range: [0, 0.5], // 0-50% of budget
  },
  healthy: {
    id: 'healthy',
    label: 'HEALTHY',
    emoji: '💚',
    color: 'text-emerald-400',
    bgColor: 'from-emerald-500/20 to-teal-500/20',
    borderColor: 'border-emerald-500/30',
    message: "Looking good! Steady and sustainable.",
    robot: "This is what financial peace looks like.",
    range: [0.5, 0.75], // 50-75%
  },
  okay: {
    id: 'okay',
    label: 'OKAY',
    emoji: '😐',
    color: 'text-yellow-400',
    bgColor: 'from-yellow-500/20 to-amber-500/20',
    borderColor: 'border-yellow-500/30',
    message: "We're okay. Not great, not terrible. Fine.",
    robot: "I've seen worse. I've also seen better. But fine.",
    range: [0.75, 0.9], // 75-90%
  },
  stressed: {
    id: 'stressed',
    label: 'STRESSED',
    emoji: '😰',
    color: 'text-orange-400',
    bgColor: 'from-orange-500/20 to-red-500/20',
    borderColor: 'border-orange-500/30',
    message: "The budget is feeling the pressure...",
    robot: "Deep breaths. We can still turn this around.",
    range: [0.9, 1.0], // 90-100%
  },
  critical: {
    id: 'critical',
    label: 'CRITICAL',
    emoji: '🚨',
    color: 'text-red-400',
    bgColor: 'from-red-500/20 to-pink-500/20',
    borderColor: 'border-red-500/30',
    message: "BUDGET BREACH! We're in the red zone!",
    robot: "Okay don't panic. But also... maybe panic a little?",
    range: [1.0, 1.2], // 100-120%
  },
  apocalyptic: {
    id: 'apocalyptic',
    label: 'YIKES',
    emoji: '💀',
    color: 'text-pink-400',
    bgColor: 'from-pink-500/20 to-purple-500/20',
    borderColor: 'border-pink-500/30',
    message: "The budget has left the chat.",
    robot: "We don't talk about this month. Ever.",
    range: [1.2, Infinity], // 120%+
  },
};

// Get health state based on spending ratio
function getHealthState(spent, budget) {
  if (!budget || budget === 0) return HEALTH_STATES.okay;
  
  const ratio = spent / budget;
  
  for (const state of Object.values(HEALTH_STATES)) {
    if (ratio >= state.range[0] && ratio < state.range[1]) {
      return state;
    }
  }
  
  return HEALTH_STATES.apocalyptic;
}

// Animated health bar
export function BudgetHealthMeter({ spent, budget, showDetails = true }) {
  const healthState = useMemo(() => getHealthState(spent, budget), [spent, budget]);
  const percentage = budget ? Math.min((spent / budget) * 100, 150) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${healthState.bgColor} border ${healthState.borderColor} rounded-2xl p-4`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <motion.span 
            className="text-2xl"
            animate={healthState.id === 'critical' || healthState.id === 'apocalyptic' 
              ? { scale: [1, 1.2, 1] } 
              : {}
            }
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            {healthState.emoji}
          </motion.span>
          <span className={`font-bold ${healthState.color}`}>
            {healthState.label}
          </span>
        </div>
        <span className="text-text-muted text-sm">
          {percentage.toFixed(0)}%
        </span>
      </div>

      {/* Health Bar */}
      <div className="h-4 bg-black/30 rounded-full overflow-hidden mb-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full rounded-full ${
            percentage <= 50 ? 'bg-green-500' :
            percentage <= 75 ? 'bg-emerald-500' :
            percentage <= 90 ? 'bg-yellow-500' :
            percentage <= 100 ? 'bg-orange-500' :
            'bg-red-500'
          }`}
        />
        {percentage > 100 && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage - 100}%` }}
            transition={{ duration: 0.5, delay: 1 }}
            className="h-full bg-red-600 -mt-4 ml-auto"
            style={{ maxWidth: '50%' }}
          />
        )}
      </div>

      {/* Message */}
      <p className="text-text-secondary text-sm mb-2">
        {healthState.message}
      </p>

      {showDetails && (
        <div className="flex justify-between text-xs text-text-muted">
          <span>Spent: {formatCurrency(spent)}</span>
          <span>Budget: {formatCurrency(budget)}</span>
        </div>
      )}

      {/* Robot comment */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-3 pt-3 border-t border-white/10"
      >
        <p className="text-xs text-text-muted italic">
          🤖 "{healthState.robot}"
        </p>
      </motion.div>
    </motion.div>
  );
}

// Mini health badge
export function BudgetHealthBadge({ spent, budget }) {
  const healthState = getHealthState(spent, budget);
  
  return (
    <div className={`flex items-center gap-1 text-sm ${healthState.color}`}>
      <span>{healthState.emoji}</span>
      <span>{healthState.label}</span>
    </div>
  );
}

// Dramatic budget countdown
export function BudgetCountdown({ remaining, daysLeft }) {
  const perDay = daysLeft > 0 ? remaining / daysLeft : 0;
  const isNegative = remaining < 0;

  const getMessage = () => {
    if (isNegative) {
      return "You're in the red. Time for a no-spend challenge? 💪";
    }
    if (perDay < 1000) { // Less than $10/day
      return "Tight budget energy. Every dollar counts now.";
    }
    if (perDay < 2500) { // Less than $25/day
      return "Manageable! Just be mindful.";
    }
    if (perDay < 5000) { // Less than $50/day
      return "Looking comfortable! Don't get too comfy though.";
    }
    return "Plenty of runway! But remember: with great budget comes great responsibility.";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-surface-raised rounded-xl p-4"
    >
      <div className="text-center">
        <p className="text-text-muted text-xs mb-1">Daily Budget Remaining</p>
        <p className={`text-3xl font-bold ${isNegative ? 'text-red-400' : 'text-text-primary'}`}>
          {formatCurrency(Math.abs(perDay))}
          {isNegative && <span className="text-red-400">/day over</span>}
        </p>
        <p className="text-text-muted text-xs mt-1">
          for the next {daysLeft} day{daysLeft !== 1 ? 's' : ''}
        </p>
      </div>
      
      <p className="text-xs text-text-secondary text-center mt-3 italic">
        {getMessage()}
      </p>
    </motion.div>
  );
}

// Weekly health summary
export function WeeklyHealthSummary({ weekData }) {
  // weekData: [{ day: 'Mon', spent: 1500, mood: 'good' }, ...]
  
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxSpent = Math.max(...weekData.map(d => d.spent), 1);

  const getMoodEmoji = (spent, avg) => {
    if (spent === 0) return '🧘'; // No spend
    if (spent < avg * 0.5) return '😎'; // Way under
    if (spent < avg) return '😊'; // Under
    if (spent < avg * 1.5) return '😐'; // Normal
    return '😬'; // Over
  };

  const avgSpent = weekData.reduce((sum, d) => sum + d.spent, 0) / 7;

  return (
    <div className="bg-surface-raised rounded-xl p-4">
      <h3 className="text-sm font-medium text-text-primary mb-3">This Week's Vibes</h3>
      
      <div className="flex justify-between items-end h-24 mb-2">
        {days.map((day, i) => {
          const data = weekData[i] || { spent: 0 };
          const height = (data.spent / maxSpent) * 100;
          
          return (
            <div key={day} className="flex flex-col items-center">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`w-6 rounded-t ${
                  data.spent === 0 ? 'bg-green-500/50' :
                  data.spent < avgSpent ? 'bg-emerald-500' :
                  data.spent < avgSpent * 1.5 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ minHeight: data.spent > 0 ? '8px' : '2px' }}
              />
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-between text-xs text-text-muted">
        {days.map((day, i) => {
          const data = weekData[i] || { spent: 0 };
          return (
            <div key={day} className="flex flex-col items-center">
              <span>{getMoodEmoji(data.spent, avgSpent)}</span>
              <span>{day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { HEALTH_STATES, getHealthState };
