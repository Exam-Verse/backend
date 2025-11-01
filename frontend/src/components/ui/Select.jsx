import React from 'react';

export const Select = ({ 
  label, 
  options = [], 
  value, 
  onChange,
  placeholder = 'Select an option',
  required = false,
  error,
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
      <select
        value={value}
        onChange={onChange}
        required={required}
        className={`input-brutal ${error ? 'border-danger' : ''} cursor-pointer`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-2 text-sm text-danger font-bold">⚠ {error}</p>
      )}
    </div>
  );
};

export default Select;
