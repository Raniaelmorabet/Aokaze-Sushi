"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Minus, Check } from "lucide-react"

export function FoodCustomizer({ item, onAddToCart, onCancel }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedOptions, setSelectedOptions] = useState({})
  const [specialInstructions, setSpecialInstructions] = useState("")

  const increaseQuantity = () => setQuantity(quantity + 1)
  const decreaseQuantity = () => quantity > 1 && setQuantity(quantity - 1)

  const toggleOption = (category, option) => {
    setSelectedOptions((prev) => {
      const newOptions = { ...prev }

      if (!newOptions[category]) {
        newOptions[category] = [option]
      } else if (newOptions[category].includes(option)) {
        newOptions[category] = newOptions[category].filter((o) => o !== option)
      } else {
        newOptions[category] = [...newOptions[category], option]
      }

      return newOptions
    })
  }

  const calculateTotal = () => {
    const total = item.price * quantity

    // Add option prices if needed

    return total.toFixed(2)
  }

  const handleAddToCart = () => {
    const customizedItem = {
      ...item,
      quantity,
      selectedOptions,
      specialInstructions,
      totalPrice: calculateTotal(),
    }

    onAddToCart(customizedItem)
  }

  // Example customization options
  const customizationOptions = {
    "Spice Level": ["No Spice", "Mild", "Medium", "Hot", "Extra Hot"],
    "Add-ons": ["Extra Wasabi", "Extra Ginger", "Soy Sauce", "Spicy Mayo"],
    "Dietary Preferences": ["Gluten-Free", "No Shellfish", "Low Sodium"],
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <div className="relative h-64 rounded-lg overflow-hidden mb-4">
          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
        </div>

        <h3 className="text-xl font-bold mb-1">{item.name}</h3>
        <p className="text-gray-400 text-sm mb-4">{item.description}</p>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={decreaseQuantity}
              className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center"
            >
              <Minus size={16} />
            </button>
            <span className="text-lg font-medium">{quantity}</span>
            <button
              onClick={increaseQuantity}
              className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center"
            >
              <Plus size={16} />
            </button>
          </div>
          <p className="text-xl font-bold text-orange-500">${calculateTotal()}</p>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-medium mb-4">Customize Your Order</h4>

        {Object.entries(customizationOptions).map(([category, options]) => (
          <div key={category} className="mb-4">
            <p className="text-sm font-medium mb-2">{category}</p>
            <div className="flex flex-wrap gap-2">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => toggleOption(category, option)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedOptions[category]?.includes(option)
                      ? "bg-orange-500 text-white"
                      : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Special Instructions</label>
          <textarea
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="Any special requests?"
            className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 min-h-[80px]"
          ></textarea>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 bg-[#2a2a2a] hover:bg-[#333] text-white py-3 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Check size={18} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
