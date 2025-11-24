import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui';
import { Input, Label, Textarea, Checkbox, Button } from '../ui';

export default function MealFormDialog({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = React.useState(initialData || {
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    isVegetarian: false,
    isSpicy: false
  });

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
          <DialogTitle>{initialData ? 'Edit Meal' : 'Add Meal'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Meal Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Price ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Meal Image</Label>
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
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <Checkbox
                checked={formData.isVegetarian}
                onCheckedChange={(val) => setFormData({ ...formData, isVegetarian: val })}
              />
              <Label>Vegetarian</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}