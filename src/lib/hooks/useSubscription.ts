'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export interface SubscriptionStatus {
  isSubscribed: boolean;
  isAdFree: boolean;
  tier: string;
  adsEnabled: boolean;
  status: 'authenticated' | 'unauthenticated' | 'loading';
  isLoading: boolean;
}

export function useSubscription(): SubscriptionStatus {
  const { data: session, status } = useSession();
  const [localSubscribed, setLocalSubscribed] = useState<boolean | null>(null);
  const [localTier, setLocalTier] = useState<string | null>(null);

  useEffect(() => {
    // Listen for real-time subscription changes dispatched on the window
    const handleSubChange = (e: any) => {
      if (e.detail) {
        setLocalSubscribed(e.detail.isSubscribed ?? true);
        if (e.detail.tier) setLocalTier(e.detail.tier);
      }
    };

    window.addEventListener('hg_subscription_changed', handleSubChange);
    return () => {
      window.removeEventListener('hg_subscription_changed', handleSubChange);
    };
  }, []);

  const sessionUser = session?.user;
  const rawTier = localTier || (sessionUser as any)?.tier || 'free';
  const tierLower = rawTier.toLowerCase();

  // Premium, Annual, Pro, or explicit adsEnabled = false grants 100% ad-free and sponsor-free access
  const isPaidTier = tierLower === 'premium' || tierLower === 'annual' || tierLower === 'pro' || tierLower === 'vip';
  const adsExplicitlyDisabled = (sessionUser as any)?.adsEnabled === false;
  const isSessionSubscribed = Boolean((sessionUser as any)?.isSubscribed) || isPaidTier || adsExplicitlyDisabled;

  const isSubscribed = localSubscribed !== null ? localSubscribed : (status === 'authenticated' && isSessionSubscribed);
  const isAdFree = isSubscribed;
  const adsEnabled = !isAdFree;

  return {
    isSubscribed,
    isAdFree,
    tier: rawTier,
    adsEnabled,
    status,
    isLoading: status === 'loading',
  };
}
