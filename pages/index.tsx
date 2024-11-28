import { useState } from "react";
import localFont from "next/font/local";
import { FoodItem } from "../types/food";
import { foodDatabase } from "../data/foodDatabase";
import FoodModal from "../components/FoodModal";
import ConfirmationModal from "../components/ConfirmationModal";
import MacroGoals from "../components/MacroGoals";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

interface CartItem extends FoodItem {
  quantity: number;
}

interface EditModalState {
  item: CartItem;
  index: number;
}

interface MacroGoals {
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [editItem, setEditItem] = useState<EditModalState | null>(null);
  const [removeItem, setRemoveItem] = useState<EditModalState | null>(null);
  const [macroGoals, setMacroGoals] = useState<MacroGoals>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });

  const filteredFoods = foodDatabase.filter((food) =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (food: FoodItem, quantity: number) => {
    const newItem: CartItem = {
      ...food,
      quantity: quantity,
    };
    setCartItems([...cartItems, newItem]);
  };

  const calculateTotals = () => {
    return cartItems.reduce(
      (acc, item) => {
        const multiplier = item.quantity / item.servingSize;
        return {
          calories: acc.calories + item.calories * multiplier,
          protein: acc.protein + item.protein * multiplier,
          carbs: acc.carbs + item.carbs * multiplier,
          fats: acc.fats + item.fats * multiplier,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  };

  const totals = calculateTotals();

  const updateCartItem = (index: number, newQuantity: number) => {
    const newCart = [...cartItems];
    newCart[index] = { ...newCart[index], quantity: newQuantity };
    setCartItems(newCart);
  };

  const removeCartItem = (index: number) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const getDifference = (current: number, goal: number) => {
    const diff = goal - current;
    const sign = diff > 0 ? "+" : "";
    return (
      <span className={diff < 0 ? "text-red-500" : "text-green-500"}>
        {sign}
        {diff.toFixed(1)}
      </span>
    );
  };

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} min-h-screen h-screen p-8 font-[family-name:var(--font-geist-sans)] flex flex-col overflow-hidden`}
    >
      <main className="max-w-6xl mx-auto w-full flex flex-col gap-4 h-full overflow-hidden">
        <div className="flex-none">
          <MacroGoals onGoalsChange={setMacroGoals} />
        </div>

        <div className="flex gap-4 flex-1 min-h-0">
          {/* Food Database Section */}
          <div className="border rounded-lg p-4 flex flex-col flex-1">
            <h2 className="text-2xl font-bold mb-4 flex-none">Food Database</h2>
            <input
              type="text"
              placeholder="Search foods..."
              className="w-full p-2 border rounded mb-4 flex-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="space-y-2 overflow-y-auto flex-1">
              {filteredFoods.map((food) => (
                <div
                  key={food.id}
                  className="flex justify-between items-center p-2 border rounded"
                >
                  <div>
                    <h3 className="font-semibold">{food.name}</h3>
                    <p className="text-sm text-gray-600">
                      {`Per ${food.servingSize} ${food.servingSizeUnit}: | ${food.calories} kcal | P: ${food.protein}g | C: ${food.carbs}g | F: ${food.fats}g`}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedFood(food)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Section */}
          <div className="border rounded-lg p-4 flex flex-col flex-1">
            <h2 className="text-2xl font-bold mb-4 flex-none">Your Cart</h2>
            <div className="space-y-2 overflow-y-auto flex-1">
              {cartItems.map((item, index) => (
                <div key={index} className="p-2 border rounded relative group">
                  <div className="absolute top-2 right-2">
                    <div className="relative">
                      <button
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={() => setEditItem({ item, index })}
                      >
                        Edit
                      </button>
                      <button
                        className="p-1 hover:bg-gray-100 rounded ml-2 text-red-500"
                        onClick={() => setRemoveItem({ item, index })}
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
                    {(
                      (item.calories * item.quantity) /
                      item.servingSize
                    ).toFixed(1)}{" "}
                    kcal | P:{" "}
                    {(
                      (item.protein * item.quantity) /
                      item.servingSize
                    ).toFixed(1)}
                    g | C:{" "}
                    {((item.carbs * item.quantity) / item.servingSize).toFixed(
                      1
                    )}
                    g | F:{" "}
                    {((item.fats * item.quantity) / item.servingSize).toFixed(
                      1
                    )}
                    g
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
                    Calories:{" "}
                    {getDifference(totals.calories, macroGoals.calories)} kcal
                  </p>
                  <p>
                    Protein: {getDifference(totals.protein, macroGoals.protein)}
                    g
                  </p>
                  <p>Carbs: {getDifference(totals.carbs, macroGoals.carbs)}g</p>
                  <p>Fats: {getDifference(totals.fats, macroGoals.fats)}g</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {selectedFood && (
        <FoodModal
          food={selectedFood}
          onClose={() => setSelectedFood(null)}
          onAdd={addToCart}
        />
      )}

      {editItem && (
        <FoodModal
          food={editItem.item}
          initialQuantity={editItem.item.quantity}
          onClose={() => setEditItem(null)}
          onAdd={(_, newQuantity) => {
            updateCartItem(editItem.index, newQuantity);
            setEditItem(null);
          }}
        />
      )}

      {removeItem && (
        <ConfirmationModal
          title="Remove Food"
          message={
            <>
              Are you sure you want to remove{" "}
              <strong>{removeItem.item.name}</strong> from your cart?
            </>
          }
          onConfirm={() => {
            removeCartItem(removeItem.index);
            setRemoveItem(null);
          }}
          onCancel={() => setRemoveItem(null)}
        />
      )}
    </div>
  );
}
