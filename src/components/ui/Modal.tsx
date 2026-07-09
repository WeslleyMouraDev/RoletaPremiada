import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  hideCloseButton?: boolean;
};

export function Modal({ isOpen, onClose, title, children, hideCloseButton = false }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-dark border border-white/10 rounded-2xl shadow-2xl p-6 w-full max-w-lg pointer-events-auto relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold via-orange to-purple opacity-50" />
              
              {title && (
                <h3 className="text-2xl font-black text-white mb-6 pr-8">
                  {title}
                </h3>
              )}

              {!hideCloseButton && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-muted hover:text-white transition-colors p-2"
                  aria-label="Fechar"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}

              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
