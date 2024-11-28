import { useState, useEffect } from "react";

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

  useEffect(() => {
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
      // When updating percentages, ensure they sum to 100
      const otherFields = [
        "proteinPercentage",
        "carbsPercentage",
        "fatsPercentage",
      ].filter((f) => f !== field) as (keyof MacroGoals)[];

      const currentSum = otherFields.reduce((sum, f) => sum + goals[f], 0);
      const remaining = 100 - value;
      const ratio = remaining / currentSum;

      const newGoals = { ...goals, [field]: value };
      otherFields.forEach((f) => {
        newGoals[f] = Math.round(goals[f] * ratio);
      });

      setGoals(newGoals);
    }
  };

  return (
    <div className="border rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Macro Goals</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Daily Calories
            </label>
            <input
              type="number"
              min="0"
              value={goals.calories}
              onChange={(e) =>
                handleInputChange("calories", Number(e.target.value))
              }
              className="w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Protein (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={goals.proteinPercentage}
              onChange={(e) =>
                handleInputChange("proteinPercentage", Number(e.target.value))
              }
              className="w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Carbs (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={goals.carbsPercentage}
              onChange={(e) =>
                handleInputChange("carbsPercentage", Number(e.target.value))
              }
              className="w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fats (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={goals.fatsPercentage}
              onChange={(e) =>
                handleInputChange("fatsPercentage", Number(e.target.value))
              }
              className="w-full border rounded-md p-2"
            />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">Daily Targets</h3>
          <div className="space-y-2">
            <p>
              Protein: {gramsGoals.protein}g ({goals.proteinPercentage}% of
              calories)
            </p>
            <p>
              Carbs: {gramsGoals.carbs}g ({goals.carbsPercentage}% of calories)
            </p>
            <p>
              Fats: {gramsGoals.fats}g ({goals.fatsPercentage}% of calories)
            </p>
            <p className="mt-4 text-sm text-gray-600">
              Total: {goals.calories} calories
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
