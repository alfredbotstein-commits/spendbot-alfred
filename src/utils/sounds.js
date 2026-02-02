/**
 * Sound Effects System
 * Satisfying audio feedback that makes the app feel premium
 * Uses Web Audio API for low-latency, high-quality sounds
 */

let audioContext = null;

// Initialize audio context on first user interaction
const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
};

/**
 * Generate a pleasant "ding" sound
 */
function createDing(frequency = 880, duration = 0.15, volume = 0.3) {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(volume, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
  
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
}

/**
 * Create a "coin" sound - multiple quick high-pitched dings
 */
function playCoin() {
  const ctx = getAudioContext();
  
  // Multiple overlapping dings for a "coin" effect
  [0, 0.05, 0.1].forEach((delay, i) => {
    setTimeout(() => {
      createDing(1200 + (i * 200), 0.1, 0.2);
    }, delay * 1000);
  });
}

/**
 * Create a "cash" sound - lower, rustling effect
 */
function playCash() {
  const ctx = getAudioContext();
  
  // White noise burst for "rustle"
  const bufferSize = ctx.sampleRate * 0.1;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
  }
  
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 2000;
  filter.Q.value = 1;
  
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
  
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  
  noise.start();
}

/**
 * Success sound - ascending cheerful notes
 */
function playSuccess() {
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
  
  notes.forEach((freq, i) => {
    setTimeout(() => {
      createDing(freq, 0.2, 0.25);
    }, i * 100);
  });
}

/**
 * Achievement sound - triumphant fanfare
 */
function playAchievement() {
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  
  notes.forEach((freq, i) => {
    setTimeout(() => {
      createDing(freq, 0.3, 0.3);
    }, i * 120);
  });
  
  // Final chord
  setTimeout(() => {
    createDing(523.25, 0.5, 0.2);
    createDing(659.25, 0.5, 0.2);
    createDing(783.99, 0.5, 0.2);
  }, 500);
}

/**
 * Error sound - descending dissonant tone
 */
function playError() {
  createDing(400, 0.15, 0.3);
  setTimeout(() => createDing(350, 0.2, 0.25), 100);
}

/**
 * Warning sound - attention-getting
 */
function playWarning() {
  createDing(600, 0.1, 0.25);
  setTimeout(() => createDing(600, 0.1, 0.25), 150);
}

/**
 * Delete/swipe sound - whoosh
 */
function playDelete() {
  const ctx = getAudioContext();
  
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  
  oscillator.frequency.setValueAtTime(400, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);
  oscillator.type = 'sine';
  
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
  
  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.15);
}

/**
 * Tap sound - subtle button press
 */
function playTap() {
  createDing(800, 0.05, 0.1);
}

/**
 * Pop sound - satisfying UI pop
 */
function playPop() {
  const ctx = getAudioContext();
  
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  
  oscillator.frequency.setValueAtTime(150, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.03);
  oscillator.type = 'sine';
  
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
  
  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.08);
}

// Sound registry
const sounds = {
  coin: playCoin,
  cash: playCash,
  success: playSuccess,
  achievement: playAchievement,
  error: playError,
  warning: playWarning,
  delete: playDelete,
  tap: playTap,
  pop: playPop,
};

// Settings
let soundEnabled = true;

/**
 * Play a sound effect
 * @param {string} name - Sound name
 */
export function playSound(name) {
  if (!soundEnabled) return;
  
  const soundFn = sounds[name];
  if (soundFn) {
    try {
      soundFn();
    } catch (e) {
      // Audio context may need user interaction first
    }
  }
}

/**
 * Play sound based on expense amount
 * @param {number} amountCents - Amount in cents
 */
export function playSoundForAmount(amountCents) {
  const amount = amountCents / 100;
  
  if (amount < 10) {
    playSound('coin');
  } else if (amount < 50) {
    playSound('cash');
  } else {
    playSound('cash');
    setTimeout(() => playSound('pop'), 200);
  }
}

/**
 * Enable/disable sounds
 */
export function setSoundEnabled(enabled) {
  soundEnabled = enabled;
}

/**
 * Check if sounds are enabled
 */
export function isSoundEnabled() {
  return soundEnabled;
}

/**
 * Initialize audio context (call on first user interaction)
 */
export function initAudio() {
  try {
    getAudioContext();
    // Resume if suspended (required after user interaction)
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
  } catch (e) {
    // Audio not supported
  }
}

export default playSound;
