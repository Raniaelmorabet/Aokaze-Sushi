"use client";

import { NextPage } from 'next';

// Use proper Next.js 13+ app router configuration
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = false;

interface ErrorProps {
  statusCode?: number;
}

const Error: NextPage<ErrorProps> = ({ statusCode }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-white">
      <h2 className="text-2xl font-bold">
        {statusCode ? `Error ${statusCode}` : 'An error occurred'}
      </h2>
      <p className="mt-2">Please try again later</p>
    </div>
  );
};

export default Error; 