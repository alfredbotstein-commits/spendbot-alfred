// Sound effects using Web Audio API (no external files needed)
// Creates pleasant, satisfying tones for key interactions

const audioContext = typeof window !== 'undefined' 
  ? new (window.AudioContext || window.webkitAudioContext)()
  : null;

// Unlock audio on first user interaction (mobile requirement)
let audioUnlocked = false;
export function unlockAudio() {
  if (audioUnlocked || !audioContext) return;
  const buffer = audioContext.createBuffer(1, 1, 22050);
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start(0);
  audioUnlocked = true;
}

// Play a tone with specific frequency and envelope
function playTone(frequency, duration = 0.15, type = 'sine', volume = 0.3) {
  if (!audioContext) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  
  // Quick attack, smooth decay
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}

// Play a sequence of tones
function playChord(frequencies, duration = 0.2, type = 'sine', volume = 0.15) {
  frequencies.forEach(freq => playTone(freq, duration, type, volume));
}

// ===== Sound Effects =====

// Satisfying "ka-ching" when expense is saved
export function playAddSound() {
  if (!audioContext) return;
  // Rising major chord - feels like success
  setTimeout(() => playTone(523.25, 0.1, 'sine', 0.2), 0);    // C5
  setTimeout(() => playTone(659.25, 0.1, 'sine', 0.2), 50);   // E5
  setTimeout(() => playTone(783.99, 0.15, 'sine', 0.25), 100); // G5
}

// Soft tap for number pad
export function playTapSound() {
  if (!audioContext) return;
  playTone(800, 0.05, 'sine', 0.1);
}

// Delete sound - subtle descending tone
export function playDeleteSound() {
  if (!audioContext) return;
  playTone(400, 0.1, 'sine', 0.15);
  setTimeout(() => playTone(300, 0.1, 'sine', 0.1), 50);
}

// Category select - pleasant pop
export function playSelectSound() {
  if (!audioContext) return;
  playTone(600, 0.08, 'sine', 0.15);
}

// Undo action - reversal feel
export function playUndoSound() {
  if (!audioContext) return;
  setTimeout(() => playTone(400, 0.08, 'sine', 0.15), 0);
  setTimeout(() => playTone(500, 0.08, 'sine', 0.15), 60);
  setTimeout(() => playTone(600, 0.1, 'sine', 0.2), 120);
}

// Success fanfare for milestones/streaks
export function playSuccessSound() {
  if (!audioContext) return;
  playChord([523.25, 659.25, 783.99], 0.3, 'sine', 0.15); // C major
}

// Error/warning sound
export function playErrorSound() {
  if (!audioContext) return;
  playTone(200, 0.15, 'square', 0.1);
  setTimeout(() => playTone(180, 0.15, 'square', 0.1), 100);
}

// Haptic feedback (where supported)
export function vibrate(pattern = [10]) {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}

// Combined feedback for key actions
export const feedback = {
  add: () => {
    playAddSound();
    vibrate([15, 30, 15]);
  },
  tap: () => {
    playTapSound();
    vibrate([5]);
  },
  delete: () => {
    playDeleteSound();
    vibrate([20]);
  },
  select: () => {
    playSelectSound();
    vibrate([8]);
  },
  undo: () => {
    playUndoSound();
    vibrate([10, 20, 10]);
  },
  success: () => {
    playSuccessSound();
    vibrate([20, 40, 20, 40, 20]);
  },
  error: () => {
    playErrorSound();
    vibrate([50, 30, 50]);
  }
};

export default feedback;
