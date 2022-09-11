type InputProps = {
  label: string;
  type?: string;
  value: string;
  setValue: (newVal: string) => void;
  icon: JSX.Element;
  className?: string;
};

export const Input = ({
  label,
  type = "text",
  value,
  setValue,
  icon,
  className,
}: InputProps) => {
  return (
    <div className={`text-left ${className}`}>
      <label
        htmlFor={label}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-gray-500 sm:text-sm">{icon}</span>
        </div>
        <input
          type={type}
          name={label}
          id={label}
          className="block w-full rounded-md border-gray-300 pl-9 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </div>
  );
};
