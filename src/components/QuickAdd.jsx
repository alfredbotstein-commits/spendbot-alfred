import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';
import { formatCurrency } from '../utils/format';

/**
 * QuickAdd - Shows frequent/recent expense patterns for one-tap adding
 */
export function QuickAdd({ expenses, categories, onQuickAdd, onClose }) {
  // Use useState with lazy initializer for timestamp - pure at render time
  const [now] = useState(() => Date.now());
  
  const suggestions = useMemo(() => {
    if (!expenses || expenses.length < 3) return [];
    
    // Analyze spending patterns
    const patterns = {};
    
    expenses.forEach(e => {
      // Round amount to nearest dollar for pattern matching
      const roundedAmount = Math.round(e.amount / 100) * 100;
      const key = `${e.category_id}-${roundedAmount}`;
      
      if (!patterns[key]) {
        patterns[key] = {
          categoryId: e.category_id,
          amount: roundedAmount,
          count: 0,
          lastDate: e.date
        };
      }
      patterns[key].count++;
      if (e.date > patterns[key].lastDate) {
        patterns[key].lastDate = e.date;
      }
    });

    // Sort by frequency and recency
    return Object.values(patterns)
      .filter(p => p.count >= 2) // Must have at least 2 occurrences
      .sort((a, b) => {
        // Score: frequency * recency
        const scoreA = a.count * (1 / (now - new Date(a.lastDate).getTime()));
        const scoreB = b.count * (1 / (now - new Date(b.lastDate).getTime()));
        return scoreB - scoreA;
      })
      .slice(0, 4); // Top 4 suggestions
  }, [expenses, now]);

  // Also show last expense for quick repeat
  const lastExpense = expenses?.[0];

  if (suggestions.length === 0 && !lastExpense) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-surface-raised rounded-2xl p-4 mb-4"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
            Quick Add
          </h3>
          {onClose && (
            <button 
              onClick={onClose}
              className="text-text-muted text-xs"
            >
              Hide
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Repeat last expense */}
          {lastExpense && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onQuickAdd({ amount: lastExpense.amount, categoryId: lastExpense.category_id })}
              className="flex items-center gap-2 px-3 py-2 bg-accent/10 border border-accent/30 
                         rounded-xl text-sm hover:bg-accent/20 transition-colors"
            >
              <span>🔄</span>
              <span className="text-text-primary">
                Repeat: {formatCurrency(lastExpense.amount)}
              </span>
            </motion.button>
          )}

          {/* Frequent patterns */}
          {suggestions.map((s, i) => {
            const cat = categories.find(c => c.id === s.categoryId);
            return (
              <motion.button
                key={i}
                whileTap={{ scale: 0.95 }}
                onClick={() => onQuickAdd({ amount: s.amount, categoryId: s.categoryId })}
                className="flex items-center gap-2 px-3 py-2 bg-surface rounded-xl 
                           text-sm hover:bg-border transition-colors"
              >
                <span>{cat?.emoji || '📦'}</span>
                <span className="text-text-primary">
                  {formatCurrency(s.amount)}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * RecentCategories - Quick category selector based on recent usage
 */
export function RecentCategories({ expenses, categories, onSelect, selected }) {
  const recentCategories = useMemo(() => {
    if (!expenses || expenses.length === 0) return categories.slice(0, 6);

    // Count recent category usage (last 20 expenses)
    const recent = expenses.slice(0, 20);
    const counts = {};
    recent.forEach(e => {
      counts[e.category_id] = (counts[e.category_id] || 0) + 1;
    });

    // Sort categories by recent usage
    return [...categories].sort((a, b) => {
      return (counts[b.id] || 0) - (counts[a.id] || 0);
    });
  }, [expenses, categories]);

  return (
    <div className="grid grid-cols-5 gap-2">
      {recentCategories.map((cat) => (
        <motion.button
          key={cat.id}
          whileTap={{ scale: 0.9 }}
          onClick={() => onSelect(cat.id)}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
            selected === cat.id
              ? 'bg-accent text-white scale-105'
              : 'bg-surface-raised hover:bg-border'
          }`}
        >
          <span className="text-xl">{cat.emoji}</span>
          <span className={`text-xs truncate w-full text-center ${
            selected === cat.id ? 'text-white' : 'text-text-secondary'
          }`}>
            {cat.name}
          </span>
        </motion.button>
      ))}
    </div>
  );
}

/**
 * AmountPresets - Common amount buttons for faster entry
 */
export function AmountPresets({ onSelect, recentAmounts = [] }) {
  // Default presets + learned amounts
  const defaults = [500, 1000, 1500, 2000, 2500, 5000]; // in cents
  
  // Combine with recent unique amounts (rounded)
  const uniqueRecent = [...new Set(
    recentAmounts
      .map(a => Math.round(a / 100) * 100) // Round to nearest dollar
      .filter(a => !defaults.includes(a))
  )].slice(0, 3);

  const presets = [...new Set([...uniqueRecent, ...defaults])].slice(0, 6);

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {presets.sort((a, b) => a - b).map((amount) => (
        <motion.button
          key={amount}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(amount)}
          className="px-3 py-1.5 bg-surface-raised rounded-lg text-sm text-text-secondary
                     hover:bg-border transition-colors"
        >
          {formatCurrency(amount)}
        </motion.button>
      ))}
    </div>
  );
}
