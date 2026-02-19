import { motion } from 'framer-motion';
import { usePurchase } from '../hooks/usePurchase';

interface PaywallModalProps {
  onDismiss: () => void;
  expenseCount?: number;
  onPurchaseSuccess?: () => void;
}

const features = [
  { name: 'Expenses', free: '50/mo', premium: 'Unlimited ✓' },
  { name: 'Categories', free: '6', premium: 'Unlimited ✓' },
  { name: 'Insights', free: 'Basic', premium: 'Advanced ✓' },
  { name: 'Export', free: '✗', premium: 'CSV ✓' },
];

export default function PaywallModal({ onDismiss, expenseCount, onPurchaseSuccess }: PaywallModalProps) {
  const { status, error, isPremium, purchase, restore, isStoreAvailable } = usePurchase();

  const handlePurchase = async () => {
    await purchase();
  };

  const handleRestore = async () => {
    await restore();
  };

  // If purchase just succeeded, notify parent and dismiss
  if (isPremium && status === 'success') {
    onPurchaseSuccess?.();
    setTimeout(onDismiss, 1500);
  }

  const isProcessing = status === 'purchasing' || status === 'restoring';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-end"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
      onClick={isProcessing ? undefined : onDismiss}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        drag={isProcessing ? false : 'y'}
        dragConstraints={{ top: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100 && !isProcessing) onDismiss();
        }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-h-[90vh] bg-surface rounded-t-3xl p-4 overflow-y-auto"
        style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom, 0px))' }}
      >
        {/* Drag handle */}
        <div className="w-9 h-1 bg-surface-elevated rounded-full mx-auto mb-5" />

        {/* Success state */}
        {isPremium && status === 'success' ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">You're Premium!</h2>
            <p className="text-text-secondary">All features unlocked. Happy tracking!</p>
          </div>
        ) : (
          <>
            {/* Hero */}
            <div className="text-center mb-5">
              <div className="text-5xl mb-3">✨ 🤖 ✨</div>
              <h2 className="text-2xl font-bold text-text-primary">
                Unlock the full experience
              </h2>
              {expenseCount && (
                <p className="text-sm text-text-secondary mt-2">
                  You've tracked {expenseCount} expenses — you're serious about this!
                </p>
              )}
            </div>

            {/* Testimonial */}
            <div className="bg-surface-raised rounded-xl p-4 mb-5 text-center">
              <p className="text-base italic text-text-primary mb-2">
                "Best $5 I've spent on an app!"
              </p>
              <p className="text-sm text-text-secondary">
                ⭐⭐⭐⭐⭐ — App Store Review
              </p>
            </div>

            {/* Comparison table */}
            <div className="bg-surface-raised rounded-xl overflow-hidden mb-5">
              <div className="grid grid-cols-3 p-3 bg-surface-elevated text-xs font-semibold uppercase text-text-secondary">
                <span></span>
                <span className="text-center">FREE</span>
                <span className="text-center">PREMIUM</span>
              </div>
              {features.map((f) => (
                <div
                  key={f.name}
                  className="grid grid-cols-3 p-3 border-b border-surface-elevated last:border-b-0 text-sm"
                >
                  <span className="text-text-primary">{f.name}</span>
                  <span className="text-center text-text-muted">{f.free}</span>
                  <span className="text-center text-accent font-medium">{f.premium}</span>
                </div>
              ))}
            </div>

            {/* Price badge */}
            <div className="text-center mb-5">
              <div className="text-3xl font-extrabold text-text-primary mb-1">$4.99 once</div>
              <div className="text-sm text-text-secondary">No subscriptions. Ever.</div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4 text-center">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* CTA */}
            <button
              onClick={handlePurchase}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl text-lg font-semibold text-white flex items-center justify-center gap-2 mb-3 disabled:opacity-60"
              style={{
                background: isProcessing
                  ? '#6B7280'
                  : 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                animation: isProcessing ? 'none' : 'buttonPulse 2s ease-in-out infinite',
              }}
            >
              {status === 'purchasing' ? (
                <>⏳ Processing...</>
              ) : (
                <>⚡ Upgrade Now</>
              )}
            </button>

            {/* Restore purchases */}
            {isStoreAvailable && (
              <button
                onClick={handleRestore}
                disabled={isProcessing}
                className="block w-full text-center text-sm text-accent py-2 mb-2 disabled:opacity-40"
              >
                {status === 'restoring' ? '⏳ Restoring...' : '🔄 Restore Purchases'}
              </button>
            )}

            <button
              onClick={onDismiss}
              disabled={isProcessing}
              className="block w-full text-center text-sm text-text-muted py-2 mb-4 disabled:opacity-40"
            >
              Maybe Later
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-text-muted">
              🔒 Secure payment via {isStoreAvailable ? 'Google Play' : 'App Store'}
            </div>
          </>
        )}
      </motion.div>

      <style>{`
        @keyframes buttonPulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3); }
          50% { box-shadow: 0 4px 30px rgba(139, 92, 246, 0.5); }
        }
      `}</style>
    </motion.div>
  );
}
