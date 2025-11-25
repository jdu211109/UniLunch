import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../utils/apiClient";
import { Plus, Edit, Trash2, Leaf, Flame, Eye, EyeOff } from "lucide-react";
import { Button, Card, Badge, AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "../ui";
import MealFormDialog from "../meals/MealFormDialog";

export default function MealsManager() {
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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Meals</h2>
                <Button onClick={() => setIsAddMealOpen(true)}>
                    <Plus size={16} className="mr-2" />
                    Add Meal
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {meals.map((meal) => (
                    <Card key={meal.id} className="overflow-hidden flex flex-col h-full">
                        <div className="flex flex-col h-full">
                            <div className="w-full h-48 relative flex-shrink-0">
                                <img
                                    src={meal.imageUrl}
                                    alt={meal.name}
                                    className="h-full w-full object-cover absolute inset-0"
                                />
                            </div>
                            <div className="p-3 flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-base font-bold">{meal.name}</h3>
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
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => updateMealMutation.mutate({ ...meal, isAvailable: meal.isAvailable === false ? true : false })}
                                            className={meal.isAvailable !== false ? "text-green-600" : "text-muted-foreground"}
                                            title={meal.isAvailable !== false ? "Mark as Unavailable" : "Mark as Available"}
                                        >
                                            {meal.isAvailable !== false ? <Eye size={16} /> : <EyeOff size={16} />}
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
                                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                    {meal.description}
                                </p>
                                <div className="flex gap-1">
                                    {meal.isVegetarian && (
                                        <Badge variant="outline" className="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-xs px-2 py-0">
                                            <Leaf size={12} className="mr-1 text-green-600 dark:text-green-400" />
                                            Vegetarian
                                        </Badge>
                                    )}
                                    {meal.isSpicy && (
                                        <Badge variant="outline" className="bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700 text-xs px-2 py-0">
                                            <Flame size={12} className="mr-1 text-red-600 dark:text-red-400" />
                                            Spicy
                                        </Badge>
                                    )}
                                    {meal.isAvailable === false && (
                                        <Badge variant="secondary" className="text-xs px-2 py-0">
                                            Unavailable
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

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
