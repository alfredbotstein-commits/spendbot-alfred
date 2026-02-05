import { useState, useEffect } from 'react';

// Check initial states outside component (pure)
const getInitialInstalled = () => 
  typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches;
const getInitialIsIOS = () => 
  typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

export function usePWA() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(getInitialInstalled);
  const [isIOS] = useState(getInitialIsIOS);

  useEffect(() => {
    // Already installed, no need to setup listeners
    if (isInstalled) return;

    // Listen for install prompt (Android/Desktop)
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Listen for successful install
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const install = async () => {
    if (!installPrompt) return false;

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setInstallPrompt(null);
      return true;
    }
    return false;
  };

  return {
    canInstall: !!installPrompt || (isIOS && !isInstalled),
    isInstalled,
    isIOS,
    install,
  };
}
