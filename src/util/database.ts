import {
  Firestore,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { createCollection } from "../firebase";

export interface CarteDuJour {
  id?: string;
  date: Timestamp;
  meals: Meal[];
}

export type MealType = "Frühstück" | "Mittagessen" | "Abendessen";

export interface Meal {
  title: MealType;
  mealComponents: MealComponent[];
  preMealBolus: number;
  preMealSnack: number;
  highBloodSugarAdaption: number;
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
export const getCarteDuJour = async (db: Firestore) => {
  const collection = createCollection<CarteDuJour>(db, "carteDuJours");

  // Start of day
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  // End of day
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  console.log("Start of day", startOfDay);
  console.log("End of day", endOfDay);

  const mealQuery = query(
    collection,
    where("date", ">", startOfDay),
    where("date", "<=", endOfDay),
    orderBy("date", "desc"),
    // Should never be more than one, but we need to find the bug.
    limit(5),
  );
  const docs = await getDocs(mealQuery);
  const finalDocs: CarteDuJour[] = [];
  docs.docs.forEach((d) =>
    finalDocs.push({
      ...d.data(),
      id: d.id,
    }),
  );

  console.log("Found CarteDuJours: " + finalDocs.length);

  if (finalDocs.length > 1) Promise.reject("Ohje... Zu viel Tageskarten!");
  if (finalDocs.length == 0)
    return Promise.reject("Ohje... Keine Tageskarten gefunden!");

  return finalDocs[0];
};

/**
 * Creates or updates the given meal in the DB. If it's existing or not
 * is determined on whether an id is given or not.
 *
 * @param db
 * @param carteDuJour
 * @returns
 */
export const createOrUpdateCarteDuJour = async (
  db: Firestore,
  carteDuJour: Partial<CarteDuJour>,
) => {
  const collection = createCollection<CarteDuJour>(db, "carteDuJours");

  if (carteDuJour.id) {
    console.log("Updating " + carteDuJour.id);
    // meal existing, perform update
    return updateDoc(doc(collection, carteDuJour.id), {
      ...carteDuJour,
      // How to ignore the id field here?
      id: null,
    });
  } else {
    console.log("Creating new CarteDuJour");
    // new meal, perform creation
    return setDoc(doc(collection), carteDuJour);
  }
};
