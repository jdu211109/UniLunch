import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../utils/apiClient";
import { Plus, Edit, Trash2, Calendar, Utensils } from "lucide-react";
import { Button, Card, Badge, AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "../ui";
import MenuFormDialog from "./MenuFormDialog";
import { useLanguage } from "../../hooks/useLanguage";

export default function MenusManager() {
    const queryClient = useQueryClient();
    const { t } = useLanguage();
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
                <h2 className="text-2xl font-bold">{t('menusManager.title')}</h2>
                <Button
                    onClick={() => setIsAddMenuOpen(true)}
                    className="!bg-orange-500 hover:!bg-orange-600 !text-white border-0"
                >
                    <Plus size={16} className="mr-2" />
                    {t('menusManager.createMenu')}
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
                                {menu.isActive ? t('menusManager.active') : t('menusManager.inactive')}
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
                                    {t('menusManager.includedMeals')} ({menu.meals?.length || 0})
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {menu.meals?.slice(0, 3).map((meal) => (
                                        <Badge key={meal.id} variant="outline" className="text-xs">
                                            {meal.name}
                                        </Badge>
                                    ))}
                                    {(menu.meals?.length || 0) > 3 && (
                                        <Badge variant="outline" className="text-xs">
                                            +{menu.meals.length - 3} {t('menusManager.more')}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 pt-4 flex justify-end gap-2 mt-auto border-t">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingMenu(menu)}
                            >
                                <Edit size={16} className="mr-2" />
                                {t('common.edit')}
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                        <Trash2 size={16} className="mr-2" />
                                        {t('common.delete')}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                                                <Trash2 className="h-6 w-6 text-destructive" />
                                            </div>
                                            <AlertDialogTitle className="text-xl">{t('menusManager.deleteMenu')}</AlertDialogTitle>
                                        </div>
                                        <AlertDialogDescription className="text-base">
                                            {t('menusManager.deleteConfirmation')} <span className="font-semibold text-foreground">"{menu.name}"</span>?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => deleteMenuMutation.mutate({ id: menu.id })}
                                        >
                                            {t('common.delete')}
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
