import React from 'react';

export const Card = ({ 
  children, 
  className = '',
  onClick,
  hover = false,
  ...props 
}) => {
  return (
    <div
      onClick={onClick}
      className={`card-brutal ${hover ? 'hover:shadow-brutal-lg hover:scale-[1.02] transition-all cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
