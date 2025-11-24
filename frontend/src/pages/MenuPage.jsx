// src/pages/MenuPage.jsx
import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../utils/apiClient'
import { Leaf, Flame, Plus, Edit, Trash2 } from 'lucide-react'
import { Button, Card, Input, Label, Checkbox, Badge, Separator } from '../components/ui'
import MealCard from '../components/meals/MealCard'
import MealFilters from '../components/meals/MealFilters'
import { useToast } from '../components/navigation/useToast.jsx'

export default function MenuPage() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [filters, setFilters] = useState({
    vegetarian: false,
    spicy: false,
    favoritesOnly: false,
    foodType: 'all',
    includesDrinks: false,
    priceRange: 'all',
    sortBy: 'default',
  })
  const [searchQuery, setSearchQuery] = useState('')
  //   const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [quantities, setQuantities] = useState({})

  const { data: meals = [] } = useQuery({
    queryKey: ['meals'],
    queryFn: apiClient.listMeals,
  })

  const { data: favoriteMealIds = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn: apiClient.getUserFavorites,
    enabled: !!apiClient.getUserFavorites,
  })

  const createOrderMutation = useMutation({
    mutationFn: apiClient.createOrder,
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Order placed successfully',
      })
      setQuantities({}); // Reset quantities
      queryClient.invalidateQueries({ queryKey: ['userReservations'] })
    },
  })

  const toggleFavoriteMutation = useMutation({
    mutationFn: apiClient.toggleFavoriteMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })

  const filteredMeals = meals.filter((meal) => {
    if (filters.vegetarian && !meal.isVegetarian) return false
    if (filters.spicy && !meal.isSpicy) return false
    if (filters.favoritesOnly && !favoriteMealIds.includes(meal.id)) return false
    if (searchQuery && !meal.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Today's Menu</h1>

        <MealFilters
          filters={filters}
          setFilters={setFilters}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>{' '}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {filteredMeals.map((meal) => (
          <MealCard
            key={meal.id}
            meal={meal}
            quantity={quantities[meal.id] || 0}
            onIncreaseQuantity={() =>
              setQuantities((prev) => ({
                ...prev,
                [meal.id]: (prev[meal.id] || 0) + 1,
              }))
            }
            onDecreaseQuantity={() =>
              setQuantities((prev) => ({
                ...prev,
                [meal.id]: Math.max(0, (prev[meal.id] || 0) - 1),
              }))
            }
            onReserve={() => {
              // No-op for individual reserve button in this flow, or could be "Add 1 to cart"
              // For now, we rely on the quantity selectors and the main "Place Order" button
              setQuantities((prev) => ({
                ...prev,
                [meal.id]: (prev[meal.id] || 0) + 1,
              }))
            }}
            onToggleFavorite={() => toggleFavoriteMutation.mutate(meal.id)}
            isFavorite={favoriteMealIds.includes(meal.id)}
          />
        ))}
      </div>

      {/* Floating Order Button */}
      {Object.values(quantities).some(q => q > 0) && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            size="lg"
            className="shadow-lg"
            onClick={() => {
              const items = Object.entries(quantities)
                .filter(([_, q]) => q > 0)
                .map(([mealId, quantity]) => ({ mealId, quantity }));

              createOrderMutation.mutate({ items });
            }}
            disabled={createOrderMutation.isPending}
          >
            {createOrderMutation.isPending ? 'Placing Order...' : `Place Order (${Object.values(quantities).reduce((a, b) => a + b, 0)} items)`}
          </Button>
        </div>
      )}
    </div>
  )
}