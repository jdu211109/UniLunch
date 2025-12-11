// src/pages/MenuPage.jsx
import React, { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../utils/apiClient'
import MealCard from '../components/meals/MealCard'
import { useLanguage } from '../hooks/useLanguage'

const CATEGORY_KEYS = ['set', 'main', 'salad', 'soup', 'dessert', 'drink', 'extra']

export default function MenuPage({ searchQuery = '' }) {
  const queryClient = useQueryClient()
  const [quantities, setQuantities] = useState({})
  const categoryRefs = useRef({})
  const { t } = useLanguage()

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

  const categories = CATEGORY_KEYS.map((key) => ({
    key,
    label: t(`menu.categories.${key}`)
  }))

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredMeals = normalizedQuery
    ? meals.filter((meal) => {
      const name = meal.name?.toLowerCase() || ''
      const description = meal.description?.toLowerCase() || ''
      return name.includes(normalizedQuery) || description.includes(normalizedQuery)
    })
    : meals

  const mealsByCategory = categories.map((category) => ({
    ...category,
    meals: filteredMeals.filter((meal) => meal.category === category.key),
  })).filter((cat) => cat.meals.length > 0)

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Category Navigation (sticky under top bar) */}
      <div className="sticky top-16 z-40 mb-8 flex justify-center py-3 pointer-events-none">
        <div className="bg-muted p-1 rounded-lg flex flex-wrap gap-1 pointer-events-auto">
          {categories.map((category) => {
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