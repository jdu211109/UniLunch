import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../utils/apiClient";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    Button,
    Input,
    Label,
    Checkbox,
} from "../ui";
import { Loader2 } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

export default function MenuFormDialog({
    isOpen,
    onClose,
    onSubmit,
    isLoading,
    initialData,
}) {
    const { t } = useLanguage();
    const { register, handleSubmit, reset, setValue, watch } = useForm({
        defaultValues: {
            name: "",
            description: "",
            price: "",
            imageUrl: "",
            date: new Date().toISOString().split("T")[0],
            mealIds: [],
            isActive: true,
        },
    });

    const { data: meals = [] } = useQuery({
        queryKey: ["meals"],
        queryFn: apiClient.listMeals,
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                reset({
                    name: initialData.name,
                    description: initialData.description,
                    price: initialData.price,
                    imageUrl: initialData.imageUrl,
                    date: initialData.date.split("T")[0],
                    mealIds: initialData.mealIds || [],
                    isActive: initialData.isActive,
                });
            } else {
                reset({
                    name: "",
                    description: "",
                    price: "",
                    imageUrl: "",
                    date: new Date().toISOString().split("T")[0],
                    mealIds: [],
                    isActive: true,
                });
            }
        }
    }, [isOpen, initialData, reset]);

    const selectedMealIds = watch("mealIds");

    const handleMealToggle = (mealId) => {
        const currentIds = selectedMealIds || [];
        const newIds = currentIds.includes(mealId)
            ? currentIds.filter((id) => id !== mealId)
            : [...currentIds, mealId];
        setValue("mealIds", newIds);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setValue("imageUrl", reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const currentImageUrl = watch("imageUrl");

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? t('menuForm.editMenu') : t('menuForm.createMenu')}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">{t('menuForm.menuName')}</Label>
                            <Input
                                id="name"
                                placeholder={t('menuForm.menuNamePlaceholder')}
                                {...register("name", { required: true })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">{t('menuForm.description')}</Label>
                            <Input
                                id="description"
                                placeholder={t('menuForm.descriptionPlaceholder')}
                                {...register("description")}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">{t('menuForm.price')}</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    {...register("price", { required: true, min: 0 })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date">{t('menuForm.date')}</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    {...register("date", { required: true })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">{t('menuForm.menuImage')}</Label>
                            <div className="flex flex-col gap-4">
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                                {currentImageUrl && (
                                    <div className="relative w-full h-40 rounded-md overflow-hidden border">
                                        <img
                                            src={currentImageUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            className="absolute top-2 right-2"
                                            onClick={() => setValue("imageUrl", "")}
                                        >
                                            {t('menuForm.remove')}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>{t('menuForm.selectMeals')}</Label>
                            <div className="border rounded-md p-4 space-y-3 max-h-60 overflow-y-auto">
                                {meals.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-2">
                                        {t('menuForm.noMeals')}
                                    </p>
                                ) : (
                                    meals.map((meal) => (
                                        <div
                                            key={meal.id}
                                            className="flex items-center space-x-3 p-2 hover:bg-accent rounded-md transition-colors"
                                        >
                                            <Checkbox
                                                id={`meal-${meal.id}`}
                                                checked={(selectedMealIds || []).includes(meal.id)}
                                                onCheckedChange={() => handleMealToggle(meal.id)}
                                            />
                                            <div className="flex-1">
                                                <label
                                                    htmlFor={`meal-${meal.id}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                >
                                                    {meal.name}
                                                </label>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    ${meal.price.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {t('menuForm.selected')}: {(selectedMealIds || []).length} {t('admin.meals').toLowerCase()}
                            </p>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isActive"
                                checked={watch("isActive")}
                                onCheckedChange={(checked) => setValue("isActive", checked)}
                            />
                            <Label htmlFor="isActive">{t('menuForm.activeMenu')}</Label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            {t('menuForm.cancel')}
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {initialData ? t('menuForm.update') : t('menuForm.create')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
