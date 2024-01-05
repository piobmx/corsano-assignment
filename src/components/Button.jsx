import React from "react";

const Button = ({ children, onClick, className }) => {
  return (
    <button
      className={`bg-blue-600 mr-3 mb-4 font-bold text-white px-4 py-2 rounded ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
