import React from 'react';

interface ActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: string; // Added to accept variant prop
}

const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  onClick,
  className = '',
  variant, // Accept variant prop
  ...props
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-center px-4 py-3 bg-sky-600 text-white font-bold rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all duration-200 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed ${variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : ''} ${variant === 'outline' ? 'bg-transparent border border-sky-600 text-sky-600 hover:bg-sky-50' : ''} ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default ActionButton;
