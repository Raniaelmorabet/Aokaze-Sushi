"use client";

import {
  Flame,
  Leaf,
  X,
  Wheat,
  CheckCircle,
  Zap,
  Plus,
  Trash2,
  AlertTriangle,
  Camera,
} from "lucide-react";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { Category, MenuItem } from "@/types";

interface EditItemMenuProps {
  setShowEditItemModal: (show: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
  formData: MenuItem | null;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  setFormData: React.Dispatch<React.SetStateAction<MenuItem | null>>;
  categories: Category[];
  handleDeleteItem: (item: MenuItem) => void;
  selectedItem: MenuItem;
}

const EditItemMenu = ({
  setShowEditItemModal,
  handleSubmit,
  formData,
  handleChange,
  setFormData,
  categories,
  handleDeleteItem,
  selectedItem,
}: EditItemMenuProps) => {
  // Add null checks and default values
  const [ingredients, setIngredients] = useState<string[]>(
    formData?.ingredients || []
  );
  const [allergens, setAllergens] = useState<string[]>(
    formData?.allergens || []
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [localImage, setLocalImage] = useState<string>(() => {
    // Handle different types of image property in formData
    if (!formData?.image) return "/placeholder.svg";
    if (typeof formData.image === "string") return formData.image;
    if (formData.image instanceof File) {
      // For File objects, we could return a placeholder until it's processed
      return "/placeholder.svg";
    }
    // Default fallback
    return "/placeholder.svg";
  });

  // Add useEffect to handle initial form data setup
  useEffect(() => {
    if (formData) {
      setIngredients(formData.ingredients || []);
      setAllergens(formData.allergens || []);

      // Properly handle the image based on its type
      if (formData.image) {
        if (typeof formData.image === "string") {
          setLocalImage(formData.image);
        } else if (formData.image instanceof File) {
          // For File objects, we could generate a preview URL
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              setLocalImage(event.target.result as string);
            }
          };
          reader.readAsDataURL(formData.image);
        }
      } else {
        setLocalImage("/placeholder.svg");
      }
    }
  }, [formData]);

  // Add null checks for formData in validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData?.name?.trim()) newErrors.name = "Item name is required";
    if (!formData?.description?.trim())
      newErrors.description = "Description is required";
    if (!formData?.price || formData.price <= 0)
      newErrors.price = "Valid price required";
    if (!formData?.category) newErrors.category = "Category is required";
    if (ingredients.length === 0)
      newErrors.ingredients = "At least one ingredient required";
    if (allergens.length === 0)
      newErrors.allergens = "At least one allergen required";
    if (!formData?.image) newErrors.image = "Image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update remaining functions with null checks
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    if (validateForm()) {
      handleSubmit(e);
    } else {
      modalRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Update ingredient handlers
  const handleAddIngredient = () => setIngredients([...ingredients, ""]);
  const handleRemoveIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
    formData && setFormData({ ...formData, ingredients: newIngredients });
  };

  // Allergens handlers
  const handleAddAllergen = () => setAllergens([...allergens, ""]);
  const handleRemoveAllergen = (index: number) => {
    const newAllergens = allergens.filter((_, i) => i !== index);
    setAllergens(newAllergens);
    setFormData({ ...formData, allergens: newAllergens });
  };
  const handleAllergenChange = (index: number, value: string) => {
    const newAllergens = [...allergens];
    newAllergens[index] = value;
    setAllergens(newAllergens);
    setFormData({ ...formData, allergens: newAllergens });
  };

  // Image handling
// Update the handleImageUpload function
const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const dataUrl = event.target.result as string;
        setLocalImage(dataUrl);
        // Update parent formData immediately with the File object
        setFormData(prev => ({
          ...prev!,
          image: file  // Store the File object directly
        }));
      }
    };
    reader.readAsDataURL(file);
  }
};

  // Category handling
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = categories.find((cat) => cat._id === e.target.value);
    if (category) {
      setFormData({ ...formData, category });
      setErrors((prev) => ({ ...prev, category: undefined }));
    }
  };

  // Price validation
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setFormData({ ...formData, price: value });
    if (value > 0) setErrors((prev) => ({ ...prev, price: undefined }));
  };

  // Error clearing
  useEffect(() => {
    const clearErrors = () => {
      if (formData.name.trim() && errors.name)
        setErrors((prev) => ({ ...prev, name: undefined }));
      if (formData.description.trim() && errors.description)
        setErrors((prev) => ({ ...prev, description: undefined }));
      if (ingredients.length > 0 && errors.ingredients)
        setErrors((prev) => ({ ...prev, ingredients: undefined }));
      if (allergens.length > 0 && errors.allergens)
        setErrors((prev) => ({ ...prev, allergens: undefined }));
    };
    clearErrors();
  }, [formData, ingredients, allergens, errors]);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="bg-[#1E1E1E] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-[#1E1E1E] z-10">
          <h3 className="text-xl font-bold">Edit Menu Item</h3>
          <button onClick={() => setShowEditItemModal(false)}>
            <X size={24} />
          </button>
        </div>

        {Object.keys(errors).length > 0 && (
          <div className="p-4">
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg mb-6">
              <AlertTriangle size={24} className="text-red-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-400 mb-1">
                  Fix these errors:
                </p>
                <ul className="text-sm text-red-400 list-disc list-inside">
                  {Object.entries(errors).map(([key, value]) => (
                    <li key={key}>{value}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Item Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:ring-1 ${
                  errors.name
                    ? "focus:ring-red-500 border-red-500/50"
                    : "focus:ring-orange-500"
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Price *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handlePriceChange}
                step="0.01"
                min="0"
                className={`w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:ring-1 ${
                  errors.price
                    ? "focus:ring-red-500 border-red-500/50"
                    : "focus:ring-orange-500"
                }`}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-500">{errors.price}</p>
              )}
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg min-h-[100px] focus:ring-1 ${
                errors.description
                  ? "focus:ring-red-500 border-red-500/50"
                  : "focus:ring-orange-500"
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-1">
              Category *
            </label>
            <select
              value={(formData.category as Category)?._id || ""}
              onChange={handleCategoryChange}
              className={`w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:ring-1 ${
                errors.category
                  ? "focus:ring-red-500 border-red-500/50"
                  : "focus:ring-orange-500"
              }`}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">{errors.category}</p>
            )}
          </div>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm text-gray-400">
                Ingredients *
              </label>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="text-orange-500 hover:text-orange-600 flex items-center gap-1 text-sm"
              >
                <Plus size={16} /> Add Ingredient
              </button>
            </div>
            <div className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) =>
                      handleIngredientChange(index, e.target.value)
                    }
                    className={`flex-1 bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:ring-1 ${
                      errors.ingredients
                        ? "focus:ring-red-500 border-red-500/50"
                        : "focus:ring-orange-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(index)}
                    className="text-gray-400 hover:text-gray-200 p-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {errors.ingredients && (
                <p className="text-sm text-red-500">{errors.ingredients}</p>
              )}
            </div>
          </div>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm text-gray-400">Allergens *</label>
              <button
                type="button"
                onClick={handleAddAllergen}
                className="text-orange-500 hover:text-orange-600 flex items-center gap-1 text-sm"
              >
                <Plus size={16} /> Add Allergen
              </button>
            </div>
            <div className="space-y-2">
              {allergens.map((allergen, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={allergen}
                    onChange={(e) =>
                      handleAllergenChange(index, e.target.value)
                    }
                    className={`flex-1 bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:ring-1 ${
                      errors.allergens
                        ? "focus:ring-red-500 border-red-500/50"
                        : "focus:ring-orange-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveAllergen(index)}
                    className="text-gray-400 hover:text-gray-200 p-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {errors.allergens && (
                <p className="text-sm text-red-500">{errors.allergens}</p>
              )}
            </div>
          </div>
          // components/modals/edit-item-menu.tsx
          {/* Image Preview Section */}
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-1">
              Item Image *
            </label>
            <div className="flex flex-col gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`w-full bg-[#2a2a2a] hover:bg-[#333] text-white px-4 py-2 rounded-lg ${
                  errors.image ? "border border-red-500/50" : ""
                }`}
              >
                {localImage ? "Change Image" : "Upload Image"}
              </button>
              <div className="relative h-40 rounded-lg overflow-hidden mt-2">
                {localImage ? (
                  <Image
                    src={localImage}
                    alt="Preview"
                    fill
                    className="object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <Camera className="text-gray-400" size={40} />
                  </div>
                )}
              </div>
              {errors.image && (
                <p className="text-sm text-red-500">{errors.image}</p>
              )}
            </div>
          </div>
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-sm text-gray-400">
                Dietary Properties
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isVegetarian"
                  checked={formData.isVegetarian}
                  onChange={handleChange}
                  className="w-4 h-4 accent-orange-500"
                />
                <Leaf size={16} className="text-green-500" />
                <span>Vegetarian</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isGlutenFree"
                  checked={formData.isGlutenFree}
                  onChange={handleChange}
                  className="w-4 h-4 accent-orange-500"
                />
                <Wheat size={16} className="text-amber-500" />
                <span>Gluten Free</span>
              </label>
            </div>

            <div className="space-y-3">
              <label className="text-sm text-gray-400">Item Status</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                  className="w-4 h-4 accent-orange-500"
                />
                <CheckCircle size={16} className="text-blue-500" />
                <span>Available</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="w-4 h-4 accent-orange-500"
                />
                <Zap size={16} className="text-yellow-500" />
                <span>Featured</span>
              </label>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex justify-between">
            <button
              type="button"
              onClick={() => handleDeleteItem(selectedItem)}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-500 px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Trash2 size={18} />
              Delete Item
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowEditItemModal(false)}
                className="bg-[#2a2a2a] hover:bg-[#333] text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemMenu;
