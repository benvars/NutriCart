"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "./ui/button";

interface MacroGoals {
  calories: number;
  proteinPercentage: number;
  carbsPercentage: number;
  fatsPercentage: number;
}

interface MacroGramsGoals {
  protein: number;
  carbs: number;
  fats: number;
}

interface MacroGoalsProps {
  onGoalsChange: (goals: MacroGramsGoals & { calories: number }) => void;
}

export default function MacroGoals({ onGoalsChange }: MacroGoalsProps) {
  const [goals, setGoals] = useState<MacroGoals>({
    calories: 2000,
    proteinPercentage: 30,
    carbsPercentage: 40,
    fatsPercentage: 30,
  });

  const [gramsGoals, setGramsGoals] = useState<MacroGramsGoals>({
    protein: 0,
    carbs: 0,
    fats: 0,
  });

  const [needsAdjustment, setNeedsAdjustment] = useState(false);

  useEffect(() => {
    const total =
      goals.proteinPercentage + goals.carbsPercentage + goals.fatsPercentage;
    setNeedsAdjustment(total !== 100);

    // Calculate grams based on percentages and calories
    const proteinCalories = (goals.calories * goals.proteinPercentage) / 100;
    const carbsCalories = (goals.calories * goals.carbsPercentage) / 100;
    const fatsCalories = (goals.calories * goals.fatsPercentage) / 100;

    const newGramsGoals = {
      protein: Math.round(proteinCalories / 4),
      carbs: Math.round(carbsCalories / 4),
      fats: Math.round(fatsCalories / 9),
      calories: goals.calories,
    };

    setGramsGoals(newGramsGoals);
    onGoalsChange(newGramsGoals);
  }, [goals, onGoalsChange]);

  const handleInputChange = (field: keyof MacroGoals, value: number) => {
    if (field === "calories") {
      setGoals({ ...goals, calories: value });
    } else {
      // Allow direct updates to percentages
      setGoals({ ...goals, [field]: value });
    }
  };

  const adjustPercentages = () => {
    const total =
      goals.proteinPercentage + goals.carbsPercentage + goals.fatsPercentage;
    if (total === 0) return;

    const ratio = 100 / total;
    setGoals({
      ...goals,
      proteinPercentage: Math.round(goals.proteinPercentage * ratio),
      carbsPercentage: Math.round(goals.carbsPercentage * ratio),
      fatsPercentage: Math.round(goals.fatsPercentage * ratio),
    });
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="macro-goals">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">Macro Goals</h2>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>{goals.calories} kcal</span>
              <span>P: {gramsGoals.protein}g</span>
              <span>C: {gramsGoals.carbs}g</span>
              <span>F: {gramsGoals.fats}g</span>
              {needsAdjustment && (
                <span className="text-yellow-500">
                  (Percentages don&apos;t sum to 100%)
                </span>
              )}
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <Card className="">
            <CardContent className="grid grid-cols-2 gap-4 pt-6">
              <div className="flex flex-col gap-2 p-4">
                <div className="space-y-1">
                  <Label htmlFor="calories">Calories (kcal)</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={goals.calories || ""}
                    onChange={(e) =>
                      handleInputChange("calories", Number(e.target.value))
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="protein">Protein (%)</Label>
                    <Input
                      id="protein"
                      type="number"
                      value={goals.proteinPercentage || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "proteinPercentage",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="carbs">Carbs (%)</Label>
                    <Input
                      id="carbs"
                      type="number"
                      value={goals.carbsPercentage || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "carbsPercentage",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="fats">Fats (%)</Label>
                    <Input
                      id="fats"
                      type="number"
                      value={goals.fatsPercentage || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "fatsPercentage",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>
                {needsAdjustment && (
                  <Button
                    variant="secondary"
                    onClick={adjustPercentages}
                    className="mt-2"
                  >
                    Adjust percentages to sum to 100%
                  </Button>
                )}
              </div>

              <div className="flex flex-col bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Daily Targets</h3>
                <div className="space-y-2">
                  <p>
                    Protein: {gramsGoals.protein}g
                    <span className="text-muted-foreground ml-1 text-sm">
                      ({goals.proteinPercentage}% of calories)
                    </span>
                  </p>
                  <p>
                    Carbs: {gramsGoals.carbs}g
                    <span className="text-muted-foreground ml-1 text-sm">
                      ({goals.carbsPercentage}% of calories)
                    </span>
                  </p>
                  <p>
                    Fats: {gramsGoals.fats}g
                    <span className="text-muted-foreground ml-1 text-sm">
                      ({goals.fatsPercentage}% of calories)
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total: {goals.calories} calories
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
