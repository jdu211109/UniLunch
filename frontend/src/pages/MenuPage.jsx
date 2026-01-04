// src/pages/MenuPage.jsx
import React, { useState, useRef, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../utils/apiClient'
import MealCard from '../components/meals/MealCard'
import { useLanguage } from '../hooks/useLanguage'
import { useAuth } from '../hooks/useAuth'
import { 
  LayoutGrid, 
  UtensilsCrossed, 
  Leaf, 
  Soup, 
  IceCream, 
  Coffee, 
  CircleEllipsis 
} from 'lucide-react'

const CATEGORY_KEYS = ['set', 'main', 'salad', 'soup', 'dessert', 'drink', 'extra']

const CATEGORY_ICONS = {
  set: LayoutGrid,
  main: UtensilsCrossed,
  salad: Leaf,
  soup: Soup,
  dessert: IceCream,
  drink: Coffee,
  extra: CircleEllipsis
}

export default function MenuPage({ searchQuery = '' }) {
  const queryClient = useQueryClient()
  const [quantities, setQuantities] = useState({})
  const [activeCategory, setActiveCategory] = useState(null)
  const [showActiveLabel, setShowActiveLabel] = useState(false)
  const categoryRefs = useRef({})
  const labelTimerRef = useRef(null)
  const isManualScroll = useRef(false)
  const { t } = useLanguage()
  const { user } = useAuth()
  const isAdmin = user?.isAdmin

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

  // Load cart quantities
  useEffect(() => {
    const cart = apiClient.getCart()
    const cartQuantities = {}
    cart.forEach(item => {
      cartQuantities[item.mealId] = item.quantity
    })
    setQuantities(cartQuantities)
  }, [])

  // Scrollspy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualScroll.current) return

        const visibleEntry = entries.find((entry) => entry.isIntersecting)
        if (visibleEntry) {
          setActiveCategory(visibleEntry.target.id)
        }
      },
      {
        rootMargin: '-20% 0px -60% 0px', 
        threshold: 0
      }
    )

    CATEGORY_KEYS.forEach((key) => {
      const el = categoryRefs.current[key]
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [meals])

  // Fade out active label after 1 second
  useEffect(() => {
    if (activeCategory) {
      setShowActiveLabel(true)
      if (labelTimerRef.current) clearTimeout(labelTimerRef.current)
      labelTimerRef.current = setTimeout(() => {
        setShowActiveLabel(false)
      }, 1000)
    }
  }, [activeCategory])

  const handleIncreaseQuantity = (meal) => {
    // Admins cannot add items to cart
    if (isAdmin) return
    
    const newQuantity = (quantities[meal.id] || 0) + 1
    setQuantities((prev) => ({ ...prev, [meal.id]: newQuantity }))
    const cart = apiClient.getCart()
    const existingItem = cart.find(item => item.mealId == meal.id)
    if (existingItem) {
      apiClient.updateCartItem(meal.id, newQuantity)
    } else {
      apiClient.addToCart(meal, 1)
    }
  }

  const handleDecreaseQuantity = (meal) => {
    // Admins cannot modify cart
    if (isAdmin) return
    
    const currentQuantity = quantities[meal.id] || 0
    if (currentQuantity <= 0) return
    const newQuantity = currentQuantity - 1
    setQuantities((prev) => ({ ...prev, [meal.id]: newQuantity }))
    apiClient.updateCartItem(meal.id, newQuantity)
  }

  const scrollToCategory = (categoryKey) => {
    const element = categoryRefs.current[categoryKey]
    if (element) {
      isManualScroll.current = true
      setActiveCategory(categoryKey)
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      
      // Reset manual scroll lock after animation
      setTimeout(() => {
        isManualScroll.current = false
      }, 1000)
    }
  }

  const categories = CATEGORY_KEYS.map((key) => ({
    key,
    label: t(`menu.categories.${key}`),
    icon: CATEGORY_ICONS[key]
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
    <div className="container mx-auto py-6 px-4 relative">
      {/* Right Rail Navigation */}
      <div className="fixed right-2 sm:right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3 p-2 bg-background/80 backdrop-blur-md rounded-full shadow-lg border border-border/50">
        {categories.map((category) => {
          const count = meals.filter((m) => m.category === category.key).length
          if (count === 0) return null
          
          const isActive = activeCategory === category.key
          const Icon = category.icon

          return (
            <button
              key={category.key}
              onClick={() => scrollToCategory(category.key)}
              className={`
                group relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                ${isActive 
                  ? 'bg-orange-500 text-white shadow-md scale-110' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }
              `}
              aria-label={category.label}
            >
              <Icon size={20} />
              
              {/* Tooltip Label (appears on hover on desktop, or temporarily when active on all devices) */}
              <span className={`
                absolute right-full mr-2 px-2 py-1 bg-foreground text-background text-xs font-medium rounded transition-opacity duration-300 pointer-events-none whitespace-nowrap
                ${(isActive && showActiveLabel) ? 'opacity-100' : 'opacity-0 lg:group-hover:opacity-100'}
              `}>
                {category.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Meals by Category */}
      <div className="space-y-16 pr-12 sm:pr-0"> {/* Add right padding on mobile to avoid overlap */}
        {mealsByCategory.map((category) => (
          <div
            key={category.key}
            id={category.key}
            ref={(el) => (categoryRefs.current[category.key] = el)}
            className="scroll-mt-24"
          >
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-primary">{category.label}</h2>
              <div className="h-px flex-1 bg-border/60"></div>
            </div>
            
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