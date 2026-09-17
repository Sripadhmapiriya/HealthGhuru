'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export type AuthModalMode = 'signin' | 'signup' | 'forgot';

export interface OpenModalOptions {
  initialMode?: AuthModalMode;
  intentTitle?: string;
  intentSubtitle?: string;
  callbackUrl?: string;
  onSuccess?: () => void;
}

interface AuthModalContextType {
  isOpen: boolean;
  mode: AuthModalMode;
  intentTitle: string | null;
  intentSubtitle: string | null;
  callbackUrl: string | null;
  openLoginModal: (options?: OpenModalOptions) => void;
  closeLoginModal: () => void;
  setMode: (mode: AuthModalMode) => void;
  handleAuthSuccess: () => void;
  requireAuth: (
    actionOrUrl?: string | (() => void),
    options?: { intentTitle?: string; intentSubtitle?: string; initialMode?: AuthModalMode }
  ) => boolean;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthModalMode>('signin');
  const [intentTitle, setIntentTitle] = useState<string | null>(null);
  const [intentSubtitle, setIntentSubtitle] = useState<string | null>(null);
  const [callbackUrl, setCallbackUrl] = useState<string | null>(null);
  const [onSuccessCallback, setOnSuccessCallback] = useState<(() => void) | null>(null);

  const openLoginModal = useCallback((options?: OpenModalOptions) => {
    setMode(options?.initialMode || 'signin');
    setIntentTitle(options?.intentTitle || null);
    setIntentSubtitle(options?.intentSubtitle || null);
    setCallbackUrl(options?.callbackUrl || null);
    setOnSuccessCallback(options?.onSuccess ? () => options.onSuccess : null);
    setIsOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleAuthSuccess = useCallback(() => {
    setIsOpen(false);
    if (onSuccessCallback) {
      onSuccessCallback();
      setOnSuccessCallback(null);
    }
    if (callbackUrl) {
      router.push(callbackUrl);
      setCallbackUrl(null);
    }
    router.refresh();
  }, [callbackUrl, onSuccessCallback, router]);

  const requireAuth = useCallback(
    (
      actionOrUrl?: string | (() => void),
      options?: { intentTitle?: string; intentSubtitle?: string; initialMode?: AuthModalMode }
    ): boolean => {
      if (session?.user) {
        if (typeof actionOrUrl === 'string') {
          router.push(actionOrUrl);
        } else if (typeof actionOrUrl === 'function') {
          actionOrUrl();
        }
        return true;
      }

      // User not authenticated -> Open modal with intent
      const isUrl = typeof actionOrUrl === 'string';
      const isFn = typeof actionOrUrl === 'function';

      openLoginModal({
        initialMode: options?.initialMode || 'signin',
        intentTitle: options?.intentTitle || 'Sign in to continue',
        intentSubtitle:
          options?.intentSubtitle ||
          'Please sign in or create an account to access this healthcare feature.',
        callbackUrl: isUrl ? actionOrUrl : undefined,
        onSuccess: isFn ? (actionOrUrl as () => void) : undefined,
      });

      return false;
    },
    [session, openLoginModal, router]
  );

  return (
    <AuthModalContext.Provider
      value={{
        isOpen,
        mode,
        intentTitle,
        intentSubtitle,
        callbackUrl,
        openLoginModal,
        closeLoginModal,
        setMode,
        handleAuthSuccess,
        requireAuth,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
}
