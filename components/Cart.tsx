import { CartItem, MacroGoals } from "../types/food";

interface CartProps {
  cartItems: CartItem[];
  macroGoals: MacroGoals;
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  onEditItem: (item: CartItem, index: number) => void;
  onRemoveItem: (item: CartItem, index: number) => void;
}

export default function Cart({
  cartItems,
  macroGoals,
  totals,
  onEditItem,
  onRemoveItem,
}: CartProps) {
  const getDifference = (current: number, goal: number) => {
    const diff = goal - current;
    const sign = diff > 0 ? "+" : "";
    return (
      <span className={diff < 0 ? "text-red-600" : "text-green-600"}>
        {sign}
        {diff.toFixed(1)}
      </span>
    );
  };

  return (
    <div className="border rounded-lg p-4 flex flex-col flex-1">
      <h2 className="text-2xl font-bold mb-4 flex-none">Your Cart</h2>
      <div className="space-y-2 overflow-y-auto flex-1">
        {cartItems.map((item, index) => (
          <div key={index} className="p-2 border rounded relative group">
            <div className="absolute top-2 right-2">
              <div className="relative">
                <button
                  className="p-1 hover:bg-gray-100 rounded"
                  onClick={() => onEditItem(item, index)}
                >
                  Edit
                </button>
                <button
                  className="p-1 hover:bg-gray-100 rounded ml-2 text-red-500"
                  onClick={() => onRemoveItem(item, index)}
                >
                  Remove
                </button>
              </div>
            </div>
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-sm text-gray-600">
              Amount: {item.quantity}
              {item.servingSizeUnit}
            </p>
            <p className="text-sm text-gray-600">
              {((item.calories * item.quantity) / item.servingSize).toFixed(1)}{" "}
              kcal | P:{" "}
              {((item.protein * item.quantity) / item.servingSize).toFixed(1)}g
              | C:{" "}
              {((item.carbs * item.quantity) / item.servingSize).toFixed(1)}g |
              F: {((item.fats * item.quantity) / item.servingSize).toFixed(1)}g
            </p>
          </div>
        ))}
      </div>
      <div className="border-t pt-4 flex-none">
        <h3 className="font-bold text-lg mb-2">Totals</h3>
        <div className="grid grid-cols-2 gap-x-4">
          <div>
            <p>Current:</p>
            <p>Calories: {totals.calories.toFixed(1)} kcal</p>
            <p>Protein: {totals.protein.toFixed(1)}g</p>
            <p>Carbs: {totals.carbs.toFixed(1)}g</p>
            <p>Fats: {totals.fats.toFixed(1)}g</p>
          </div>
          <div>
            <p>Remaining:</p>
            <p>
              Calories: {getDifference(totals.calories, macroGoals.calories)}{" "}
              kcal
            </p>
            <p>
              Protein: {getDifference(totals.protein, macroGoals.protein)} g
            </p>
            <p>Carbs: {getDifference(totals.carbs, macroGoals.carbs)} g</p>
            <p>Fats: {getDifference(totals.fats, macroGoals.fats)} g</p>
          </div>
        </div>
      </div>
    </div>
  );
}
