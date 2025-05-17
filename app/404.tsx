"use client";

import { unstable_noStore as noStore } from 'next/cache';

// This forces dynamic rendering and prevents static generation
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = false;

export default function NotFoundPage() {
  // Prevent static generation for this route
  noStore();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-white">
      <h2 className="text-2xl font-bold">404 - Page Not Found</h2>
      <p className="mt-2">The requested resource could not be found</p>
    </div>
  )
} 