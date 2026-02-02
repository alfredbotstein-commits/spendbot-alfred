/**
 * Haptic Feedback System
 * Makes the app feel physical and premium on mobile devices
 */

// Check if vibration is supported
const isSupported = () => 'vibrate' in navigator;

// Haptic patterns (in milliseconds)
const patterns = {
  // Light tap - single short pulse
  light: [10],
  
  // Medium tap - slightly longer
  medium: [20],
  
  // Heavy tap - strong single pulse
  heavy: [30],
  
  // Success - two quick pulses
  success: [15, 50, 15],
  
  // Error - three quick pulses
  error: [10, 30, 10, 30, 10],
  
  // Warning - two longer pulses
  warning: [20, 50, 40],
  
  // Selection - ultra light
  selection: [5],
  
  // Impact - strong single
  impact: [40],
  
  // Notification - attention pattern
  notification: [20, 100, 20, 100, 40],
  
  // Achievement - celebratory pattern
  achievement: [15, 50, 15, 50, 15, 100, 30],
  
  // Delete - descending feel
  delete: [30, 30, 20, 30, 10],
  
  // Coin drop - quick succession
  coin: [5, 20, 5, 20, 5],
};

// Settings
let hapticsEnabled = true;

/**
 * Trigger haptic feedback
 * @param {string} type - Pattern name or 'light'|'medium'|'heavy'
 */
export function haptic(type = 'light') {
  if (!hapticsEnabled || !isSupported()) return;
  
  const pattern = patterns[type] || patterns.light;
  
  try {
    navigator.vibrate(pattern);
  } catch (e) {
    // Vibration failed, silently ignore
  }
}

/**
 * Trigger haptic based on expense amount
 * @param {number} amountCents - Amount in cents
 */
export function hapticForAmount(amountCents) {
  const amount = amountCents / 100;
  
  if (amount < 10) {
    haptic('light');
  } else if (amount < 50) {
    haptic('medium');
  } else if (amount < 200) {
    haptic('heavy');
  } else {
    haptic('impact');
  }
}

/**
 * Enable/disable haptics
 */
export function setHapticsEnabled(enabled) {
  hapticsEnabled = enabled;
}

/**
 * Check if haptics are enabled and supported
 */
export function isHapticsEnabled() {
  return hapticsEnabled && isSupported();
}

/**
 * Check device support
 */
export function isHapticsSupported() {
  return isSupported();
}

export default haptic;
