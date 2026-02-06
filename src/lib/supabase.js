import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials');
}

// Custom lock function that doesn't use Navigator Locks API.
// The Navigator Locks API uses AbortController which can cause "AbortError: signal is aborted"
// errors in Safari, PWAs, and when tabs are backgrounded. Since SpendBot is a single-page app
// that doesn't need cross-tab session synchronization, we use a simple Promise-based lock.
const simpleLock = async (name, acquireTimeout, fn) => {
  // Just run the function directly - no cross-tab locking needed for this app
  return await fn();
};

// Custom fetch wrapper that REMOVES abort signals entirely
// This prevents AbortErrors from happening when:
// - React StrictMode unmounts/remounts components
// - PWA service worker intercepts requests
// - Browser backgrounds the tab
// - Supabase's internal AbortController fires prematurely
// Since SpendBot is a simple PWA that doesn't need request cancellation,
// we completely ignore abort signals.
const resilientFetch = async (url, options = {}) => {
  // CRITICAL: Remove the signal from fetch options to prevent AbortError
  // eslint-disable-next-line no-unused-vars
  const { signal, ...optionsWithoutSignal } = options || {};
  
  try {
    return await fetch(url, optionsWithoutSignal);
  } catch (error) {
    // If somehow an abort still happens, retry without signal
    if (error.name === 'AbortError') {
      console.log('[Supabase] AbortError caught, retrying without signal:', url);
      return await fetch(url, optionsWithoutSignal);
    }
    throw error;
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Use our custom lock function to avoid Navigator Locks AbortError issues
    lock: simpleLock,
    // Reduce lock timeout to fail fast rather than hang
    lockAcquireTimeout: 5000,
  },
  global: {
    // Use our resilient fetch wrapper
    fetch: resilientFetch,
  },
});

// Auth helpers
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });
  return { data, error };
};

export const signInWithApple = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: {
      redirectTo: window.location.origin,
    },
  });
  return { data, error };
};

export const signInWithEmail = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUpWithEmail = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: window.location.origin,
    },
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const resetPassword = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  return { data, error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
};
