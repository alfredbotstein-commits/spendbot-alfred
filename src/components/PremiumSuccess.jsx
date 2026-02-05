import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { verifyCheckoutSession } from '../lib/stripe';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { FunLoader } from './EasterEggs';
import { Confetti } from './Confetti';

export function PremiumSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [error, setError] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const verifyAndUpgrade = async (sessionId) => {
    try {
      // Verify the session with Stripe via our Netlify function
      const result = await verifyCheckoutSession(sessionId);
      
      if (!result.paid) {
        setStatus('error');
        setError('Payment not completed');
        return;
      }

      // Double-check: update Supabase directly as webhook fallback
      // This ensures premium is set even if webhook fails/delays
      if (user) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ is_premium: true })
          .eq('id', user.id);

        if (updateError) {
          console.error('Failed to update premium status:', updateError);
          // Don't fail the whole flow - webhook will handle it
        }
      }

      // Refresh the profile in AuthContext
      if (updateProfile) {
        await updateProfile({ is_premium: true });
      }

      setStatus('success');
      setShowConfetti(true);
      
      // Redirect to app after celebration
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 4000);

    } catch (err) {
      console.error('Verification error:', err);
      setStatus('error');
      setError(err.message || 'Failed to verify payment');
    }
  };

  // Run verification on mount
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      setStatus('error');
      setError('No session ID found');
      return;
    }

    verifyAndUpgrade(sessionId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  if (status === 'verifying') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <FunLoader message="Verifying your purchase..." />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-surface-raised rounded-3xl p-8 max-w-md w-full text-center"
        >
          <div className="text-5xl mb-4">😕</div>
          <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">
            Something Went Wrong
          </h1>
          <p className="text-text-secondary mb-6">
            {error || 'We couldn\'t verify your payment.'}
          </p>
          <p className="text-text-muted text-sm mb-6">
            If you were charged, don't worry! Your premium status will be activated shortly.
            Contact support if it doesn't appear within a few minutes.
          </p>
          <motion.button
            onClick={() => navigate('/', { replace: true })}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-accent text-white rounded-2xl font-semibold"
          >
            Return to App
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Confetti show={showConfetti} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-surface-raised rounded-3xl p-8 max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-heading font-bold text-text-primary mb-2"
        >
          Welcome to Premium!
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-text-secondary mb-6"
        >
          You now have unlimited access to SpendBot.
          <br />
          Thank you for supporting indie development! 💚
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-3 mb-8"
        >
          <div className="flex items-center gap-3 bg-background/50 rounded-xl p-3">
            <span className="text-xl">✅</span>
            <span className="text-text-primary">Unlimited expenses unlocked</span>
          </div>
          <div className="flex items-center gap-3 bg-background/50 rounded-xl p-3">
            <span className="text-xl">✅</span>
            <span className="text-text-primary">Advanced insights enabled</span>
          </div>
          <div className="flex items-center gap-3 bg-background/50 rounded-xl p-3">
            <span className="text-xl">✅</span>
            <span className="text-text-primary">Cloud sync activated</span>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-text-muted text-sm"
        >
          Redirecting to app in a moment...
        </motion.p>
      </motion.div>
    </div>
  );
}
