import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../utils/format';
import haptic from '../utils/haptics';
import playSound from '../utils/sounds';

// Challenge definitions
const CHALLENGES = [
  {
    id: 'no_spend_sunday',
    name: 'No-Spend Sunday',
    emoji: '🌅',
    description: 'Go the whole day without spending',
    type: 'no_spend',
    duration: 'day',
    dayOfWeek: 0, // Sunday
    reward: 50, // XP
  },
  {
    id: 'coffee_free_week',
    name: 'Coffee-Free Week',
    emoji: '☕',
    description: 'Skip the café for 7 days straight',
    type: 'category_avoid',
    categoryId: 'coffee',
    duration: 'week',
    reward: 200,
  },
  {
    id: 'meal_prep_master',
    name: 'Meal Prep Master',
    emoji: '🍱',
    description: 'No dining out for 5 days',
    type: 'category_avoid',
    categoryId: 'dining',
    duration: 'custom',
    durationDays: 5,
    reward: 150,
  },
  {
    id: 'budget_boss',
    name: 'Budget Boss',
    emoji: '💪',
    description: 'Stay under budget for the whole month',
    type: 'under_budget',
    duration: 'month',
    reward: 500,
  },
  {
    id: 'streak_starter',
    name: 'Streak Starter',
    emoji: '🔥',
    description: 'Track expenses for 7 days straight',
    type: 'streak',
    targetDays: 7,
    reward: 100,
  },
  {
    id: 'impulse_control',
    name: 'Impulse Control',
    emoji: '🧘',
    description: 'No shopping purchases for 3 days',
    type: 'category_avoid',
    categoryId: 'shopping',
    duration: 'custom',
    durationDays: 3,
    reward: 75,
  },
  {
    id: 'entertainment_diet',
    name: 'Entertainment Diet',
    emoji: '🎮',
    description: 'Limit entertainment to $20 this week',
    type: 'category_limit',
    categoryId: 'entertainment',
    limitAmount: 2000, // cents
    duration: 'week',
    reward: 100,
  },
  {
    id: 'minimalist_monday',
    name: 'Minimalist Monday',
    emoji: '✨',
    description: 'Spend under $10 total today',
    type: 'daily_limit',
    limitAmount: 1000,
    dayOfWeek: 1, // Monday
    reward: 30,
  },
];

// Calculate challenge progress
function getChallengeProgress(challenge, expenses, startDate) {
  const start = new Date(startDate);
  const now = new Date();
  
  // Filter expenses within challenge period
  const relevantExpenses = expenses.filter(e => {
    const expenseDate = new Date(e.date);
    return expenseDate >= start && expenseDate <= now;
  });
  
  switch (challenge.type) {
    case 'no_spend': {
      const hasSpent = relevantExpenses.length > 0;
      return { progress: hasSpent ? 0 : 100, failed: hasSpent };
    }
    
    case 'category_avoid': {
      const categorySpends = relevantExpenses.filter(
        e => e.category_id === challenge.categoryId
      );
      return { 
        progress: categorySpends.length === 0 ? 100 : 0,
        failed: categorySpends.length > 0,
        count: categorySpends.length,
      };
    }
    
    case 'category_limit': {
      const categoryTotal = relevantExpenses
        .filter(e => e.category_id === challenge.categoryId)
        .reduce((sum, e) => sum + e.amount, 0);
      const progress = Math.max(0, 100 - (categoryTotal / challenge.limitAmount) * 100);
      return { 
        progress,
        failed: categoryTotal > challenge.limitAmount,
        spent: categoryTotal,
        limit: challenge.limitAmount,
      };
    }
    
    case 'daily_limit': {
      const total = relevantExpenses.reduce((sum, e) => sum + e.amount, 0);
      const progress = Math.max(0, 100 - (total / challenge.limitAmount) * 100);
      return {
        progress,
        failed: total > challenge.limitAmount,
        spent: total,
        limit: challenge.limitAmount,
      };
    }
    
    case 'under_budget': {
      // This needs monthlyBudget from settings
      return { progress: 50 }; // Placeholder
    }
    
    case 'streak': {
      // This needs streak data
      return { progress: 50 }; // Placeholder
    }
    
    default:
      return { progress: 0 };
  }
}

// Challenge card component
function ChallengeCard({ challenge, isActive, progress, onStart, onComplete }) {
  const isCompleted = progress?.progress >= 100 && !progress?.failed;
  const isFailed = progress?.failed;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-2xl p-4 ${
        isCompleted 
          ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30'
          : isFailed
          ? 'bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20'
          : isActive
          ? 'bg-gradient-to-br from-accent/20 to-purple-500/20 border border-accent/30'
          : 'bg-surface-raised border border-border'
      }`}
    >
      {/* Completion overlay */}
      {isCompleted && (
        <div className="absolute top-2 right-2">
          <span className="text-2xl">✅</span>
        </div>
      )}
      
      {/* Failed overlay */}
      {isFailed && (
        <div className="absolute top-2 right-2">
          <span className="text-2xl opacity-50">❌</span>
        </div>
      )}
      
      <div className="flex items-start gap-3">
        <span className="text-3xl">{challenge.emoji}</span>
        <div className="flex-1">
          <h3 className="font-semibold text-text-primary">{challenge.name}</h3>
          <p className="text-sm text-text-secondary mt-0.5">{challenge.description}</p>
          
          {/* Progress bar */}
          {isActive && !isCompleted && !isFailed && (
            <div className="mt-3">
              <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress?.progress || 0}%` }}
                  className="h-full bg-accent rounded-full"
                />
              </div>
              {progress?.spent !== undefined && (
                <p className="text-xs text-text-muted mt-1">
                  {formatCurrency(progress.spent)} / {formatCurrency(progress.limit)} limit
                </p>
              )}
            </div>
          )}
          
          {/* Reward */}
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-text-muted">
              🏆 {challenge.reward} XP
            </span>
            
            {!isActive && !isCompleted && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  haptic('medium');
                  playSound('pop');
                  onStart(challenge);
                }}
                className="px-3 py-1.5 bg-accent text-white text-sm font-medium rounded-lg"
              >
                Start
              </motion.button>
            )}
            
            {isActive && isCompleted && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  haptic('achievement');
                  playSound('achievement');
                  onComplete(challenge);
                }}
                className="px-3 py-1.5 bg-green-500 text-white text-sm font-medium rounded-lg"
              >
                Claim Reward
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Active challenges widget for dashboard
export function ActiveChallengesWidget({ activeChallenges, expenses, onViewAll }) {
  if (!activeChallenges || activeChallenges.length === 0) {
    return null;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-raised rounded-2xl p-4 mb-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-text-primary flex items-center gap-2">
          <span>🎯</span> Active Challenges
        </h3>
        <button 
          onClick={onViewAll}
          className="text-sm text-accent"
        >
          View All
        </button>
      </div>
      
      <div className="space-y-2">
        {activeChallenges.slice(0, 2).map(ac => {
          const challenge = CHALLENGES.find(c => c.id === ac.challengeId);
          if (!challenge) return null;
          
          const progress = getChallengeProgress(challenge, expenses, ac.startDate);
          
          return (
            <div 
              key={ac.challengeId}
              className="flex items-center gap-3 p-2 bg-black/10 rounded-xl"
            >
              <span className="text-xl">{challenge.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {challenge.name}
                </p>
                <div className="h-1.5 bg-black/20 rounded-full overflow-hidden mt-1">
                  <div 
                    className={`h-full rounded-full ${
                      progress.failed ? 'bg-red-500' : 'bg-accent'
                    }`}
                    style={{ width: `${progress.progress}%` }}
                  />
                </div>
              </div>
              {progress.failed ? (
                <span className="text-lg">❌</span>
              ) : progress.progress >= 100 ? (
                <span className="text-lg">✅</span>
              ) : null}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// Full challenges page
export function ChallengesPage({ 
  activeChallenges = [], 
  completedChallenges = [],
  expenses = [],
  onStartChallenge,
  onCompleteChallenge,
  onClose 
}) {
  const [tab, setTab] = useState('available');
  
  const availableChallenges = CHALLENGES.filter(
    c => !activeChallenges.find(ac => ac.challengeId === c.id) &&
         !completedChallenges.includes(c.id)
  );
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background z-50 overflow-auto"
    >
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-text-primary">🎯 Challenges</h1>
          <button 
            onClick={onClose}
            className="text-2xl text-text-secondary"
          >
            ✕
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          {['available', 'active', 'completed'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                tab === t 
                  ? 'bg-accent text-white' 
                  : 'bg-surface-raised text-text-secondary'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {t === 'active' && activeChallenges.length > 0 && (
                <span className="ml-1.5 bg-white/20 px-1.5 rounded-full text-xs">
                  {activeChallenges.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 space-y-3">
        <AnimatePresence mode="wait">
          {tab === 'available' && (
            <motion.div
              key="available"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              {availableChallenges.length === 0 ? (
                <p className="text-center text-text-muted py-8">
                  You've started all available challenges! 🎉
                </p>
              ) : (
                availableChallenges.map(challenge => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    isActive={false}
                    onStart={onStartChallenge}
                  />
                ))
              )}
            </motion.div>
          )}
          
          {tab === 'active' && (
            <motion.div
              key="active"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              {activeChallenges.length === 0 ? (
                <p className="text-center text-text-muted py-8">
                  No active challenges. Start one! 💪
                </p>
              ) : (
                activeChallenges.map(ac => {
                  const challenge = CHALLENGES.find(c => c.id === ac.challengeId);
                  if (!challenge) return null;
                  
                  const progress = getChallengeProgress(challenge, expenses, ac.startDate);
                  
                  return (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      isActive={true}
                      progress={progress}
                      onComplete={onCompleteChallenge}
                    />
                  );
                })
              )}
            </motion.div>
          )}
          
          {tab === 'completed' && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              {completedChallenges.length === 0 ? (
                <p className="text-center text-text-muted py-8">
                  Complete challenges to see them here! 🏆
                </p>
              ) : (
                completedChallenges.map(id => {
                  const challenge = CHALLENGES.find(c => c.id === id);
                  if (!challenge) return null;
                  
                  return (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      isActive={false}
                      progress={{ progress: 100 }}
                    />
                  );
                })
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export { CHALLENGES, getChallengeProgress };
