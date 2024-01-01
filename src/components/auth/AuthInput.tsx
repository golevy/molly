import { cn } from "~/lib/utils";

interface InputProps {
  id: string;
  onChange: any;
  value: string;
  label: string;
  type?: string;
}

const AuthInput = ({ id, onChange, value, label, type }: InputProps) => {
  return (
    <div className="relative">
      <input
        id={id}
        value={value}
        type={type}
        onChange={onChange}
        className="peer block w-full appearance-none rounded-md border px-4 pb-1 pt-6 focus:right-0 focus:outline-none"
        placeholder=" "
      />
      <label
        className={cn(
          "absolute left-4 top-4 z-10",
          "text-zinc-400",
          "origin-[0] -translate-y-3 scale-75 transform duration-150",
          "peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75",
        )}
        htmlFor={id}
      >
        {label}
      </label>
    </div>
  );
};

export default AuthInput;
