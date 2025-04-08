"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Clock, Copy } from "lucide-react"
import { useState } from "react"

export function PromotionCard({ promotion }) {
  const [copied, setCopied] = useState(false)

  const copyCode = () => {
    navigator.clipboard.writeText(promotion.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 bg-[#1E1E1E] rounded-xl overflow-hidden p-6">
      <div className="relative h-64 md:h-auto rounded-lg overflow-hidden">
        <Image src={promotion.image || "/placeholder.svg"} alt={promotion.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full font-bold">
          {promotion.discount}
        </div>
      </div>

      <div className="flex flex-col justify-center">
        <h3 className="text-2xl font-bold mb-2">{promotion.title}</h3>
        <p className="text-gray-300 mb-4">{promotion.description}</p>

        <div className="flex items-center gap-2 mb-4">
          <Clock size={18} className="text-gray-400" />
          <span className="text-gray-300">{promotion.validUntil}</span>
        </div>

        <div className="relative">
          <div className="bg-[#2a2a2a] p-3 rounded-lg flex justify-between items-center">
            <span className="font-mono font-bold">{promotion.code}</span>
            <button className="text-orange-500 hover:text-orange-400 transition-colors" onClick={copyCode}>
              <Copy size={18} />
            </button>
          </div>

          {copied && (
            <motion.div
              className="absolute -top-8 left-0 right-0 bg-green-500 text-white text-center py-1 rounded-md text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              Code copied!
            </motion.div>
          )}
        </div>

        <button className="mt-6 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg transition-colors">
          Redeem Now
        </button>
      </div>
    </div>
  )
}
