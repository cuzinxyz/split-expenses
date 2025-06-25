import React, { useState, useRef } from 'react';
import { ChevronsUpDown, Check } from "lucide-react";
import InputWithLabel from '../input/InputWithLabel';
import useClickOutside from '../../hooks/useClickOutside';
import { useTranslation } from 'react-i18next';

interface SearchableSelectProps<T> {
  options: T[];
  value: any;
  onChange: (value: any) => void;
  placeholder?: string;
  displayKey?: keyof T;
  valueKey?: keyof T;
}

function SearchableSelect<T extends Record<string, any>>({
  options,
  value,
  onChange,
  placeholder = 'Chọn...',
  displayKey = 'name',
  valueKey = 'id',
}: SearchableSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const { t: translate } = useTranslation();

  useClickOutside(ref, () => setIsOpen(false));

  const selectedOption = options.find((opt) => opt[valueKey] === value);

  const filteredOptions = options.filter((opt) =>
    String(opt[displayKey]).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500"
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
          {selectedOption ? selectedOption[displayKey] : placeholder}
        </span>
        <ChevronsUpDown className="text-gray-400" size={20} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-2">
            <InputWithLabel
              id="search"
              label={`${translate('search')}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <ul className="max-h-60 overflow-y-auto custom-scrollbar">
            {filteredOptions.map((opt) => (
              <li
                key={opt[valueKey]}
                onClick={() => {
                  onChange(opt[valueKey]);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                className="px-4 py-2 hover:bg-sky-100 cursor-pointer flex items-center justify-between text-sm"
              >
                {opt.logo && (
                  <img
                    src={opt.logo}
                    alt={String(opt[displayKey])}
                    className="w-10 h-auto mr-3"
                  />
                )}
                <span className="flex-grow">{opt[displayKey]}</span>
                {value === opt[valueKey] && (
                  <Check className="text-sky-600" size={20} />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchableSelect;
