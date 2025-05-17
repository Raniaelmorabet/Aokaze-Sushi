'use client';

import dynamic from 'next/dynamic';
import Loading from './loading';

// Import the profile page with dynamic import and SSR disabled
const ProfilePageContent = dynamic(() => import('./page-content'), { 
  ssr: false,
  loading: () => <Loading />
});

export default function ProfilePage() {
  return <ProfilePageContent />;
} 