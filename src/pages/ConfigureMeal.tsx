import { useEffect, useMemo, useState } from "react";
import PreMealBolusInput from "../components/molecules/PreMealBolusInput";
import MealComponentInput from "../components/molecules/mealComponentInput";
import { db } from "../firebase";
import {
  Meal,
  MealComponent,
  createOrUpdateMeal,
  getMealForToday,
} from "../util/database";
import Heading from "../components/molecules/Heading";
import LoadingSpinner from "../components/molecules/LoadingSpinner";
import { Timestamp } from "firebase/firestore";

const emptyMealComponent = {
  name: undefined,
  amount: 0,
  carbsPerPiece: undefined,
  eaten: 0
};

function Configuration() {
  const [meal, setMeal] = useState<Meal>({
    mealComponents: [emptyMealComponent],
    preMealBolus: 0,
    preMealSnack: 0,
    highBloodSugarAdaption: 0,
    date: Timestamp.fromDate(new Date()),
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getTodaysMeal();
  }, []);

  const updateMealComponent = (index: number, c: MealComponent) => {
    setMeal((m: Meal) => ({
      ...m,
      mealComponents: [
        ...m.mealComponents.slice(0, index),
        c,
        ...m.mealComponents.slice(index + 1),
      ],
    }));
  };

  /**
   * Saves or updates the given meal to the DB.
   * @param updatedMeal
   */
  const saveMealToDb = async (updatedMeal: Meal) => {
    setIsLoading(true);
    try {
      await createOrUpdateMeal(db, {
        ...updatedMeal,
        // Filter out placeholder compontent if present:
        mealComponents: updatedMeal.mealComponents.filter(
          (c) => !!c.name && !!c.amount && !!c.carbsPerPiece,
        ),
      });
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

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

  /**
   * Calculates the total amount carbs for this dish.
   */
  const sumOfCarbs = useMemo(() => {
    if (
      meal?.mealComponents.every((c) => typeof c.carbsPerPiece !== "undefined")
    ) {
      const totalCarbs = meal.mealComponents.reduce(
        (acc, c) => acc + c.amount! * c.carbsPerPiece!,
        0,
      );
      return totalCarbs;
    }
    // If nothing was selected so far, return null
    return null;
  }, [meal]);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <section className="mb-24">
        {meal.id &&
          "Initial gespeichert: " + meal.date.toDate().toLocaleTimeString()}
        <Heading
          title="Bestandteile konfigurieren"
          subtitle="Einzelne Bestandteile des Mittagessens samt Kohlenhydratangaben pro Stück."
        />
        <ol className="mb-4">
          {meal.mealComponents.map((c, i) => (
            <li key={i}>
              <MealComponentInput
                component={c}
                updateMealComponent={(update) => updateMealComponent(i, update)}
              />
            </li>
          ))}
        </ol>
        <div className="text-center">
          <button
            onClick={() =>
              setMeal({
                ...meal,
                mealComponents: [...meal.mealComponents, emptyMealComponent],
              })
            }
          >
            + Bestandteil hinzufügen
          </button>
        </div>
        {sumOfCarbs !== null && (
          <div className="pt-5">
            <span className="text-2xl">{sumOfCarbs}</span> Kohlenhydrate gesamt
          </div>
        )}
      </section>
      <section className="mb-12">
        <Heading
          title="Bolusmenge vor Mahlzeit"
          subtitle="Für diese Menge an Kohlenhydraten muss vor der Mahlzeit ein Bolus gegeben werden."
        />
        <PreMealBolusInput
          bolus={meal.preMealBolus}
          setBolus={(update) =>
            setMeal((m: Meal) => ({
              ...m,
              preMealBolus: update,
            }))
          }
        />
      </section>
      <section className="mb-12">
        <Heading
          title="Snack-Menge vor Mahlzeit"
          subtitle="Für diese Menge an Kohlenhydraten muss vor der Mahlzeit ein Snack gegeben werden."
        />
        <PreMealBolusInput
          bolus={meal.preMealSnack}
          setBolus={(update) =>
            setMeal((m: Meal) => ({
              ...m,
              preMealSnack: update,
            }))
          }
        />
      </section>
      {sumOfCarbs !== null && (
        <div className="w-full">
          {sumOfCarbs - meal.preMealBolus - meal.preMealSnack < 0 ? (
            <div>Warnung: Der Gesamtbolus ist größer als die gesamten KH!</div>
          ) : (
            <div></div>
          )}
        </div>
      )}
      <div className="text-center">
        <button onClick={() => saveMealToDb(meal)}>Speichern</button>
      </div>
    </>
  );
}

export default Configuration;
