import React from 'react';

export const Input = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange,
  error,
  required = false,
  className = '',
  ...props 
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block mb-2 font-bold text-sm uppercase tracking-wide">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`input-brutal ${error ? 'border-danger' : ''}`}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-danger font-bold">⚠ {error}</p>
      )}
    </div>
  );
};

export default Input;
