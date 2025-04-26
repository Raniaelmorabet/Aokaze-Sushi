"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronDown, ChevronUp, Clock, Flame } from "lucide-react"

export function SpecialtyDish({ dish, index, onAddToCart }) {
  const [showIngredients, setShowIngredients] = useState(false)

  // Function to clean and format ingredients
  const cleanIngredients = () => {
    try {
      if (!dish.ingredients) return []
      
      // If it's already a clean array, return it
      if (Array.isArray(dish.ingredients)) {
        return dish.ingredients.map(ing => 
          typeof ing === 'string' ? ing.replace(/["[\]]/g, '').trim() : String(ing)
        )
      }
      
      // Handle the case where we have an array of quoted strings
      if (Array.isArray(dish.ingredients)) {
        return dish.ingredients.map(ing => 
          String(ing).replace(/["[\]]/g, '').trim()
        )
      }
      
      // Handle string input (could be JSON string or comma-separated)
      const str = String(dish.ingredients).trim()
      if (str.startsWith('[')) {
        try {
          const parsed = JSON.parse(str.replace(/(\r\n|\n|\r)/gm, ""))
          return Array.isArray(parsed) 
            ? parsed.map(i => String(i).replace(/["[\]]/g, '').trim())
            : [String(parsed).replace(/["[\]]/g, '').trim()]
        } catch {
          return str.replace(/["[\]]/g, '').split(',').map(i => i.trim())
        }
      }
      
      // Handle comma-separated string
      return str.replace(/["[\]]/g, '').split(',').map(i => i.trim())
    } catch (e) {
      console.error("Error cleaning ingredients:", e)
      return []
    }
  }

  const ingredients = cleanIngredients()

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
          priority={index < 3}
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
                  fill={star <= Math.floor(dish.rate) ? "#F97316" : "none"}
                  stroke="#F97316"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            <span className="text-orange-500">{dish.rate}</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <p className="text-gray-300 text-sm mb-4">{dish.description}</p>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-400" />
            <span className="text-sm text-gray-400">{dish.prepTime} minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame size={16} className="text-[#F05B29]" />
            <span className="text-sm text-gray-400">{dish.calories} cal</span>
          </div>
        </div>

        <button
          className="w-full py-2 px-4 bg-[#2a2a2a] hover:bg-[#333] rounded-lg mb-4 flex items-center justify-between transition-colors"
          onClick={() => setShowIngredients(!showIngredients)}
          aria-expanded={showIngredients}
          aria-controls={`ingredients-${index}`}
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
            id={`ingredients-${index}`}
          >
            {ingredients.length > 0 ? (
              <ul className="space-y-2 text-sm text-gray-400">
                {ingredients.map((ingredient, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-sm">No ingredients listed</p>
            )}
          </motion.div>
        )}

        <div className="flex justify-between items-center">
          <p className="text-xl font-bold">${dish.price.toFixed(2)}</p>
          <button
            onClick={() => onAddToCart(dish)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
            aria-label={`Add ${dish.title} to cart`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  )
}