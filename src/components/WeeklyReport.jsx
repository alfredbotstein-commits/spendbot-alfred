import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../utils/format';
import { getLocalDateString, getLocalMonthString } from '../utils/dateUtils';

/**
 * WeeklyReport - A beautiful summary card that makes users feel accomplished
 * 
 * Shows up once a week with a "report card" of their spending habits.
 * Makes tracking feel rewarding, not punishing.
 */

const GRADES = [
  { min: 90, grade: 'A+', emoji: '🏆', message: "Legendary! You're a budgeting master!" },
  { min: 80, grade: 'A', emoji: '🌟', message: "Excellent work! Keep crushing it!" },
  { min: 70, grade: 'B+', emoji: '💪', message: "Great job! You're on the right track." },
  { min: 60, grade: 'B', emoji: '👍', message: "Solid week! Room to improve, but good." },
  { min: 50, grade: 'C+', emoji: '📈', message: "Not bad! Let's aim higher next week." },
  { min: 40, grade: 'C', emoji: '🎯', message: "Average week. You've got more in you!" },
  { min: 30, grade: 'D', emoji: '💸', message: "Spent a bit much. Fresh start next week!" },
  { min: 0, grade: 'F', emoji: '🔥', message: "Yikes! But hey, awareness is step one." },
];

function getGrade(score) {
  return GRADES.find(g => score >= g.min) || GRADES[GRADES.length - 1];
}

function calculateWeeklyScore({ 
  weekTotal, 
  weeklyBudget, 
  daysTracked, 
  categoriesUsed,
  vsLastWeek,
}) {
  let score = 50; // Start at average
  
  // Budget adherence (up to +30 or -30)
  if (weeklyBudget && weeklyBudget > 0) {
    const budgetRatio = weekTotal / weeklyBudget;
    if (budgetRatio <= 0.8) score += 30;
    else if (budgetRatio <= 1.0) score += 20;
    else if (budgetRatio <= 1.2) score += 0;
    else if (budgetRatio <= 1.5) score -= 15;
    else score -= 30;
  }
  
  // Tracking consistency (+20 for 7 days)
  score += (daysTracked / 7) * 20;
  
  // Category diversity bonus (+5 for using multiple categories)
  if (categoriesUsed >= 3) score += 5;
  
  // Improvement vs last week (+10)
  if (vsLastWeek && vsLastWeek < 0) score += 10;
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function WeeklyReport({ expenses, monthlyBudget, onClose }) {
  const report = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 86400000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 86400000);
    
    // This week's expenses
    const thisWeekExpenses = expenses.filter(e => {
      const d = new Date(e.date);
      return d >= weekAgo;
    });
    
    // Last week's expenses
    const lastWeekExpenses = expenses.filter(e => {
      const d = new Date(e.date);
      return d >= twoWeeksAgo && d < weekAgo;
    });
    
    const weekTotal = thisWeekExpenses.reduce((sum, e) => sum + e.amount, 0);
    const lastWeekTotal = lastWeekExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    // Days with expenses this week
    const daysWithExpenses = new Set(
      thisWeekExpenses.map(e => getLocalDateString(new Date(e.date)))
    ).size;
    
    // Categories used
    const categoriesUsed = new Set(thisWeekExpenses.map(e => e.category_id)).size;
    
    // Weekly budget (monthly / 4.33)
    const weeklyBudget = monthlyBudget ? monthlyBudget / 4.33 : null;
    
    // Change vs last week
    const vsLastWeek = lastWeekTotal > 0 
      ? ((weekTotal - lastWeekTotal) / lastWeekTotal) * 100 
      : null;
    
    const score = calculateWeeklyScore({
      weekTotal,
      weeklyBudget,
      daysTracked: daysWithExpenses,
      categoriesUsed,
      vsLastWeek,
    });
    
    const gradeInfo = getGrade(score);
    
    // Top category
    const categoryTotals = {};
    thisWeekExpenses.forEach(e => {
      categoryTotals[e.category_id] = (categoryTotals[e.category_id] || 0) + e.amount;
    });
    const topCategory = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])[0];
    
    return {
      weekTotal,
      lastWeekTotal,
      vsLastWeek,
      daysWithExpenses,
      expenseCount: thisWeekExpenses.length,
      categoriesUsed,
      weeklyBudget,
      score,
      gradeInfo,
      topCategory,
    };
  }, [expenses, monthlyBudget]);
  
  if (!report || report.expenseCount === 0) return null;
  
  const { gradeInfo, score, weekTotal, vsLastWeek, daysWithExpenses, weeklyBudget } = report;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-gradient-to-br from-surface to-surface-elevated rounded-3xl p-6 max-w-sm w-full border border-white/10"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <motion.span 
            className="text-6xl block mb-2"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            {gradeInfo.emoji}
          </motion.span>
          <h2 className="text-xl font-heading font-bold text-text-primary">
            Weekly Report Card
          </h2>
          <p className="text-text-muted text-sm">Your spending performance</p>
        </div>
        
        {/* Grade Circle */}
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.3 }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.4)]"
          >
            <span className="text-4xl font-bold text-white">{gradeInfo.grade}</span>
          </motion.div>
        </div>
        
        {/* Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-text-secondary mb-6"
        >
          {gradeInfo.message}
        </motion.p>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-text-primary">
              {formatCurrency(weekTotal)}
            </p>
            <p className="text-xs text-text-muted">Total Spent</p>
          </div>
          
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <p className={`text-2xl font-bold ${
              vsLastWeek === null ? 'text-text-muted' :
              vsLastWeek < 0 ? 'text-success' : 'text-danger'
            }`}>
              {vsLastWeek === null ? '—' : 
                `${vsLastWeek > 0 ? '+' : ''}${vsLastWeek.toFixed(0)}%`}
            </p>
            <p className="text-xs text-text-muted">vs Last Week</p>
          </div>
          
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-text-primary">
              {daysWithExpenses}/7
            </p>
            <p className="text-xs text-text-muted">Days Tracked</p>
          </div>
          
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <p className={`text-2xl font-bold ${
              !weeklyBudget ? 'text-text-muted' :
              weekTotal <= weeklyBudget ? 'text-success' : 'text-danger'
            }`}>
              {weeklyBudget 
                ? `${Math.round((weekTotal / weeklyBudget) * 100)}%`
                : '—'}
            </p>
            <p className="text-xs text-text-muted">of Budget</p>
          </div>
        </div>
        
        {/* Close Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="w-full py-3 bg-accent rounded-xl text-white font-semibold"
        >
          Keep Going! 💪
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

/**
 * WeeklyReportTrigger - Small card that opens the full report
 */
export function WeeklyReportTrigger({ expenses, monthlyBudget }) {
  const [showReport, setShowReport] = useState(false);
  
  // Only show on Sundays or if they haven't seen it this week
  const shouldShow = useMemo(() => {
    const today = new Date().getDay();
    return today === 0; // Sunday
  }, []);
  
  if (!shouldShow || !expenses || expenses.length < 5) return null;
  
  return (
    <>
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowReport(true)}
        className="w-full p-4 mb-4 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">📊</span>
          <div>
            <p className="font-semibold text-text-primary">Weekly Report Ready!</p>
            <p className="text-sm text-text-muted">Tap to see your grade</p>
          </div>
          <span className="ml-auto text-xl">→</span>
        </div>
      </motion.button>
      
      <AnimatePresence>
        {showReport && (
          <WeeklyReport
            expenses={expenses}
            monthlyBudget={monthlyBudget}
            onClose={() => setShowReport(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
