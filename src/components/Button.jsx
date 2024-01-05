import React from "react";

const Button = ({ children, onClick, className }) => {
  return (
    <button
      className={`rounded bg-white px-3 py-2 mx-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
