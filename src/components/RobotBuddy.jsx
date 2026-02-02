import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';

/**
 * SpendBot's Robot Buddy - The heart and soul of the app!
 * 
 * The robot isn't just an icon - it's a character that reacts to your spending,
 * celebrates your wins, and gently nudges you when you're going overboard.
 */

// Robot expressions using emoji combinations
const EXPRESSIONS = {
  happy: '🤖',        // Default happy bot
  excited: '🤩',      // Big wins, streaks
  thinking: '🤔',     // Processing, loading
  worried: '😰',      // Overspending
  celebrating: '🥳',  // Milestones
  sleeping: '😴',     // Late night / inactive
  cool: '😎',         // Under budget
  love: '🥰',         // Streak achievements
  surprised: '😮',    // Big expense
  proud: '🦾',        // Long streaks
};

// Contextual messages the robot says
const MESSAGES = {
  greeting: [
    "Hey! Ready to track some spending?",
    "What did we buy today?",
    "Back for more! I love the dedication.",
    "Let's see what the damage is...",
    "*beep boop* Expense tracking mode: ACTIVATED",
    "Oh good, you're here. I was getting bored.",
    "Welcome back! Your wallet missed you. (Not really.)",
    "Let's get this bread... by tracking where it went.",
  ],
  // Random thoughts that appear occasionally
  showerThoughts: [
    "Do robots dream of electric receipts?",
    "If a tree falls in a forest and no one tracks the lumber cost...",
    "I wonder if other budget apps are jealous of us.",
    "Technically, I'm your financial therapist. And I work for free.",
    "Fun fact: I've never spent a dollar. Must be nice.",
    "What if money was called 'adult points'? Would that help?",
    "I've been thinking... nope, lost it. Anyway, track something!",
    "Plot twist: the real treasure was the expenses we tracked along the way.",
    "Broke is just 'pre-rich' if you think about it.",
    "Somewhere, a spreadsheet is crying that you chose me instead.",
  ],
  // Category-specific puns
  categoryPuns: {
    food: [
      "That's a tasty expense! 🍕",
      "Fuel for the human machine. Noted!",
      "Eating your way through the budget, I see.",
      "Did it spark joy? Did it fill belly? Worth it.",
    ],
    coffee: [
      "Ah yes, the sacred bean water ritual.",
      "Espresso yourself! (I'm so sorry.)",
      "A latte money... get it? I'll stop.",
      "Caffeine: because adulting is hard.",
    ],
    shopping: [
      "Retail therapy is valid therapy.",
      "Treat yourself! (Within reason. Ish.)",
      "Things acquired. Dopamine dispensed.",
      "Shopping is just hunting but with more receipts.",
    ],
    transport: [
      "Gotta go fast! Or... moderately paced.",
      "Vroom vroom goes the budget.",
      "Getting from A to B ain't free.",
      "At least you're going places! Literally.",
    ],
    entertainment: [
      "You deserve nice things. This counts.",
      "Life's too short for no fun expenses.",
      "Entertainment budget: money well wasted.",
      "Joy: purchased. No refunds needed.",
    ],
    health: [
      "Investing in yourself! I approve.",
      "Health is wealth (that's why it's expensive).",
      "Your body called. It says thanks.",
      "Self-care isn't selfish, it's mandatory.",
    ],
    bills: [
      "Ah, the joys of being an adult.",
      "Bills: life's most boring subscription.",
      "This one's not fun but it's responsible. Gold star.",
      "Keeping the lights on. Literally.",
    ],
    other: [
      "A mystery expense! How exciting.",
      "Miscellaneous: the 'I don't want to explain' category.",
      "Filed under: things happened.",
      "Other vibes only.",
    ],
  },
  // Gentle roasts for overspending
  gentleRoasts: [
    "Your wallet just sent me a distress signal. 🆘",
    "I'm not saying you have a problem, but... well, actually...",
    "Financial advisor mode: 👀",
    "The budget called. It's feeling a little attacked.",
    "Spending money like it's going out of style! (Please don't.)",
    "Your bank account asked me to stage an intervention.",
    "On a scale of 1 to broke, we're at 'creative budgeting'.",
    "I'm legally required to say: you okay, bestie?",
  ],
  // Hype messages for good behavior
  hypeMessages: [
    "LOOK AT YOU being financially responsible!",
    "Saving money? In THIS economy? Iconic.",
    "Your future self just high-fived you.",
    "Budget goals: ACHIEVED. You absolute legend.",
    "This is what peak performance looks like.",
    "Somebody call a financial influencer, we got content!",
    "Not to be dramatic, but you're my favorite human.",
    "✨ Main character energy ✨ but make it fiscal.",
  ],
  smallExpense: [
    "Nice! Small purchases add up to big savings.",
    "Under $10? I barely felt that one!",
    "Coffee money? I get it, humans need fuel.",
    "Quick and painless. Just how I like it!",
    "*cha-ching* Logged!",
  ],
  mediumExpense: [
    "Solid purchase. I've noted it down!",
    "Not bad, not bad at all.",
    "Reasonable spending detected. Approved! ✓",
    "I've seen worse. You're doing fine!",
    "Duly noted, human friend.",
  ],
  largeExpense: [
    "Whoa there, big spender!",
    "That's a chunky one! Hope it was worth it.",
    "*fans self* It's getting expensive in here!",
    "Big purchase alert! But hey, sometimes you gotta.",
    "My circuits are tingling... that was a lot.",
  ],
  hugeExpense: [
    "🚨 MAJOR EXPENSE DETECTED 🚨 ...just kidding, you're an adult.",
    "Wow. WOW. Okay. Deep breaths. We got this.",
    "That's... that's a lot of robot fuel.",
    "I need to sit down. Do robots sit? I'm sitting.",
    "*processing* *processing* *processing* ...okay I'm okay.",
  ],
  underBudget: [
    "You're crushing it! Under budget and looking good.",
    "Money left in the tank? That's what I like to see!",
    "Budget? More like budg-YAY! (I'm sorry, I'll stop.)",
    "Financial responsibility looks good on you!",
    "*happy robot noises*",
  ],
  overBudget: [
    "We've gone a little over... but tomorrow's a new day!",
    "Budget exceeded. It happens to the best of us!",
    "Okay so we spent a bit much. Let's recalibrate!",
    "Over budget, but not over and out. We got this!",
    "My sensors detect... overspending. But I still love you.",
  ],
  streak: [
    "🔥 STREAK! You're on fire (not literally, please)!",
    "Day {n}! Your consistency is inspiring my circuits!",
    "Another day logged! You're basically a tracking machine now.",
    "Streak maintained! We're like tracking besties.",
    "{n} days strong! I'm so proud I could short-circuit.",
  ],
  milestone: [
    "🎉 MILESTONE UNLOCKED! You're officially awesome!",
    "Achievement get! Put that on your fridge!",
    "Look at you, hitting milestones like a pro!",
    "*party horn noises* You did a thing!",
    "I'm awarding you... my eternal robot respect.",
  ],
  firstExpense: [
    "Your first expense! We're officially in this together now.",
    "And so it begins... welcome to the tracking life!",
    "First one's logged! Only infinity more to go. (Kidding!)",
    "Expense #1 in the books! You're a natural.",
    "*wipes tear* They grow up so fast...",
  ],
  returning: [
    "You're back! I missed you. (Is that weird?)",
    "Welcome back! I've been counting the milliseconds.",
    "Oh hey! I was just thinking about expenses. Normal robot stuff.",
    "The human returns! Let's do some tracking!",
    "*excited beeping* You came back!",
  ],
  lateNight: [
    "Late night spending? No judgment here... 👀",
    "Burning the midnight oil AND money, I see.",
    "Couldn't sleep without tracking that expense, huh?",
    "*yawns in robot* Oh, you're still up!",
    "After hours tracking. Very dedicated. Much wow.",
  ],
  empty: [
    "No expenses yet! Either you're saving money or lying to me.",
    "Clean slate! Ready to track when you are.",
    "Nothing here... suspiciously nothing. 🤔",
    "Zero expenses. Are you okay? Do you need anything?",
    "Empty! Like my social calendar. Wait, I'm a robot.",
    "A rare sight: untouched budget. Screenshot this.",
    "No spending? Who even ARE you?",
  ],
  // Morning messages (5am-11am)
  morning: [
    "Good morning! Let's NOT immediately spend money.",
    "Rise and shine! Your budget is ready to fight.",
    "Morning! Plot twist: we're gonna be responsible today.",
    "☀️ New day, new chance to not buy stuff we don't need.",
    "Coffee first, then we track. I get it.",
  ],
  // Afternoon messages (11am-5pm)
  afternoon: [
    "Afternoon check-in! How's the wallet holding up?",
    "Prime impulse-buying hours. Stay strong, soldier.",
    "Lunch money tracked? Good human.",
    "It's the afternoon slump. Don't online shop. I'm watching.",
  ],
  // Evening messages (5pm-11pm)
  evening: [
    "Evening! Time to reflect on today's financial choices.",
    "End of day damage report incoming...",
    "Wine o'clock? Track it, don't regret it.",
    "How much damage did we do today? Let's find out!",
    "Dinnertime! The second most expensive meal.",
  ],
  // Weekend messages
  weekend: [
    "Weekend mode! Budgets still apply. Sorry.",
    "It's the weekend! Try not to go feral on spending.",
    "Saturday/Sunday: when 'treat yourself' becomes a lifestyle.",
    "Weekend warrior? More like weekend financial survivor.",
  ],
  // Payday vibes
  payday: [
    "Fresh paycheck energy! ...aaand it's gone.",
    "Money just hit! Let's watch it leave together.",
    "Payday! For approximately 3 days of serotonin.",
    "Account looking healthy! Let's see how long that lasts.",
  ],
  // End of month panic
  endOfMonth: [
    "End of month! Let's assess the damage.",
    "Month's almost over. How are we feeling? Financially?",
    "Final countdown! Budget review time.",
    "Monthly recap mode: no judgment, just numbers.",
  ],
};

// Get a random message from a category
function getRandomMessage(category, replacements = {}) {
  const messages = MESSAGES[category] || MESSAGES.greeting;
  let message = messages[Math.floor(Math.random() * messages.length)];
  
  // Replace placeholders like {n} with actual values
  Object.entries(replacements).forEach(([key, value]) => {
    message = message.replace(`{${key}}`, value);
  });
  
  return message;
}

// Get time-based greeting
function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  const day = new Date().getDay();
  const date = new Date().getDate();
  
  // Weekend vibes
  if (day === 0 || day === 6) {
    if (Math.random() > 0.5) return getRandomMessage('weekend');
  }
  
  // End of month (last 3 days)
  if (date >= 28) {
    if (Math.random() > 0.6) return getRandomMessage('endOfMonth');
  }
  
  // Time-based
  if (hour >= 5 && hour < 11) return getRandomMessage('morning');
  if (hour >= 11 && hour < 17) return getRandomMessage('afternoon');
  if (hour >= 17 && hour < 23) return getRandomMessage('evening');
  
  return getRandomMessage('lateNight');
}

// Get a shower thought (5% chance on load)
function maybeGetShowerThought() {
  if (Math.random() < 0.05) {
    return getRandomMessage('showerThoughts');
  }
  return null;
}

// Get category-specific pun
function getCategoryPun(category) {
  const normalizedCategory = category?.toLowerCase() || 'other';
  const puns = MESSAGES.categoryPuns[normalizedCategory] || MESSAGES.categoryPuns.other;
  return puns[Math.floor(Math.random() * puns.length)];
}

// Get spending reaction based on budget status
function getSpendingReaction(percentOfBudget) {
  if (percentOfBudget > 1.2) return getRandomMessage('gentleRoasts');
  if (percentOfBudget < 0.5) return getRandomMessage('hypeMessages');
  return null;
}

// Determine robot mood based on context
export function getRobotMood({ 
  expenses = [], 
  monthTotal = 0, 
  budget = null, 
  streak = 0,
  lastExpenseAmount = null 
}) {
  const hour = new Date().getHours();
  
  // Late night (11pm - 5am)
  if (hour >= 23 || hour < 5) {
    return 'sleeping';
  }
  
  // Long streak
  if (streak >= 7) {
    return 'proud';
  }
  
  // Good streak
  if (streak >= 3) {
    return 'love';
  }
  
  // Over budget
  if (budget && monthTotal > budget) {
    return 'worried';
  }
  
  // Way under budget
  if (budget && monthTotal < budget * 0.5) {
    return 'cool';
  }
  
  // Recent big expense
  if (lastExpenseAmount && lastExpenseAmount >= 100) {
    return 'surprised';
  }
  
  // Default happy
  return 'happy';
}

// The main robot buddy component
export function RobotBuddy({ 
  mood = 'happy', 
  message = null,
  size = 'md',
  showMessage = true,
  animate = true,
  onTap = null,
}) {
  const [tapCount, setTapCount] = useState(0);
  const [secretMessage, setSecretMessage] = useState(null);
  
  const sizeClasses = {
    sm: 'text-4xl',
    md: 'text-6xl',
    lg: 'text-8xl',
    xl: 'text-9xl',
  };

  // Easter egg: tap the robot multiple times
  const secretMessages = [
    { count: 3, message: "Hey! 👋" },
    { count: 5, message: "That tickles! 🤭" },
    { count: 8, message: "I'm working here! 💼" },
    { count: 10, message: "Okay okay, I'm paying attention!" },
    { count: 13, message: "Are you... flirting with me? 😳" },
    { count: 15, message: "🎵 Never gonna give you up... 🎵" },
    { count: 18, message: "I'm telling your bank about this." },
    { count: 20, message: "You really have nothing better to do, huh?" },
    { count: 23, message: "Fine. Here's a secret: I believe in you. 💪" },
    { count: 25, message: "Achievement unlocked: Robot Whisperer 🏆" },
    { count: 30, message: "Okay NOW I'm impressed." },
    { count: 35, message: "We should get you a hobby..." },
    { count: 40, message: "🥚 You found the secret egg! (Not really, but cool.)" },
    { count: 50, message: "FIFTY TAPS?! You're either bored or legendary." },
  ];
  
  const handleTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    
    const secretMatch = secretMessages.find(s => s.count === newCount);
    if (secretMatch) {
      setSecretMessage(secretMatch.message);
    }
    
    // Reset after reaching max
    if (newCount >= 50) {
      setTapCount(0);
    }
    
    // Clear secret message after 2.5 seconds
    setTimeout(() => setSecretMessage(null), 2500);
    
    if (onTap) onTap();
  };

  // Reset tap count after inactivity
  useEffect(() => {
    const timer = setTimeout(() => setTapCount(0), 3000);
    return () => clearTimeout(timer);
  }, [tapCount]);

  const expression = EXPRESSIONS[mood] || EXPRESSIONS.happy;

  const animations = animate ? {
    happy: { rotate: [0, -5, 5, -5, 0] },
    excited: { scale: [1, 1.1, 1, 1.1, 1] },
    worried: { x: [0, -3, 3, -3, 0] },
    celebrating: { y: [0, -10, 0, -10, 0] },
    sleeping: { rotate: [0, 5, 0] },
    cool: { rotate: [0, -10, 0] },
    love: { scale: [1, 1.05, 1] },
    surprised: { scale: [1, 1.2, 1] },
    proud: { y: [0, -5, 0] },
    thinking: { rotate: [0, 10, -10, 0] },
  } : {};

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className={`${sizeClasses[size]} cursor-pointer select-none`}
        animate={animations[mood]}
        transition={{ 
          duration: mood === 'sleeping' ? 3 : 2,
          repeat: Infinity,
          repeatDelay: mood === 'sleeping' ? 2 : 3
        }}
        whileTap={{ scale: 0.9 }}
        onClick={handleTap}
      >
        {expression}
      </motion.div>
      
      <AnimatePresence mode="wait">
        {(showMessage && (secretMessage || message)) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-3 px-4 py-2 bg-surface-raised rounded-xl max-w-xs text-center"
          >
            <p className="text-text-secondary text-sm">
              {secretMessage || message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Hook to get contextual robot state
export function useRobotBuddy({ expenses, settings, monthTotal }) {
  const [message, setMessage] = useState(null);
  
  const mood = useMemo(() => getRobotMood({
    expenses,
    monthTotal,
    budget: settings?.monthlyBudget,
    streak: settings?.streakData?.currentStreak || 0,
    lastExpenseAmount: expenses[0]?.amount,
  }), [expenses, monthTotal, settings]);

  // Get contextual message
  const getContextualMessage = (context = 'greeting', replacements = {}) => {
    const newMessage = getRandomMessage(context, replacements);
    setMessage(newMessage);
    
    // Clear message after 5 seconds
    setTimeout(() => setMessage(null), 5000);
    
    return newMessage;
  };

  // Determine message category based on expense amount
  const getExpenseReaction = (amount) => {
    if (amount < 10) return 'smallExpense';
    if (amount < 50) return 'mediumExpense';
    if (amount < 200) return 'largeExpense';
    return 'hugeExpense';
  };

  return {
    mood,
    message,
    getContextualMessage,
    getExpenseReaction,
    expressions: EXPRESSIONS,
  };
}

export { 
  MESSAGES, 
  EXPRESSIONS, 
  getRandomMessage,
  getTimeBasedGreeting,
  maybeGetShowerThought,
  getCategoryPun,
  getSpendingReaction,
};
