// src/pages/MenuPage.jsx
import React, { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../utils/apiClient'
import MealCard from '../components/meals/MealCard'

const CATEGORIES = [
  { key: 'set', label: 'Сет' },
  { key: 'main', label: 'Блюда' },
  { key: 'salad', label: 'Салаты' },
  { key: 'soup', label: 'Суп/Самса' },
  { key: 'dessert', label: 'Десерты' },
  { key: 'drink', label: 'Напиток' },
  { key: 'extra', label: 'Дополнительно' },
]

export default function MenuPage() {
  const queryClient = useQueryClient()
  const [quantities, setQuantities] = useState({})
  const categoryRefs = useRef({})

  const { data: meals = [] } = useQuery({
    queryKey: ['meals'],
    queryFn: apiClient.listMeals,
  })

  const { data: favoriteMealIds = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn: apiClient.getUserFavorites,
    enabled: !!apiClient.getUserFavorites,
  })

  const toggleFavoriteMutation = useMutation({
    mutationFn: apiClient.toggleFavoriteMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })

  // Загружаем количества из корзины при загрузке
  React.useEffect(() => {
    const cart = apiClient.getCart()
    const cartQuantities = {}
    cart.forEach(item => {
      cartQuantities[item.mealId] = item.quantity
    })
    setQuantities(cartQuantities)
  }, [])

  const handleIncreaseQuantity = (meal) => {
    const newQuantity = (quantities[meal.id] || 0) + 1
    setQuantities((prev) => ({ ...prev, [meal.id]: newQuantity }))
    
    // Добавляем в корзину
    const cart = apiClient.getCart()
    const existingItem = cart.find(item => item.mealId == meal.id)
    if (existingItem) {
      apiClient.updateCartItem(meal.id, newQuantity)
    } else {
      apiClient.addToCart(meal, 1)
    }
  }

  const handleDecreaseQuantity = (meal) => {
    const currentQuantity = quantities[meal.id] || 0
    if (currentQuantity <= 0) return
    
    const newQuantity = currentQuantity - 1
    setQuantities((prev) => ({ ...prev, [meal.id]: newQuantity }))
    
    // Обновляем корзину
    apiClient.updateCartItem(meal.id, newQuantity)
  }

  const scrollToCategory = (categoryKey) => {
    const element = categoryRefs.current[categoryKey]
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const mealsByCategory = CATEGORIES.map((category) => ({
    ...category,
    meals: meals.filter((meal) => meal.category === category.key),
  })).filter((cat) => cat.meals.length > 0)

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Меню на сегодня</h1>

        {/* Category Navigation */}
        <div className="flex justify-center sticky top-0 bg-background/95 backdrop-blur-sm py-4 z-10">
          <div className="bg-muted p-1 rounded-lg flex flex-wrap gap-1">
            {CATEGORIES.map((category) => {
              const count = meals.filter((m) => m.category === category.key).length
              return count > 0 ? (
                <button
                  key={category.key}
                  onClick={() => scrollToCategory(category.key)}
                  className="px-4 py-2 rounded-md text-sm font-medium transition-all text-muted-foreground hover:text-foreground hover:bg-background/50"
                >
                  {category.label}
                </button>
              ) : null
            })}
          </div>
        </div>
      </div>

      {/* Meals by Category */}
      <div className="space-y-12">
        {mealsByCategory.map((category) => (
          <div
            key={category.key}
            ref={(el) => (categoryRefs.current[category.key] = el)}
            className="scroll-mt-32"
          >
            <h2 className="text-2xl font-bold mb-6 text-primary">{category.label}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {category.meals.map((meal) => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  quantity={quantities[meal.id] || 0}
                  onIncreaseQuantity={() => handleIncreaseQuantity(meal)}
                  onDecreaseQuantity={() => handleDecreaseQuantity(meal)}
                  onToggleFavorite={() => toggleFavoriteMutation.mutate(meal.id)}
                  isFavorite={favoriteMealIds.includes(meal.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}