import React from 'react'
import Loader from "@/components/Loader"

export default function Loading() {
  return (
      <div className='h-screen w-full'>
        <Loader/>
      </div>
  )
}

export function HomeLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-white">
      <div className="animate-pulse space-y-8 w-full max-w-7xl px-4">
        {/* Header placeholder */}
        <div className="flex justify-between items-center">
          <div className="h-12 w-32 bg-gray-800 rounded"></div>
          <div className="flex space-x-4">
            <div className="h-8 w-20 bg-gray-800 rounded"></div>
            <div className="h-8 w-20 bg-gray-800 rounded"></div>
            <div className="h-8 w-20 bg-gray-800 rounded"></div>
          </div>
        </div>
        
        {/* Hero section placeholder */}
        <div className="h-[60vh] w-full bg-gray-800 rounded-lg mt-8"></div>
        
        {/* Content blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="h-64 bg-gray-800 rounded-lg"></div>
          <div className="h-64 bg-gray-800 rounded-lg"></div>
          <div className="h-64 bg-gray-800 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
