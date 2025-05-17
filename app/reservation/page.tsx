"use client";

import { Suspense } from 'react';
import { unstable_noStore as noStore } from 'next/cache';
import dynamic from 'next/dynamic';
import Loading from './loading';

// Force dynamic rendering with config exports
export const config = {
  dynamic: 'force-dynamic',
  fetchCache: 'force-no-store',
  revalidate: false
};

// Use dynamic import with SSR explicitly disabled to prevent server-side document references
const ReservationContent = dynamic(
  () => import('./reservation-content'),
  { ssr: false, loading: () => <Loading /> }
);

export default function ReservationPage() {
  // Ensure no store caching
  noStore();
  
  return (
    <Suspense fallback={<Loading />}>
      <ReservationContent />
    </Suspense>
  );
}
