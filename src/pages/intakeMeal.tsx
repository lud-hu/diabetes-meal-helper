import { useEffect, useMemo, useState } from "react";
import {
  Meal,
  MealComponent,
  createOrUpdateMeal,
  getMealForToday,
} from "../util/database";
import { db } from "../firebase";
import IntakeMealComponentInput from "../components/molecules/IntakeMealComponentInput";
import Heading from "../components/molecules/Heading";
import LoadingSpinner from "../components/molecules/LoadingSpinner";

function IntakeMeal() {
  const [isLoading, setIsLoading] = useState(false);
  const [meal, setMeal] = useState<Meal>();

  useEffect(() => {
    getTodaysMeal();
  }, []);

  /**
   * Retrieves the meal for the current day.
   * Sets today's meal to the state so that it can be edited and saved again.
   */
  const getTodaysMeal = async () => {
    setIsLoading(true);

    try {
      setMeal(await getMealForToday(db));
      // Error thrown if no meal found, just swallow
      // -> we want to have the user create a new one
    } finally {
      setIsLoading(false);
    }
  };

  const setPreBolusGiven = async (given: boolean) => {
    if (!meal) return;
    setIsLoading(true);
    try {
      await createOrUpdateMeal(db, { id: meal?.id, preMealBolusGiven: given });
      setMeal({ ...meal, preMealBolusGiven: given });
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const setAfterBolusGiven = async (given: boolean) => {
    if (!meal) return;
    setIsLoading(true);
    try {
      await createOrUpdateMeal(db, {
        id: meal?.id,
        afterMealBolusGiven: given,
        mealComponents: meal?.mealComponents,
      });
      setMeal({ ...meal, afterMealBolusGiven: given });
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const updateMealComponent = (index: number, c: MealComponent) => {
    if (meal) {
      setMeal({
        ...meal,
        mealComponents: [
          ...meal.mealComponents.slice(0, index),
          c,
          ...meal.mealComponents.slice(index + 1),
        ],
      });
    }
  };

  const afterMealBolus = useMemo(() => {
    if (meal?.mealComponents.every((c) => !!c.eaten)) {
      const totalCarbsEaten = meal.mealComponents.reduce(
        (acc, c) => acc + c.eaten! * c.carbsPerPiece!,
        0,
      );
      return totalCarbsEaten - meal.preMealBolus;
    }
    return null;
  }, [meal]);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {!meal ? (
        <div>Für Heute wurde noch kein Essen konfiguriert.</div>
      ) : (
        <>
          <section className="mb-24">
            {/* {meal.id} */}
            <Heading
              title="Vor dem Essen"
              subtitle="Ein gewisse Menge der Kohlenhydrate muss man vor dem Essen eingeben."
            />
            <div className="flex items-center justify-between gap-4">
              <div>
                <span style={{ fontWeight: "bold" }}>{meal.preMealBolus}</span>{" "}
                kh über X Symbol eingeben
              </div>
              <button onClick={() => setPreBolusGiven(!meal.preMealBolusGiven)}>
                {meal.preMealBolusGiven ? "Erledigt ✅" : "Erledigt?"}
              </button>
            </div>
          </section>
          <section className="mb-6">
            <Heading
              title="Nach dem Essen"
              subtitle="Wie viel hat Theo insgesamt gegessen? Bitte gebe die Anzahl der Stücke ein."
            />
            <ol>
              {meal.mealComponents.map((c, i) => (
                <li key={i}>
                  <IntakeMealComponentInput
                    component={c}
                    updateMealComponent={(u) => updateMealComponent(i, u)}
                  />
                </li>
              ))}
            </ol>
            {afterMealBolus && (
              <div className="flex items-center justify-between gap-4">
                {afterMealBolus > 0 ? (
                  <div>
                    <span style={{ fontWeight: "bold" }}>{afterMealBolus}</span>{" "}
                    kh über X Symbol eingeben
                  </div>
                ) : (
                  <div>
                    {/* Wenn negativ: 1 Traubenzucker pro fehlendem kh, oder 1 Gummibärchen pro 2kh! */}
                    Theo muss noch{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {Math.abs(afterMealBolus)}
                    </span>{" "}
                    Traubenzucker{" "}
                    {Math.abs(afterMealBolus) / 2 > 1 && (
                      <>
                        oder{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {Math.abs(afterMealBolus) / 2}
                        </span>{" "}
                        Gummibärchen
                      </>
                    )}{" "}
                    essen
                  </div>
                )}
                <button onClick={() => setAfterBolusGiven(true)}>
                  {meal.afterMealBolusGiven ? "Erledigt ✅" : "Erledigt?"}
                </button>
              </div>
            )}
          </section>
        </>
      )}
    </>
  );
}

export default IntakeMeal;
