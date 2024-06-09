import { useMemo } from "react";
import Heading from "../../components/molecules/Heading";
import PreMealBolusInput from "../../components/molecules/PreMealBolusInput";
import MealComponentInput from "../../components/molecules/mealComponentInput";
import { Meal, MealComponent } from "../../util/database";
import { emptyMealComponent } from "../../pages/ConfigureMeal";
import { calculateSumOfCarbs } from "../../util/calculations";

interface MealConfigurationDialogProps {
  meal: Meal;
  setMeal: (m: Meal) => void; //React.Dispatch<React.SetStateAction<Meal>>;
  saveMealToDb: () => Promise<void>;
}

function MealConfigurationDialog({
  meal,
  setMeal,
  saveMealToDb,
}: MealConfigurationDialogProps) {
  const updateMealComponent = (index: number, c: MealComponent) => {
    setMeal({
      ...meal,
      mealComponents: [
        ...meal.mealComponents.slice(0, index),
        c,
        ...meal.mealComponents.slice(index + 1),
      ],
    });
  };

  const deleteMealComponent = (index: number) => {
    setMeal({
      ...meal,
      mealComponents: [
        ...meal.mealComponents.slice(0, index),
        ...meal.mealComponents.slice(index + 1),
      ],
    });
  };

  /**
   * Calculates the total amount carbs for this dish.
   */
  const sumOfCarbs = useMemo(() => {
    return calculateSumOfCarbs(meal.mealComponents);
  }, [meal]);

  return (
    <div className="p-8">
      <section className="mb-24">
        <Heading
          title={"Bestandteile für " + meal.title + " konfigurieren"}
          subtitle="Einzelne Bestandteile des Mittagessens samt Kohlenhydratangaben pro Stück."
        />
        <ol className="mb-4">
          {meal.mealComponents.map((c, i) => (
            <li key={i}>
              {i + 1}. Bestandteil
              <MealComponentInput
                component={c}
                updateMealComponent={(update) => updateMealComponent(i, update)}
                deleteMealComponent={
                  i > 0 ? () => deleteMealComponent(i) : undefined
                }
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
            setMeal({
              ...meal,
              preMealBolus: update,
            })
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
            setMeal({
              ...meal,
              preMealSnack: update,
            })
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
        <button onClick={() => saveMealToDb()}>Speichern</button>
      </div>
    </div>
  );
}

export default MealConfigurationDialog;
