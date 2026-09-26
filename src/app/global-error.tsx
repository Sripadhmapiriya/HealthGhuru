'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global Error Boundary caught:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F5FAF5] flex items-center justify-center font-sans p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-emerald-200 p-8 text-center shadow-lg space-y-4">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold">
            !
          </div>
          <h2 className="text-xl font-bold text-gray-900">Application Error</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            An unexpected error occurred. Please try reloading the page.
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={() => reset()}
              className="px-4 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Reload Page
            </button>
            <a
              href="/"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-colors inline-block"
            >
              Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
