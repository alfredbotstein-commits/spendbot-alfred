import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLocalDateString } from '../utils/dateUtils';
import { playSound } from '../utils/sounds';
import { haptic } from '../utils/haptics';

/**
 * NoSpendCelebration - Celebrates when user has a no-spend day
 * 
 * The ultimate flex in expense tracking — celebrating NOT spending.
 * Shows a special animation and tracks no-spend streaks.
 */

export function NoSpendDayBadge({ expenses, onCelebrate }) {
  const [celebrated, setCelebrated] = useState(false);
  
  const noSpendInfo = useMemo(() => {
    const today = getLocalDateString();
    const todayExpenses = expenses.filter(e => e.date?.startsWith(today));
    const isNoSpendDay = todayExpenses.length === 0;
    
    // Check time - only count as no-spend if it's after 6 PM
    const hour = new Date().getHours();
    const canCelebrate = hour >= 18;
    
    // Count no-spend days this month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const daysInMonth = new Set();
    
    for (let d = new Date(monthStart); d <= now; d.setDate(d.getDate() + 1)) {
      const dateStr = getLocalDateString(new Date(d));
      const hasExpenses = expenses.some(e => e.date?.startsWith(dateStr));
      if (!hasExpenses) {
        daysInMonth.add(dateStr);
      }
    }
    
    // Calculate no-spend streak
    let streak = 0;
    let checkDate = new Date();
    
    while (true) {
      const dateStr = getLocalDateString(checkDate);
      const dayExpenses = expenses.filter(e => e.date?.startsWith(dateStr));
      
      if (dayExpenses.length === 0) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
      
      // Max lookback
      if (streak > 30) break;
    }
    
    return {
      isNoSpendDay,
      canCelebrate,
      noSpendDaysThisMonth: daysInMonth.size,
      streak: isNoSpendDay ? streak : 0,
    };
  }, [expenses]);
  
  // Celebrate when conditions are met
  useEffect(() => {
    if (noSpendInfo.isNoSpendDay && noSpendInfo.canCelebrate && !celebrated) {
      setCelebrated(true);
      playSound('achievement');
      haptic('success');
      onCelebrate?.();
    }
  }, [noSpendInfo, celebrated, onCelebrate]);
  
  if (!noSpendInfo.isNoSpendDay) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative rounded-2xl p-4 mb-4 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 overflow-hidden"
    >
      {/* Sparkle effects */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          />
        ))}
      </div>
      
      <div className="flex items-center gap-3 relative">
        <motion.span 
          className="text-4xl"
          animate={{ 
            rotate: [0, -10, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🎊
        </motion.span>
        
        <div>
          <h3 className="font-semibold text-emerald-400">
            No Spend Day!
          </h3>
          <p className="text-sm text-text-secondary">
            {noSpendInfo.streak > 1 
              ? `${noSpendInfo.streak} day streak! You're on fire!`
              : "You haven't spent anything today. Amazing!"}
          </p>
        </div>
        
        {noSpendInfo.noSpendDaysThisMonth > 1 && (
          <div className="ml-auto text-center">
            <span className="text-2xl font-bold text-emerald-400">
              {noSpendInfo.noSpendDaysThisMonth}
            </span>
            <p className="text-xs text-text-muted">this month</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/**
 * NoSpendCelebrationModal - Full screen celebration
 */
export function NoSpendCelebrationModal({ onClose }) {
  useEffect(() => {
    playSound('achievement');
    haptic('achievement');
  }, []);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Confetti particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-sm"
            style={{
              left: `${Math.random() * 100}%`,
              backgroundColor: ['#10B981', '#34D399', '#6EE7B7', '#FBBF24', '#F472B6'][i % 5],
            }}
            initial={{ y: -20, rotate: 0 }}
            animate={{
              y: window.innerHeight + 20,
              rotate: Math.random() * 720 - 360,
              x: Math.random() * 100 - 50,
            }}
            transition={{
              duration: Math.random() * 2 + 2,
              delay: Math.random() * 0.5,
              ease: 'easeIn',
            }}
          />
        ))}
      </div>
      
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 10 }}
        className="text-center"
      >
        <motion.span 
          className="text-8xl block mb-4"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5, repeat: 3 }}
        >
          🏆
        </motion.span>
        
        <h1 className="text-3xl font-bold text-white mb-2">
          NO SPEND DAY!
        </h1>
        
        <p className="text-emerald-400 text-lg mb-6">
          You did it! $0 spent today.
        </p>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-emerald-500 rounded-full text-white font-semibold"
        >
          Celebrate! 🎉
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
