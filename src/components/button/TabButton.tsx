import React from "react";

type Icon = any;

interface TabButtonProps {
  icon: Icon;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({
  icon: Icon,
  label,
  isActive = false,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
      isActive ? "text-sky-600" : "text-gray-500 hover:text-sky-500"
    }`}
  >
    <Icon size={22} />
    <span className="text-xs font-medium mt-1">{label}</span>
  </button>
);

export default TabButton;
