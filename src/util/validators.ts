import { CarteDuJour, Meal, MealComponent } from "./database";

export const validateCarteDuJour = (carteDuJour: CarteDuJour): boolean => {
  if (!carteDuJour || !carteDuJour.meals) return false;

  for (const meal of carteDuJour.meals) {
    if (!validateMeal(meal)) return false;
  }

  return true;
};

export const validateMeal = (meal: Meal): boolean => {
  if (!meal || !meal.mealComponents) return false;

  for (const mealComponent of meal.mealComponents) {
    if (!validateMealComponent(mealComponent)) return false;
  }

  // If there is no valid meal component, the meal is invalid
  if (!meal.mealComponents.some(validateMealComponent)) return false;

  return true;
};

export const validateMealComponent = (
  mealComponent: MealComponent,
): boolean => {
  if (!mealComponent) return false;

  return mealComponent.name !== undefined && mealComponent.amount !== undefined;
};

export const isIntakeDone = (meal: Meal): boolean => {
  if (!meal) return false;

  return (meal.given?.preMealBolus && meal.given?.afterMealBolus) || false;
};
