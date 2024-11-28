"use client";

import { useState } from "react";
import { FoodItem } from "@/types/food";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface FoodModalProps {
  food: FoodItem;
  initialQuantity?: number;
  onClose: () => void;
  onAdd: (food: FoodItem, quantity: number) => void;
}

export default function FoodModal({
  food,
  initialQuantity,
  onClose,
  onAdd,
}: FoodModalProps) {
  const [quantity, setQuantity] = useState(initialQuantity || food.servingSize);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(food, quantity);
    onClose();
  };

  const calculateNutrients = (amount: number) => {
    const multiplier = amount / food.servingSize;
    return {
      calories: (food.calories * multiplier).toFixed(1),
      protein: (food.protein * multiplier).toFixed(1),
      carbs: (food.carbs * multiplier).toFixed(1),
      fats: (food.fats * multiplier).toFixed(1),
    };
  };

  const nutrients = calculateNutrients(quantity);

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="bg-white dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle>{food.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Amount ({food.servingSizeUnit})</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg flex">
            <div className="flex flex-1 flex-col space-y-2">
              <h3 className="font-semibold">
                Per {food.servingSize}
                {food.servingSizeUnit}:
              </h3>
              <p>Calories: {food.calories} kcal</p>
              <p>Protein: {food.protein}g</p>
              <p>Carbs: {food.carbs}g</p>
              <p>Fats: {food.fats}g</p>
            </div>

            <div className="flex flex-1 flex-col space-y-2">
              <h3 className="font-semibold">
                Per {quantity}
                {food.servingSizeUnit}
              </h3>
              <p>Calories: {nutrients.calories} kcal</p>
              <p>Protein: {nutrients.protein}g</p>
              <p>Carbs: {nutrients.carbs}g</p>
              <p>Fats: {nutrients.fats}g</p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialQuantity ? "Update" : "Add to Cart"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
