// src/utils/apiClient.js
const BASE_URL = 'http://127.0.0.1:8001/api'

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('auth_token')
}

// Helper function to make API requests
const makeRequest = async (url, options = {}) => {
  const token = getAuthToken()

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(`${BASE_URL}${url}`, config)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Helper to simulate delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock Data Storage
const STORAGE_KEYS = {
  MEALS: 'unilunch_meals',
  MENUS: 'unilunch_menus',
  RESERVATIONS: 'unilunch_reservations',
  CART: 'unilunch_cart', // Cart items before confirmation
}

const getStoredData = (key, defaultData) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultData
  } catch {
    return defaultData
  }
}

const setStoredData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data))
}

// Initial Mock Data
const INITIAL_MEALS = [
  {
    id: '1',
    name: 'Spicy Thai Curry Tofu',
    description:
      'Crispy tofu cubes in a rich, spicy Thai red curry with bamboo shoots, bell peppers, and Thai basil. Served with jasmine rice.',
    price: 10.99,
    imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop',
    isVegetarian: true,
    isSpicy: true,
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Classic Burger',
    description: 'Juicy beef patty with lettuce, tomato, and special sauce',
    price: 12.99,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    isVegetarian: false,
    isSpicy: false,
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const INITIAL_MENUS = [
  {
    id: '1',
    name: 'Lunch Special',
    description: 'Available Mon-Fri 11am-2pm',
    date: new Date().toISOString(),
    mealIds: ['1', '2'],
    isActive: true,
    price: 15.99,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
  },
]

export const apiClient = {
  // Auth
  login: async ({ email, password }) => {
    const response = await makeRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    if (response.success && response.token) {
      localStorage.setItem('auth_token', response.token)
      if (response.user) {
        localStorage.setItem('user_info', JSON.stringify(response.user))
      }
    }

    return response
  },

  register: async ({ name, email, password, password_confirmation }) => {
    const response = await makeRequest('/register', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
        password_confirmation,
      }),
    })

    if (response.success && response.token) {
      localStorage.setItem('auth_token', response.token)
      if (response.user) {
        localStorage.setItem('user_info', JSON.stringify(response.user))
      }
    }

    return response
  },

  getCurrentUser: async () => {
    const token = getAuthToken()
    if (!token) {
      throw new Error('No authentication token')
    }

    const response = await makeRequest('/user')
    return {
      id: response.id,
      name: response.name,
      email: response.email,
      role: response.role,
      isAdmin: response.role === 'admin',
    }
  },

  logout: async () => {
    try {
      await makeRequest('/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_info')
    }
  },

  signUp: async ({ email }) => {
    // Temporary mock - will be replaced with actual API call
    console.log('Mock signUp for:', email)
    return { success: true }
  },

  // Password Reset
  sendResetCode: async ({ email }) => {
    const response = await makeRequest('/password/send-code', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
    return response
  },

  verifyResetCode: async ({ email, code }) => {
    const response = await makeRequest('/password/verify-code', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    })
    return response
  },

  resetPassword: async ({ email, code, password, password_confirmation }) => {
    const response = await makeRequest('/password/reset', {
      method: 'POST',
      body: JSON.stringify({
        email,
        code,
        password,
        password_confirmation,
      }),
    })
    return response
  },

  // Meals
  listMeals: async () => {
    const response = await makeRequest('/meals')
    // Convert snake_case to camelCase for frontend
    return (response.meals || []).map((meal) => ({
      id: meal.id,
      name: meal.name,
      description: meal.description,
      price: parseFloat(meal.price),
      imageUrl: meal.image_url,
      category: meal.category,
      isVegetarian: meal.is_vegetarian,
      isSpicy: meal.is_spicy,
      isAvailable: meal.is_available,
      createdAt: meal.created_at,
      updatedAt: meal.updated_at,
    }))
  },

  getMealCategories: async () => {
    const response = await makeRequest('/meals/categories')
    return response.categories || {}
  },

  getUserFavorites: async () => {
    // Mock implementation
    return ['1'] // Return array of meal IDs
  },

  toggleFavoriteMeal: async (mealId) => {
    // Mock implementation
    console.log('Mock toggleFavoriteMeal for:', mealId)
    return { success: true }
  },

  createMeal: async (mealData) => {
    const formattedData = {
      name: mealData.name,
      description: mealData.description,
      price: parseFloat(mealData.price),
      image_url: mealData.imageUrl,
      category: mealData.category || 'main',
      is_vegetarian: mealData.isVegetarian || false,
      is_spicy: mealData.isSpicy || false,
      is_available: mealData.isAvailable !== false,
    }
    const response = await makeRequest('/meals', {
      method: 'POST',
      body: JSON.stringify(formattedData),
    })
    // Convert response back to camelCase
    const meal = response.meal
    return {
      id: meal.id,
      name: meal.name,
      description: meal.description,
      price: parseFloat(meal.price),
      imageUrl: meal.image_url,
      category: meal.category,
      isVegetarian: meal.is_vegetarian,
      isSpicy: meal.is_spicy,
      isAvailable: meal.is_available,
      createdAt: meal.created_at,
      updatedAt: meal.updated_at,
    }
  },

  updateMeal: async ({ id, ...mealData }) => {
    const formattedData = {
      name: mealData.name,
      description: mealData.description,
      price: parseFloat(mealData.price),
      image_url: mealData.imageUrl,
      category: mealData.category,
      is_vegetarian: mealData.isVegetarian,
      is_spicy: mealData.isSpicy,
      is_available: mealData.isAvailable,
    }
    const response = await makeRequest(`/meals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(formattedData),
    })
    // Convert response back to camelCase
    const meal = response.meal
    return {
      id: meal.id,
      name: meal.name,
      description: meal.description,
      price: parseFloat(meal.price),
      imageUrl: meal.image_url,
      category: meal.category,
      isVegetarian: meal.is_vegetarian,
      isSpicy: meal.is_spicy,
      isAvailable: meal.is_available,
      createdAt: meal.created_at,
      updatedAt: meal.updated_at,
    }
  },

  deleteMeal: async ({ id }) => {
    await makeRequest(`/meals/${id}`, {
      method: 'DELETE',
    })
    return { success: true }
  },

  // Cart (local storage for items before confirmation)
  getCart: () => {
    return getStoredData(STORAGE_KEYS.CART, [])
  },

  addToCart: (meal, quantity = 1) => {
    const cart = getStoredData(STORAGE_KEYS.CART, [])
    // Use == for comparison to handle number/string mismatch
    const existingIndex = cart.findIndex((item) => item.mealId == meal.id)

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity
    } else {
      cart.push({
        mealId: meal.id,
        mealName: meal.name,
        price: meal.price,
        imageUrl: meal.imageUrl || meal.image_url, // Handle both cases
        quantity: quantity,
      })
    }

    setStoredData(STORAGE_KEYS.CART, cart)
    return cart
  },

  updateCartItem: (mealId, quantity) => {
    let cart = getStoredData(STORAGE_KEYS.CART, [])
    // Use == for comparison to handle number/string mismatch
    const index = cart.findIndex((item) => item.mealId == mealId)

    if (index >= 0) {
      if (quantity <= 0) {
        cart = cart.filter((_, i) => i !== index)
      } else {
        cart = cart.map((item, i) => (i === index ? { ...item, quantity } : item))
      }
    }

    setStoredData(STORAGE_KEYS.CART, cart)
    return [...cart] // Return new array reference
  },

  removeFromCart: (mealId) => {
    const cart = getStoredData(STORAGE_KEYS.CART, [])
    // Use == for comparison to handle number/string mismatch
    const filteredCart = cart.filter((item) => item.mealId != mealId)
    setStoredData(STORAGE_KEYS.CART, filteredCart)
    return filteredCart
  },

  clearCart: () => {
    setStoredData(STORAGE_KEYS.CART, [])
    return []
  },

  // Orders (confirmed orders - backend)
  confirmOrder: async ({ pickupTime, paymentMethod }) => {
    const cart = getStoredData(STORAGE_KEYS.CART, [])
    if (cart.length === 0) {
      throw new Error('Cart is empty')
    }

    const response = await makeRequest('/orders', {
      method: 'POST',
      body: JSON.stringify({
        items: cart.map((item) => ({
          mealId: item.mealId,
          quantity: item.quantity,
        })),
        pickupTime,
        paymentMethod,
      }),
    })

    // Clear cart after successful order
    setStoredData(STORAGE_KEYS.CART, [])
    return response
  },

  listUserOrders: async () => {
    const response = await makeRequest('/orders')
    return response.orders || []
  },

  deleteOrder: async (orderId) => {
    await makeRequest(`/orders/${orderId}`, {
      method: 'DELETE',
    })
    return { success: true }
  },

  cancelOrder: async (orderId) => {
    const response = await makeRequest(`/orders/${orderId}/cancel`, {
      method: 'PUT',
    })
    return response
  },

  // Check if order can be cancelled (within 2 minutes)
  canCancelOrder: (createdAt) => {
    const orderDate = new Date(createdAt)
    const now = new Date()
    const diffSeconds = (now - orderDate) / 1000
    return diffSeconds <= 120
  },

  // Get remaining time to cancel in seconds
  getRemainingCancelTime: (createdAt) => {
    const orderDate = new Date(createdAt)
    const now = new Date()
    const diffSeconds = (now - orderDate) / 1000
    return Math.max(0, Math.ceil(120 - diffSeconds))
  },

  // Admin: Get confirmed orders
  listAdminOrders: async () => {
    const response = await makeRequest('/admin/orders')
    return {
      orders: response.orders || [],
      pendingCount: response.pendingCount || 0,
    }
  },

  updateOrderStatus: async ({ id, status }) => {
    const response = await makeRequest(`/admin/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
    return response
  },

  // Menus
  listMenus: async () => {
    await delay(500)
    const menus = getStoredData(STORAGE_KEYS.MENUS, INITIAL_MENUS)
    const meals = getStoredData(STORAGE_KEYS.MEALS, INITIAL_MEALS)

    // Enrich menus with full meal objects
    return menus.map((menu) => ({
      ...menu,
      meals: menu.mealIds.map((id) => meals.find((m) => m.id === id)).filter(Boolean),
    }))
  },

  createMenu: async (menuData) => {
    await delay(500)
    const menus = getStoredData(STORAGE_KEYS.MENUS, INITIAL_MENUS)
    const newMenu = {
      ...menuData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    menus.push(newMenu)
    setStoredData(STORAGE_KEYS.MENUS, menus)
    return newMenu
  },

  updateMenu: async ({ id, ...menuData }) => {
    await delay(500)
    const menus = getStoredData(STORAGE_KEYS.MENUS, INITIAL_MENUS)
    const index = menus.findIndex((m) => m.id === id)
    if (index !== -1) {
      menus[index] = { ...menus[index], ...menuData, updatedAt: new Date().toISOString() }
      setStoredData(STORAGE_KEYS.MENUS, menus)
      return menus[index]
    }
    throw new Error('Menu not found')
  },

  deleteMenu: async ({ id }) => {
    await delay(500)
    const menus = getStoredData(STORAGE_KEYS.MENUS, INITIAL_MENUS)
    const filteredMenus = menus.filter((m) => m.id !== id)
    setStoredData(STORAGE_KEYS.MENUS, filteredMenus)
    return { success: true }
  },
}
