import { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  suffix?: ReactNode;
}

function Input(props: InputProps) {
  if (!props.suffix) {
    return <input {...props} />;
  }

  return (
    <div className="relative">
      <input {...props} className={props.className + " !pr-8"} />
      <div className="absolute inset-y-0 end-0 flex items-center pe-3.5 pointer-events-none">
        {props.suffix}
      </div>
    </div>
  );
}

export default Input;
