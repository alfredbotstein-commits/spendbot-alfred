// Default expense categories
export const DEFAULT_CATEGORIES = [
  { id: 'food', name: 'Food', emoji: '🍔', color: '#F97316', isDefault: true, sortOrder: 0 },
  { id: 'transport', name: 'Transport', emoji: '🚗', color: '#3B82F6', isDefault: true, sortOrder: 1 },
  { id: 'groceries', name: 'Groceries', emoji: '🛒', color: '#22C55E', isDefault: true, sortOrder: 2 },
  { id: 'entertainment', name: 'Entertainment', emoji: '🎬', color: '#A855F7', isDefault: true, sortOrder: 3 },
  { id: 'bills', name: 'Bills', emoji: '🏠', color: '#6B7280', isDefault: true, sortOrder: 4 },
  { id: 'shopping', name: 'Shopping', emoji: '🛍️', color: '#EC4899', isDefault: true, sortOrder: 5 },
  { id: 'health', name: 'Health', emoji: '💊', color: '#EF4444', isDefault: true, sortOrder: 6 },
  { id: 'travel', name: 'Travel', emoji: '✈️', color: '#06B6D4', isDefault: true, sortOrder: 7 },
  { id: 'subscriptions', name: 'Subscriptions', emoji: '📱', color: '#6366F1', isDefault: true, sortOrder: 8 },
  { id: 'other', name: 'Other', emoji: '📦', color: '#64748B', isDefault: true, sortOrder: 9 },
];

// Helper to get category by ID
export function getCategoryById(id) {
  return DEFAULT_CATEGORIES.find(c => c.id === id) || DEFAULT_CATEGORIES.find(c => c.id === 'other');
}
