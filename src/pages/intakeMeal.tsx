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
import YesNoInput from "../components/atoms/YesNoInput";
import confetti from "canvas-confetti";

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

  const handleBloodSugarCheck = (isBloodSugarHigh: boolean) => {
    if (meal) {
      if (isBloodSugarHigh) {
        // Blood sugar is higher than 200 mg/dl
        // Decrease afterMealBolus by 2 KH
        setMeal({ ...meal, highBloodSugarAdaption: -2 });
      } else {
        setMeal({ ...meal, highBloodSugarAdaption: 0 });
      }
    }
  };

  /**
   * Calculates the amount insulin (in KH) that needs to be injected after the meal.
   * It does NOT include a potential high blood sugar adaption (so that
   * there can be more reactive calculations be done beforehand).
   */
  const afterMealBolus = useMemo(() => {
    if (meal?.mealComponents.every((c) => typeof c.eaten !== "undefined")) {
      const totalCarbsEaten = meal.mealComponents.reduce(
        (acc, c) => acc + c.eaten! * c.carbsPerPiece!,
        0,
      );
      return totalCarbsEaten - meal.preMealBolus - meal.preMealSnack;
    }
    // If nothing was selected so far, return null
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="mb-3">
                  <span style={{ fontWeight: "bold" }}>
                    {meal.preMealBolus}
                  </span>{" "}
                  KH über 🍴 "Messer und Gabel" Symbol eingeben (Sofort-Bolus).
                </div>
                <div>
                  <span style={{ fontWeight: "bold" }}>
                    {meal.preMealSnack}
                  </span>{" "}
                  KH als Snack eingeben (Menü - Mahlzeit eingeben - Snack).
                </div>
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
            <ol className="mb-3">
              {meal.mealComponents.map((c, i) => (
                <li key={i}>
                  <IntakeMealComponentInput
                    component={c}
                    updateMealComponent={(u) => updateMealComponent(i, u)}
                  />
                </li>
              ))}
            </ol>
            {afterMealBolus !== null && (
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                {afterMealBolus > 0 ? (
                  <div>
                    <span style={{ fontWeight: "bold" }}>{afterMealBolus}</span>{" "}
                    KH über 🍴 "Messer und Gabel" Symbol eingeben.
                  </div>
                ) : afterMealBolus === 0 ? (
                  <div>Kein zusätzlicher Bolus erforderlich.</div>
                ) : (
                  <div className="w-full">
                    Ist der Blutzucker höher als 200 mg/dl?
                    <YesNoInput onChange={handleBloodSugarCheck} />
                    {afterMealBolus - meal.highBloodSugarAdaption < 0 ? (
                      <div>
                        Theo muss noch{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {Math.ceil(
                            Math.abs(
                              afterMealBolus - meal.highBloodSugarAdaption,
                            ) / 2,
                          )}
                        </span>{" "}
                        Traubenzucker oder Gummibärchen essen.
                      </div>
                    ) : (
                      "Theo muss nichts mehr essen."
                    )}
                  </div>
                )}
                <div className="w-full text-center">
                  <button
                    onClick={() => {
                      if (!meal.afterMealBolusGiven) {
                        confetti({
                          particleCount: 100,
                          spread: 70,
                          origin: { y: 0.6 },
                        });
                      }
                      setAfterBolusGiven(!meal.afterMealBolusGiven);
                    }}
                  >
                    {meal.afterMealBolusGiven ? "Erledigt ✅" : "Erledigt?"}
                  </button>
                </div>
              </div>
            )}
          </section>
        </>
      )}
    </>
  );
}

export default IntakeMeal;
