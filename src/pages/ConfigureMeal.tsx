import { useLongPress } from "@uidotdev/usehooks";
import { Timestamp } from "firebase/firestore";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import LoadingSpinner from "../components/molecules/LoadingSpinner";
import MealConfigurationDialog from "../components/templates/MealConfigurationDialog";
import { db } from "../firebase";
import {
  CarteDuJour,
  Meal,
  MealComponent,
  MealType,
  createOrUpdateCarteDuJour,
  getCarteDuJour,
} from "../util/database";
import { validateCarteDuJour, validateMealComponent } from "../util/validators";

export const emptyMealComponent: MealComponent = {
  name: undefined,
  amount: 0,
  carbsPerPiece: undefined,
  eaten: 0,
};

const emptyMeal: Meal = {
  mealComponents: [emptyMealComponent],
  preMealBolus: 0,
  preMealSnack: 0,
  highBloodSugarAdaption: 0,
  title: "Mittagessen",
};

function Configuration() {
  const [isLoading, setIsLoading] = useState(true);
  const longPressAttrs = useLongPress(
    (e: any) => {
      if (carteDuJour.meals.length === 1) {
        enqueueSnackbar("Die letzte Mahlzeit kann nicht gelöscht werden.", {
          variant: "error",
        });
      } else {
        setCarteDuJour((ms) => {
          return {
            ...ms,
            meals: ms.meals.filter((m) => m.title !== e.target.innerText),
          };
        });
      }
    },
    {
      threshold: 500,
    },
  );

  const [carteDuJour, setCarteDuJour] = useState<CarteDuJour>({
    date: Timestamp.fromDate(new Date()),
    meals: [
      {
        ...emptyMeal,
        title: "Mittagessen",
      },
    ],
  });

  useEffect(() => {
    getTodaysMeal();
  }, []);

  /**
   * Saves or updates the given meal to the DB.
   * @param updatedCarteDuJour
   */
  const saveCarteDuJour = async () => {
    setIsLoading(true);

    if (!validateCarteDuJour(carteDuJour)) {
      console.log("Carte du jour is invalid");
      enqueueSnackbar("Es sind nicht alle Felder ausgefüllt!", {
        variant: "error",
      });
      setIsLoading(false);
      return;
    }

    try {
      await createOrUpdateCarteDuJour(db, {
        ...carteDuJour,
        // Filter out placeholder component if present:
        meals: carteDuJour.meals.map((m) => ({
          ...m,
          mealComponents: m.mealComponents.filter(validateMealComponent),
        })),
      });
      enqueueSnackbar("Erfolgreich gespeichert.", {
        variant: "success",
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
      setCarteDuJour(await getCarteDuJour(db));
      // Error thrown if no meal found, just swallow
      // -> we want to have the user create a new one
    } finally {
      setIsLoading(false);
    }
  };

  const addMeal = (mealType: MealType) => {
    setCarteDuJour((ms) => {
      return {
        ...ms,
        meals: [
          ...(mealType === "Frühstück"
            ? [{ ...emptyMeal, title: mealType }]
            : []),
          ...ms.meals,
          ...(mealType === "Abendessen"
            ? [{ ...emptyMeal, title: mealType }]
            : []),
        ],
      };
    });
  };

  const updateOneMeal = (mealTitle: string, newMeal: Meal) =>
    setCarteDuJour((ms) => {
      return {
        ...ms,
        meals: ms.meals.map((m2) => (m2.title === mealTitle ? newMeal : m2)),
      };
    });

  return (
    <Tabs defaultIndex={1}>
      {isLoading && <LoadingSpinner />}
      <TabList className="h-14 leading-10 flex border-b-2 border-emerald-700">
        {carteDuJour.meals.every((m) => m.title !== "Frühstück") && (
          <Tab
            className="inline w-24 py-2 px-3 cursor-pointer text-center"
            onClick={() => addMeal("Frühstück")}
          >
            +
          </Tab>
        )}
        {carteDuJour.meals.map((m) => (
          <Tab
            {...longPressAttrs}
            className="flex-1 inline w-24 py-2 px-3 cursor-pointer text-center"
            selectedClassName="bg-emerald-700 text-white"
          >
            {m.title}
          </Tab>
        ))}
        {carteDuJour.meals.every((m) => m.title !== "Abendessen") && (
          <Tab
            className="inline w-24 py-2 px-3 cursor-pointer text-center"
            onClick={() => addMeal("Abendessen")}
          >
            +
          </Tab>
        )}
      </TabList>

      {/* Not pretty. Improve. */}
      {carteDuJour.meals.every((m) => m.title !== "Frühstück") && (
        <TabPanel>+</TabPanel>
      )}
      {carteDuJour.meals.map((m) => (
        <TabPanel>
          <MealConfigurationDialog
            meal={m}
            setMeal={(newMeal) => updateOneMeal(m.title, newMeal)}
            saveMealToDb={() => saveCarteDuJour()}
          />
        </TabPanel>
      ))}
      {carteDuJour.meals.every((m) => m.title !== "Abendessen") && (
        <TabPanel>+</TabPanel>
      )}
    </Tabs>
  );
}

export default Configuration;
