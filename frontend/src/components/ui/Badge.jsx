import React from 'react';

export const Badge = ({ 
  children, 
  variant = 'primary',
  className = '',
  ...props 
}) => {
  const variantClasses = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-dark',
    accent: 'bg-accent text-dark',
    success: 'bg-success text-dark',
    danger: 'bg-danger text-white',
    dark: 'bg-dark text-white',
  };
  
  return (
    <span
      className={`px-3 py-1 border-2 border-black text-xs font-bold uppercase inline-block ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
