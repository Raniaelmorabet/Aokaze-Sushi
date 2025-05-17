"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
      <div className="text-center">
        <motion.div
          className="w-16 h-16 rounded-full border-4 border-t-orange-500 border-r-orange-500 border-b-orange-300 border-l-orange-200 mx-auto mb-6"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <h3 className="text-xl font-semibold mb-2">Loading profile...</h3>
        <p className="text-gray-400">Please wait while we load your profile data</p>
      </div>
    </div>
  );
}
