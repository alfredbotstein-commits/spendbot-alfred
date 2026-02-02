/**
 * Haptic Feedback Utility
 * Creates satisfying tactile feedback for different interactions
 */

// Check if haptics are available
const canVibrate = () => 'vibrate' in navigator;

// Haptic patterns (in milliseconds)
const patterns = {
  // Light tap - button press, small actions
  light: [10],
  
  // Medium tap - confirming actions
  medium: [15],
  
  // Heavy tap - important confirmations
  heavy: [25],
  
  // Success pattern - achievement unlocked, expense saved
  success: [10, 50, 10, 50, 30],
  
  // Error pattern - validation error, limit reached
  error: [50, 100, 50],
  
  // Warning pattern - approaching budget limit
  warning: [30, 50, 30],
  
  // Coin drop - small expense (<$10)
  coinDrop: [5, 30, 5],
  
  // Cash rustle - medium expense ($10-50)
  cashRustle: [10, 20, 10, 20, 10],
  
  // Big spend - large expense (>$50)
  bigSpend: [20, 40, 20, 40, 30, 50, 40],
  
  // Streak celebration
  streak: [10, 30, 10, 30, 10, 30, 20, 50, 30],
  
  // Achievement unlocked
  achievement: [15, 50, 15, 50, 15, 50, 30, 100, 50],
  
  // Delete swipe
  delete: [20, 30, 40],
  
  // Pull to refresh
  pullRefresh: [5, 20, 5, 20, 5, 20, 10],
};

/**
 * Trigger haptic feedback
 * @param {string} type - Pattern name from patterns object
 */
export function haptic(type = 'light') {
  if (!canVibrate()) return;
  
  const pattern = patterns[type] || patterns.light;
  
  try {
    navigator.vibrate(pattern);
  } catch (e) {
    // Silently fail if vibration not supported
  }
}

/**
 * Get haptic pattern based on expense amount
 * @param {number} amountCents - Amount in cents
 */
export function hapticForAmount(amountCents) {
  const amount = amountCents / 100;
  
  if (amount < 10) {
    haptic('coinDrop');
  } else if (amount < 50) {
    haptic('cashRustle');
  } else {
    haptic('bigSpend');
  }
}

/**
 * Create a custom haptic sequence
 * @param {number[]} pattern - Array of milliseconds
 */
export function customHaptic(pattern) {
  if (!canVibrate()) return;
  
  try {
    navigator.vibrate(pattern);
  } catch (e) {
    // Silently fail
  }
}

/**
 * Stop any ongoing vibration
 */
export function stopHaptic() {
  if (!canVibrate()) return;
  navigator.vibrate(0);
}

export default haptic;
