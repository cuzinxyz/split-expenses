import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  onClear: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClear }) => {
  useEffect(() => {
    const timer = setTimeout(onClear, 3000);
    return () => clearTimeout(timer);
  }, [onClear]);

  return (
    <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-down z-50">
      {message}
    </div>
  );
};

export default Toast;
