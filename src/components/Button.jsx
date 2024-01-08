import React from "react";

const Button = ({ children, onClick, className, disabled }) => {
  return (
    <button
      className={`fetch-bottom ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
