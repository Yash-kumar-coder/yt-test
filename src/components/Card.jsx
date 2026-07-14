import React from 'react';

const Card = ({ children, className = '', hoverable = false, ...props }) => {
  return (
    <div 
      className={`bg-white rounded-2xl shadow-sm ring-1 ring-zinc-200/50 p-6 ${hoverable ? 'transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
