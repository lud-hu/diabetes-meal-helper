import { MealComponent } from "./database";

const round = (value: number) => Math.round(value * 10) / 10;

/**
 * Calculates the total amount of carbs for a meal.
 * @param mealComponents The meal components to calculate the carbs for.
 * @returns The total amount of carbs for the meal. Null if not all components have a carb amount set yet.
 */
export const calculateSumOfCarbs = (mealComponents: MealComponent[]) => {
  if (mealComponents.every((c) => typeof c.carbsPerPiece !== "undefined")) {
    const totalCarbs = mealComponents.reduce((acc, c) => {
      return acc + c.amount! * c.carbsPerPiece!;
    }, 0);
    return Math.round(totalCarbs * 10) / 10;
  }
  // If nothing was selected so far, return null
  return null;
};

/**
 * Calculates the amount of insulin (in KH) that needs to be injected after the meal.
 * @param mealComponents The meal components to calculate the carbs for.
 * @param preMealBolus The amount of insulin (in KH) that was injected before the meal.
 * @returns The amount of insulin (in KH) that needs to be injected after the meal. Null if not all components have a eaten amount set yet.
 */
export const calculateAfterMealBolus = (
  mealComponents: MealComponent[],
  preMealBolus: number,
  preMealSnack: number,
) => {
  if (mealComponents.every((c) => typeof c.eaten !== "undefined")) {
    const totalCarbsEaten = mealComponents.reduce(
      (acc, c) => acc + c.eaten! * c.carbsPerPiece!,
      0,
    );
    if (totalCarbsEaten > preMealBolus + preMealSnack) {
      return round(totalCarbsEaten - preMealBolus - preMealSnack);
    }
    if (totalCarbsEaten > preMealBolus) {
      return 0;
    } else {
      return round(totalCarbsEaten - preMealBolus);
    }
  }
  // If nothing was selected so far, return null
  return null;
};
