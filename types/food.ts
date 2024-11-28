type ServingSizeUnit = "g" | "item";

export interface FoodItem {
  id: string;
  name: string;
  servingSize: number;
  servingSizeUnit: ServingSizeUnit;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface CartItem extends FoodItem {
  quantity: number;
}

export interface MacroGoals {
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
}
