"use client"

import { useState } from "react"
import { Search, Plus, Edit, Trash2, X, Camera, Flame, Leaf, Award, AlertTriangle } from "lucide-react"
import Image from "next/image"

export default function MenuManagementPage() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [showAddItemModal, setShowAddItemModal] = useState(false)
  const [showEditItemModal, setShowEditItemModal] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "sushi",
    image: "",
    spicy: false,
    vegetarian: false,
    popular: false,
  })
  const [itemAvailable, setItemAvailable] = useState(true)

  // Mock data
  const menuItems = [
    {
      id: 1,
      name: "Salmon Nigiri",
      description: "Fresh salmon over seasoned rice",
      price: 8.5,
      category: "sushi",
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=600&auto=format&fit=crop",
      rating: 5.0,
      spicy: false,
      vegetarian: false,
      popular: true,
      available: true,
    },
    {
      id: 2,
      name: "Dragon Roll",
      description: "Eel and cucumber inside, avocado and tobiko on top",
      price: 12.95,
      category: "sushi",
      image: "https://images.unsplash.com/photo-1617196034183-421b4917c92d?q=80&w=600&auto=format&fit=crop",
      rating: 4.9,
      spicy: false,
      vegetarian: false,
      popular: true,
      available: true,
    },
    {
      id: 3,
      name: "Edamame",
      description: "Steamed young soybeans lightly seasoned with sea salt",
      price: 4.5,
      category: "appetizer",
      image: "https://images.unsplash.com/photo-1615361200141-f45625a9296d?q=80&w=600&auto=format&fit=crop",
      rating: 4.8,
      spicy: false,
      vegetarian: true,
      popular: false,
      available: true,
    },
    {
      id: 4,
      name: "Gyoza",
      description: "Pan-fried dumplings filled with seasoned ground pork and vegetables",
      price: 6.75,
      category: "appetizer",
      image: "https://images.unsplash.com/photo-1625938145744-e380515399b7?q=80&w=600&auto=format&fit=crop",
      rating: 4.9,
      spicy: false,
      vegetarian: false,
      popular: true,
      available: true,
    },
    {
      id: 5,
      name: "Sake",
      description: "Traditional Japanese rice wine served warm or cold",
      price: 7.5,
      category: "drink",
      image: "https://images.unsplash.com/photo-1627517511589-b920f2c1a30b?q=80&w=600&auto=format&fit=crop",
      rating: 4.8,
      alcoholic: true,
      popular: true,
      available: true,
    },
    {
      id: 6,
      name: "Matcha Tea",
      description: "Premium Japanese green tea with a rich, earthy flavor",
      price: 4.25,
      category: "drink",
      image: "https://images.unsplash.com/photo-1563929084-73cd4bbe2ddc?q=80&w=600&auto=format&fit=crop",
      rating: 4.9,
      alcoholic: false,
      popular: true,
      available: false,
    },
    {
      id: 7,
      name: "Salmon Bento",
      description: "Grilled salmon with rice, miso soup, salad, and gyoza",
      price: 15.95,
      category: "bento",
      image: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?q=80&w=600&auto=format&fit=crop",
      rating: 4.9,
      spicy: false,
      vegetarian: false,
      popular: true,
      available: true,
    },
    {
      id: 8,
      name: "Vegetable Bento",
      description: "Assorted vegetable tempura with rice, miso soup, and salad",
      price: 13.75,
      category: "bento",
      image: "https://images.unsplash.com/photo-1546069901-5ec6a79120b0?q=80&w=600&auto=format&fit=crop",
      rating: 4.7,
      spicy: false,
      vegetarian: true,
      popular: false,
      available: true,
    },
  ]

  const filteredItems = menuItems.filter((item) => {
    if (activeCategory !== "all" && item.category !== activeCategory) {
      return false
    }
    return true
  })

  const handleAddItem = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "sushi",
      image: "",
      spicy: false,
      vegetarian: false,
      popular: false,
    })
    setShowAddItemModal(true)
  }

  const handleEditItem = (item) => {
    setSelectedItem(item)
    setItemAvailable(item.available)
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image,
      spicy: item.spicy || false,
      vegetarian: item.vegetarian || false,
      popular: item.popular || false,
    })
    setShowEditItemModal(true)
  }

  const handleDeleteItem = (item) => {
    setSelectedItem(item)
    setShowDeleteConfirmation(true)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real application, this would save to a database
    console.log("Saving item:", formData)

    // Close the modal
    setShowAddItemModal(false)
    setShowEditItemModal(false)
  }

  const confirmDelete = () => {
    // In a real application, this would delete from a database
    console.log("Deleting item:", selectedItem)

    // Close the modal
    setShowDeleteConfirmation(false)
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Menu Management</h1>
          <p className="text-gray-400">Add, edit, and manage your menu items</p>
        </div>

        <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search menu items..."
              className="bg-[#1E1E1E] text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 w-full md:w-64"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>

          <button
            onClick={handleAddItem}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={18} />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      <div className="bg-[#1E1E1E] rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-4 border-b border-gray-800 flex flex-wrap gap-4">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-lg text-sm ${
              activeCategory === "all" ? "bg-orange-500 text-white" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
            }`}
          >
            All Categories
          </button>
          <button
            onClick={() => setActiveCategory("appetizer")}
            className={`px-4 py-2 rounded-lg text-sm ${
              activeCategory === "appetizer" ? "bg-orange-500 text-white" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
            }`}
          >
            Appetizers
          </button>
          <button
            onClick={() => setActiveCategory("sushi")}
            className={`px-4 py-2 rounded-lg text-sm ${
              activeCategory === "sushi" ? "bg-orange-500 text-white" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
            }`}
          >
            Sushi
          </button>
          <button
            onClick={() => setActiveCategory("drink")}
            className={`px-4 py-2 rounded-lg text-sm ${
              activeCategory === "drink" ? "bg-orange-500 text-white" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
            }`}
          >
            Drinks
          </button>
          <button
            onClick={() => setActiveCategory("bento")}
            className={`px-4 py-2 rounded-lg text-sm ${
              activeCategory === "bento" ? "bg-orange-500 text-white" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
            }`}
          >
            Bento
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-[#2a2a2a] rounded-xl overflow-hidden">
                <div className="relative h-48">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                  {!item.available && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Unavailable
                      </span>
                    </div>
                  )}

                  <div className="absolute top-2 left-2 flex gap-1">
                    {item.popular && (
                      <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Award size={12} />
                        <span>Popular</span>
                      </span>
                    )}

                    {item.spicy && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Flame size={12} />
                        <span>Spicy</span>
                      </span>
                    )}

                    {item.vegetarian && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Leaf size={12} />
                        <span>Veg</span>
                      </span>
                    )}
                  </div>

                  <div className="absolute top-2 right-2 flex">
                    <button
                      onClick={() => handleEditItem(item)}
                      className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-lg font-bold text-orange-500">${item.price.toFixed(2)}</p>
                  </div>

                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">{item.description}</p>

                  <div className="flex justify-between items-center">
                    <span className="text-xs px-2 py-1 bg-[#333] rounded-full">
                      {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="p-2 bg-[#333] hover:bg-[#444] rounded-lg transition-colors"
                        title="Edit Item"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item)}
                        className="p-2 bg-[#333] hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No menu items found in this category.</p>
              <button
                onClick={handleAddItem}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
              >
                <Plus size={18} />
                <span>Add New Item</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E1E1E] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-[#1E1E1E] z-10">
              <h3 className="text-xl font-bold">Add Menu Item</h3>
              <button onClick={() => setShowAddItemModal(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Item Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 min-h-[100px]"
                  required
                ></textarea>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                  required
                >
                  <option value="appetizer">Appetizer</option>
                  <option value="sushi">Sushi</option>
                  <option value="drink">Drink</option>
                  <option value="bento">Bento</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-1">Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="flex-1 bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                    placeholder="https://example.com/image.jpg"
                  />
                  <button
                    type="button"
                    className="bg-[#2a2a2a] hover:bg-[#333] text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Camera size={18} />
                  </button>
                </div>

                {formData.image && (
                  <div className="mt-2 relative h-40 rounded-lg overflow-hidden">
                    <Image src={formData.image || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                  </div>
                )}
              </div>

              <div className="mb-6 flex flex-col gap-3">
                <label className="text-sm text-gray-400">Item Properties</label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="spicy"
                    checked={formData.spicy}
                    onChange={handleChange}
                    className="w-4 h-4 accent-orange-500"
                  />
                  <Flame size={16} className="text-red-500" />
                  <span>Spicy</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="vegetarian"
                    checked={formData.vegetarian}
                    onChange={handleChange}
                    className="w-4 h-4 accent-orange-500"
                  />
                  <Leaf size={16} className="text-green-500" />
                  <span>Vegetarian</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="popular"
                    checked={formData.popular}
                    onChange={handleChange}
                    className="w-4 h-4 accent-orange-500"
                  />
                  <Award size={16} className="text-orange-500" />
                  <span>Popular</span>
                </label>
              </div>

              <div className="border-t border-gray-800 pt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddItemModal(false)}
                  className="bg-[#2a2a2a] hover:bg-[#333] text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {showEditItemModal && selectedItem && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E1E1E] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-[#1E1E1E] z-10">
              <h3 className="text-xl font-bold">Edit Menu Item</h3>
              <button onClick={() => setShowEditItemModal(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Item Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 min-h-[100px]"
                  required
                ></textarea>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                  required
                >
                  <option value="appetizer">Appetizer</option>
                  <option value="sushi">Sushi</option>
                  <option value="drink">Drink</option>
                  <option value="bento">Bento</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-1">Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="flex-1 bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                    placeholder="https://example.com/image.jpg"
                  />
                  <button
                    type="button"
                    className="bg-[#2a2a2a] hover:bg-[#333] text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Camera size={18} />
                  </button>
                </div>

                {formData.image && (
                  <div className="mt-2 relative h-40 rounded-lg overflow-hidden">
                    <Image src={formData.image || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                  </div>
                )}
              </div>

              <div className="mb-6 flex flex-col gap-3">
                <label className="text-sm text-gray-400">Item Properties</label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="spicy"
                    checked={formData.spicy}
                    onChange={handleChange}
                    className="w-4 h-4 accent-orange-500"
                  />
                  <Flame size={16} className="text-red-500" />
                  <span>Spicy</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="vegetarian"
                    checked={formData.vegetarian}
                    onChange={handleChange}
                    className="w-4 h-4 accent-orange-500"
                  />
                  <Leaf size={16} className="text-green-500" />
                  <span>Vegetarian</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="popular"
                    checked={formData.popular}
                    onChange={handleChange}
                    className="w-4 h-4 accent-orange-500"
                  />
                  <Award size={16} className="text-orange-500" />
                  <span>Popular</span>
                </label>
              </div>

              <div className="mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="available"
                    checked={itemAvailable}
                    onChange={() => setItemAvailable(!itemAvailable)}
                    className="w-4 h-4 accent-orange-500"
                  />
                  <span>Item Available</span>
                </label>
                <p className="text-xs text-gray-400 mt-1">
                  Unavailable items will be shown as out of stock on the menu
                </p>
              </div>

              <div className="border-t border-gray-800 pt-6 flex justify-between">
                <button
                  type="button"
                  onClick={() => handleDeleteItem(selectedItem)}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-500 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Trash2 size={18} />
                  Delete Item
                </button>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowEditItemModal(false)}
                    className="bg-[#2a2a2a] hover:bg-[#333] text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && selectedItem && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E1E1E] rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold">Confirm Delete</h3>
              <button onClick={() => setShowDeleteConfirmation(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={selectedItem.image || "/placeholder.svg"}
                    alt={selectedItem.name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{selectedItem.name}</p>
                  <p className="text-sm text-gray-400">${selectedItem.price.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg mb-6">
                <AlertTriangle size={24} className="text-red-500 flex-shrink-0" />
                <p className="text-sm">Are you sure you want to delete this item? This action cannot be undone.</p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirmation(false)}
                  className="bg-[#2a2a2a] hover:bg-[#333] text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
