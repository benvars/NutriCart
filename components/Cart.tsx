import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    <Card className="flex flex-col flex-1 h-full">
      <CardHeader>
        <CardTitle>Your Cart</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-[calc(100%-72px)]">
        <ScrollArea className="">
          <div className="space-y-2">
            {cartItems.map((item, index) => (
              <Card key={index} className="relative group">
                <CardContent className="p-4">
                  <div className="absolute top-2 right-2">
                    <div className="relative space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditItem(item, index)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => onRemoveItem(item, index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Amount: {item.quantity}
                    {item.servingSizeUnit}
                  </p>
                  <p className="text-sm text-muted-foreground">
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
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t pt-4 mt-4 h-fit">
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
      </CardContent>
    </Card>
  );
}
