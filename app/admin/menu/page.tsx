"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Camera,
  Flame,
  Leaf,
  Award,
  AlertTriangle,
  Slash,
} from "lucide-react";
import Image from "next/image";
import { categoryAPI, menuAPI } from "@/utils/api";
import AddItemMenu from "@/components/modals/add-item-menu";
import { set } from "date-fns";
import EditItemMenu from "@/components/modals/edit-item-menu";
import { AnimatePresence, motion } from "framer-motion";

export default function MenuManagementPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingMenuItems, setLoadingMenuItems] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [alertStatus, setAlertStatus] = useState({});
  const [isExiting, setIsExiting] = useState(false);
  const [menu, setMenu] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "sushi",
    image: "",
    ingredients: [] as string[],
    allergens: [] as string[],
    spicyLevel: 0,
    isVegetarian: false,
    isGlutenFree: false,
    isAvailable: true,
    isFeatured: false,
  });
  const [itemAvailable, setItemAvailable] = useState(true);

  // Mock data
  const menuItems = [
    {
      id: 1,
      name: "Salmon Nigiri",
      description: "Fresh salmon over seasoned rice",
      price: 8.5,
      category: "sushi",
      image:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=600&auto=format&fit=crop",
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
      image:
        "https://images.unsplash.com/photo-1617196034183-421b4917c92d?q=80&w=600&auto=format&fit=crop",
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
      image:
        "https://images.unsplash.com/photo-1615361200141-f45625a9296d?q=80&w=600&auto=format&fit=crop",
      rating: 4.8,
      spicy: false,
      vegetarian: true,
      popular: false,
      available: true,
    },
    {
      id: 4,
      name: "Gyoza",
      description:
        "Pan-fried dumplings filled with seasoned ground pork and vegetables",
      price: 6.75,
      category: "appetizer",
      image:
        "https://images.unsplash.com/photo-1625938145744-e380515399b7?q=80&w=600&auto=format&fit=crop",
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
      image:
        "https://images.unsplash.com/photo-1627517511589-b920f2c1a30b?q=80&w=600&auto=format&fit=crop",
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
      image:
        "https://images.unsplash.com/photo-1563929084-73cd4bbe2ddc?q=80&w=600&auto=format&fit=crop",
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
      image:
        "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?q=80&w=600&auto=format&fit=crop",
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
      image:
        "https://images.unsplash.com/photo-1546069901-5ec6a79120b0?q=80&w=600&auto=format&fit=crop",
      rating: 4.7,
      spicy: false,
      vegetarian: true,
      popular: false,
      available: true,
    },
  ];

  const handleAddItem = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      category: "sushi",
      image: "",
      ingredients: [] as string[],
      allergens: [] as string[],
      spicyLevel: 0,
      isVegetarian: false,
      isGlutenFree: false,
      isAvailable: true,
      isFeatured: false,
    });
    setShowAddItemModal(true);
  };

  const handleEditItem = (item: any) => {
    setFormData({
      _id: item._id,
      name: item.name || "",
      description: item.description || "",
      price: item.price || 0,
      category: item.category || categories[0]?._id || "",
      image: item.image || "",
      ingredients: item.ingredients || [],
      allergens: item.allergens || [],
      spicyLevel: item.spicyLevel || 0,
      isVegetarian: item.isVegetarian || false,
      isGlutenFree: item.isGlutenFree || false,
      isAvailable: item.isAvailable ?? true,
      isFeatured: item.isFeatured || false,
    });
    setShowEditItemModal(true);
  };

  const editItem = async (data) => {
    try {
      const formData = new FormData();
      console.log("Editing item:", data);
      
      // Append basic fields
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      formData.append("category", data.category._id);
      formData.append("spicyLevel", data.spicyLevel.toString());
      formData.append("isVegetarian", data.isVegetarian.toString());
      formData.append("isGlutenFree", data.isGlutenFree.toString());
      formData.append("isAvailable", data.isAvailable.toString());
      formData.append("isFeatured", data.isFeatured.toString());
  
      // Append arrays
      data.ingredients.forEach(ingredient => 
        formData.append("ingredients", ingredient)
      );
      data.allergens.forEach(allergen => 
        formData.append("allergens", allergen)
      );
  
      // Handle image
      if (data.image instanceof File) {
        formData.append("image", data.image);
      }
      console.log("📝 FormData content:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      // Send request
      const response = await menuAPI.updateItem(data._id, formData);
      console.log("Item updated:", response);
      
  
      // Update state
      setMenu(prev => prev.map(item => 
        item._id === data._id ? response.data : item
      ));
  
      setAlertStatus({
        type: true,
        message: "Item updated successfully"
      });
  
    } catch (error) {
      setAlertStatus({
        type: false,
        message: error.response?.data?.message || "Failed to update item"
      });
    }
  };
  
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setShowEditItemModal(false);
    await editItem({ ...formData, _id: selectedItem._id });
  };

  const handleDeleteItem = (item) => {
    setSelectedItem(item);
    setShowDeleteConfirmation(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev!,
      [name]: type === "checkbox" ? checked :
              name === "spicyLevel" ? parseInt(value, 10) :
              value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    // Call the createItem function with the form data
    createItem(formData);

    // Close the modal
    setShowAddItemModal(false);
  };

  const createItem = async (data) => {
    try {
      console.log("Creating item:", data);

      // Create FormData object
      const formData = new FormData();

      // Add text fields
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("category", data.category._id);

      // Add arrays
      if (data.ingredients?.length) {
        data.ingredients.forEach((ingredient) => {
          formData.append("ingredients", ingredient);
        });
      }

      if (data.allergens?.length) {
        data.allergens.forEach((allergen) => {
          formData.append("allergens", allergen);
        });
      }

      // Add boolean fields
      formData.append("isVegetarian", data.isVegetarian.toString());
      formData.append("isGlutenFree", data.isGlutenFree.toString());
      formData.append("isAvailable", data.isAvailable.toString());
      formData.append("isFeatured", data.isFeatured.toString());

      // Add spicy level
      if (data.spicyLevel !== undefined) {
        formData.append("spicyLevel", data.spicyLevel.toString());
      }

      // Handle the image
      if (data.image) {
        if (data.image instanceof File) {
          formData.append("image", data.image);
        } else if (
          typeof data.image === "string" &&
          data.image.startsWith("data:")
        ) {
          // Convert base64 to blob
          const response = await fetch(data.image);
          const blob = await response.blob();
          formData.append("image", blob, "menu-item-image.jpg");
        } else if (typeof data.image === "string") {
          formData.append("imageUrl", data.image);
        }
      }

      // Send the formData to the API
      const response = await menuAPI.createItem(formData);

      // Update the menu list with the new item
      setMenu((prevMenu) => [...prevMenu, response.data]);

      setAlertStatus({
        type: response.success,
        message: "Item created successfully",
      });

      return response;
    } catch (error) {
      console.error("Error creating item:", error);
      setAlertStatus({
        type: false,
        message: "Error creating item",
      });
      setTimeout(() => {
        setAlertStatus({});
      }, 3000);
      throw error;
    }
  };

  const confirmDelete = async () => {
    // In a real application, this would delete from a database
    try {
      await menuAPI.deleteItem(selectedItem._id);
      setMenu((prevMenu) =>
        prevMenu.filter((item) => item._id !== selectedItem._id)
      );
      setAlertStatus({
        type: true,
        message: "Item deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      setAlertStatus({
        type: false,
        message: "Error deleting item",
      });
    }
    // Close the modal
    setShowDeleteConfirmation(false);
  };

  const getCategories = async () => {
    setLoadingCategories(true);
    try {
      const data = await categoryAPI.getPaginatedCategories({
        page: 1,
        limit: 10,
        active: true,
      });
      setCategories(data.data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoadingCategories(false);
    }
  };

  const getMenuItems = async () => {
    setLoadingMenuItems(true);
    try {
      const data = await menuAPI.getItems({
        page: 1,
        limit: 10,
      });
      setMenu(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMenuItems(false);
    }
  };

  const getMenuItemsBySearch = async (search: string) => {
    setLoadingMenuItems(true);
    try {
      const data = await menuAPI.getItems({
        page: 1,
        limit: 10,
        search: search,
      });
      setMenu(data.data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoadingMenuItems(false);
    }
  };

  const getMenuItemsByCategory = async (id: any) => {
    setLoadingMenuItems(true);
    try {
      const data = await menuAPI.getItemsByCategory(id, {
        page: 1,
        limit: 10,
      });
      setMenu(data.data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoadingMenuItems(false);
    }
  };

  useEffect(() => {
    getCategories();
    getMenuItems();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (Object.keys(alertStatus).length > 0) {
      setIsExiting(false);
      timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          setAlertStatus({});
          setIsExiting(false);
        }, 300); // Match this with your slideOut animation duration
      }, 3000); // Display duration
    }
    return () => clearTimeout(timer);
  }, [alertStatus]);

  return (
    <div className="relative">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        {/* Title */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-3xl font-bold"
          >
            Menu Management
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 2 * 0.1 }}
            className="text-gray-400"
          >
            Add, edit, and manage your menu items
          </motion.p>
        </div>

        {/* Search and Add Item Button */}
        <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 3 * 0.1 }}
            className="relative"
          >
            <input
              type="text"
              placeholder="Search menu items..."
              onChange={(e) => getMenuItemsBySearch(e.target.value)}
              className="bg-[#1E1E1E] text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 w-full md:w-64"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </motion.div>

          <motion.button
            onClick={handleAddItem}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 4 * 0.1 }}
          >
            <Plus size={18} />
            <span>Add Item</span>
          </motion.button>
        </div>
      </div>

      <div className="bg-[#1E1E1E] rounded-xl shadow-md overflow-hidden mb-8">
        {/* Category nav */}
        <AnimatePresence mode="wait">
          <div className="flex justify-between items-center">
            <div className="p-4 border-b border-gray-800 flex flex-wrap gap-4">
              <motion.button
                onClick={() => {
                  getMenuItems();
                  setActiveCategory("all");
                }}
                className={`px-4 py-2 rounded-lg text-sm ${
                  activeCategory === "all"
                    ? "bg-orange-500 text-white"
                    : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                All Categories
              </motion.button>
              {categories.length > 0 &&
                categories.map((category, index) => (
                  <motion.button
                    key={category._id}
                    onClick={() => {
                      getMenuItemsByCategory(category._id);
                      setActiveCategory(category.name);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      activeCategory === category.name
                        ? "bg-orange-500 text-white"
                        : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {category.name}
                  </motion.button>
                ))}
            </div>
            {/* <motion.button
              // onClick={handleAddItem}
              className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors mr-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 6 * 0.1 }}
            >
              <Plus size={18} />
              <span>Add Category</span>
            </motion.button> */}
          </div>
        </AnimatePresence>

        {/* Menu List */}
        <AnimatePresence mode="wait">
          <div className="p-6">
            {loadingMenuItems ? (
              <div className="flex items-center justify-center w-full h-20 text-gray-400">
                Loading...
              </div>
            ) : menu.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {menu.map((item, index) => (
                  <motion.div
                    key={item._id}
                    className="bg-[#2a2a2a] rounded-xl overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="relative h-48">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                      {!item.isAvailable && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            Unavailable
                          </span>
                        </div>
                      )}

                      <div className="absolute top-2 left-2 flex gap-1">
                        {item.isFeatured && (
                          <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <Award size={12} />
                            <span>Feat</span>
                          </span>
                        )}

                        {item.spicyLevel > 0 && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <Flame size={12} />
                            <span>{item.spicyLevel}</span>
                          </span>
                        )}

                        {item.isVegetarian && (
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
                        <h3 className="font-medium">
                          {item.name.length > 12
                            ? item.name.slice(0, 12) + ".."
                            : item.name}
                        </h3>
                        <p className="text-lg font-bold text-orange-500">
                          ${Number(item.price).toFixed(2)}
                        </p>
                      </div>

                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="flex justify-between items-center">
                        <span className="text-xs px-2 py-1 bg-[#333] rounded-full">
                          {item.category.name.charAt(0).toUpperCase() +
                            item.category.name.slice(1)}
                        </span>

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              handleEditItem(item);
                              setSelectedItem(item);
                            }}
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
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">
                  No menu items found in this category.
                </p>
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
        </AnimatePresence>
      </div>

      {/* Add Item Modal */}
      {showAddItemModal && (
        <AddItemMenu
          formData={formData}
          setFormData={setFormData}
          setShowAddItemModal={setShowAddItemModal}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          categories={categories}
        />
      )}

      {/* Edit Item Modal */}
      {showEditItemModal && selectedItem && (
        <EditItemMenu
          setShowEditItemModal={setShowEditItemModal}
          handleSubmit={handleEditSubmit}
          handleChange={handleChange}
          categories={categories}
          handleDeleteItem={handleDeleteItem}
          selectedItem={selectedItem}
          formData={formData}
          setFormData={setFormData}
        />
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
                  <p className="text-sm text-gray-400">
                    ${selectedItem.price.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg mb-6">
                <AlertTriangle
                  size={24}
                  className="text-red-500 flex-shrink-0"
                />
                <p className="text-sm">
                  Are you sure you want to delete this item? This action cannot
                  be undone.
                </p>
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
      {/* Alert Status */}
      {Object.keys(alertStatus).length > 0 && (
        <div
          className={`fixed w-fit bottom-5 right-5 ${
            alertStatus.type
              ? "border-[#179417] bg-[#1b3f07]"
              : "border-[#941717] bg-[#3f0707]"
          } text-center py-4 px-4 border-2 rounded-xl text-gray-400 ${
            isExiting ? "animate-slideOut" : "animate-slideIn"
          }`}
        >
          {alertStatus.message}
        </div>
      )}
    </div>
  );
}
