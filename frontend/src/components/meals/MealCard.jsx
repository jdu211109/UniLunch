// src/components/meals/MealCard.jsx
import React from 'react'
import { Leaf, Flame } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Button,
} from '../ui'

export default function MealCard({
  meal,
  isFavorite,
  quantity,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onReserve,
  onToggleFavorite,
}) {
  return (
    <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-background to-muted/20 flex flex-col h-full">
      <div className="aspect-[4/3] w-full overflow-hidden relative">
        <img
          src={meal.imageUrl}
          alt={meal.name}
          className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(meal.name)}&background=random&size=256`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <button
          onClick={onToggleFavorite}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={isFavorite ? 'text-yellow-500' : 'text-gray-600'}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </button>
      </div>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors duration-200">
            {meal.name}
          </CardTitle>
          <div className="flex gap-1">
            {meal.isVegetarian && (
              <Badge
                variant="outline"
                className="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700"
              >
                <Leaf size={12} className="mr-1 text-green-600 dark:text-green-400" />
                Veg
              </Badge>
            )}
            {meal.isSpicy && (
              <Badge
                variant="outline"
                className="bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700"
              >
                <Flame size={12} className="mr-1 text-red-600 dark:text-red-400" />
                Spicy
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CardDescription className="text-2xl font-bold text-primary">
            ${meal.price.toFixed(2)}
          </CardDescription>
        </div>
      </CardHeader>{' '}
      <CardContent className="pb-4 flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {meal.description}
        </p>
      </CardContent>
      <CardFooter className="pt-4 border-t border-border/50">
        <div className="flex w-full items-center gap-3">
          <div className="flex items-center bg-muted/50 rounded-full p-1 w-32">
            <Button
              variant="ghost"
              size="icon"
              onClick={onDecreaseQuantity}
              className="h-8 w-8 rounded-full hover:bg-background hover:shadow-sm"
              disabled={quantity === 0}
            >
              -
            </Button>
            <div className="flex-1 text-center font-semibold">{quantity}</div>
            <Button
                          variant="ghost"
              size="icon"
              onClick={onIncreaseQuantity}
              className="h-8 w-8 rounded-full hover:bg-background hover:shadow-sm"
            >
              +
            </Button>
          </div>
          <Button
            className="flex-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 h-10"
            onClick={onReserve}
            disabled={quantity === 0}
          >
            Reserve
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}