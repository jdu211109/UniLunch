import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../utils/apiClient";
import { Plus, Edit, Trash2, Calendar, Utensils } from "lucide-react";
import { Button, Card, Badge, AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "../ui";
import MenuFormDialog from "./MenuFormDialog";

export default function MenusManager() {
    const queryClient = useQueryClient();
    const { data: menus = [] } = useQuery({
        queryKey: ["menus"],
        queryFn: apiClient.listMenus
    });
    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
    const [editingMenu, setEditingMenu] = useState(null);

    const createMenuMutation = useMutation({
        mutationFn: apiClient.createMenu,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["menus"] });
            setIsAddMenuOpen(false);
        },
    });

    const updateMenuMutation = useMutation({
        mutationFn: apiClient.updateMenu,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["menus"] });
            setEditingMenu(null);
        },
    });

    const deleteMenuMutation = useMutation({
        mutationFn: apiClient.deleteMenu,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["menus"] });
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Menus</h2>
                <Button onClick={() => setIsAddMenuOpen(true)}>
                    <Plus size={16} className="mr-2" />
                    Create Menu
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {menus.map((menu) => (
                    <Card key={menu.id} className="overflow-hidden flex flex-col h-full">
                        <div className="h-48 relative">
                            <img
                                src={menu.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop"}
                                alt={menu.name}
                                className="w-full h-full object-cover"
                            />
                            <Badge
                                variant={menu.isActive ? "default" : "secondary"}
                                className="absolute top-2 right-2"
                            >
                                {menu.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>

                        <div className="p-6 flex flex-col flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-xl font-bold mb-1">{menu.name}</h3>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Calendar size={14} className="mr-1" />
                                        {new Date(menu.date).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="text-lg font-bold">
                                    ${Number(menu.price || 0).toFixed(2)}
                                </div>
                            </div>

                            <p className="text-sm text-muted-foreground mb-4 flex-1">
                                {menu.description}
                            </p>

                            <div className="mb-6">
                                <div className="flex items-center text-sm font-medium mb-2">
                                    <Utensils size={14} className="mr-2" />
                                    Included Meals ({menu.meals?.length || 0})
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {menu.meals?.slice(0, 3).map((meal) => (
                                        <Badge key={meal.id} variant="outline" className="text-xs">
                                            {meal.name}
                                        </Badge>
                                    ))}
                                    {(menu.meals?.length || 0) > 3 && (
                                        <Badge variant="outline" className="text-xs">
                                            +{menu.meals.length - 3} more
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 pt-0 flex justify-end gap-2 mt-auto border-t">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingMenu(menu)}
                            >
                                <Edit size={16} className="mr-2" />
                                Edit
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
                                        <Trash2 size={16} className="mr-2" />
                                        Delete
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Menu</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to delete "{menu.name}"?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => deleteMenuMutation.mutate({ id: menu.id })}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </Card>
                ))}
            </div>

            <MenuFormDialog
                isOpen={isAddMenuOpen}
                onClose={() => setIsAddMenuOpen(false)}
                onSubmit={(data) => createMenuMutation.mutate(data)}
                isLoading={createMenuMutation.isPending}
            />
            {editingMenu && (
                <MenuFormDialog
                    isOpen={!!editingMenu}
                    onClose={() => setEditingMenu(null)}
                    onSubmit={(data) =>
                        updateMenuMutation.mutate({ id: editingMenu.id, ...data })
                    }
                    isLoading={updateMenuMutation.isPending}
                    initialData={editingMenu}
                />
            )}
        </div>
    );
}
