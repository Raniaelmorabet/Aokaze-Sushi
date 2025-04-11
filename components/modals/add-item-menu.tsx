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
} from "lucide-react";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";

interface Category {
  _id: string;
  name: string;
  description?: string;
}

interface FormData {
  name: string;
  description: string;
  price: number;
  category: Category | string;
  ingredients: string[];
  allergens: string[];
  spicyLevel?: number;
  image?: string;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  isAvailable?: boolean;
  isFeatured?: boolean;
}

interface FormErrors {
  name?: string;
  description?: string;
  price?: string;
  category?: string;
  ingredients?: string;
  allergens?: string;
  image?: string;
}

interface AddItemMenuProps {
  setShowAddItemModal: (show: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
  formData: FormData;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  categories: Category[];
}

const AddItemMenu = ({
  setShowAddItemModal,
  handleSubmit,
  formData,
  handleChange,
  setFormData,
  categories,
}) => {
  const [ingredients, setIngredients] = useState<string[]>(
    formData.ingredients || []
  );
  const [allergens, setAllergens] = useState<string[]>(
    formData.allergens || []
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Item name is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (formData.price <= 0 || isNaN(formData.price)) {
      newErrors.price = "Price must be greater than 0";
    }
    
    if (!formData.category || (typeof formData.category === 'string' && !formData.category)) {
      newErrors.category = "Category is required";
    }
    
    if (ingredients.length === 0 || ingredients.every(i => !i.trim())) {
      newErrors.ingredients = "At least one ingredient is required";
    }
    
    if (allergens.length === 0 || allergens.every(a => !a.trim())) {
      newErrors.allergens = "At least one allergen is required";
    }
    
    if (!formData.image) {
      newErrors.image = "Image is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      handleSubmit(e);
    } else {
      // Scroll to top to show errors
      modalRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const handleRemoveIngredient = (index: number) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
    setFormData({
      ...formData,
      ingredients: newIngredients.filter((i) => i.trim() !== ""),
    });
  };

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
    setFormData({
      ...formData,
      ingredients: newIngredients.filter((i) => i.trim() !== ""),
    });
  };

  const handleAddAllergen = () => {
    setAllergens([...allergens, ""]);
  };

  const handleRemoveAllergen = (index: number) => {
    const newAllergens = [...allergens];
    newAllergens.splice(index, 1);
    setAllergens(newAllergens);
    setFormData({
      ...formData,
      allergens: newAllergens.filter((a) => a.trim() !== ""),
    });
  };

  const handleAllergenChange = (index: number, value: string) => {
    const newAllergens = [...allergens];
    newAllergens[index] = value;
    setAllergens(newAllergens);
    setFormData({
      ...formData,
      allergens: newAllergens.filter((a) => a.trim() !== ""),
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData({ ...formData, image: event.target.result as string });
          // Clear image error if any
          setErrors(prev => ({ ...prev, image: undefined }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setFormData({
      ...formData,
      price: value,
    });
    // Clear price error if any
    if (value > 0) {
      setErrors(prev => ({ ...prev, price: undefined }));
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = categories.find(
      (cat) => cat._id === e.target.value
    );
    if (selectedCategory) {
      setFormData({
        ...formData,
        category: selectedCategory,
      });
      // Clear category error if any
      setErrors(prev => ({ ...prev, category: undefined }));
    }
  };

  const getCurrentCategoryValue = () => {
    return typeof formData.category === "string"
      ? categories.find((cat) => cat.name === formData.category)?._id || ""
      : formData.category?._id || "";
  };

  // Clear errors when fields are modified
  useEffect(() => {
    if (formData.name.trim() && errors.name) {
      setErrors(prev => ({ ...prev, name: undefined }));
    }
    if (formData.description.trim() && errors.description) {
      setErrors(prev => ({ ...prev, description: undefined }));
    }
    if (ingredients.some(i => i.trim()) && errors.ingredients) {
      setErrors(prev => ({ ...prev, ingredients: undefined }));
    }
    if (allergens.some(a => a.trim()) && errors.allergens) {
      setErrors(prev => ({ ...prev, allergens: undefined }));
    }
  }, [formData, ingredients, allergens, errors]);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div 
        ref={modalRef}
        className="bg-[#1E1E1E] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-[#1E1E1E] z-10">
          <h3 className="text-xl font-bold">Add Menu Item</h3>
          <button onClick={() => setShowAddItemModal(false)}>
            <X size={24} />
          </button>
        </div>

        {Object.keys(errors).length > 0 && (
          <div className="p-4">
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg mb-6">
              <AlertTriangle size={24} className="text-red-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-400 mb-1">
                  Please fix the following errors:
                </p>
                <ul className="text-sm text-red-400 list-disc list-inside">
                  {errors.name && <li>{errors.name}</li>}
                  {errors.description && <li>{errors.description}</li>}
                  {errors.price && <li>{errors.price}</li>}
                  {errors.category && <li>{errors.category}</li>}
                  {errors.ingredients && <li>{errors.ingredients}</li>}
                  {errors.allergens && <li>{errors.allergens}</li>}
                  {errors.image && <li>{errors.image}</li>}
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
                className={`w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 ${
                  errors.name ? 'focus:ring-red-500 border-red-500/50' : 'focus:ring-orange-500'
                }`}
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Price ($) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handlePriceChange}
                step="0.01"
                min="0"
                className={`w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 ${
                  errors.price ? 'focus:ring-red-500 border-red-500/50' : 'focus:ring-orange-500'
                }`}
                required
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
              className={`w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 min-h-[100px] ${
                errors.description ? 'focus:ring-red-500 border-red-500/50' : 'focus:ring-orange-500'
              }`}
              required
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-1">
              Category *
            </label>
            <select
              name="category"
              value={getCurrentCategoryValue()}
              onChange={handleCategoryChange}
              className={`w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 ${
                errors.category ? 'focus:ring-red-500 border-red-500/50' : 'focus:ring-orange-500'
              }`}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name.charAt(0).toUpperCase() +
                    category.name.slice(1)}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm text-gray-400">Ingredients *</label>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="text-orange-500 hover:text-orange-600 flex items-center gap-1 text-sm duration-300"
              >
                <Plus size={16} />
                Add Ingredient
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
                    className={`flex-1 bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 ${
                      errors.ingredients ? 'focus:ring-red-500 border-red-500/50' : 'focus:ring-orange-500'
                    }`}
                    placeholder={`Ingredient ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(index)}
                    className="text-gray-600 hover:text-gray-400 p-2 duration-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {ingredients.length === 0 && (
                <p className="text-sm text-gray-500">
                  No ingredients added yet
                </p>
              )}
              {errors.ingredients && (
                <p className="mt-1 text-sm text-red-500">{errors.ingredients}</p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm text-gray-400">Allergens *</label>
              <button
                type="button"
                onClick={handleAddAllergen}
                className="text-orange-500 hover:text-orange-600 flex items-center gap-1 text-sm duration-300"
              >
                <Plus size={16} />
                Add Allergen
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
                    className={`flex-1 bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 ${
                      errors.allergens ? 'focus:ring-red-500 border-red-500/50' : 'focus:ring-orange-500'
                    }`}
                    placeholder={`Allergen ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveAllergen(index)}
                    className="text-gray-600 hover:text-gray-400 p-2 duration-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {allergens.length === 0 && (
                <p className="text-sm text-gray-500">No allergens added yet</p>
              )}
              {errors.allergens && (
                <p className="mt-1 text-sm text-red-500">{errors.allergens}</p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-1">
              Spicy Level (0-5)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                name="spicyLevel"
                min="0"
                max="5"
                value={formData.spicyLevel || 0}
                onChange={handleChange}
                className="flex-1 accent-orange-500 hover:cursor-pointer"
              />
              <span className="text-sm w-6 text-center">
                {formData.spicyLevel || 0}
              </span>
              <Flame size={16} className="text-red-500" />
            </div>
          </div>

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
                className={`w-full bg-[#2a2a2a] hover:bg-[#333] text-white px-4 py-2 rounded-lg transition-colors text-left ${
                  errors.image ? 'border border-red-500/50' : ''
                }`}
              >
                {formData.image ? "Change Image" : "Upload Image"}
              </button>
              {formData.image && (
                <div className="mt-2 relative h-40 rounded-lg overflow-hidden">
                  <Image
                    src={formData.image}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              {errors.image && (
                <p className="mt-1 text-sm text-red-500">{errors.image}</p>
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
                  checked={formData.isVegetarian || false}
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
                  checked={formData.isGlutenFree || false}
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
                  checked={formData.isAvailable || false}
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
                  checked={formData.isFeatured || false}
                  onChange={handleChange}
                  className="w-4 h-4 accent-orange-500"
                />
                <Zap size={16} className="text-yellow-500" />
                <span>Featured</span>
              </label>
            </div>
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
  );
};

export default AddItemMenu;