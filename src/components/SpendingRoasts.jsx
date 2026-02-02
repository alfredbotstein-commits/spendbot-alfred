import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../utils/format';

/**
 * Spending Roasts - The robot gently (or not so gently) roasts your purchases
 * 
 * Because sometimes you need a reality check from an AI.
 */

// Category-specific roasts
const CATEGORY_ROASTS = {
  coffee: [
    "Another coffee? At this point you're just renting it.",
    "Your barista is putting their kids through college. You're welcome.",
    "This could've been instant coffee but go off I guess.",
    "Starbucks shareholders thank you for your service.",
    "You know you can make coffee at HOME right? ...Anyway.",
    "Caffeine addiction is valid. This is a safe space.",
    "At least it's not drugs. (Caffeine IS a drug but shhh.)",
  ],
  food: [
    "Ah yes, the 'I'll cook tomorrow' purchase.",
    "Your kitchen is starting to feel neglected.",
    "Uber Eats thanks you. Your wallet does not.",
    "Cooking at home: 0. Delivery apps: still winning.",
    "The fridge at home: 'Am I a joke to you?'",
    "Meal prep who? Don't know her.",
    "Future you is looking at past you with questions.",
  ],
  shopping: [
    "Did you NEED it or did Instagram tell you to buy it?",
    "Retail therapy: when regular therapy is also expensive.",
    "Your closet called. It's at capacity.",
    "This sparks joy? Or just temporary dopamine?",
    "Add to cart is a lifestyle at this point.",
    "The algorithm knows you too well.",
    "Impulse purchase or planned? Be honest.",
  ],
  entertainment: [
    "At least you're having fun! ...Right?",
    "Memories > Money. But also... money.",
    "YOLO is valid but so is YOLO (You Only Live Once so maybe save a little).",
    "Life's short! Spend responsibly! (Contradictions are fine.)",
    "Joy is priceless. This joy was $XX though.",
    "You can't take money to the grave! (But you can retire comfortably.)",
  ],
  transport: [
    "Gas prices are a scam and I support you.",
    "Uber surge pricing: legal robbery.",
    "Walking is free. Just saying. Anyway.",
    "Your car is expensive but at least it's... expensive.",
    "Public transit exists but I respect your choices.",
  ],
  subscriptions: [
    "When's the last time you used this? Be honest.",
    "The gym subscription collecting dust, I see.",
    "You're subscribing to subscriptions at this point.",
    "Free trial? More like 'forget to cancel' trial.",
    "Do you even remember signing up for this?",
  ],
  health: [
    "Health is wealth! This is a good expense actually.",
    "Investing in yourself. I approve.",
    "Self-care isn't selfish. Carry on.",
    "Your body thanks you. Your wallet understands.",
    "This one gets a pass. Health first!",
  ],
  default: [
    "I have questions but I'll mind my business.",
    "No judgment here. (Okay maybe a little.)",
    "Interesting choice. Interesting.",
    "The robot sees all. The robot says nothing. (This time.)",
    "Filed under: things that happened.",
    "Your money, your rules. I'm just the messenger.",
    "I'm not saying anything. 🤐",
  ],
};

// Amount-based roasts
const AMOUNT_ROASTS = {
  tiny: [ // Under $5
    "Micro-purchase! Death by a thousand cuts style.",
    "It's the little things. (That add up. Sneakily.)",
    "Barely felt that one!",
  ],
  small: [ // $5-20
    "Reasonable! I'll allow it.",
    "This is fine. Everything is fine.",
    "Standard human expense. Approved.",
  ],
  medium: [ // $20-50
    "Getting into 'think about it' territory...",
    "Not nothing, but not everything. Proceed.",
    "The budget felt that one.",
  ],
  large: [ // $50-100
    "Okay that's a chunk of change.",
    "My sensors are tingling.",
    "Your future self has opinions about this.",
  ],
  huge: [ // $100-500
    "WE'RE IN THE BIG LEAGUES NOW.",
    "That's... that's a lot of coffee money.",
    "I need a moment to process this.",
  ],
  massive: [ // $500+
    "I'M GOING TO NEED YOU TO EXPLAIN.",
    "*visible robot concern*",
    "The budget didn't just cry, it WAILED.",
    "This better be rent or something important.",
  ],
};

// Get a roast based on category and amount
export function getSpendingRoast(amount, categoryName) {
  const category = categoryName?.toLowerCase() || 'default';
  
  // Find matching category
  let categoryRoasts = CATEGORY_ROASTS.default;
  for (const [key, roasts] of Object.entries(CATEGORY_ROASTS)) {
    if (category.includes(key)) {
      categoryRoasts = roasts;
      break;
    }
  }

  // Determine amount tier
  let amountRoasts;
  if (amount < 500) amountRoasts = AMOUNT_ROASTS.tiny;
  else if (amount < 2000) amountRoasts = AMOUNT_ROASTS.small;
  else if (amount < 5000) amountRoasts = AMOUNT_ROASTS.medium;
  else if (amount < 10000) amountRoasts = AMOUNT_ROASTS.large;
  else if (amount < 50000) amountRoasts = AMOUNT_ROASTS.huge;
  else amountRoasts = AMOUNT_ROASTS.massive;

  // 70% category roast, 30% amount roast
  const useCategory = Math.random() < 0.7;
  const roasts = useCategory ? categoryRoasts : amountRoasts;
  
  return roasts[Math.floor(Math.random() * roasts.length)];
}

// Time-based warnings
export function getTimeBasedWarning() {
  const hour = new Date().getHours();
  
  if (hour >= 0 && hour < 5) {
    return {
      show: true,
      message: "It's after midnight... Are you SURE about this purchase? Sleep on it maybe?",
      emoji: "🌙",
      severity: "high",
    };
  }
  
  if (hour >= 23) {
    return {
      show: true,
      message: "Late night purchase detected. These hit different in the morning.",
      emoji: "🦉",
      severity: "medium",
    };
  }

  // Friday/Saturday night
  const day = new Date().getDay();
  if ((day === 5 || day === 6) && hour >= 20) {
    return {
      show: true,
      message: "Weekend night spending! The vibes are immaculate but the budget is nervous.",
      emoji: "🎉",
      severity: "low",
    };
  }

  return { show: false };
}

// Roast card component
export function RoastCard({ amount, category, onDismiss }) {
  const roast = getSpendingRoast(amount, category);
  const timeWarning = getTimeBasedWarning();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-surface-raised rounded-xl p-4"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">🤖</span>
        <div className="flex-1">
          <p className="text-text-secondary text-sm italic">"{roast}"</p>
          
          {timeWarning.show && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={`mt-2 text-xs flex items-center gap-1 ${
                timeWarning.severity === 'high' ? 'text-red-400' :
                timeWarning.severity === 'medium' ? 'text-yellow-400' :
                'text-text-muted'
              }`}
            >
              <span>{timeWarning.emoji}</span>
              <span>{timeWarning.message}</span>
            </motion.div>
          )}
        </div>
      </div>
      
      {onDismiss && (
        <button 
          onClick={onDismiss}
          className="mt-2 text-xs text-text-muted hover:text-text-secondary w-full text-right"
        >
          Yeah yeah, I know
        </button>
      )}
    </motion.div>
  );
}

// "What could this have been?" alternative spending
const ALTERNATIVES = [
  { amount: 500, item: "a fancy coffee", emoji: "☕" },
  { amount: 1000, item: "a fast food meal", emoji: "🍔" },
  { amount: 1500, item: "a movie ticket", emoji: "🎬" },
  { amount: 2000, item: "a month of a streaming service", emoji: "📺" },
  { amount: 3000, item: "a nice lunch", emoji: "🥗" },
  { amount: 5000, item: "a book", emoji: "📚" },
  { amount: 10000, item: "a month of Spotify", emoji: "🎵" },
  { amount: 15000, item: "a decent dinner", emoji: "🍽️" },
  { amount: 25000, item: "a tank of gas", emoji: "⛽" },
  { amount: 50000, item: "a concert ticket", emoji: "🎤" },
  { amount: 100000, item: "a nice pair of shoes", emoji: "👟" },
  { amount: 200000, item: "a weekend getaway", emoji: "✈️" },
  { amount: 500000, item: "a really nice dinner for two", emoji: "🥂" },
  { amount: 1000000, item: "a new phone", emoji: "📱" },
];

export function getAlternativeSpending(amount) {
  // Find items that cost less than or equal to this amount
  const affordable = ALTERNATIVES.filter(alt => alt.amount <= amount);
  if (affordable.length === 0) return null;
  
  // Get the most expensive affordable item
  const best = affordable[affordable.length - 1];
  const count = Math.floor(amount / best.amount);
  
  if (count === 1) {
    return `That's ${best.emoji} ${best.item}!`;
  }
  return `That's ${count}x ${best.emoji} ${best.item}${count > 1 ? 's' : ''}!`;
}

export function AlternativeSpendingBadge({ amount }) {
  const alternative = getAlternativeSpending(amount);
  if (!alternative) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-xs text-text-muted bg-surface-raised px-2 py-1 rounded-full inline-block"
    >
      {alternative}
    </motion.div>
  );
}
