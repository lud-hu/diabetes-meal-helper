import { MealComponent } from "../../util/database";

interface IntakeMealComponentInputProps {
  component: MealComponent;
  updateMealComponent: (m: MealComponent) => void;
}

function IntakeMealComponentInput({
  component,
  updateMealComponent,
}: IntakeMealComponentInputProps) {
  return (
    <div className="flex gap-1 items-center py-2">
      <input
        type="number"
        placeholder="4"
        className="w-12 sm:w-16"
        min="0"
        max={component.amount}
        value={component.eaten}
        onChange={(e) =>
          updateMealComponent({
            ...component,
            eaten: parseInt(e.target.value),
          })
        }
      />
      von {component.amount} Stücken {component.name} gegessen
    </div>
  );
}

export default IntakeMealComponentInput;
