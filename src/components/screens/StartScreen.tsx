import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { GoldTitle } from '../ui/GoldTitle';
import { ParticlesBackground } from '../ui/ParticlesBackground';

type StartScreenProps = {
  onSelectCampaign: (type: 'graduacao' | 'pos') => void;
};

export function StartScreen({ onSelectCampaign }: StartScreenProps) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 bg-bg overflow-hidden">
      <ParticlesBackground />
      
      <motion.div 
        className="z-10 flex flex-col items-center max-w-3xl text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-24 h-24 mx-auto bg-dark rounded-full flex items-center justify-center border-2 border-gold/30 shadow-[0_0_30px_rgba(255,209,102,0.2)] mb-6"
          >
            <span className="text-5xl">🎡</span>
          </motion.div>
        </div>

        <GoldTitle size="xl" delay={0.3} className="mb-4">
          Roleta Premiada
          <br />
          <span className="text-white text-4xl md:text-5xl tracking-normal font-bold">
            HUNTER
          </span>
        </GoldTitle>

        <motion.p 
          className="text-base md:text-lg text-muted mb-12 max-w-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Painel de controle para campanhas comerciais. Escolha o segmento da roleta abaixo para iniciar a distribuição de prêmios:
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 w-full max-w-md justify-center"
        >
          <Button 
            size="lg" 
            onClick={() => onSelectCampaign('graduacao')} 
            className="text-lg py-5 uppercase tracking-wider flex-1 shadow-[0_0_20px_rgba(255,209,102,0.15)]"
          >
            🎓 Graduação
          </Button>
          <Button 
            size="lg" 
            variant="danger"
            onClick={() => onSelectCampaign('pos')} 
            className="text-lg py-5 uppercase tracking-wider flex-1 shadow-[0_0_20px_rgba(241,90,36,0.15)]"
          >
            🚀 Pós-Graduação
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
