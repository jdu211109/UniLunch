// src/utils/apiClient.js
const BASE_URL = 'http://127.0.0.1:8001/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

// Helper function to make API requests
const makeRequest = async (url, options = {}) => {
  const token = getAuthToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${BASE_URL}${url}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Helper to simulate delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Data Storage
const STORAGE_KEYS = {
  MEALS: 'unilunch_meals',
  MENUS: 'unilunch_menus',
  RESERVATIONS: 'unilunch_reservations'
};

const getStoredData = (key, defaultData) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultData;
  } catch {
    return defaultData;
  }
};

const setStoredData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Initial Mock Data
const INITIAL_MEALS = [
  {
    id: "1",
    name: "Spicy Thai Curry Tofu",
    description: "Crispy tofu cubes in a rich, spicy Thai red curry with bamboo shoots, bell peppers, and Thai basil. Served with jasmine rice.",
    price: 10.99,
    imageUrl: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop",
    isVegetarian: true,
    isSpicy: true,
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    name: "Classic Burger",
    description: "Juicy beef patty with lettuce, tomato, and special sauce",
    price: 12.99,
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    isVegetarian: false,
    isSpicy: false,
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
];

const INITIAL_MENUS = [
  {
    id: "1",
    name: "Lunch Special",
    description: "Available Mon-Fri 11am-2pm",
    date: new Date().toISOString(),
    mealIds: ["1", "2"],
    isActive: true,
    price: 15.99,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop"
  }
];

export const apiClient = {
  // Auth
  login: async ({ email, password }) => {
    const response = await makeRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.token) {
      localStorage.setItem('auth_token', response.token);
      if (response.user) {
        localStorage.setItem('user_info', JSON.stringify(response.user));
      }
    }

    return response;
  },

  register: async ({ name, email, password, password_confirmation }) => {
    const response = await makeRequest('/register', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
        password_confirmation
      }),
    });

    if (response.success && response.token) {
      localStorage.setItem('auth_token', response.token);
      if (response.user) {
        localStorage.setItem('user_info', JSON.stringify(response.user));
      }
    }

    return response;
  },

  getCurrentUser: async () => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token');
    }

    const response = await makeRequest('/user');
    return {
      id: response.id,
      name: response.name,
      email: response.email,
      role: response.role,
      isAdmin: response.role === 'admin'
    };
  },

  logout: async () => {
    try {
      await makeRequest('/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_info');
    }
  },

  signUp: async ({ email }) => {
    // Temporary mock - will be replaced with actual API call
    console.log('Mock signUp for:', email);
    return { success: true };
  },

  // Password Reset
  sendResetCode: async ({ email }) => {
    const response = await makeRequest('/password/send-code', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    return response;
  },

  verifyResetCode: async ({ email, code }) => {
    const response = await makeRequest('/password/verify-code', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
    return response;
  },

  resetPassword: async ({ email, code, password, password_confirmation }) => {
    const response = await makeRequest('/password/reset', {
      method: 'POST',
      body: JSON.stringify({
        email,
        code,
        password,
        password_confirmation
      }),
    });
    return response;
  },

  // Meals
  listMeals: async () => {
    await delay(500);
    return getStoredData(STORAGE_KEYS.MEALS, INITIAL_MEALS);
  },

  getUserFavorites: async () => {
    // Mock implementation
    return ["1"]; // Return array of meal IDs
  },

  toggleFavoriteMeal: async (mealId) => {
    // Mock implementation
    console.log('Mock toggleFavoriteMeal for:', mealId);
    return { success: true };
  },

  createMeal: async (mealData) => {
    await delay(500);
    const meals = getStoredData(STORAGE_KEYS.MEALS, INITIAL_MEALS);
    const newMeal = {
      ...mealData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    meals.push(newMeal);
    setStoredData(STORAGE_KEYS.MEALS, meals);
    return newMeal;
  },

  updateMeal: async ({ id, ...mealData }) => {
    await delay(500);
    const meals = getStoredData(STORAGE_KEYS.MEALS, INITIAL_MEALS);
    const index = meals.findIndex(m => m.id === id);
    if (index !== -1) {
      meals[index] = { ...meals[index], ...mealData, updatedAt: new Date().toISOString() };
      setStoredData(STORAGE_KEYS.MEALS, meals);
      return meals[index];
    }
    throw new Error('Meal not found');
  },

  deleteMeal: async ({ id }) => {
    await delay(500);
    const meals = getStoredData(STORAGE_KEYS.MEALS, INITIAL_MEALS);
    const filteredMeals = meals.filter(m => m.id !== id);
    setStoredData(STORAGE_KEYS.MEALS, filteredMeals);
    return { success: true };
  },

  // Menus
  listMenus: async () => {
    await delay(500);
    const menus = getStoredData(STORAGE_KEYS.MENUS, INITIAL_MENUS);
    const meals = getStoredData(STORAGE_KEYS.MEALS, INITIAL_MEALS);

    // Enrich menus with full meal objects
    return menus.map(menu => ({
      ...menu,
      meals: menu.mealIds.map(id => meals.find(m => m.id === id)).filter(Boolean)
    }));
  },

  createMenu: async (menuData) => {
    await delay(500);
    const menus = getStoredData(STORAGE_KEYS.MENUS, INITIAL_MENUS);
    const newMenu = {
      ...menuData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    menus.push(newMenu);
    setStoredData(STORAGE_KEYS.MENUS, menus);
    return newMenu;
  },

  updateMenu: async ({ id, ...menuData }) => {
    await delay(500);
    const menus = getStoredData(STORAGE_KEYS.MENUS, INITIAL_MENUS);
    const index = menus.findIndex(m => m.id === id);
    if (index !== -1) {
      menus[index] = { ...menus[index], ...menuData, updatedAt: new Date().toISOString() };
      setStoredData(STORAGE_KEYS.MENUS, menus);
      return menus[index];
    }
    throw new Error('Menu not found');
  },

  deleteMenu: async ({ id }) => {
    await delay(500);
    const menus = getStoredData(STORAGE_KEYS.MENUS, INITIAL_MENUS);
    const filteredMenus = menus.filter(m => m.id !== id);
    setStoredData(STORAGE_KEYS.MENUS, filteredMenus);
    return { success: true };
  },

  // Reservations
  createOrder: async ({ items, userId, userName }) => {
    await delay(500);
    const reservations = getStoredData(STORAGE_KEYS.RESERVATIONS, []);
    const meals = getStoredData(STORAGE_KEYS.MEALS, INITIAL_MEALS);

    // Calculate total price and enrich items
    let totalPrice = 0;
    const enrichedItems = items.map(item => {
      const meal = meals.find(m => m.id === item.mealId);
      if (!meal) throw new Error(`Meal ${item.mealId} not found`);
      const itemTotal = (meal.price || 0) * item.quantity;
      totalPrice += itemTotal;
      return {
        ...item,
        mealName: meal.name,
        price: meal.price,
        imageUrl: meal.imageUrl
      };
    });

    const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
    const finalUserId = userId || userInfo.id || 'user-1';
    const finalUserName = userName || userInfo.name || 'John Doe';

    const newOrder = {
      id: Date.now().toString(),
      userId: finalUserId,
      userName: finalUserName,
      items: enrichedItems,
      totalPrice,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    reservations.push(newOrder);
    setStoredData(STORAGE_KEYS.RESERVATIONS, reservations);
    return newOrder;
  },

  // Deprecated: kept for backward compatibility if needed, but createOrder should be used
  createReservation: async ({ mealId, quantity, userId, userName }) => {
    return apiClient.createOrder({
      items: [{ mealId, quantity }],
      userId,
      userName
    });
  },

  listUserReservations: async () => {
    await delay(500);
    const reservations = getStoredData(STORAGE_KEYS.RESERVATIONS, []);
    const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
    const currentUserId = userInfo.id || 'user-1';

    return reservations
      .filter(r => r.userId === currentUserId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  listAllReservations: async () => {
    await delay(500);
    const reservations = getStoredData(STORAGE_KEYS.RESERVATIONS, []);
    return reservations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  updateReservationStatus: async ({ id, status }) => {
    await delay(500);
    const reservations = getStoredData(STORAGE_KEYS.RESERVATIONS, []);
    const index = reservations.findIndex(r => r.id === id);
    if (index !== -1) {
      reservations[index] = { ...reservations[index], status, updatedAt: new Date().toISOString() };
      setStoredData(STORAGE_KEYS.RESERVATIONS, reservations);
      return reservations[index];
    }
    throw new Error('Reservation not found');
  },

  cancelReservation: async (id) => {
    await delay(500);
    const reservations = getStoredData(STORAGE_KEYS.RESERVATIONS, []);
    const index = reservations.findIndex(r => r.id === id);
    if (index !== -1) {
      reservations[index] = { ...reservations[index], status: 'cancelled', updatedAt: new Date().toISOString() };
      setStoredData(STORAGE_KEYS.RESERVATIONS, reservations);
      return reservations[index];
    }
    throw new Error('Reservation not found');
  },

  deleteReservation: async (id) => {
    await delay(500);
    const reservations = getStoredData(STORAGE_KEYS.RESERVATIONS, []);
    const filteredReservations = reservations.filter(r => r.id !== id);
    setStoredData(STORAGE_KEYS.RESERVATIONS, filteredReservations);
    return { success: true };
  }
}