import confetti from "canvas-confetti";
import { useMemo } from "react";
import YesNoInput from "../../components/atoms/YesNoInput";
import Heading from "../../components/molecules/Heading";
import IntakeMealComponentInput from "../../components/molecules/IntakeMealComponentInput";
import { Meal, MealComponent } from "../../util/database";

interface MealIntakeDialogProps {
  meal: Meal;
  setMeal: (m: Meal) => void; //React.Dispatch<React.SetStateAction<Meal>>;
}

function MealIntakeDialog({ meal, setMeal }: MealIntakeDialogProps) {
  const setPreBolusGiven = async (given: boolean) => {
    if (!meal) return;
    setMeal({ ...meal, preMealBolusGiven: given });
  };

  const setAfterBolusGiven = async (given: boolean) => {
    if (!meal) return;
    setMeal({ ...meal, afterMealBolusGiven: given });
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
      return totalCarbsEaten - meal.preMealBolus;
    }
    // If nothing was selected so far, return null
    return null;
  }, [meal]);

  const MoreFoodNeededText = ({ bolusAmount }: { bolusAmount: number }) => (
    <div className="py-2">
      Theo muss noch
      <ul className="pl-4 pb-2">
        <li>
          <strong>
            {Math.ceil(Math.abs(bolusAmount - meal.highBloodSugarAdaption) / 2)}
          </strong>{" "}
          Traubenzucker <strong>oder</strong>
        </li>
        <li>
          <strong>
            {Math.ceil(Math.abs(bolusAmount - meal.highBloodSugarAdaption) / 2)}
          </strong>{" "}
          Gummibärchen essen <strong>oder</strong>
        </li>
        <li>
          <strong>
            {Math.abs(bolusAmount - meal.highBloodSugarAdaption) * 10}
          </strong>{" "}
          ml Apfelsaft trinken.
        </li>
      </ul>
      In CamAPS FX muss nichts weiter eingegeben werden.
    </div>
  );

  return (
    <div className="p-8 flex-1">
      {!meal ? (
        <div>Für Heute wurde noch kein Essen konfiguriert.</div>
      ) : (
        <>
          <section className="mb-24">
            <Heading
              title={"Vor dem " + meal.title}
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
              title={"Nach dem " + meal.title}
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
            {afterMealBolus !== null && !Number.isNaN(afterMealBolus) && (
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
                      <MoreFoodNeededText bolusAmount={afterMealBolus} />
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
    </div>
  );
}

export default MealIntakeDialog;
