"use client"

import { useEffect } from 'react';
import Link from 'next/link';

// This forces dynamic rendering and prevents static generation
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-white p-4">
      <h2 className="text-3xl font-bold mb-4">Something went wrong</h2>
      <p className="text-center text-gray-400 mb-8">
        We apologize for the inconvenience. Please try again later.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={reset}
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          Return to home
        </Link>
      </div>
    </div>
  );
}