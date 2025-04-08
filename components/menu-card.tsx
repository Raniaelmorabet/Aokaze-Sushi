"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Star, ShoppingCart, Flame, Leaf, Award } from "lucide-react"
import { useLanguage } from "@/context/language-context"

export function MenuCard({ item, index, onAddToCart, onCustomize }) {
  const { t } = useLanguage()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="relative group perspective"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className="bg-[#1E1E1E] rounded-xl overflow-hidden h-full"
        animate={{
          rotateY: isHovered ? 10 : 0,
          scale: isHovered ? 1.03 : 1,
          z: isHovered ? 10 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="relative h-48 overflow-hidden">
          <Image
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            width={600}
            height={400}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {item.popular && (
            <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <Award size={12} />
              <span>{t("menu.popular")}</span>
            </div>
          )}

          {item.spicy && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <Flame size={12} />
              <span>{t("menu.spicy")}</span>
            </div>
          )}

          {item.vegetarian && (
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <Leaf size={12} />
              <span>{t("menu.vegetarian")}</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-lg">{item.name}</h3>
            <p className="text-xl font-bold text-orange-500">${item.price.toFixed(2)}</p>
          </div>

          <p className="text-gray-400 text-sm mt-1 line-clamp-2">{item.description}</p>

          <div className="flex mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${star <= Math.floor(item.rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-600 text-gray-600"}`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-400">{item.rating}</span>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              className="flex-1 bg-[#2a2a2a] hover:bg-[#333] text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
              onClick={onCustomize}
            >
              {t("menu.customize")}
            </button>
            <button
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
              onClick={onAddToCart}
            >
              <ShoppingCart size={16} />
              {t("menu.add")}
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute -bottom-2 left-1/2 w-[90%] h-[10px] bg-black/20 rounded-full blur-md -z-10"
        style={{ x: "-50%" }}
        animate={{
          width: isHovered ? "95%" : "90%",
          opacity: isHovered ? 0.3 : 0.2,
        }}
      />
    </motion.div>
  )
}
