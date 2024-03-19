import { useEffect, useState } from "react";
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

const emptyMealComponent = {
  name: undefined,
  amount: undefined,
  carbsPerPiece: undefined,
};

function Configuration() {
  const [meal, setMeal] = useState<Meal>({
    mealComponents: [emptyMealComponent],
    preMealBolus: 0,
    date: new Date(),
  });
  const [isLoading, setIsLoading] = useState(false);

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
      createOrUpdateMeal(db, {
        ...updatedMeal,
        // Filter out placeholder compontent if present:
        mealComponents: updatedMeal.mealComponents.filter(
          (c) => !!c.name && !!c.amount && !!c.carbsPerPiece
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

  return (
    <>
      {isLoading && <div>Lädt...</div>}
      <section className="mb-24">
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
      <button onClick={() => saveMealToDb(meal)}>Speichern</button>
    </>
  );
}

export default Configuration;
