"use client";

import { Suspense } from 'react';
import { unstable_noStore as noStore } from 'next/cache';
import Loading from './loading';
import dynamic from 'next/dynamic';

// Force dynamic rendering with config exports
export const config = {
  dynamic: 'force-dynamic',
  fetchCache: 'force-no-store',
  revalidate: false
};

// Use dynamic import with SSR explicitly disabled to prevent server-side document references
const ProfileContent = dynamic(
  () => import('./profile-content'),
  { ssr: false, loading: () => <Loading /> }
);

export default function ProfilePage() {
  // Ensure no store caching
  noStore();
  
  return (
    <Suspense fallback={<Loading />}>
      <ProfileContent />
    </Suspense>
  );
} 
