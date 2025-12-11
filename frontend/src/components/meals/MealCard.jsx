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
import { useLanguage } from '../../hooks/useLanguage'

export default function MealCard({
  meal,
  isFavorite,
  quantity,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onToggleFavorite,
}) {
  const { t } = useLanguage()
  const isAvailable = meal.isAvailable !== false;

  return (
    <Card className={`overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-background to-muted/20 flex flex-col h-full ${!isAvailable ? 'grayscale opacity-80' : ''}`}>
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
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
            <span className="text-white font-bold text-xl border-2 border-white px-4 py-2 rounded-md transform -rotate-12">
              {t('menu.soldOut')}
            </span>
          </div>
        )}
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
                {t('menu.vegetarian')}
              </Badge>
            )}
            {meal.isSpicy && (
              <Badge
                variant="outline"
                className="bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700"
              >
                <Flame size={12} className="mr-1 text-red-600 dark:text-red-400" />
                {t('menu.spicy')}
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
        <div className="flex w-full items-center justify-center">
          <div className="flex items-center bg-muted/50 rounded-full p-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onDecreaseQuantity}
              className="h-10 w-10 rounded-full !bg-transparent hover:bg-muted/60 text-lg font-bold"
              disabled={quantity === 0 || !isAvailable}
            >
              -
            </Button>
            <div className="w-12 text-center font-bold text-lg">{quantity}</div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onIncreaseQuantity}
              className="h-10 w-10 rounded-full !bg-transparent hover:bg-muted/60 text-lg font-bold"
              disabled={!isAvailable}
            >
              +
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}