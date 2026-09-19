'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Runtime Error:', error);
  }, [error]);

  return (
    <div className="min-h-[75vh] bg-[#F5FAF5] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl border border-primary/20 p-8 text-center shadow-lg space-y-5">
        <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <AlertCircle size={32} />
        </div>

        <div className="space-y-2">
          <h2 className="font-heading font-extrabold text-2xl text-dark">
            Something went wrong
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            We encountered an unexpected error while loading this section. You can try refreshing the page or return to the homepage.
          </p>
          {error?.digest && (
            <p className="text-[10px] font-mono text-text-muted bg-surface px-2 py-1 rounded">
              Error Digest: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2"
          >
            <RefreshCw size={14} />
            <span>Try Again</span>
          </Button>
          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="w-full inline-flex items-center justify-center gap-2"
            >
              <Home size={14} />
              <span>Go to Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
