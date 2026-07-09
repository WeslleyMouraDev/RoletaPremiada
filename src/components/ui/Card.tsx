import React from 'react';
import { motion } from 'framer-motion';

type CardProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export function Card({ children, className = '', delay = 0 }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`bg-dark/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl ${className}`}
    >
      {children}
    </motion.div>
  );
}
