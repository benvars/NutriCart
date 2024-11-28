import { useState } from "react";
import localFont from "next/font/local";
import { FoodItem } from "../types/food";
import { foodDatabase } from "../data/foodDatabase";
import FoodModal from "../components/FoodModal";
import ConfirmationModal from "../components/ConfirmationModal";
import MacroGoals from "../components/MacroGoals";
import FoodDatabase from "../components/FoodDatabase";
import Cart from "../components/Cart";

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

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} min-h-screen h-screen p-8 font-[family-name:var(--font-geist-sans)] flex flex-col overflow-hidden`}
    >
      <main className="max-w-6xl mx-auto w-full flex flex-col gap-4 h-full overflow-hidden">
        <div className="flex-none">
          <MacroGoals onGoalsChange={setMacroGoals} />
        </div>

        <div className="flex gap-4 flex-1 min-h-0">
          <FoodDatabase
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filteredFoods={filteredFoods}
            onFoodSelect={setSelectedFood}
          />
          <Cart
            cartItems={cartItems}
            macroGoals={macroGoals}
            totals={totals}
            onEditItem={(item, index) => setEditItem({ item, index })}
            onRemoveItem={(item, index) => setRemoveItem({ item, index })}
          />
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
