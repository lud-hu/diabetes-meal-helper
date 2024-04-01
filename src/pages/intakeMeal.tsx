import { useEffect, useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import LoadingSpinner from "../components/molecules/LoadingSpinner";
import MealIntakeDialog from "../components/templates/MealIntakeDialog";
import { db } from "../firebase";
import {
  CarteDuJour,
  Meal,
  createOrUpdateCarteDuJour,
  getCarteDuJour,
} from "../util/database";
import { isIntakeDone } from "../util/validators";

function IntakeMeal() {
  const [isLoading, setIsLoading] = useState(false);
  const [carteDuJour, setCarteDuJour] = useState<CarteDuJour>();
  const [activeTab, setActiveTab] = useState(0);

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
      const newCarte = await getCarteDuJour(db);
      setCarteDuJour(newCarte);
      // Error thrown if no meal found, just swallow
      // -> we want to have the user create a new one
      calculateInitialTabIndex(newCarte);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOneMeal = (mealTitle: string, newMeal: Meal) => {
    if (!carteDuJour) return;
    const updatedCarteDuJour = {
      ...carteDuJour,
      meals: carteDuJour.meals.map((m2) =>
        m2.title === mealTitle ? newMeal : m2,
      ),
    };
    setCarteDuJour(updatedCarteDuJour);
    console.log("Saving meal to DB");
    saveCarteDuJour(updatedCarteDuJour);
  };

  /**
   * Saves or updates the given meal to the DB.
   * @param updatedCarteDuJour
   */
  const saveCarteDuJour = async (updatedCarteDuJour: CarteDuJour) => {
    setIsLoading(true);
    try {
      await createOrUpdateCarteDuJour(db, {
        ...updatedCarteDuJour,
        // Filter out placeholder component if present:
        meals: updatedCarteDuJour.meals.map((m) => ({
          ...m,
          mealComponents: m.mealComponents.filter(
            (c) => c.name !== undefined && c.amount !== undefined,
          ),
        })),
      });
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Calculates the initial tab index based on the first meal
   * that has not been taken yet and sets it to the Tab bar.
   * @param carte The carte du jour to calculate the index for.
   */
  const calculateInitialTabIndex = (carte: CarteDuJour) => {
    const firstIndex = carte.meals.findIndex((m) => !isIntakeDone(m));
    setActiveTab(firstIndex >= 0 ? firstIndex : 0);
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {!carteDuJour ? (
        <div>Für Heute wurde noch kein Essen konfiguriert.</div>
      ) : (
        <Tabs
          selectedIndex={activeTab}
          onSelect={(index) => setActiveTab(index)}
        >
          <TabList className="h-14 leading-10 flex border-b-2 border-emerald-700">
            {carteDuJour.meals.map((m) => (
              <Tab
                key={m.title}
                className="flex-1 inline w-24 py-2 px-3 cursor-pointer text-center"
                selectedClassName="bg-emerald-700 text-white"
              >
                {m.title + (isIntakeDone(m) ? "\u00A0✅" : "")}
              </Tab>
            ))}
          </TabList>

          {/* Not pretty. Improve. */}
          {carteDuJour.meals.map((m) => (
            <TabPanel key={m.title}>
              <MealIntakeDialog
                meal={m}
                setMeal={(newMeal) => updateOneMeal(m.title, newMeal)}
              />
            </TabPanel>
          ))}
        </Tabs>
      )}
    </>
  );
}

export default IntakeMeal;
