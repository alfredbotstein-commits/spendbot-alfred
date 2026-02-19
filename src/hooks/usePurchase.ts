import { useState, useEffect, useCallback, useRef } from 'react';
import { db } from '../db';

// cordova-plugin-purchase exposes CdvPurchase on window
declare global {
  interface Window {
    CdvPurchase?: typeof import('cordova-plugin-purchase')['CdvPurchase'];
  }
}

const PRODUCT_ID = 'spendbot_pro';

type PurchaseStatus = 'idle' | 'loading' | 'purchasing' | 'restoring' | 'success' | 'error';

interface UsePurchaseReturn {
  status: PurchaseStatus;
  error: string | null;
  isPremium: boolean;
  purchase: () => Promise<void>;
  restore: () => Promise<void>;
  isStoreAvailable: boolean;
}

export function usePurchase(): UsePurchaseReturn {
  const [status, setStatus] = useState<PurchaseStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isStoreAvailable, setIsStoreAvailable] = useState(false);
  const initializedRef = useRef(false);

  const markPremium = useCallback(async () => {
    await db.settings.update('settings', {
      isPremium: true,
      purchaseDate: new Date(),
      purchasePlatform: 'android' as const,
    });
    setIsPremium(true);
    setStatus('success');
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

  // Initialize store
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const initStore = () => {
      const CdvPurchase = window.CdvPurchase;
      if (!CdvPurchase) {
        console.log('[IAP] CdvPurchase not available (web/dev mode)');
        setStatus('idle');
        return;
      }

      const { store, Platform, ProductType } = CdvPurchase;
      setIsStoreAvailable(true);

      // Register product
      store.register([
        {
          id: PRODUCT_ID,
          type: ProductType.NON_CONSUMABLE,
          platform: Platform.GOOGLE_PLAY,
        },
      ]);

      // Listen for approved transactions
      store.when().approved((transaction) => {
        console.log('[IAP] Purchase approved:', transaction.transactionId);
        // Finish the transaction (acknowledge it with Google Play)
        transaction.finish();
      });

      // Listen for finished (verified + acknowledged)
      store.when().finished((transaction) => {
        console.log('[IAP] Purchase finished:', transaction.transactionId);
        markPremium();
      });

      // Listen for product updates to detect owned products (restore)
      store.when().productUpdated((product) => {
        if (product.id === PRODUCT_ID && product.owned) {
          console.log('[IAP] Product already owned');
          markPremium();
        }
      });

      // Initialize
      store.initialize([Platform.GOOGLE_PLAY])
        .then(() => {
          console.log('[IAP] Store initialized');
          setStatus('idle');
        })
        .catch((err: Error) => {
          console.error('[IAP] Store init error:', err);
          setStatus('idle'); // Don't block the app
        });
    };

    // Wait for deviceready if in Capacitor
    if (document.readyState === 'complete' && window.CdvPurchase) {
      initStore();
    } else {
      document.addEventListener('deviceready', initStore, false);
      // Fallback timeout for web
      setTimeout(() => {
        if (!isStoreAvailable) {
          setStatus('idle');
        }
      }, 3000);
    }
  }, [markPremium, isStoreAvailable]);

  const purchase = useCallback(async () => {
    const CdvPurchase = window.CdvPurchase;
    if (!CdvPurchase) {
      setError('Store not available. Please try again later.');
      setStatus('error');
      return;
    }

    setStatus('purchasing');
    setError(null);

    try {
      const { store } = CdvPurchase;
      const product = store.get(PRODUCT_ID);

      if (!product) {
        setError('Product not found. Please try again later.');
        setStatus('error');
        return;
      }

      // Check if already owned
      if (product.owned) {
        await markPremium();
        return;
      }

      const offer = product.getOffer();
      if (!offer) {
        setError('No offer available. Please try again later.');
        setStatus('error');
        return;
      }

      const orderResult = await store.order(offer);
      if (orderResult && orderResult.isError) {
        // User cancelled or error
        if (orderResult.code === CdvPurchase.ErrorCode.PAYMENT_CANCELLED) {
          setStatus('idle'); // Silent cancel
        } else {
          setError(orderResult.message || 'Purchase failed. Please try again.');
          setStatus('error');
        }
      }
      // If no error, the approved/finished listeners handle the rest
    } catch (err) {
      console.error('[IAP] Purchase error:', err);
      setError('Something went wrong. Please try again.');
      setStatus('error');
    }
  }, [markPremium]);

  const restore = useCallback(async () => {
    const CdvPurchase = window.CdvPurchase;
    if (!CdvPurchase) {
      setError('Store not available.');
      setStatus('error');
      return;
    }

    setStatus('restoring');
    setError(null);

    try {
      const { store } = CdvPurchase;
      await store.restorePurchases();

      // Check if product is now owned
      const product = store.get(PRODUCT_ID);
      if (product?.owned) {
        await markPremium();
      } else {
        setError('No previous purchase found.');
        setStatus('idle');
      }
    } catch (err) {
      console.error('[IAP] Restore error:', err);
      setError('Restore failed. Please try again.');
      setStatus('error');
    }
  }, [markPremium]);

  return { status, error, isPremium, purchase, restore, isStoreAvailable };
}
