import NumberInput from "../atoms/NumberInput";

interface PreMealBolusInputProps {
  bolus: number;
  setBolus: (b: number) => void;
}

function PreMealBolusInput({ bolus, setBolus }: PreMealBolusInputProps) {
  return (
    <div className="flex gap-1 items-center py-2">
      <NumberInput
        placeholder="4"
        min={0}
        value={bolus}
        onChange={(e) => setBolus(e)}
      />
      KH vor Mahlzeit
    </div>
  );
}

export default PreMealBolusInput;
