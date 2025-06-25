import React from 'react';

interface InputWithLabelProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
}

const InputWithLabel: React.FC<InputWithLabelProps> = ({ id, label, ...props }) => (
  <div className="relative">
    <input
      id={id}
      placeholder={label}
      className="peer w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 placeholder-transparent"
      {...props}
    />
    <label
      htmlFor={id}
      className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-sky-600"
    >
      {label}
    </label>
  </div>
);

export default InputWithLabel;
