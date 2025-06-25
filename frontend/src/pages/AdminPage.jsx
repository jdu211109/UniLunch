// src/pages/AdminPage.jsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../utils/apiClient";
import { Plus, Edit, Trash2, Leaf, Flame } from "lucide-react";
import { Button, Card, Badge, AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "../components/ui";
import MealFormDialog from "../components/meals/MealFormDialog";

export default function AdminPage() {
  const queryClient = useQueryClient();
  const { data: meals = [] } = useQuery({
    queryKey: ["meals"],
    queryFn: apiClient.listMeals
  });
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);

  const createMealMutation = useMutation({
    mutationFn: apiClient.createMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      setIsAddMealOpen(false);
    },
  });

  const updateMealMutation = useMutation({
    mutationFn: apiClient.updateMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      setEditingMeal(null);
    },
  });

  const deleteMealMutation = useMutation({
    mutationFn: apiClient.deleteMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
    },
  });

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Meals</h1>
        <Button onClick={() => setIsAddMealOpen(true)}>
          <Plus size={16} className="mr-2" />
          Add Meal
        </Button>
      </div>

      <div className="space-y-4">
        {meals.map((meal) => (
          <Card key={meal.id}>
            <div className="md:flex">
              <div className="md:w-1/4 h-48 md:h-auto">
                <img
                  src={meal.imageUrl}
                  alt={meal.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{meal.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      ${meal.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingMeal(meal)}
                    >
                      <Edit size={16} />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive">
                          <Trash2 size={16} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Meal</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{meal.name}"?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMealMutation.mutate({ id: meal.id })}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {meal.description}
                </p>
                <div className="flex gap-1">
                  {meal.isVegetarian && (
                    <Badge variant="outline" className="bg-green-50">
                      <Leaf size={14} className="mr-1 text-green-500" />
                      Vegetarian
                    </Badge>
                  )}
                  {meal.isSpicy && (
                    <Badge variant="outline" className="bg-red-50">
                      <Flame size={14} className="mr-1 text-red-500" />
                      Spicy
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Meal Dialogs */}
      <MealFormDialog
        isOpen={isAddMealOpen}
        onClose={() => setIsAddMealOpen(false)}
        onSubmit={(data) => createMealMutation.mutate(data)}
        isLoading={createMealMutation.isPending}
      />
      {editingMeal && (
        <MealFormDialog
          isOpen={!!editingMeal}
          onClose={() => setEditingMeal(null)}
          onSubmit={(data) =>
            updateMealMutation.mutate({ id: editingMeal.id, ...data })
          }
          isLoading={updateMealMutation.isPending}
          initialData={editingMeal}
        />
      )}
    </div>
  );
}