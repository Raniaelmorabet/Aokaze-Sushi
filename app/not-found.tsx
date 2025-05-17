"use client";

import Link from 'next/link';
import { unstable_noStore as noStore } from 'next/cache';

// This forces dynamic rendering and prevents static generation
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default function NotFound() {
  // Prevent static generation for this route
  noStore();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-white p-4">
      <h2 className="text-3xl font-bold mb-4">404 - Page Not Found</h2>
      <p className="text-center text-gray-400 mb-8">
        The requested resource could not be found
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
      >
        Return to home
      </Link>
    </div>
  );
}