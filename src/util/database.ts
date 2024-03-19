import {
  Firestore,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { createCollection } from "../firebase";

export interface Meal {
  id?: string;
  mealComponents: MealComponent[];
  preMealBolus: number;
  date: Date;
  preMealBolusGiven?: boolean;
  afterMealBolusGiven?: boolean;
}

export interface MealComponent {
  name?: string;
  amount?: number;
  carbsPerPiece?: number;
  eaten?: number;
}

/**
 * Returns the meal for the given day if there is any.
 *
 * @param db
 * @returns
 */
export const getMealForToday = async (db: Firestore) => {
  const collection = createCollection<Meal>(db, "meals");

  // Start of day
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  // End of day
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const mealQuery = query(
    collection,
    where("date", ">", startOfDay),
    where("date", "<=", endOfDay)
  );
  const docs = await getDocs(mealQuery);
  const finalDocs: Meal[] = [];
  docs.docs.forEach((d) =>
    finalDocs.push({
      ...d.data(),
      id: d.id,
    })
  );

  if (finalDocs.length > 1)
    return Promise.reject("Ohje... Zu viel Mahlzeiten!");
  if (finalDocs.length == 0)
    return Promise.reject("Ohje... Keine Mahlzeiten gefunden!");

  return finalDocs[0];
};

/**
 * Creates or updates the given meal in the DB. If it's existing or not
 * is determined on whether an id is given or not.
 *
 * @param db
 * @param meal
 * @returns
 */
export const createOrUpdateMeal = async (
  db: Firestore,
  meal: Partial<Meal>
) => {
  const collection = createCollection<Meal>(db, "meals");

  console.log(meal);
  if (meal.id) {
    // meal existing, perform update
    return updateDoc(doc(collection, meal.id), {
      ...meal,
      // How to ignore the id field here?
      id: null,
    });
  } else {
    // new meal, perform creation
    return setDoc(doc(collection), meal);
  }
};
