import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { getLocalDateString } from '../utils/dateUtils';

const DEFAULT_SETTINGS = {
  monthly_budget: null,
  custom_categories: null,
  onboarding_complete: false,
  streak_data: {
    currentStreak: 0,
    lastExpenseDate: null,
    longestStreak: 0,
  },
};

export function useSupabaseSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  // Fetch settings from Supabase - inline createDefaultSettings to avoid dependency issues
  const fetchSettings = useCallback(async () => {
    if (!user) {
      setSettings(DEFAULT_SETTINGS);
      setLoading(false);
      return;
    }

    // Helper function to create default settings (inlined to avoid stale closure)
    // Uses upsert to avoid race condition conflicts (409 errors)
    const createDefaults = async () => {
      try {
        const { data, error } = await supabase
          .from('user_settings')
          .upsert({
            user_id: user.id,
            ...DEFAULT_SETTINGS,
          }, {
            onConflict: 'user_id',
            ignoreDuplicates: false,
          })
          .select()
          .single();

        if (!error && data) {
          setSettings(data);
        }
      } catch (err) {
        console.error('Error creating default settings:', err);
      }
    };

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle(); // Use maybeSingle() to avoid 406 when no rows

      if (error) {
        console.error('Error fetching settings:', error);
      }

      if (data) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...data,
          streak_data: data.streak_data || DEFAULT_SETTINGS.streak_data,
        });
      } else {
        // Create default settings for new user
        await createDefaults();
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Update settings with timeout to prevent hanging on stale sessions
  const updateSettings = async (updates) => {
    if (!user) return { error: 'Not authenticated' };

    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Settings update timed out')), 8000)
    );

    try {
      // Race the update against the timeout
      const { data, error } = await Promise.race([
        supabase
          .from('user_settings')
          .update(updates)
          .eq('user_id', user.id)
          .select()
          .single(),
        timeoutPromise
      ]);

      if (error) throw error;

      setSettings(prev => ({ ...prev, ...data }));
      return { data, error: null };
    } catch (err) {
      console.error('Error updating settings:', err);
      return { error: err.message };
    }
  };

  // Update streak
  const updateStreak = async () => {
    if (!user) return;

    const today = getLocalDateString();
    const lastDate = settings.streak_data?.lastExpenseDate;
    
    let newStreak = 1;
    let longestStreak = settings.streak_data?.longestStreak || 0;

    if (lastDate) {
      const lastDateObj = new Date(lastDate);
      const todayObj = new Date(today);
      const diffDays = Math.floor((todayObj - lastDateObj) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Same day, don't change streak
        return;
      } else if (diffDays === 1) {
        // Consecutive day, increment streak
        newStreak = (settings.streak_data?.currentStreak || 0) + 1;
      }
      // If more than 1 day, streak resets to 1
    }

    if (newStreak > longestStreak) {
      longestStreak = newStreak;
    }

    await updateSettings({
      streak_data: {
        currentStreak: newStreak,
        lastExpenseDate: today,
        longestStreak,
      },
    });
  };

  return {
    settings: {
      monthlyBudget: settings.monthly_budget,
      customCategories: settings.custom_categories,
      onboardingComplete: settings.onboarding_complete,
      streakData: settings.streak_data,
    },
    loading,
    updateSettings: async (updates) => {
      // Map from camelCase to snake_case
      const dbUpdates = {};
      if (updates.monthlyBudget !== undefined) {
        dbUpdates.monthly_budget = updates.monthlyBudget;
      }
      if (updates.customCategories !== undefined) {
        dbUpdates.custom_categories = updates.customCategories;
      }
      if (updates.onboardingComplete !== undefined) {
        dbUpdates.onboarding_complete = updates.onboardingComplete;
      }
      if (updates.streakData !== undefined) {
        dbUpdates.streak_data = updates.streakData;
      }
      return updateSettings(dbUpdates);
    },
    updateStreak,
  };
}
