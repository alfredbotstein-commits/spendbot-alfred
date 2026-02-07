import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PWAInstallModalProps {
  onDismiss: () => void;
}

const benefits = [
  { icon: '⚡', title: 'Open instantly', desc: 'No browser needed' },
  { icon: '📡', title: 'Works offline', desc: 'Track expenses anywhere' },
  { icon: '🔒', title: 'Secure & private', desc: 'Biometric login supported' },
];

// Detect iOS Safari
const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

export default function PWAInstallModal({ onDismiss }: PWAInstallModalProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const showIOSGuide = isIOS();

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === 'accepted') {
        onDismiss();
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-end"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
      onClick={onDismiss}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        drag="y"
        dragConstraints={{ top: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100) onDismiss();
        }}
        onClick={(e) => e.stopPropagation()}
        className="w-full bg-surface rounded-t-3xl p-4"
        style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom, 0px))' }}
      >
        {/* Drag handle */}
        <div className="w-9 h-1 bg-surface-elevated rounded-full mx-auto mb-5" />

        {/* Device mockup */}
        <div
          className="w-40 h-[280px] mx-auto mb-5 rounded-[20px] border-[3px] border-border bg-background flex flex-col items-center justify-center gap-2"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.05)' }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
            style={{
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
            }}
          >
            🤖
          </div>
          <span className="text-xs text-text-primary font-medium">SpendBot</span>
        </div>

        <h2 className="text-2xl font-bold text-text-primary text-center mb-5">
          Get SpendBot on your<br />home screen
        </h2>

        {/* Benefits */}
        <div className="flex flex-col gap-4 mb-6 px-2">
          {benefits.map((b) => (
            <div key={b.title} className="flex items-start gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-surface-raised rounded-[10px] text-xl flex-shrink-0">
                {b.icon}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-base font-medium text-text-primary">{b.title}</span>
                <span className="text-sm text-text-secondary">{b.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* iOS Safari guide */}
        {showIOSGuide && (
          <div className="bg-surface-raised rounded-xl p-4 mb-4">
            <p className="text-[0.9375rem] text-text-secondary py-2 border-b border-border">
              1. Tap the <strong className="text-text-primary">Share</strong> button 📤
            </p>
            <p className="text-[0.9375rem] text-text-secondary py-2 border-b border-border">
              2. Scroll down and tap <strong className="text-text-primary">Add to Home Screen</strong>
            </p>
            <p className="text-[0.9375rem] text-text-secondary py-2">
              3. Tap <strong className="text-text-primary">Add</strong> in the top right
            </p>
          </div>
        )}

        {/* CTA */}
        {!showIOSGuide && (
          <button
            onClick={handleInstall}
            className="w-full py-4 rounded-2xl text-lg font-semibold text-white flex items-center justify-center gap-2 mb-3"
            style={{
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
            }}
          >
            📲 Add to Home Screen
          </button>
        )}

        <button
          onClick={onDismiss}
          className="block w-full text-center text-sm text-text-muted py-2"
        >
          Not now
        </button>
      </motion.div>
    </motion.div>
  );
}
