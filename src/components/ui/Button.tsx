import React from 'react';
import { motion } from 'framer-motion';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gold text-bg hover:bg-[#FFDF8A] shadow-[0_0_15px_rgba(255,209,102,0.3)] hover:shadow-[0_0_25px_rgba(255,209,102,0.5)]',
    secondary: 'bg-dark text-white hover:bg-dark/80 border border-white/10',
    danger: 'bg-orange text-white hover:bg-[#FF7A4D] shadow-[0_0_15px_rgba(241,90,36,0.3)]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: props.disabled ? 1 : 1.02 }}
      whileTap={{ scale: props.disabled ? 1 : 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
