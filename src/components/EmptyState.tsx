import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: string;
  headline: string;
  subtext: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'default' | 'error';
  supportLink?: boolean;
}

export default function EmptyState({
  icon,
  headline,
  subtext,
  actionLabel,
  onAction,
  variant = 'default',
  supportLink = false,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-12 px-4 min-h-[300px] ${
        variant === 'error' ? 'bg-danger/10 rounded-2xl mx-4' : ''
      }`}
    >
      <motion.span
        className="text-[4rem] mb-4 opacity-80"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.8 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {icon}
      </motion.span>
      <h3
        className={`text-xl font-semibold mb-2 ${
          variant === 'error' ? 'text-danger' : 'text-text-primary'
        }`}
      >
        {headline}
      </h3>
      <p className="text-[0.9375rem] text-text-secondary max-w-[260px] mb-5 leading-relaxed">
        {subtext}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-3 bg-accent rounded-xl text-base font-medium text-white active:scale-[0.97] transition-transform"
        >
          {actionLabel}
        </button>
      )}
      {supportLink && (
        <a
          href="mailto:support@spendbot.app"
          className="text-sm text-accent mt-4"
        >
          Contact Support
        </a>
      )}
    </div>
  );
}

// Preset factory functions
export const EmptyStates = {
  noExpenses: (onAdd: () => void) => (
    <EmptyState
      icon="📭"
      headline="No expenses yet"
      subtext="Tap the + button below to add your first expense"
      actionLabel="+ Add Expense"
      onAction={onAdd}
    />
  ),

  noBudget: (onSet: () => void) => (
    <EmptyState
      icon="💡"
      headline="Set a monthly budget"
      subtext="Track your progress and see how you're doing"
      actionLabel="Set Budget"
      onAction={onSet}
    />
  ),

  networkError: (onRetry: () => void) => (
    <EmptyState
      icon="📡"
      headline="Connection lost"
      subtext="We couldn't reach our servers. Check your connection and try again."
      actionLabel="Retry"
      onAction={onRetry}
    />
  ),

  genericError: (onRetry: () => void) => (
    <EmptyState
      icon="😵"
      headline="Something went wrong"
      subtext="We hit a snag. Don't worry, your data is safe."
      actionLabel="Try Again"
      onAction={onRetry}
      variant="error"
      supportLink
    />
  ),
};
