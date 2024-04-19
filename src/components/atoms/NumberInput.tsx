import { ReactNode } from "react";
import Input from "./Input";

interface NumberInputProps {
  placeholder: string;
  min?: number;
  max?: number;
  value?: number;
  suffix?: ReactNode;
  onChange: (e: number) => void;
}

function NumberInput(props: NumberInputProps) {
  return (
    <div className="flex">
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
      <Input
        type="number"
        placeholder={props.placeholder}
        className="w-20 !rounded-none no-arrows text-center"
        min={props.min}
        max={props.max}
        value={props.value}
        onChange={(e) => props.onChange(parseInt(e.target.value))}
        suffix={props.suffix}
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
