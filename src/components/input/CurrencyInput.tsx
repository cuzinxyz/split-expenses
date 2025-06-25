import React from 'react';
import InputWithLabel from './InputWithLabel';

interface CurrencyInputProps {
  id: string;
  label: string;
  value: number;
  onValueChange: (val: number) => void;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  id,
  label,
  value,
  onValueChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    onValueChange(rawValue === '' ? 0 : parseInt(rawValue, 10));
  };

  const formattedValue =
    value === 0 ? '' : new Intl.NumberFormat('vi-VN').format(value);

  return (
    <InputWithLabel
      id={id}
      label={label}
      value={formattedValue}
      onChange={handleChange}
      placeholder="0"
    />
  );
};

export default CurrencyInput;
