import { useState } from "react";

interface YesNoInputProps {
  onChange: (isBloodSugarHigh: boolean) => void;
}

function YesNoInput({ onChange }: YesNoInputProps) {
  const [selectedOption, setSelectedOption] = useState("no");

  const handleOnChange = (newState: "yes" | "no") => {
    setSelectedOption(newState);
    onChange(newState === "yes");
  };

  return (
    <form>
      <div className="">
        <label>
          <input
            type="radio"
            value="yes"
            checked={selectedOption === "yes"}
            onChange={() => handleOnChange("yes")}
          />
          Ja
        </label>
      </div>
      <div className="">
        <label>
          <input
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
