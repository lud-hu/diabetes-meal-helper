import { MealComponent } from "../../util/database";

interface MealComponentInputProps {
  component: MealComponent;
  updateMealComponent: (m: MealComponent) => void;
}

function MealComponentInput({
  component,
  updateMealComponent,
}: MealComponentInputProps) {
  return (
    <div className="flex gap-1 items-center py-2">
      <input
        type="number"
        placeholder="4"
        className="w-12 sm:w-16"
        value={component.amount || ""}
        onChange={(e) =>
          updateMealComponent({
            ...component,
            amount: parseInt(e.target.value),
          })
        }
      />
      Stücke
      <input
        type="text"
        className="w-28"
        placeholder="Apfel"
        value={component.name || ""}
        onChange={(e) =>
          updateMealComponent({
            ...component,
            name: e.target.value,
          })
        }
      />
      mit je
      <input
        type="number"
        placeholder="0.5"
        className="w-12 sm:w-16"
        value={component.carbsPerPiece || ""}
        onChange={(e) =>
          updateMealComponent({
            ...component,
            carbsPerPiece: parseFloat(e.target.value),
          })
        }
      />
      KH
    </div>
  );
}

export default MealComponentInput;
