interface PreMealSnackInputProps {
  bolus: number;
  setBolus: (b: number) => void;
}

function PreMealSnackInput({ bolus, setBolus }: PreMealSnackInputProps) {
  return (
    <div className="flex gap-1 items-center py-2">
      <input
        type="number"
        className="w-12 sm:w-16"
        value={bolus}
        onChange={(e) => setBolus(parseFloat(e.target.value))}
      />
      KH vor Mahlzeit
    </div>
  );
}

export default PreMealSnackInput;
