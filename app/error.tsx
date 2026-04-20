"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[App Error]", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-md w-full text-center space-y-4">
        <div className="text-5xl">⚠️</div>
        <h1 className="text-xl font-bold text-gray-900">Något gick fel</h1>
        <p className="text-sm text-gray-500">
          Kunde inte ladda stipendier just nu. Det kan bero på ett tillfälligt
          databasfel. Försök igen om en stund.
        </p>
        {error.digest && (
          <p className="text-xs text-gray-300 font-mono">#{error.digest}</p>
        )}
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition"
        >
          Försök igen
        </button>
      </div>
    </main>
  );
}
