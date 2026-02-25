import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePurchase } from '../hooks/usePurchase';

const FEATURES = [
  { emoji: '♾️', text: 'Unlimited expenses' },
  { emoji: '📊', text: 'Advanced insights' },
  { emoji: '🎨', text: 'Custom categories' },
  { emoji: '☁️', text: 'Cloud sync across devices' },
  { emoji: '💚', text: 'Support indie development' },
];

export function Paywall({ monthCount, onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { status, error, offerings, purchase, restore, isStoreAvailable } = usePurchase();

  const loading = status === 'purchasing' || status === 'restoring';

  // Get the first package from offerings for price display
  const currentPackage = offerings?.[0]?.availablePackages?.[0];
  const priceString = currentPackage?.product?.priceString || '$4.99';

  const handleSignIn = () => {
    onClose();
    navigate('/');
    window.location.reload();
  };

  const handleUpgrade = async () => {
    if (!user) {
      return;
    }

    if (isStoreAvailable && currentPackage) {
      await purchase(currentPackage);
    } else {
      // Fallback: attempt default purchase
      await purchase();
    }
  };

  const handleRestore = async () => {
    await restore();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        onClick={e => e.stopPropagation()}
        className="bg-surface-raised rounded-t-3xl w-full max-w-lg p-6 pb-10"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🚀</div>
          <h2 className="text-2xl font-heading font-bold text-text-primary mb-2">
            You're on Fire!
          </h2>
          <p className="text-text-secondary">
            You've tracked <span className="text-accent font-semibold">{monthCount}</span> expenses.
            <br />
            Upgrade to keep the momentum going!
          </p>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-8">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 bg-background/50 rounded-xl p-3"
            >
              <span className="text-xl">{feature.emoji}</span>
              <span className="text-text-primary">{feature.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Price */}
        <div className="text-center mb-6">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold text-text-primary">{priceString}</span>
            <span className="text-text-muted">lifetime</span>
          </div>
          <p className="text-text-muted text-sm mt-1">
            One-time purchase. Yours forever ✨
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-center">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Sign in prompt for unauthenticated users */}
        {!user && (
          <div className="mb-4 p-4 bg-accent/10 border border-accent/30 rounded-xl text-center">
            <p className="text-text-secondary text-sm mb-3">
              Sign in to unlock Premium features
            </p>
            <motion.button
              onClick={handleSignIn}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 bg-accent text-white rounded-xl font-medium text-sm"
            >
              Sign In
            </motion.button>
          </div>
        )}

        {/* CTA */}
        <motion.button
          onClick={handleUpgrade}
          disabled={loading}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="w-full py-4 bg-gradient-to-r from-accent to-purple-500 text-white 
                     rounded-2xl font-semibold text-lg shadow-lg shadow-accent/30
                     disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {status === 'purchasing' ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                ⚙️
              </motion.span>
              Processing...
            </span>
          ) : (
            'Upgrade to Premium'
          )}
        </motion.button>

        {/* Restore */}
        <button
          onClick={handleRestore}
          disabled={loading}
          className="w-full py-3 text-accent text-sm mt-2 disabled:opacity-50"
        >
          {status === 'restoring' ? 'Restoring...' : 'Restore Purchases'}
        </button>

        {/* Dismiss */}
        <button
          onClick={onClose}
          disabled={loading}
          className="w-full py-3 text-text-muted text-sm mt-1 disabled:opacity-50"
        >
          Maybe Later
        </button>
      </motion.div>
    </motion.div>
  );
}
