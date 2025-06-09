
export type User = {
  id: string;
  email: string;
  isAdmin: boolean;
};

export type Meal = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isVegetarian: boolean;
  isSpicy: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type Reservation = {
  id: string;
  userId: string;
  mealId: string;
  date: Date | string;
  meal: Meal;
  createdAt: Date | string;
  updatedAt: Date | string;
};