import { useState } from 'react';
import { motion } from 'framer-motion';
import haptic from '../utils/haptics';
import playSound from '../utils/sounds';

// Spending moods
const MOODS = [
  { id: 'planned', emoji: '📋', label: 'Planned', color: 'from-blue-500 to-cyan-500', description: 'I intended to buy this' },
  { id: 'needed', emoji: '✅', label: 'Needed', color: 'from-green-500 to-emerald-500', description: 'Essential purchase' },
  { id: 'treat', emoji: '🎁', label: 'Treat', color: 'from-purple-500 to-pink-500', description: 'A reward for myself' },
  { id: 'impulse', emoji: '⚡', label: 'Impulse', color: 'from-orange-500 to-red-500', description: 'Spontaneous decision' },
  { id: 'social', emoji: '👥', label: 'Social', color: 'from-yellow-500 to-orange-500', description: 'With friends/family' },
  { id: 'stressed', emoji: '😰', label: 'Stressed', color: 'from-red-500 to-rose-500', description: 'Emotional purchase' },
];

// Mood selector component (shows after expense is saved)
export function MoodSelector({ onSelect, onSkip }) {
  const [selected, setSelected] = useState(null);
  
  const handleSelect = (mood) => {
    setSelected(mood.id);
    haptic('light');
    playSound('pop');
    
    // Delay to show selection animation
    setTimeout(() => {
      onSelect(mood.id);
    }, 300);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mt-4"
    >
      <p className="text-sm text-text-secondary text-center mb-3">
        How did this purchase feel?
      </p>
      
      <div className="grid grid-cols-3 gap-2">
        {MOODS.map((mood) => (
          <motion.button
            key={mood.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(mood)}
            className={`relative p-3 rounded-xl transition-all ${
              selected === mood.id
                ? `bg-gradient-to-br ${mood.color} text-white`
                : 'bg-surface-raised text-text-primary hover:bg-surface-raised/80'
            }`}
          >
            <span className="text-2xl block mb-1">{mood.emoji}</span>
            <span className="text-xs font-medium">{mood.label}</span>
            
            {selected === mood.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full 
                           flex items-center justify-center text-xs"
              >
                ✓
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
      
      <button
        onClick={onSkip}
        className="w-full mt-3 py-2 text-sm text-text-muted"
      >
        Skip
      </button>
    </motion.div>
  );
}

// Mood insights widget for dashboard
export function MoodInsights({ expenses }) {
  if (!expenses || expenses.length < 5) return null;
  
  // Calculate mood distribution
  const moodCounts = {};
  const moodTotals = {};
  
  expenses.forEach(e => {
    if (e.mood) {
      moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
      moodTotals[e.mood] = (moodTotals[e.mood] || 0) + e.amount;
    }
  });
  
  const expensesWithMood = expenses.filter(e => e.mood).length;
  if (expensesWithMood < 5) return null;
  
  // Find dominant mood
  const dominantMood = Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1])[0];
  
  // Find highest spending mood
  const highestSpendMood = Object.entries(moodTotals)
    .sort((a, b) => b[1] - a[1])[0];
  
  const dominantMoodData = MOODS.find(m => m.id === dominantMood?.[0]);
  // Reserved for future mood spending comparison feature
  const _highestSpendMoodData = MOODS.find(m => m.id === highestSpendMood?.[0]);
  
  // Calculate impulse percentage
  const impulseCount = moodCounts['impulse'] || 0;
  const impulsePercent = Math.round((impulseCount / expensesWithMood) * 100);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 
                 border border-purple-500/20 rounded-2xl p-4 mb-4"
    >
      <h3 className="font-semibold text-text-primary flex items-center gap-2 mb-3">
        <span>🧠</span> Spending Psychology
      </h3>
      
      <div className="space-y-3">
        {/* Most common mood */}
        {dominantMoodData && (
          <div className="flex items-center gap-3">
            <span className="text-2xl">{dominantMoodData.emoji}</span>
            <div>
              <p className="text-sm text-text-primary">
                Most purchases are <strong>{dominantMoodData.label.toLowerCase()}</strong>
              </p>
              <p className="text-xs text-text-muted">
                {dominantMood[1]} of {expensesWithMood} tracked purchases
              </p>
            </div>
          </div>
        )}
        
        {/* Impulse alert */}
        {impulsePercent > 30 && (
          <div className="flex items-center gap-3 p-2 bg-orange-500/10 rounded-xl">
            <span className="text-2xl">⚡</span>
            <div>
              <p className="text-sm text-orange-400 font-medium">
                {impulsePercent}% impulse purchases
              </p>
              <p className="text-xs text-text-muted">
                Try the 24-hour rule before buying
              </p>
            </div>
          </div>
        )}
        
        {/* Stressed spending alert */}
        {moodCounts['stressed'] > 2 && (
          <div className="flex items-center gap-3 p-2 bg-red-500/10 rounded-xl">
            <span className="text-2xl">😰</span>
            <div>
              <p className="text-sm text-red-400 font-medium">
                Stress spending detected
              </p>
              <p className="text-xs text-text-muted">
                Consider healthier coping strategies
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Mood badge for expense items
export function MoodBadge({ mood }) {
  const moodData = MOODS.find(m => m.id === mood);
  if (!moodData) return null;
  
  return (
    <span 
      className="inline-flex items-center gap-1 text-xs px-2 py-0.5 
                 bg-surface-raised rounded-full"
      title={moodData.description}
    >
      <span>{moodData.emoji}</span>
      <span className="text-text-muted">{moodData.label}</span>
    </span>
  );
}

export { MOODS };
