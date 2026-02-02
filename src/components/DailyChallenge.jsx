import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../utils/format';
import { getLocalDateString } from '../utils/dateUtils';

/**
 * DailyChallenge - Fun micro-challenges that make saving feel like a game
 * 
 * Each day presents a new challenge based on user's spending patterns.
 * Completing challenges earns streaks and unlocks achievements.
 */

const CHALLENGE_TYPES = [
  {
    id: 'no-spend',
    name: 'No Spend Day',
    emoji: '🚫',
    description: 'Don\'t spend anything today',
    difficulty: 'hard',
    checkComplete: (todayTotal) => todayTotal === 0,
  },
  {
    id: 'under-20',
    name: 'Minimalist Monday',
    emoji: '🪶',
    description: 'Keep spending under $20 today',
    difficulty: 'medium',
    checkComplete: (todayTotal) => todayTotal <= 2000,
  },
  {
    id: 'under-10',
    name: 'Lean & Mean',
    emoji: '💪',
    description: 'Spend less than $10 today',
    difficulty: 'hard',
    checkComplete: (todayTotal) => todayTotal <= 1000,
  },
  {
    id: 'single-expense',
    name: 'One & Done',
    emoji: '☝️',
    description: 'Only log one expense today',
    difficulty: 'medium',
    checkComplete: (todayTotal, todayCount) => todayCount === 1,
  },
  {
    id: 'beat-yesterday',
    name: 'Better Than Yesterday',
    emoji: '📈',
    description: 'Spend less than you did yesterday',
    difficulty: 'medium',
    checkComplete: (todayTotal, todayCount, yesterdayTotal) => todayTotal < yesterdayTotal,
  },
  {
    id: 'no-food',
    name: 'Home Chef',
    emoji: '👨‍🍳',
    description: 'No eating out today',
    difficulty: 'medium',
    checkComplete: (todayTotal, todayCount, yesterdayTotal, todayExpenses) => 
      !todayExpenses.some(e => e.category_id === 'food'),
  },
  {
    id: 'no-coffee',
    name: 'Caffeine Detox',
    emoji: '☕',
    description: 'Skip the coffee shop today',
    difficulty: 'easy',
    checkComplete: (todayTotal, todayCount, yesterdayTotal, todayExpenses) => 
      !todayExpenses.some(e => e.category_id === 'coffee'),
  },
  {
    id: 'under-daily-avg',
    name: 'Below Average',
    emoji: '📊',
    description: 'Spend less than your daily average',
    difficulty: 'medium',
    checkComplete: (todayTotal, todayCount, yesterdayTotal, todayExpenses, dailyAvg) => 
      todayTotal < dailyAvg,
  },
];

// Get today's challenge based on day of year (consistent per day)
function getTodaysChallenge(dayOfYear, userData) {
  // Filter out challenges that don't make sense for the user
  const validChallenges = CHALLENGE_TYPES.filter(c => {
    // Don't show "beat yesterday" if no yesterday data
    if (c.id === 'beat-yesterday' && !userData.yesterdayTotal) return false;
    // Don't show "below average" if no average yet
    if (c.id === 'under-daily-avg' && !userData.dailyAvg) return false;
    return true;
  });
  
  // Use day of year to pick challenge (changes daily)
  const index = dayOfYear % validChallenges.length;
  return validChallenges[index];
}

function getDayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export function DailyChallenge({ expenses, onComplete }) {
  const [dismissed, setDismissed] = useState(false);
  const [celebrated, setCelebrated] = useState(false);
  
  const challengeData = useMemo(() => {
    const today = getLocalDateString();
    const yesterday = getLocalDateString(new Date(Date.now() - 86400000));
    
    const todayExpenses = expenses.filter(e => e.date?.startsWith(today));
    const yesterdayExpenses = expenses.filter(e => e.date?.startsWith(yesterday));
    
    const todayTotal = todayExpenses.reduce((sum, e) => sum + e.amount, 0);
    const yesterdayTotal = yesterdayExpenses.reduce((sum, e) => sum + e.amount, 0);
    const todayCount = todayExpenses.length;
    
    // Calculate daily average from last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);
    const recentExpenses = expenses.filter(e => new Date(e.date) >= thirtyDaysAgo);
    const totalSpent = recentExpenses.reduce((sum, e) => sum + e.amount, 0);
    const daysWithData = new Set(recentExpenses.map(e => e.date?.slice(0, 10))).size;
    const dailyAvg = daysWithData > 0 ? totalSpent / daysWithData : 0;
    
    return {
      todayTotal,
      todayCount,
      yesterdayTotal,
      todayExpenses,
      dailyAvg,
    };
  }, [expenses]);
  
  const challenge = useMemo(() => {
    return getTodaysChallenge(getDayOfYear(), challengeData);
  }, [challengeData]);
  
  const isComplete = useMemo(() => {
    if (!challenge) return false;
    return challenge.checkComplete(
      challengeData.todayTotal,
      challengeData.todayCount,
      challengeData.yesterdayTotal,
      challengeData.todayExpenses,
      challengeData.dailyAvg
    );
  }, [challenge, challengeData]);
  
  // Celebrate on completion
  useEffect(() => {
    if (isComplete && !celebrated) {
      setCelebrated(true);
      onComplete?.(challenge);
    }
  }, [isComplete, celebrated, challenge, onComplete]);
  
  if (dismissed || !challenge) return null;
  
  const difficultyColors = {
    easy: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
    medium: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
    hard: 'from-red-500/20 to-pink-500/20 border-red-500/30',
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`relative rounded-2xl p-4 mb-4 border bg-gradient-to-br ${
        isComplete 
          ? 'from-success/20 to-emerald-500/20 border-success/30'
          : difficultyColors[challenge.difficulty]
      }`}
    >
      {/* Dismiss button */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 text-text-muted hover:text-text-secondary"
      >
        ✕
      </button>
      
      <div className="flex items-start gap-3">
        <motion.span 
          className="text-3xl"
          animate={isComplete ? { 
            scale: [1, 1.3, 1],
            rotate: [0, -10, 10, 0]
          } : {}}
          transition={{ duration: 0.5 }}
        >
          {isComplete ? '🎉' : challenge.emoji}
        </motion.span>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-text-primary">
              {isComplete ? 'Challenge Complete!' : "Today's Challenge"}
            </h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              challenge.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
              challenge.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {challenge.difficulty}
            </span>
          </div>
          
          <p className="text-sm text-text-secondary mb-2">
            {challenge.name}: {challenge.description}
          </p>
          
          {/* Progress indicator */}
          {!isComplete && (
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <span>Current: {formatCurrency(challengeData.todayTotal)}</span>
              {challenge.id === 'beat-yesterday' && challengeData.yesterdayTotal > 0 && (
                <span>• Yesterday: {formatCurrency(challengeData.yesterdayTotal)}</span>
              )}
              {challenge.id === 'under-daily-avg' && challengeData.dailyAvg > 0 && (
                <span>• Avg: {formatCurrency(challengeData.dailyAvg)}</span>
              )}
            </div>
          )}
          
          {isComplete && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-success font-medium"
            >
              +1 Challenge Streak! Keep it up! 🔥
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * ChallengeStreak - Shows how many challenges completed
 */
export function ChallengeStreak({ completedCount }) {
  if (completedCount === 0) return null;
  
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30"
    >
      <span>🏆</span>
      <span className="text-sm font-semibold text-purple-400">
        {completedCount} Challenge{completedCount !== 1 ? 's' : ''} Complete
      </span>
    </motion.div>
  );
}
