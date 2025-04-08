"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Award } from "lucide-react"

export function ChefCard({ chef, index }) {
  return (
    <motion.div
      className="bg-[#1E1E1E] rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      whileHover={{ y: -10 }}
    >
      <div className="relative h-80 overflow-hidden">
        <Image
          src={chef.image || "/placeholder.svg"}
          alt={chef.name}
          width={400}
          height={600}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold">{chef.name}</h3>
          <p className="text-orange-500">{chef.title}</p>
        </div>
      </div>

      <div className="p-4">
        <p className="text-gray-300 text-sm mb-4">{chef.bio}</p>

        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Specialties:</p>
          <div className="flex flex-wrap gap-2">
            {chef.specialties.map((specialty, i) => (
              <span key={i} className="bg-[#2a2a2a] text-xs px-2 py-1 rounded-full">
                {specialty}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Awards:</p>
          <div className="space-y-2">
            {chef.awards.map((award, i) => (
              <div key={i} className="flex items-center gap-2">
                <Award size={14} className="text-yellow-400" />
                <span className="text-xs">{award}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
