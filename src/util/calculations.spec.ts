import { expect, test, describe } from "vitest";
import { calculateAfterMealBolus, calculateSumOfCarbs } from "./calculations";

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
        { amount: 3, carbsPerPiece: 3, type: "pieces" },
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

describe("Bolus Calculations", () => {
  test("sums up basic carbs", () => {
    expect(
      calculateAfterMealBolus(
        [
          { eaten: 1, carbsPerPiece: 1, type: "pieces" },
          { eaten: 1, carbsPerPiece: 1, type: "pieces" },
        ],
        0,
        0,
      ),
    ).toBe(2);
  });
  test("sums up basic carbs and subtracts bolus", () => {
    expect(
      calculateAfterMealBolus(
        [
          { eaten: 1, carbsPerPiece: 2, type: "pieces" },
          { eaten: 1, carbsPerPiece: 2, type: "pieces" },
        ],
        1,
        1,
      ),
    ).toBe(2);
  });
  test("sums up more complex carbs", () => {
    expect(
      calculateAfterMealBolus(
        [
          { eaten: 3, carbsPerPiece: 2.5, type: "pieces" },
          { eaten: 4, carbsPerPiece: 1.25, type: "pieces" },
        ],
        2,
        0,
      ),
    ).toBe(10.5);
  });
  test("sums up correctly if carbsPerPiece is null", () => {
    expect(
      calculateAfterMealBolus(
        [
          { eaten: 3, carbsPerPiece: 0, type: "pieces" },
          { eaten: 2, carbsPerPiece: 2, type: "pieces" },
        ],
        2,
        0,
      ),
    ).toBe(2);
  });
  test("returns null if at least one MealComponent is not fully configured", () => {
    expect(
      calculateAfterMealBolus(
        [
          { eaten: 1, carbsPerPiece: 1, type: "pieces" },
          { eaten: undefined, carbsPerPiece: 1, type: "pieces" },
        ],
        0,
        0,
      ),
    ).toBeNull();
  });
  test("sums up carbs per grams correctly", () => {
    expect(
      calculateAfterMealBolus(
        [{ eaten: 100, carbsPerPiece: 0.1, type: "grams" }],
        2,
        0,
      ),
    ).toBe(8);
  });
  test("sums up combination of grams and pieces correctly", () => {
    expect(
      calculateAfterMealBolus(
        [
          { eaten: 10, carbsPerPiece: 1, type: "pieces" },
          { eaten: 100, carbsPerPiece: 0.1, type: "grams" },
        ],
        2,
        0,
      ),
    ).toBe(18);
  });
  test("rounds result properly", () => {
    expect(
      calculateAfterMealBolus(
        [{ eaten: 3, carbsPerPiece: 1.33, type: "pieces" }],
        2,
        0,
      ),
    ).toBe(2);
  });
  // TODO: Is this correct???
  test("returns 0 if eaten more than injected before but not more than injected and snacked before", () => {
    expect(
      calculateAfterMealBolus(
        [{ eaten: 5, carbsPerPiece: 3, type: "pieces" }],
        10,
        10,
      ),
    ).toBe(0);
  });
  // TODO: Is this correct???
  test("returns carb amount if eaten more than injected and snacked before", () => {
    expect(
      calculateAfterMealBolus(
        [{ eaten: 5, carbsPerPiece: 3, type: "pieces" }],
        10,
        0,
      ),
    ).toBe(5);
  });
  test("returns negative carb amount if eaten less than injected before", () => {
    expect(
      calculateAfterMealBolus(
        [{ eaten: 5, carbsPerPiece: 1, type: "pieces" }],
        10,
        0,
      ),
    ).toBe(-5);
  });
});
