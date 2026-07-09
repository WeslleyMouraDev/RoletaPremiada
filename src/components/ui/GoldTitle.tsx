import React from 'react';
import { motion } from 'framer-motion';

type GoldTitleProps = {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  delay?: number;
};

export function GoldTitle({ children, size = 'lg', className = '', delay = 0 }: GoldTitleProps) {
  const sizes = {
    sm: 'text-xl md:text-2xl',
    md: 'text-3xl md:text-4xl',
    lg: 'text-4xl md:text-5xl lg:text-6xl',
    xl: 'text-5xl md:text-7xl',
  };

  return (
    <motion.h1
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay, type: 'spring' }}
      className={`font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-[#FFF5D1] via-gold to-[#D4A017] drop-shadow-[0_2px_10px_rgba(255,209,102,0.2)] ${sizes[size]} ${className}`}
    >
      {children}
    </motion.h1>
  );
}
