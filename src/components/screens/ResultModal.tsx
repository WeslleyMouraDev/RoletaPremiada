import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Button } from '../ui/Button';
import type { WheelSegment } from '../../types/campaign';

type ResultModalProps = {
  isOpen: boolean;
  result: WheelSegment | null;
  consultantName: string;
  availableBalance: number;
  onContinue: () => void;
};

export function ResultModal({
  isOpen,
  result,
  consultantName,
  availableBalance,
  onContinue,
}: ResultModalProps) {
  const isPrize = Boolean(result && result.prizeAmount > 0);

  useEffect(() => {
    if (!isOpen || !isPrize) return;

    // Dispara confetes dourados
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FFD166', '#F15A24', '#FFFFFF', '#FFE566'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FFD166', '#7B2CFF', '#FFFFFF', '#FFE566'],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };

    frame();
  }, [isOpen, isPrize]);

  if (!isOpen || !result) return null;

  const prizeLabel = isPrize ? result.label : 'Não foi dessa vez';
  const prizeAmount = isPrize ? result.prizeAmount : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="bg-[#0E1520] border border-white/10 rounded-3xl p-8 max-w-md w-full text-center relative overflow-hidden shadow-2xl"
            >
              {/* Barra de cor no topo */}
              <div
                className={`absolute top-0 left-0 w-full h-1.5 ${isPrize ? 'bg-gradient-to-r from-gold via-orange to-green' : 'bg-gradient-to-r from-muted to-dark'}`}
              />

              {isPrize ? (
                <>
                  {/* Resultado com prêmio */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="text-7xl mb-4"
                  >
                    🏆
                  </motion.div>

                  <h2 className="text-2xl font-black text-white mb-2">
                    Parabéns, {consultantName}!
                  </h2>

                  <p className="text-muted mb-6">Você ganhou um prêmio nesta rodada!</p>

                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-green/10 border border-green/20 rounded-2xl p-6 mb-8"
                  >
                    <span className="text-green text-5xl font-black block">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(prizeAmount)}
                    </span>
                    <span className="text-white/60 text-sm mt-1 block">{prizeLabel}</span>
                  </motion.div>
                </>
              ) : (
                <>
                  {/* Resultado sem prêmio */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="text-7xl mb-4"
                  >
                    🎲
                  </motion.div>

                  <h2 className="text-2xl font-black text-white mb-2">
                    Não foi dessa vez!
                  </h2>

                  <p className="text-muted mb-8">
                    Continue tentando, {consultantName}! A sorte pode chegar no próximo giro.
                  </p>

                  {availableBalance === 0 && (
                    <div className="bg-orange/10 border border-orange/20 rounded-xl p-4 mb-6 text-sm text-orange">
                      ⚠️ Verba de prêmios esgotada para esta campanha.
                    </div>
                  )}
                </>
              )}

              <Button onClick={onContinue} fullWidth size="lg" className="uppercase tracking-wider">
                Continuar ➔
              </Button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
