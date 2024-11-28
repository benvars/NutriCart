"use client";

import { FoodItem } from "@/types/food";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FoodDatabaseProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filteredFoods: FoodItem[];
  onFoodSelect: (food: FoodItem) => void;
}

export default function FoodDatabase({
  searchTerm,
  onSearchChange,
  filteredFoods,
  onFoodSelect,
}: FoodDatabaseProps) {
  return (
    <Card className="flex flex-col flex-1 h-full">
      <CardHeader className="flex-none">
        <CardTitle>Food Database</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 h-full">
        <Input
          type="text"
          placeholder="Search foods..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-none"
        />
        <ScrollArea className="h-[calc(100%-120px)]">
          <div className="space-y-2">
            {filteredFoods.map((food) => (
              <div
                key={food.id}
                className="flex justify-between items-center p-4 border rounded hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div>
                  <h3 className="font-semibold">{food.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Per {food.servingSize}
                    {food.servingSizeUnit} | {food.calories} kcal | P:{" "}
                    {food.protein}g | C: {food.carbs}g | F: {food.fats}g
                  </p>
                </div>
                <Button
                  onClick={() => onFoodSelect(food)}
                  className="flex-none ml-4"
                >
                  Add
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
