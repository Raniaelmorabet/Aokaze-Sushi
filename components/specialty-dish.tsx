"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronDown, ChevronUp, Clock, Flame } from "lucide-react"

export function SpecialtyDish({ dish, index, onAddToCart }) {
  const [showIngredients, setShowIngredients] = useState(false)

  return (
    <motion.div
      className="bg-[#1E1E1E] rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      whileHover={{ y: -10 }}
    >
      <div className="relative h-64 overflow-hidden">
        <Image
          src={dish.image || "/placeholder.svg"}
          alt={dish.name}
          width={600}
          height={400}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold">{dish.name}</h3>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill={star <= Math.floor(dish.rating) ? "#F97316" : "none"}
                  stroke="#F97316"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            <span className="text-orange-500">{dish.rating}</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <p className="text-gray-300 text-sm mb-4">{dish.description}</p>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-400" />
            <span className="text-sm text-gray-400">{dish.preparationTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame size={16} className="text-[#F05B29]" />
            <span className="text-sm text-gray-400">{dish.calories} cal</span>
          </div>
        </div>

        <button
          className="w-full py-2 px-4 bg-[#2a2a2a] hover:bg-[#333] rounded-lg mb-4 flex items-center justify-between transition-colors"
          onClick={() => setShowIngredients(!showIngredients)}
        >
          <span>Ingredients</span>
          {showIngredients ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showIngredients && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4"
          >
            <ul className="space-y-2 text-sm text-gray-400">
              {dish.ingredients.map((ingredient, i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        <div className="flex justify-between items-center">
          <p className="text-xl font-bold">${dish.price.toFixed(2)}</p>
          <button
            onClick={() => onAddToCart(dish)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  )
}
