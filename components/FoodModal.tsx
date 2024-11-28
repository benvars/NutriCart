import { FoodItem } from "../types/food";
import { useState } from "react";

interface FoodModalProps {
  food: FoodItem;
  onClose: () => void;
  onAdd: (food: FoodItem, quantity: number) => void;
  initialQuantity?: number;
}

export default function FoodModal({
  food,
  onClose,
  onAdd,
  initialQuantity,
}: FoodModalProps) {
  const [quantity, setQuantity] = useState(initialQuantity ?? food.servingSize);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(food, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">
          {initialQuantity ? `Edit ${food.name}` : food.name}
        </h2>

        <div className="mb-4 text-sm text-gray-600">
          <p>
            Per {food.servingSize}
            {food.servingSizeUnit}:
          </p>
          <p>Calories: {food.calories} kcal</p>
          <p>Protein: {food.protein}g</p>
          <p>Carbs: {food.carbs}g</p>
          <p>Fats: {food.fats}g</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount ({food.servingSizeUnit}):
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {initialQuantity ? "Save" : "Add to Cart"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
