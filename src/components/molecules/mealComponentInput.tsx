import { MealComponent } from "../../util/database";
import NumberInput from "../atoms/NumberInput";

interface MealComponentInputProps {
  component: MealComponent;
  updateMealComponent: (m: MealComponent) => void;
}

function MealComponentInput({
  component,
  updateMealComponent,
}: MealComponentInputProps) {
  return (
    <div>
      <div className="py-4">
        <input
          type="text"
          className="w-full"
          placeholder="Apfel"
          value={component.name || ""}
          onChange={(e) =>
            updateMealComponent({
              ...component,
              name: e.target.value,
            })
          }
        />
      </div>
      <div className="flex gap-1 items-center pl-4 pb-4 flex-wrap">
        <NumberInput
          placeholder="4"
          min={0}
          value={component.amount}
          onChange={(e) =>
            updateMealComponent({
              ...component,
              amount: e,
            })
          }
        />
        Stk. mit je
        <input
          type="number"
          placeholder="0.5"
          className="w-12 sm:w-16"
          min={0}
          step={0.5}
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
    </div>
  );
}

export default MealComponentInput;
