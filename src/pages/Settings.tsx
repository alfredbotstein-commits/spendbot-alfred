import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Pencil, Trash2, Check, X, AlertTriangle } from 'lucide-react';
import { 
  getCategories, 
  getSettings, 
  updateSettings,
  addCategory,
  updateCategory,
  deleteCategory,
  getCategoryExpenseCount,
  reassignExpenses,
  getExpensesByCategory,
  Category, 
  UserSettings,
  DEFAULT_CATEGORIES
} from '../db';

// Common emoji options for categories
const EMOJI_OPTIONS = ['🍔', '🚗', '🛒', '🎬', '🏠', '🛍️', '💊', '✈️', '📱', '📦', '💰', '🎮', '☕', '🍕', '🏋️', '🎵', '📚', '🐕', '💇', '🔧'];

// Common color options
const COLOR_OPTIONS = ['#FB923C', '#60A5FA', '#34D399', '#C084FC', '#94A3B8', '#F472B6', '#F87171', '#22D3EE', '#A78BFA', '#9CA3AF', '#FBBF24', '#10B981'];

interface EditingCategory {
  id: string | null;
  name: string;
  emoji: string;
  color: string;
}

export default function Settings() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Budget state
  const [budget, setBudget] = useState('');
  const [showBudgetInput, setShowBudgetInput] = useState(false);
  
  // Category editing state
  const [editingCategory, setEditingCategory] = useState<EditingCategory | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  // Category spend totals
  const [categorySpends, setCategorySpends] = useState<Record<string, number>>({});
  
  // Delete confirmation state
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [deleteExpenseCount, setDeleteExpenseCount] = useState(0);
  const [reassignTarget, setReassignTarget] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const now = new Date();
    const [cats, userSettings, spends] = await Promise.all([
      getCategories(),
      getSettings(),
      getExpensesByCategory(now.getFullYear(), now.getMonth()),
    ]);
    setCategories(cats);
    setSettings(userSettings || null);
    setCategorySpends(spends);
    if (userSettings?.monthlyBudget) {
      setBudget((userSettings.monthlyBudget / 100).toString());
    }
    setIsLoading(false);
  }

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: settings?.currency || 'USD',
    }).format(cents / 100);
  };

  const handleBudgetSave = async () => {
    const value = parseFloat(budget);
    if (!isNaN(value) && value > 0) {
      await updateSettings({ monthlyBudget: Math.round(value * 100) });
      setSettings(prev => prev ? { ...prev, monthlyBudget: Math.round(value * 100) } : null);
    } else if (budget === '' || budget === '0') {
      await updateSettings({ monthlyBudget: undefined });
      setSettings(prev => prev ? { ...prev, monthlyBudget: undefined } : null);
    }
    setShowBudgetInput(false);
  };

  // Category management
  const startAddCategory = () => {
    setEditingCategory({
      id: null,
      name: '',
      emoji: '📦',
      color: '#6B7280',
    });
  };

  const startEditCategory = (cat: Category) => {
    setEditingCategory({
      id: cat.id,
      name: cat.name,
      emoji: cat.emoji,
      color: cat.color,
    });
  };

  const cancelEditing = () => {
    setEditingCategory(null);
    setShowEmojiPicker(false);
    setShowColorPicker(false);
  };

  const saveCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim()) return;

    if (editingCategory.id) {
      // Update existing
      await updateCategory(editingCategory.id, {
        name: editingCategory.name.trim(),
        emoji: editingCategory.emoji,
        color: editingCategory.color,
      });
    } else {
      // Add new
      await addCategory(
        editingCategory.name.trim(),
        editingCategory.emoji,
        editingCategory.color
      );
    }
    
    cancelEditing();
    await loadData();
  };

  const startDeleteCategory = async (cat: Category) => {
    const count = await getCategoryExpenseCount(cat.id);
    setDeleteExpenseCount(count);
    setDeletingCategory(cat);
    // Default reassign target to "other" category
    const otherCat = categories.find(c => c.id === 'other');
    setReassignTarget(otherCat?.id || categories[0]?.id || '');
  };

  const confirmDelete = async () => {
    if (!deletingCategory) return;

    if (deleteExpenseCount > 0 && reassignTarget) {
      await reassignExpenses(deletingCategory.id, reassignTarget);
    }
    await deleteCategory(deletingCategory.id);
    
    setDeletingCategory(null);
    setDeleteExpenseCount(0);
    await loadData();
  };

  const cancelDelete = () => {
    setDeletingCategory(null);
    setDeleteExpenseCount(0);
    setReassignTarget('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-4xl animate-bounce">🤖</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center p-4"
        style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top, 0px))' }}
      >
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-xl"
        >
          <ArrowLeft className="w-6 h-6 text-text-secondary" />
        </button>
        <h1 className="text-xl font-semibold font-heading text-text-primary ml-3">Settings</h1>
      </motion.header>

      <div className="px-4 py-4 space-y-6" style={{ paddingBottom: 'calc(3rem + env(safe-area-inset-bottom, 0px))' }}>
        {/* Account Section */}
        <section>
          <div className="text-xs font-semibold uppercase tracking-[0.05em] text-text-muted px-0 mb-2">Account</div>
          <div className="bg-surface-raised rounded-2xl overflow-hidden">
            <button className="w-full flex items-center p-4 border-b border-surface-elevated active:bg-surface-elevated transition-colors">
              <div className="w-8 h-8 flex items-center justify-center bg-surface rounded-lg text-base mr-3">📧</div>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-base text-text-primary">Email</div>
                <div className="text-sm text-text-secondary mt-0.5">user@example.com</div>
              </div>
              <span className="text-text-muted">›</span>
            </button>
            <button className="w-full flex items-center p-4 border-b border-surface-elevated active:bg-surface-elevated transition-colors">
              <div className="w-8 h-8 flex items-center justify-center bg-surface rounded-lg text-base mr-3">🔐</div>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-base text-text-primary">Password</div>
              </div>
              <span className="text-text-muted">›</span>
            </button>
            <button className="w-full flex items-center p-4 active:bg-surface-elevated transition-colors">
              <div className="w-8 h-8 flex items-center justify-center bg-surface rounded-lg text-base mr-3">🚪</div>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-base text-danger">Sign Out</div>
              </div>
              <span className="text-text-muted">›</span>
            </button>
          </div>
        </section>

        {/* Budget Section */}
        <section>
          <div className="text-xs font-semibold uppercase tracking-[0.05em] text-text-muted px-0 mb-2">Budget</div>
          <div className="bg-surface-raised rounded-2xl overflow-hidden">
            <div className="flex items-center p-4">
              <div className="w-8 h-8 flex items-center justify-center bg-surface rounded-lg text-base mr-3">💰</div>
              <div className="flex-1 min-w-0">
                <div className="text-base text-text-primary">Monthly Budget</div>
                <div className="text-sm text-text-secondary mt-0.5">
                  {settings?.monthlyBudget ? formatCurrency(settings.monthlyBudget) : 'Not set'}
                </div>
              </div>
              {showBudgetInput ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="0"
                    className="w-24 px-3 py-2 bg-background border border-border rounded-lg text-text-primary text-right focus:outline-none focus:border-accent"
                    autoFocus
                  />
                  <button
                    onClick={handleBudgetSave}
                    className="p-2 bg-accent rounded-lg text-white"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowBudgetInput(false)}
                    className="p-2 bg-surface rounded-lg text-text-secondary"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowBudgetInput(true)}
                  className="text-accent font-medium"
                >
                  {settings?.monthlyBudget ? 'Edit' : 'Set'}
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold uppercase tracking-[0.05em] text-text-muted">
              Categories
            </div>
            <button
              onClick={startAddCategory}
              className="flex items-center gap-1 text-accent text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
          
          <div className="bg-surface-raised rounded-2xl overflow-hidden">
            {categories.map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`flex items-center justify-between p-4 ${
                  index < categories.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    style={{ backgroundColor: cat.color + '20' }}
                  >
                    {cat.emoji}
                  </div>
                  <div>
                    <div className="text-text-primary font-medium">{cat.name}</div>
                    {cat.isDefault && (
                      <div className="text-xs text-text-muted">Default</div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {categorySpends[cat.id] ? (
                    <span className="text-sm text-text-muted mr-1">
                      {formatCurrency(categorySpends[cat.id])}
                    </span>
                  ) : null}
                  <button
                    onClick={() => startEditCategory(cat)}
                    className="p-2 rounded-lg hover:bg-surface transition-colors"
                  >
                    <Pencil className="w-4 h-4 text-text-secondary" />
                  </button>
                  {!cat.isDefault && (
                    <button
                      onClick={() => startDeleteCategory(cat)}
                      className="p-2 rounded-lg hover:bg-danger/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-danger" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Data Section */}
        <section>
          <div className="text-xs font-semibold uppercase tracking-[0.05em] text-text-muted px-0 mb-2">Data</div>
          <div className="bg-surface-raised rounded-2xl overflow-hidden">
            <button className="w-full flex items-center p-4 border-b border-surface-elevated active:bg-surface-elevated transition-colors">
              <div className="w-8 h-8 flex items-center justify-center bg-surface rounded-lg text-base mr-3">📤</div>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-base text-text-primary">Export to CSV</div>
              </div>
              <span className="text-text-muted">›</span>
            </button>
            <button className="w-full flex items-center p-4 active:bg-surface-elevated transition-colors">
              <div className="w-8 h-8 flex items-center justify-center bg-surface rounded-lg text-base mr-3">🗑️</div>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-base text-danger">Clear All Data</div>
              </div>
              <span className="text-text-muted">›</span>
            </button>
          </div>
        </section>

        {/* Support Section */}
        <section>
          <div className="text-xs font-semibold uppercase tracking-[0.05em] text-text-muted px-0 mb-2">Support</div>
          <div className="bg-surface-raised rounded-2xl overflow-hidden">
            <button className="w-full flex items-center p-4 border-b border-surface-elevated active:bg-surface-elevated transition-colors">
              <div className="w-8 h-8 flex items-center justify-center bg-surface rounded-lg text-base mr-3">❓</div>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-base text-text-primary">Help & FAQ</div>
              </div>
              <span className="text-text-muted">›</span>
            </button>
            <button className="w-full flex items-center p-4 border-b border-surface-elevated active:bg-surface-elevated transition-colors">
              <div className="w-8 h-8 flex items-center justify-center bg-surface rounded-lg text-base mr-3">💬</div>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-base text-text-primary">Contact Support</div>
              </div>
              <span className="text-text-muted">›</span>
            </button>
            <button className="w-full flex items-center p-4 active:bg-surface-elevated transition-colors">
              <div className="w-8 h-8 flex items-center justify-center bg-surface rounded-lg text-base mr-3">⭐</div>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-base text-text-primary">Rate SpendBot</div>
              </div>
              <span className="text-text-muted">›</span>
            </button>
          </div>
        </section>

        {/* Premium CTA (for free users) */}
        {!settings?.isPremium && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full p-4 rounded-2xl text-center"
            style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)' }}
          >
            <div className="text-base font-semibold text-white">✨ Upgrade to Premium</div>
          </motion.button>
        )}

        {/* Footer */}
        <section className="text-center py-6">
          <div className="flex items-center justify-center gap-2 text-text-secondary mb-3">
            <span>🤖</span>
            <span className="text-sm">SpendBot v1.1.0</span>
          </div>
          <div className="text-xs text-text-muted mb-3">Made by Loopspur</div>
          <div className="flex justify-center gap-4">
            <button className="text-sm text-text-muted">Privacy</button>
            <span className="text-text-muted">•</span>
            <button className="text-sm text-text-muted">Terms</button>
            <span className="text-text-muted">•</span>
            <button className="text-sm text-text-muted">Licenses</button>
          </div>
        </section>
      </div>

      {/* Category Edit Modal */}
      <AnimatePresence>
        {editingCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-end justify-center z-50"
            onClick={cancelEditing}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="bg-surface rounded-t-3xl p-6 w-full max-w-lg"
            >
              <h2 className="text-xl font-bold font-heading text-text-primary mb-6">
                {editingCategory.id ? 'Edit Category' : 'New Category'}
              </h2>
              
              {/* Preview */}
              <div className="flex items-center gap-3 mb-6 p-4 bg-background rounded-xl">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{ backgroundColor: editingCategory.color + '20' }}
                >
                  {editingCategory.emoji}
                </div>
                <div className="text-text-primary font-medium text-lg">
                  {editingCategory.name || 'Category Name'}
                </div>
              </div>

              {/* Name Input */}
              <div className="mb-4">
                <label className="block text-sm text-text-secondary mb-2">Name</label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  placeholder="Category name"
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary focus:outline-none focus:border-accent"
                  autoFocus
                />
              </div>

              {/* Emoji Picker */}
              <div className="mb-4">
                <label className="block text-sm text-text-secondary mb-2">Emoji</label>
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-left text-2xl"
                >
                  {editingCategory.emoji}
                </button>
                <AnimatePresence>
                  {showEmojiPicker && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 grid grid-cols-10 gap-2 p-3 bg-background rounded-xl"
                    >
                      {EMOJI_OPTIONS.map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => {
                            setEditingCategory({ ...editingCategory, emoji });
                            setShowEmojiPicker(false);
                          }}
                          className={`text-2xl p-2 rounded-lg hover:bg-surface-raised transition-colors ${
                            editingCategory.emoji === emoji ? 'bg-accent/20 ring-2 ring-accent' : ''
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Color Picker */}
              <div className="mb-6">
                <label className="block text-sm text-text-secondary mb-2">Color</label>
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl flex items-center gap-3"
                >
                  <div 
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: editingCategory.color }}
                  />
                  <span className="text-text-secondary">{editingCategory.color}</span>
                </button>
                <AnimatePresence>
                  {showColorPicker && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 grid grid-cols-6 gap-2 p-3 bg-background rounded-xl"
                    >
                      {COLOR_OPTIONS.map(color => (
                        <button
                          key={color}
                          onClick={() => {
                            setEditingCategory({ ...editingCategory, color });
                            setShowColorPicker(false);
                          }}
                          className={`w-10 h-10 rounded-full transition-transform hover:scale-110 ${
                            editingCategory.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-surface' : ''
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={cancelEditing}
                  className="flex-1 h-12 bg-background text-text-secondary rounded-xl font-medium hover:bg-surface-raised transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveCategory}
                  disabled={!editingCategory.name.trim()}
                  className="flex-1 h-12 bg-accent text-white rounded-xl font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingCategory.id ? 'Save Changes' : 'Add Category'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50"
            onClick={cancelDelete}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-surface rounded-3xl p-6 max-w-sm w-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-danger/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-danger" />
                </div>
                <div>
                  <h2 className="text-lg font-bold font-heading text-text-primary">
                    Delete "{deletingCategory.name}"?
                  </h2>
                </div>
              </div>

              {deleteExpenseCount > 0 ? (
                <div className="mb-6">
                  <p className="text-text-secondary mb-4">
                    This category has <span className="font-semibold text-text-primary">{deleteExpenseCount} expense{deleteExpenseCount !== 1 ? 's' : ''}</span>. 
                    Choose a category to reassign them to:
                  </p>
                  <select
                    value={reassignTarget}
                    onChange={(e) => setReassignTarget(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary focus:outline-none focus:border-accent"
                  >
                    {categories
                      .filter(c => c.id !== deletingCategory.id)
                      .map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.emoji} {cat.name}
                        </option>
                      ))
                    }
                  </select>
                </div>
              ) : (
                <p className="text-text-secondary mb-6">
                  This category has no expenses. It will be permanently deleted.
                </p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 h-12 bg-background text-text-secondary rounded-xl font-medium hover:bg-surface-raised transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 h-12 bg-danger text-white rounded-xl font-medium hover:bg-danger/90 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
