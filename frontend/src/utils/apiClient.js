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

export const apiClient = {
  // Auth
  login: async ({ email, password }) => {
    const response = await makeRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.success && response.token) {
      localStorage.setItem('auth_token', response.token);
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
    }
  },

  signUp: async ({ email }) => {
    // Temporary mock - will be replaced with actual API call
    console.log('Mock signUp for:', email);
    return { success: true };
  },

  // Meals
  listMeals: async () => {
    // Mock data - replace with actual API call
    return [
      {
        id: "1",
        name: "Spicy Thai Curry Tofu",
        description: "Crispy tofu cubes in a rich, spicy Thai red curry with bamboo shoots, bell peppers, and Thai basil. Served with jasmine rice.",
        price: 10.99,
        imageUrl: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop",
        isVegetarian: true,
        isSpicy: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "2",
        name: "Classic Burger",
        description: "Juicy beef patty with lettuce, tomato, and special sauce",
        price: 12.99,
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
        isVegetarian: false,
        isSpicy: false,
      },
    ];
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
    // Mock implementation for now
    console.log('Mock createMeal:', mealData);
    return { success: true, id: Date.now().toString() };
  },

  updateMeal: async ({ id, ...mealData }) => {
    // Mock implementation for now
    console.log('Mock updateMeal:', id, mealData);
    return { success: true };
  },

  deleteMeal: async ({ id }) => {
    // Mock implementation for now
    console.log('Mock deleteMeal:', id);
    return { success: true };
  },

  // Reservations
  createReservation: async ({ mealId, quantity }) => {
    // Mock implementation
    console.log('Mock createReservation for:', mealId, 'quantity:', quantity);
    return { success: true };
  },

  listUserReservations: async () => {
    // Mock implementation
    return []; // В реальном приложении здесь будут данные о заказах
  },
}