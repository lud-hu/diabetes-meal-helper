import { expect, test, describe } from "vitest";
import { calculateAfterMealBolus, calculateSumOfCarbs } from "./calculations";
import { Meal } from "./database";

describe("Carb Calculations", () => {
  test("sums up basic carbs", () => {
    expect(
      calculateSumOfCarbs([
        { amount: 1, carbsPerPiece: 1, type: "pieces" },
        { amount: 1, carbsPerPiece: 1, type: "pieces" },
      ]),
    ).toBe(2);
  });
  test("sums up more complex carbs", () => {
    expect(
      calculateSumOfCarbs([
        { amount: 3, carbsPerPiece: 2.5, type: "pieces" },
        { amount: 4, carbsPerPiece: 1.25, type: "pieces" },
      ]),
    ).toBe(12.5);
  });
  test("sums up correctly if carbsPerPiece is null", () => {
    expect(
      calculateSumOfCarbs([
        { amount: 3, carbsPerPiece: 0, type: "pieces" },
        { amount: 2, carbsPerPiece: 2, type: "pieces" },
      ]),
    ).toBe(4);
  });
  test("returns null if at least one MealComponent is not fully configured", () => {
    expect(
      calculateSumOfCarbs([
        { amount: 1, carbsPerPiece: 1, type: "pieces" },
        { amount: 1, carbsPerPiece: undefined, type: "pieces" },
      ]),
    ).toBeNull();
  });
  test("sums up carbs per grams correctly", () => {
    expect(
      calculateSumOfCarbs([{ amount: 100, carbsPerPiece: 0.1, type: "grams" }]),
    ).toBe(10);
  });
  test("sums up combination of grams and pieces correctly", () => {
    expect(
      calculateSumOfCarbs([
        { amount: 10, carbsPerPiece: 1, type: "pieces" },
        { amount: 100, carbsPerPiece: 0.1, type: "grams" },
      ]),
    ).toBe(20);
  });
  test("rounds result properly", () => {
    expect(
      calculateSumOfCarbs([{ amount: 3, carbsPerPiece: 1.33, type: "pieces" }]),
    ).toBe(4);
  });
});

const partialMeal: Omit<Meal, "mealComponents"> = {
  title: "Mittagessen",
  preMealBolus: 0,
  preMealSnack: 0,
  given: {
    highBloodSugarAdaption: 0,
  },
};

describe("Bolus Calculations", () => {
  test("sums up basic carbs", () => {
    expect(
      calculateAfterMealBolus(
        {
          ...partialMeal,
          mealComponents: [
            { carbsPerPiece: 1, type: "pieces", name: "Apfel" },
            { carbsPerPiece: 1, type: "pieces", name: "Birne" },
          ],
          given: {
            ...partialMeal.given,
            mealComponentPieces: {
              Apfel: 1,
              Birne: 1,
            },
          },
        },
        0,
        0,
      ),
    ).toBe(2);
  });
  test("sums up basic carbs and subtracts bolus", () => {
    expect(
      calculateAfterMealBolus(
        {
          ...partialMeal,
          mealComponents: [
            { carbsPerPiece: 2, type: "pieces", name: "Apfel" },
            { carbsPerPiece: 2, type: "pieces", name: "Birne" },
          ],
          given: {
            ...partialMeal.given,
            mealComponentPieces: {
              Apfel: 1,
              Birne: 1,
            },
          },
        },
        1,
        1,
      ),
    ).toBe(2);
  });
  test("sums up more complex carbs", () => {
    expect(
      calculateAfterMealBolus(
        {
          ...partialMeal,
          mealComponents: [
            { carbsPerPiece: 2.5, type: "pieces", name: "Apfel" },
            { carbsPerPiece: 1.25, type: "pieces", name: "Birne" },
          ],
          given: {
            ...partialMeal.given,
            mealComponentPieces: {
              Apfel: 3,
              Birne: 4,
            },
          },
        },
        2,
        0,
      ),
    ).toBe(10.5);
  });
  test("sums up correctly if carbsPerPiece is null", () => {
    expect(
      calculateAfterMealBolus(
        {
          ...partialMeal,
          mealComponents: [
            { carbsPerPiece: 0, type: "pieces", name: "Apfel" },
            { carbsPerPiece: 2, type: "pieces", name: "Birne" },
          ],
          given: {
            ...partialMeal.given,
            mealComponentPieces: {
              Apfel: 3,
              Birne: 2,
            },
          },
        },
        2,
        0,
      ),
    ).toBe(2);
  });
  test("returns null if at least one MealComponent is not fully configured", () => {
    expect(
      calculateAfterMealBolus(
        {
          ...partialMeal,
          mealComponents: [
            { carbsPerPiece: 1, type: "pieces", name: "Apfel" },
            { carbsPerPiece: 1, type: "pieces", name: "Birne" },
          ],
          given: {
            ...partialMeal.given,
            mealComponentPieces: {
              Apfel: 1,
            },
          },
        },
        0,
        0,
      ),
    ).toBeNull();
  });
  test("sums up carbs per grams correctly", () => {
    expect(
      calculateAfterMealBolus(
        {
          ...partialMeal,
          mealComponents: [
            { carbsPerPiece: 0.1, type: "pieces", name: "Apfel" },
          ],
          given: {
            ...partialMeal.given,
            mealComponentPieces: {
              Apfel: 100,
            },
          },
        },
        2,
        0,
      ),
    ).toBe(8);
  });
  test("sums up combination of grams and pieces correctly", () => {
    expect(
      calculateAfterMealBolus(
        {
          ...partialMeal,
          mealComponents: [
            { carbsPerPiece: 1, type: "pieces", name: "Apfel" },
            { carbsPerPiece: 0.1, type: "pieces", name: "Birne" },
          ],
          given: {
            ...partialMeal.given,
            mealComponentPieces: {
              Apfel: 10,
              Birne: 100,
            },
          },
        },
        2,
        0,
      ),
    ).toBe(18);
  });
  test("rounds result properly", () => {
    expect(
      calculateAfterMealBolus(
        {
          ...partialMeal,
          mealComponents: [
            { carbsPerPiece: 1.33, type: "pieces", name: "Apfel" },
          ],
          given: {
            ...partialMeal.given,
            mealComponentPieces: {
              Apfel: 3,
            },
          },
        },
        2,
        0,
      ),
    ).toBe(2);
  });
  // TODO: Is this correct???
  test("returns 0 if eaten more than injected before but not more than injected and snacked before", () => {
    expect(
      calculateAfterMealBolus(
        {
          ...partialMeal,
          mealComponents: [{ carbsPerPiece: 3, type: "pieces", name: "Apfel" }],
          given: {
            ...partialMeal.given,
            mealComponentPieces: {
              Apfel: 5,
            },
          },
        },
        10,
        10,
      ),
    ).toBe(0);
  });
  // TODO: Is this correct???
  test("returns carb amount if eaten more than injected and snacked before", () => {
    expect(
      calculateAfterMealBolus(
        {
          ...partialMeal,
          mealComponents: [{ carbsPerPiece: 3, type: "pieces", name: "Apfel" }],
          given: {
            ...partialMeal.given,
            mealComponentPieces: {
              Apfel: 5,
            },
          },
        },
        10,
        0,
      ),
    ).toBe(5);
  });
  test("returns negative carb amount if eaten less than injected before", () => {
    expect(
      calculateAfterMealBolus(
        {
          ...partialMeal,
          mealComponents: [{ carbsPerPiece: 1, type: "pieces", name: "Apfel" }],
          given: {
            ...partialMeal.given,
            mealComponentPieces: {
              Apfel: 5,
            },
          },
        },
        10,
        0,
      ),
    ).toBe(-5);
  });
});
