'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, HelpCircle } from 'lucide-react';

/**
 * HealthGhuru Dialog System
 * -----------------------------------------------------------------------------
 * Drop-in replacement for window.confirm() and window.prompt().
 * Used app-wide: public site, Free/Pro Vault, Admin (e.g. "Delete this record?",
 * "Change role for this user?", "Discard unsaved changes?").
 *
 * Usage:
 *   const { confirm } = useDialog();
 *
 *   const ok = await confirm({
 *     title: 'Delete this record?',
 *     description: 'This cannot be undone.',
 *     confirmLabel: 'Delete',
 *     variant: 'danger',
 *   });
 *   if (ok) { ...proceed... }
 *
 * Mount <DialogProvider> ONCE near the root of every layout, same as ToastProvider.
 */

type DialogVariant = 'default' | 'danger';

interface ConfirmOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: DialogVariant;
}

interface PendingDialog extends ConfirmOptions {
  resolve: (value: boolean) => void;
}

interface DialogApi {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const DialogContext = createContext<DialogApi | null>(null);

export function useDialog() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error('useDialog must be used within <DialogProvider>');
  return ctx;
}

export function DialogProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<PendingDialog | null>(null);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setPending({ ...options, resolve });
    });
  }, []);

  const handleClose = (value: boolean) => {
    pending?.resolve(value);
    setPending(null);
  };

  const isDanger = pending?.variant === 'danger';

  return (
    <DialogContext.Provider value={{ confirm }}>
      {children}

      <AnimatePresence>
        {pending && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[10001] bg-[#1A2E1A]/40 backdrop-blur-sm"
              onClick={() => handleClose(false)}
            />

            {/* Dialog card */}
            <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', damping: 26, stiffness: 320 }}
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="dialog-title"
                className="dialog-content w-full max-w-[420px] rounded-[14px] bg-white p-6 shadow-[0_20px_60px_rgba(26,46,26,0.25)] pointer-events-auto flex flex-col items-center text-center"
              >
              <div className="flex flex-col items-center gap-3 mb-2">
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: isDanger ? '#FDF2F2' : '#F5FAF5' }}
                >
                  {isDanger ? (
                    <AlertTriangle size={24} style={{ color: '#C62828' }} />
                  ) : (
                    <HelpCircle size={24} style={{ color: '#2E7D32' }} />
                  )}
                </div>
                <div className="pt-1.5">
                  <h3
                    id="dialog-title"
                    className="font-semibold text-[1.1rem] leading-snug"
                    style={{ color: '#1A2E1A', fontFamily: 'var(--font-heading, "Plus Jakarta Sans", sans-serif)' }}
                  >
                    {pending.title}
                  </h3>
                </div>
              </div>

              {pending.description && (
                <p
                  className="text-sm leading-relaxed mb-6"
                  style={{ color: '#4A6741', fontFamily: 'var(--font-body, "Inter", sans-serif)' }}
                >
                  {pending.description}
                </p>
              )}

              <div className="flex justify-center gap-3 mt-4 w-full">
                <button
                  data-cursor="button"
                  onClick={() => handleClose(false)}
                  className="flex-1 max-w-[140px] px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-150 hover:-translate-y-0.5"
                  style={{ borderColor: 'rgba(46,125,50,0.3)', color: '#2E7D32' }}
                >
                  {pending.cancelLabel ?? 'Cancel'}
                </button>
                <button
                  data-cursor="button"
                  onClick={() => handleClose(true)}
                  className="flex-1 max-w-[140px] px-5 py-2.5 rounded-full text-sm font-medium text-white transition-all duration-150 hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #f06d2f 0%, #ff8a57 100%)',
                  }}
                >
                  {pending.confirmLabel ?? 'Confirm'}
                </button>
              </div>
            </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </DialogContext.Provider>
  );
}
