// src/utils/apiClient.js
export const apiClient = {
  // Auth
  getCurrentUser: async () => {
    // В реальном приложении здесь будет запрос к API
    // Сейчас возвращаем моковые данные
    return {
      id: "1",
      email: "user@example.com",
      isAdmin: false,
    };
  },

  signUp: async ({ email }) => {
    // In a real app, this would call your backend API
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
        imageUrl: "",
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
        imageUrl: "https://placekitten.com/301/200",
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
    return { success: true };
  },

  // Reservations
  createReservation: async ({ mealId, quantity }) => {
    // Mock implementation
    return { success: true };
  },

  listUserReservations: async () => {
    // Mock implementation
    return []; // В реальном приложении здесь будут данные о заказах
  },
}