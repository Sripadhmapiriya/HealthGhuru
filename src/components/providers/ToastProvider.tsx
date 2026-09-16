'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

/**
 * HealthGhuru Toast System
 * -----------------------------------------------------------------------------
 * Drop-in replacement for window.alert() / inline "Saved!" messages.
 * Uses ONLY existing design tokens — no new colors:
 *   success → var(--color-primary) / var(--color-primary-light)
 *   error   → #C62828 (the one documented exception used for admin danger states)
 *   warning → var(--color-accent)
 *   info    → var(--color-text-secondary)
 *
 * Usage anywhere in the app (public site, Free/Pro Vault, Admin):
 *   const { toast } = useToast();
 *   toast.success('Article saved');
 *   toast.error('Could not upload file — try again');
 *   toast.warning('You have reached your 10-record limit');
 *   toast.info('Switched to Arjun\'s profile');
 *
 * Mount <ToastProvider> ONCE near the root of every layout that needs it:
 * public root layout, (vault) layout, (admin) layout.
 */

type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: number;
  variant: ToastVariant;
  message: string;
  description?: string;
  duration: number;
}

interface ToastApi {
  success: (message: string, description?: string, duration?: number) => void;
  error: (message: string, description?: string, duration?: number) => void;
  warning: (message: string, description?: string, duration?: number) => void;
  info: (message: string, description?: string, duration?: number) => void;
}

const ToastContext = createContext<{ toast: ToastApi } | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

const VARIANT_CONFIG: Record<
  ToastVariant,
  { icon: typeof CheckCircle2; accent: string; bg: string; border: string }
> = {
  success: { icon: CheckCircle2, accent: '#2E7D32', bg: '#F5FAF5', border: '#2E7D32' },
  error: { icon: XCircle, accent: '#C62828', bg: '#FDF2F2', border: '#C62828' },
  warning: { icon: AlertTriangle, accent: '#F9A825', bg: '#FFF8E1', border: '#F9A825' },
  info: { icon: Info, accent: '#4A6741', bg: '#F0F4F0', border: '#4A6741' },
};

let idCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (variant: ToastVariant, message: string, description?: string, duration = 4000) => {
      const id = idCounter++;
      setToasts((prev) => [...prev, { id, variant, message, description, duration }]);
      if (duration > 0) {
        window.setTimeout(() => dismiss(id), duration);
      }
    },
    [dismiss]
  );

  const toast: ToastApi = {
    success: (m, d, dur) => push('success', m, d, dur),
    error: (m, d, dur) => push('error', m, d, dur ?? 6000), // errors stay slightly longer by default
    warning: (m, d, dur) => push('warning', m, d, dur),
    info: (m, d, dur) => push('info', m, d, dur),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Fixed stack, top-right on desktop, top-center full-width on mobile */}
      <div
        aria-live="polite"
        className="toast-container fixed top-4 right-4 left-4 sm:left-auto z-[10000] flex flex-col gap-2 sm:w-[380px] pointer-events-none"
      >
        <AnimatePresence>
          {toasts.map((t) => {
            const cfg = VARIANT_CONFIG[t.variant];
            const Icon = cfg.icon;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: -16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', damping: 22, stiffness: 280 }}
                className="pointer-events-auto rounded-[14px] border shadow-[0_8px_30px_rgba(46,125,50,0.12)] p-4 flex gap-3"
                style={{ backgroundColor: cfg.bg, borderColor: `${cfg.border}33` }}
              >
                <Icon size={20} style={{ color: cfg.accent }} className="flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p
                    className="font-medium text-sm leading-snug"
                    style={{ color: '#1A2E1A', fontFamily: 'var(--font-heading, "Plus Jakarta Sans", sans-serif)' }}
                  >
                    {t.message}
                  </p>
                  {t.description && (
                    <p
                      className="text-xs mt-0.5 leading-snug"
                      style={{ color: '#4A6741', fontFamily: 'var(--font-body, "Inter", sans-serif)' }}
                    >
                      {t.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => dismiss(t.id)}
                  data-cursor="text"
                  aria-label="Dismiss notification"
                  className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
                >
                  <X size={16} style={{ color: '#1A2E1A' }} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
