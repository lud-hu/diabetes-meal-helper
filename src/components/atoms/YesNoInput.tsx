import { useState } from "react";

interface YesNoInputProps {
  onChange: (isBloodSugarHigh: boolean) => void;
  defaultValue?: boolean;
}

function YesNoInput({ onChange, defaultValue }: YesNoInputProps) {
  const [selectedOption, setSelectedOption] = useState(
    defaultValue === true ? "yes" : "no",
  );

  const handleOnChange = (newState: "yes" | "no") => {
    setSelectedOption(newState);
    onChange(newState === "yes");
  };

  return (
    <form className="w-full flex">
      <div className="flex-1">
        <label>
          <input
            className="m-3"
            type="radio"
            value="yes"
            checked={selectedOption === "yes"}
            onChange={() => handleOnChange("yes")}
          />
          Ja
        </label>
      </div>
      <div className="flex-1">
        <label>
          <input
            className="m-3"
            type="radio"
            value="no"
            checked={selectedOption === "no"}
            onChange={() => handleOnChange("no")}
          />
          Nein
        </label>
      </div>
    </form>
  );
}

export default YesNoInput;
