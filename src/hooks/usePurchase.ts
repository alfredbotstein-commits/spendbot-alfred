import { useState, useEffect, useCallback, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { db } from '../db';

// RevenueCat types
let Purchases: any = null;

const REVENUECAT_API_KEY_ANDROID = 'YOUR_REVENUECAT_ANDROID_API_KEY';
const REVENUECAT_API_KEY_IOS = 'YOUR_REVENUECAT_IOS_API_KEY';
const ENTITLEMENT_ID = 'premium';

type PurchaseStatus = 'idle' | 'loading' | 'purchasing' | 'restoring' | 'success' | 'error';

export interface Offering {
  identifier: string;
  availablePackages: Package[];
}

export interface Package {
  identifier: string;
  packageType: string;
  product: {
    title: string;
    description: string;
    priceString: string;
    price: number;
  };
}

interface UsePurchaseReturn {
  status: PurchaseStatus;
  error: string | null;
  isPremium: boolean;
  offerings: Offering[];
  purchase: (pkg?: Package) => Promise<void>;
  restore: () => Promise<void>;
  isStoreAvailable: boolean;
}

export function usePurchase(): UsePurchaseReturn {
  const [status, setStatus] = useState<PurchaseStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isStoreAvailable, setIsStoreAvailable] = useState(false);
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const initializedRef = useRef(false);

  const markPremium = useCallback(async () => {
    await db.settings.update('settings', {
      isPremium: true,
      purchaseDate: new Date(),
      purchasePlatform: Capacitor.getPlatform() as 'android' | 'ios',
    });
    setIsPremium(true);
    setStatus('success');
  }, []);

  const checkEntitlement = useCallback(async (): Promise<boolean> => {
    if (!Purchases) return false;
    try {
      const { customerInfo } = await Purchases.getCustomerInfo();
      const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];
      return !!entitlement;
    } catch (err) {
      console.error('[RevenueCat] Error checking entitlement:', err);
      return false;
    }
  }, []);

  // Check local premium status
  useEffect(() => {
    (async () => {
      const settings = await db.settings.get('settings');
      if (settings?.isPremium) {
        setIsPremium(true);
        setStatus('idle');
      }
    })();
  }, []);

  // Initialize RevenueCat
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const init = async () => {
      const platform = Capacitor.getPlatform();
      if (platform === 'web') {
        console.log('[RevenueCat] Not available on web');
        setStatus('idle');
        return;
      }

      try {
        // Dynamic import for native only
        const mod = await import('@revenuecat/purchases-capacitor');
        Purchases = mod.Purchases;

        const apiKey = platform === 'ios' ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;

        await Purchases.configure({ apiKey });
        console.log('[RevenueCat] Configured successfully');
        setIsStoreAvailable(true);

        // Check existing entitlements
        const hasPremium = await checkEntitlement();
        if (hasPremium) {
          await markPremium();
        } else {
          setStatus('idle');
        }

        // Fetch offerings
        try {
          const { offerings: offeringsResult } = await Purchases.getOfferings();
          if (offeringsResult.current) {
            setOfferings([offeringsResult.current]);
          }
          if (offeringsResult.all) {
            setOfferings(Object.values(offeringsResult.all));
          }
        } catch (err) {
          console.warn('[RevenueCat] Failed to fetch offerings:', err);
        }
      } catch (err) {
        console.error('[RevenueCat] Init error:', err);
        setStatus('idle');
      }
    };

    init();
  }, [checkEntitlement, markPremium]);

  const purchase = useCallback(async (pkg?: Package) => {
    if (!Purchases) {
      setError('Store not available. Please try again later.');
      setStatus('error');
      return;
    }

    setStatus('purchasing');
    setError(null);

    try {
      let result;
      if (pkg) {
        result = await Purchases.purchasePackage({ aPackage: pkg });
      } else {
        // Use first available package from current offering
        const { offerings: off } = await Purchases.getOfferings();
        const defaultPkg = off.current?.availablePackages?.[0];
        if (!defaultPkg) {
          setError('No products available. Please try again later.');
          setStatus('error');
          return;
        }
        result = await Purchases.purchasePackage({ aPackage: defaultPkg });
      }

      const entitlement = result.customerInfo.entitlements.active[ENTITLEMENT_ID];
      if (entitlement) {
        await markPremium();
      } else {
        setStatus('idle');
      }
    } catch (err: any) {
      if (err.code === 1 || err.message?.includes('cancel')) {
        // User cancelled
        setStatus('idle');
      } else {
        console.error('[RevenueCat] Purchase error:', err);
        setError('Something went wrong. Please try again.');
        setStatus('error');
      }
    }
  }, [markPremium]);

  const restore = useCallback(async () => {
    if (!Purchases) {
      setError('Store not available.');
      setStatus('error');
      return;
    }

    setStatus('restoring');
    setError(null);

    try {
      const { customerInfo } = await Purchases.restorePurchases();
      const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];
      if (entitlement) {
        await markPremium();
      } else {
        setError('No previous purchase found.');
        setStatus('idle');
      }
    } catch (err) {
      console.error('[RevenueCat] Restore error:', err);
      setError('Restore failed. Please try again.');
      setStatus('error');
    }
  }, [markPremium]);

  return { status, error, isPremium, offerings, purchase, restore, isStoreAvailable };
}
