import React from 'react'
import Loader from "@/components/Loader"

export default function ProfileLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-white">
      <div className="animate-pulse space-y-8 w-full max-w-7xl px-4">
        {/* Header placeholder */}
        <div className="flex justify-between items-center">
          <div className="h-12 w-32 bg-gray-800 rounded"></div>
          <div className="flex space-x-4">
            <div className="h-8 w-20 bg-gray-800 rounded"></div>
          </div>
        </div>
        
        {/* Profile content placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar placeholder */}
          <div className="md:col-span-1 h-[80vh] bg-gray-800 rounded-lg"></div>
          
          {/* Main content placeholder */}
          <div className="md:col-span-3 h-[80vh] bg-gray-800 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
