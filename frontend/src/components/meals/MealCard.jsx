// src/components/meals/MealCard.jsx
import React from "react";
import { Leaf, Flame } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge, Button } from "../ui";

export default function MealCard({ 
  meal, 
  isFavorite, 
  quantity, 
  onIncreaseQuantity, 
  onDecreaseQuantity, 
  onReserve,
  onToggleFavorite
}) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[4/3] w-full overflow-hidden relative">
        {meal.imageUrl ? (
          <img
            src={meal.imageUrl}
            alt={meal.name}
            className="h-full w-full object-cover transition-all hover:scale-105"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(meal.name)}&background=random&size=256`;
            }}
          />
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(meal.name)}&background=random&size=256`}
              alt={meal.name}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <button
          onClick={onToggleFavorite}
          className="absolute top-2 right-2 p-1 rounded-full bg-background/80 hover:bg-background transition-colors"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={isFavorite ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={isFavorite ? "text-yellow-400" : "text-white"}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </button>
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{meal.name}</CardTitle>
          <div className="flex gap-1">
            {meal.isVegetarian && (
              <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20">
                <Leaf size={14} className="mr-1 text-green-500" />
                Veg
              </Badge>
            )}
            {meal.isSpicy && (
              <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20">
                <Flame size={14} className="mr-1 text-red-500" />
                Spicy
              </Badge>
            )}
          </div>
        </div>
        <CardDescription>${meal.price.toFixed(2)}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground line-clamp-3">
          {meal.description}
        </p>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onDecreaseQuantity}
            className="h-8 w-8"
          >
            -
          </Button>
          <div className="flex-1 text-center">
            {quantity}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={onIncreaseQuantity}
            className="h-8 w-8"
          >
            +
          </Button>
          <Button
            className="flex-1"
            onClick={onReserve}
          >
            Reserve
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}