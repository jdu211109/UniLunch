import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui';
import { Input, Label, Textarea, Checkbox, Button } from '../ui';

export default function MealFormDialog({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = React.useState(initialData || {
    name: '',
    description: '',
    price: 0,
    isVegetarian: false,
    isSpicy: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
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
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div className="flex gap-4">
              <Checkbox
                checked={formData.isVegetarian}
                onCheckedChange={(val) => setFormData({...formData, isVegetarian: val})}
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