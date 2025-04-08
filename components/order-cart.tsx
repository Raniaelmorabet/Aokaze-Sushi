"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Trash2, ArrowRight } from "lucide-react"
import Link from "next/link"

export function OrderCart({ items, onClose, onRemoveItem }) {
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + item.price * (item.quantity || 1), 0).toFixed(2)
  }

  const calculateTax = () => {
    return (calculateSubtotal() * 0.1).toFixed(2)
  }

  const calculateTotal = () => {
    return (Number.parseFloat(calculateSubtotal()) + Number.parseFloat(calculateTax())).toFixed(2)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h3 className="text-xl font-bold">Your Order</h3>
        <button onClick={onClose}>
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-[#2a2a2a] flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
            </div>
            <p className="text-gray-400">Your cart is empty</p>
            <button onClick={onClose} className="mt-4 text-orange-500 hover:text-orange-400 transition-colors">
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-[#2a2a2a] rounded-lg p-3 flex gap-3">
                <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{item.name}</h4>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <p className="text-sm text-gray-400 mb-2">Qty: {item.quantity || 1}</p>

                  {item.selectedOptions && Object.entries(item.selectedOptions).length > 0 && (
                    <div className="mb-2">
                      {Object.entries(item.selectedOptions).map(([category, options]) => (
                        <div key={category} className="text-xs text-gray-400">
                          <span className="font-medium">{category}:</span>{" "}
                          {Array.isArray(options) ? options.join(", ") : options}
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-orange-500 font-medium">${(item.price * (item.quantity || 1)).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="p-4 border-t border-gray-800">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Subtotal</span>
              <span>${calculateSubtotal()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Tax (10%)</span>
              <span>${calculateTax()}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${calculateTotal()}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            Checkout <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  )
}
