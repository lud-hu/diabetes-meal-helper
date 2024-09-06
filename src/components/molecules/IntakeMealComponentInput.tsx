import { MealComponent } from "../../util/database";
import NumberInput from "../atoms/NumberInput";

interface IntakeMealComponentInputProps {
  component: MealComponent;
  eaten: number;
  onEatenChange: (eaten: number) => void;
}

function IntakeMealComponentInput({
  component,
  eaten,
  onEatenChange,
}: IntakeMealComponentInputProps) {
  return (
    <div className="flex gap-1 items-center py-2">
      <NumberInput
        min={0}
        max={component.amount}
        step={0.5}
        value={eaten}
        onChange={(e) => onEatenChange(e)}
        placeholder="4"
      />
      von {component.amount} {component.type === "grams" ? "gr." : "Stk."}{" "}
      {component.name} gegessen
    </div>
  );
}

export default IntakeMealComponentInput;
