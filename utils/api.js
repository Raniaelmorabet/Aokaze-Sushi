// utils/api.js

// const API_BASE_URL = 'https://aokaze-sushi.vercel.app/api';
const API_BASE_URL = "http://localhost:5000/api";

/**
 * Get the authentication token from localStorage
 * @returns {string|null} The authentication token or null if not found
 */
export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Central function to make API requests
 * @param {string} endpoint - API endpoint path
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {Object} data - Request payload (optional)
 * @param {boolean} requiresAuth - Whether the request requires authentication (default: false)
 * @param {Object} customHeaders - Additional headers to include (optional)
 * @returns {Promise<Object>} - Response data
 */
export const apiRequest = async (
  endpoint,
  method = "GET",
  data = null,
  requiresAuth = false,
  customHeaders = {}
) => {
  try {
    // Prepare headers
    const headers = {
      "Content-Type": "application/json",
      ...customHeaders,
    };

    // Add auth token if required
    if (requiresAuth) {
      const token = getToken();
      if (!token) {
        throw new Error("Authentication required");
      }
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Prepare request options
    const options = {
      method,
      headers,
      credentials: "include", // Include cookies for cross-origin requests
    };

    // Add body data if needed
    if (data && ["POST", "PUT", "PATCH"].includes(method)) {
      options.body = JSON.stringify(data);
    }

    // Make the request
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, options);

    // Parse the response
    const responseData = await response.json();

    // Handle error responses
    if (!response.ok) {
      const errorMessage =
        responseData.error ||
        responseData.message ||
        `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return responseData;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

/**
 * Authentication API functions
 */
export const authAPI = {
  // Login user
  login: async (email, password) => {
    const data = await apiRequest("/auth/login", "POST", { email, password });
    console.log("Login response:", data);

    // Store token if provided
    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    return data;
  },

  // Register new user
  register: async (userData) => {
    const data = await apiRequest("/auth/register", "POST", userData);
    console.log("Login response:", data);
    // Store token if provided
    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    return data;
  },

  // Get current user profile
  getCurrentUser: async () => {
    return await apiRequest("/auth/me", "GET", null, true);
  },

  // Update user details
  updateUserDetails: async (userData) => {
    return await apiRequest("/auth/updatedetails", "PUT", userData, true);
  },

  // Update password
  updatePassword: async (passwordData) => {
    return await apiRequest("/auth/updatepassword", "PUT", passwordData, true);
  },

  // Logout user
  logout: async () => {
    try {
      await apiRequest("/auth/logout", "GET", null, true);
    } finally {
      // Always clear local storage even if API call fails
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    }
  },
};

/**
 * Menu API functions
 */
export const menuAPI = {
  // Get all menu items
  getItems: async () => {
    return await apiRequest("/menu", "GET");
  },

  // Get menu item by ID
  getItemById: async (id) => {
    return await apiRequest(`/menu/${id}`, "GET");
  },

  // Get menu items by category
  getItemsByCategory: async (category) => {
    return await apiRequest(`/menu/category/${category}`, "GET");
  },
};

/**
 * Order API functions
 */
export const orderAPI = {
  // Place a new order
  placeOrder: async (orderData) => {
    return await apiRequest("/orders", "POST", orderData, true);
  },

  // Get user's orders
  getUserOrders: async () => {
    return await apiRequest("/orders/user", "GET", null, true);
  },

  // Get order by ID
  getOrderById: async (id) => {
    return await apiRequest(`/orders/${id}`, "GET", null, true);
  },

  // Update order status (for admins)
  updateOrderStatus: async (id, status) => {
    return await apiRequest(`/orders/${id}/status`, "PUT", { status }, true);
  },
};

/**
 * Offers API functions
 */
export const offersAPI = {
  // Get all offers with optional query parameters
  getOffers: async (queryParams = {}) => {
    const queryString = new URLSearchParams(queryParams).toString();
    return await apiRequest(`/offers?${queryString}`, "GET");
  },

  // Get a specific offer by ID
  getOfferById: async (id) => {
    return await apiRequest(`/offers/${id}`, "GET");
  },

  // Create a new offer (Admin only)
  createOffer: async (offerData) => {
    return await apiRequest("/offers", "POST", offerData, true);
  },

  // Update an existing offer (Admin only)
  updateOffer: async (id, offerData) => {
    return await apiRequest(`/offers/${id}`, "PUT", offerData, true);
  },

  // Delete an offer (Admin only)
  deleteOffer: async (id) => {
    return await apiRequest(`/offers/${id}`, "DELETE", null, true);
  },

  // Toggle offer status (Admin only)
  toggleOfferStatus: async (id, isActive) => {
    return await apiRequest(
      `/offers/${id}/status`,
      "PATCH",
      { isActive },
      true
    );
  },

  // Validate a coupon code
  validateCoupon: async (couponCode, orderData = {}) => {
    return await apiRequest("/offers/validate", "POST", {
      couponCode,
      ...orderData,
    });
  },

  // Get offers applicable to specific menu items
  getOffersForMenuItems: async (menuItemIds) => {
    return await apiRequest("/offers/for-items", "POST", { menuItemIds });
  },

  // Get offers applicable to specific categories
  getOffersForCategories: async (categories) => {
    return await apiRequest("/offers/for-categories", "POST", { categories });
  },
};

/**
 * Chef Specialties API functions
 */
export const chefSpecialtiesAPI = {
  // Get all chef specialties with optional query parameters
  getChefSpecialties: async (queryParams = {}) => {
    const queryString = new URLSearchParams(queryParams).toString();
    return await apiRequest(`/chef-specialties?${queryString}`, "GET");
  },

  // Get a specific chef specialty by ID
  getChefSpecialtyById: async (id) => {
    return await apiRequest(`/chef-specialties/${id}`, "GET");
  },

  // Create a new chef specialty (Admin only)
  createChefSpecialty: async (specialtyData) => {
    return await apiRequest(
      "/chef-specialties",
      "POST",
      specialtyData,
      true
    );
  },

  // Update an existing chef specialty (Admin only)
  updateChefSpecialty: async (id, specialtyData) => {
    return await apiRequest(
      `/chef-specialties/${id}`,
      "PUT",
      specialtyData,
      true
    );
  },

  // Delete a chef specialty (Admin only)
  deleteChefSpecialty: async (id) => {
    return await apiRequest(
      `/chef-specialties/${id}`,
      "DELETE",
      null,
      true
    );
  },

  // Toggle featured status (Admin only)
  toggleFeaturedStatus: async (id) => {
    return await apiRequest(
      `/chef-specialties/${id}/feature`,
      "PATCH",
      null,
      true
    );
  },

  // Get featured chef specialties
  getFeaturedSpecialties: async () => {
    return await apiRequest("/chef-specialties?featured=true", "GET");
  },

  // Search chef specialties by title or description
  searchSpecialties: async (searchTerm) => {
    return await apiRequest(
      `/chef-specialties?search=${encodeURIComponent(searchTerm)}`,
      "GET"
    );
  },

  // Get specialties by category
  getSpecialtiesByCategory: async (categoryId) => {
    return await apiRequest(
      `/chef-specialties?category=${categoryId}`,
      "GET"
    );
  },

  // Get specialties by property (e.g., Spicy, Vegetarian)
  getSpecialtiesByProperty: async (property) => {
    return await apiRequest(
      `/chef-specialties?property=${property}`,
      "GET"
    );
  },
};
