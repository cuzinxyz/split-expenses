import React from 'react';
import { Check } from "lucide-react";

interface CustomCheckboxProps {
  id: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  id,
  checked,
  onChange,
  label,
}) => (
  <div className="flex items-center">
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="sr-only"
    />
    <label htmlFor={id} className="flex items-center cursor-pointer">
      <div
        className={`w-5 h-5 flex items-center justify-center border-2 rounded-md transition-all duration-200 ${
          checked ? 'bg-sky-600 border-sky-600' : 'bg-white border-gray-200'
        }`}
      >
        {checked && <Check className="text-white" size={14} />}
      </div>
      <span className="ml-3 text-gray-700 text-base">{label}</span>
    </label>
  </div>
);

export default CustomCheckbox;
