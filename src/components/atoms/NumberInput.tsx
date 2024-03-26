interface NumberInputProps {
  placeholder: string;
  min?: number;
  max?: number;
  value?: number;
  onChange: (e: number) => void;
}

function NumberInput(props: NumberInputProps) {
  return (
    <div className="flex mr-2">
      <button
        className="disabled:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 rounded-none rounded-l-lg"
        onClick={() =>
          props.value !== undefined ? props.onChange(props.value - 1) : {}
        }
        disabled={
          props.value !== undefined &&
          props.min !== undefined &&
          props.value <= props.min
        }
      >
        -
      </button>
      <input
        type="number"
        placeholder={props.placeholder}
        className="w-12 text-center !rounded-none no-arrows"
        min={props.min}
        max={props.max}
        value={props.value}
        onChange={(e) => props.onChange(parseInt(e.target.value))}
      />
      <button
        className="disabled:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50  rounded-none rounded-r-lg"
        onClick={() =>
          props.value !== undefined ? props.onChange(props.value + 1) : {}
        }
        disabled={
          props.value !== undefined &&
          props.max !== undefined &&
          props.value >= props.max
        }
      >
        +
      </button>
    </div>
  );
}
export default NumberInput;
