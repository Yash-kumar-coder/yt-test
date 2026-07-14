import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg px-5 py-2.5 text-sm';
  
  const variants = {
    primary: 'bg-zinc-950 text-white hover:bg-zinc-800 shadow-sm ring-1 ring-inset ring-zinc-950/10',
    outline: 'bg-white text-zinc-900 ring-1 ring-inset ring-zinc-200 hover:bg-zinc-50 shadow-sm',
    ghost: 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm ring-1 ring-inset ring-red-500/10',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
