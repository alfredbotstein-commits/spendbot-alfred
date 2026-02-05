import { motion, AnimatePresence } from 'framer-motion';

export function InstallBanner({ canInstall, isIOS, onInstall, onDismiss }) {
  if (!canInstall) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-20 left-4 right-4 z-40"
      >
        <div className="bg-gradient-to-r from-accent/90 to-purple-600/90 backdrop-blur-lg 
                        rounded-2xl p-4 shadow-xl border border-white/10">
          <div className="flex items-start gap-3">
            <div className="text-3xl">📱</div>
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-1">
                Add to Home Screen
              </h3>
              <p className="text-white/80 text-sm">
                {isIOS 
                  ? 'Tap the share button, then "Add to Home Screen"'
                  : 'Install SpendBot for quick access anytime'}
              </p>
            </div>
            <button
              onClick={onDismiss}
              className="text-white/60 hover:text-white p-1"
            >
              ✕
            </button>
          </div>
          
          {!isIOS && (
            <motion.button
              onClick={onInstall}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-3 py-2.5 bg-white text-accent rounded-xl font-semibold text-sm"
            >
              Install App
            </motion.button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
