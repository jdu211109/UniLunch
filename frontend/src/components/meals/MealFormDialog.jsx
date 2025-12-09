import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui';
import { Input, Label, Textarea, Checkbox, Button } from '../ui';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../utils/apiClient';
import { useLanguage } from '../../hooks/useLanguage';

export default function MealFormDialog({ isOpen, onClose, onSubmit, initialData, isLoading }) {
  const { t } = useLanguage();
  const [formData, setFormData] = React.useState(initialData || {
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    category: 'main',
    isVegetarian: false,
    isSpicy: false
  });

  const { data: categories = {} } = useQuery({
    queryKey: ['meal-categories'],
    queryFn: apiClient.getMealCategories,
  });

  React.useEffect(() => {
    if (isOpen && initialData) {
      setFormData(initialData);
    } else if (isOpen && !initialData) {
      setFormData({
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
        category: 'main',
        isVegetarian: false,
        isSpicy: false
      });
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? t('mealForm.editMeal') : t('mealForm.addMeal')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('mealForm.mealName')}</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('mealForm.description')}</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('mealForm.price')}</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('mealForm.category')}</Label>
              <select
                className="w-full px-3 py-2 border rounded-md bg-background"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {Object.keys(categories).map((key) => (
                  <option key={key} value={key}>{t(`menu.categories.${key}`)}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>{t('mealForm.mealImage')}</Label>
              <div className="flex flex-col gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {formData.imageUrl && (
                  <div className="relative w-full h-40 rounded-md overflow-hidden border">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                    >
                      {t('mealForm.remove')}
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={formData.isVegetarian}
                  onCheckedChange={(val) => setFormData({ ...formData, isVegetarian: val })}
                />
                <Label>{t('mealForm.vegetarian')}</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={formData.isSpicy}
                  onCheckedChange={(val) => setFormData({ ...formData, isSpicy: val })}
                />
                <Label>{t('mealForm.spicy')}</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t('mealForm.cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t('mealForm.saving') : t('mealForm.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}