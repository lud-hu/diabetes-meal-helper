import { useState } from "react";
import { MealComponent } from "../../util/database";
import Input from "../atoms/Input";
import KhPerGrIcon from "../atoms/KhPerGrIcon";
import NumberInput from "../atoms/NumberInput";

interface MealComponentInputProps {
  component: MealComponent;
  updateMealComponent: (m: MealComponent) => void;
}

function MealComponentInput({
  component,
  updateMealComponent,
}: MealComponentInputProps) {
  const [type, setType] = useState<MealComponent["type"]>(
    component.type || "pieces",
  );

  return (
    <div>
      <div className="py-4 flex gap-1">
        <input
          type="text"
          className="w-full text-center"
          placeholder="Apfel"
          value={component.name || ""}
          onChange={(e) =>
            updateMealComponent({
              ...component,
              name: e.target.value,
              type,
            })
          }
        />
        <select
          className="bg-gray-200 dark:bg-gray-700 rounded px-3"
          value={type}
          onChange={(event) =>
            setType(event.target.value as "pieces" | "grams")
          }
        >
          <option value="pieces">Stücke</option>
          <option value="grams">Menge</option>
        </select>
      </div>
      <div className="flex gap-1 items-center pl-4 pb-4 flex-wrap">
        <NumberInput
          placeholder="4"
          min={0}
          value={component.amount}
          suffix={type === "grams" ? "gr" : "St"}
          onChange={(e) =>
            updateMealComponent({
              ...component,
              amount: e,
              type,
            })
          }
        />
        mit
        <Input
          type="number"
          placeholder="0.5"
          className="w-24 sm:w-16 text-center"
          min={0}
          step={0.1}
          value={
            component.carbsPerPiece === undefined ? "" : component.carbsPerPiece
          }
          onChange={(e) =>
            updateMealComponent({
              ...component,
              carbsPerPiece: parseFloat(e.target.value),
              type,
            })
          }
          suffix={type === "grams" ? <KhPerGrIcon /> : "KH"}
        />
      </div>
    </div>
  );
}

export default MealComponentInput;
