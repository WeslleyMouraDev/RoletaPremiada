import { useState, useRef, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { GoldTitle } from '../ui/GoldTitle';
import { Button } from '../ui/Button';
import type { Consultant, WheelSegment } from '../../types/campaign';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { calculateResult } from '../../services/prizeCalculationService';

type PrizeWheelScreenProps = {
  consultant: Consultant;
  segments: WheelSegment[];
  availableBalance: number;
  onSpinComplete: (result: WheelSegment) => void;
  onBack: () => void;
};

const WHEEL_SIZE = 500;
const CENTER = WHEEL_SIZE / 2;
const RADIUS = CENTER - 10;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function buildSegmentPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

export function PrizeWheelScreen({
  consultant,
  segments,
  availableBalance,
  onSpinComplete,
  onBack,
}: PrizeWheelScreenProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [rotation, setRotation] = useState(0);
  const controls = useAnimation();
  const resultRef = useRef<WheelSegment | null>(null);
  const { playTickSound, playWinSound, playNoWinSound, isEnabled, toggleSound } = useSoundEffects();

  const segmentAngle = 360 / segments.length;

  const handleSpin = useCallback(async () => {
    if (isSpinning || hasSpun) return;
    setIsSpinning(true);

    // Calcular resultado antes de animar
    const result = calculateResult(availableBalance, segments);
    resultRef.current = result;

    const resultIndex = segments.findIndex(s => s.id === result.id);

    // O ponteiro está no topo (12h). Para que o segmento resultIndex pare no topo:
    // offset = -(resultIndex * segmentAngle) - (segmentAngle / 2)
    // Somamos múltiplas voltas para ter efeito de aceleração
    const extraSpins = 5 + Math.floor(Math.random() * 3); // 5-7 voltas extras
    const targetRotation = 360 * extraSpins + (360 - resultIndex * segmentAngle - segmentAngle / 2);
    const totalRotation = rotation + targetRotation;

    // Ticker de som durante o giro
    let tickCount = 0;
    const totalTicks = extraSpins * segments.length + resultIndex + 1;
    const tickDuration = 5000 / totalTicks;
    const tickInterval = setInterval(() => {
      tickCount++;
      playTickSound();
      if (tickCount >= totalTicks) clearInterval(tickInterval);
    }, Math.max(tickDuration, 30));

    await controls.start({
      rotate: totalRotation,
      transition: {
        duration: 5,
        ease: [0.17, 0.67, 0.34, 0.99], // easeInOut personalizado
      },
    });

    clearInterval(tickInterval);
    setRotation(totalRotation % 360);
    setIsSpinning(false);
    setHasSpun(true);

    if (result.prizeAmount > 0 && availableBalance >= result.prizeAmount) {
      playWinSound();
    } else {
      playNoWinSound();
    }

    // Aguardar 1 segundo para o usuário ver o resultado antes de fechar
    setTimeout(() => {
      onSpinComplete(result);
    }, 1200);
  }, [isSpinning, hasSpun, rotation, segments, availableBalance, controls, playTickSound, playWinSound, playNoWinSound, onSpinComplete]);

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-start p-4 md:p-8">
      
      {/* Header */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} disabled={isSpinning} className="text-muted hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg disabled:opacity-40">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <div>
            <GoldTitle size="sm">Roleta de Prêmios</GoldTitle>
            <p className="text-sm text-muted mt-0.5">
              Consultor: <span className="text-white font-bold">{consultant.name}</span>
              {' · '}Saldo: <span className="text-green font-bold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(availableBalance)}
              </span>
            </p>
          </div>
        </div>
        <button
          onClick={toggleSound}
          className="text-muted hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
          title={isEnabled ? 'Desativar sons' : 'Ativar sons'}
        >
          {isEnabled ? '🔊' : '🔇'}
        </button>
      </div>

      {/* Ponteiro */}
      <div className="relative mb-2 z-10">
        <div className="w-0 h-0 border-l-[14px] border-r-[14px] border-t-[28px] border-l-transparent border-r-transparent border-t-gold drop-shadow-[0_0_8px_rgba(255,209,102,0.8)]" />
      </div>

      {/* Roleta SVG */}
      <div className="relative" style={{ width: Math.min(WHEEL_SIZE, 500), height: Math.min(WHEEL_SIZE, 500) }}>
        {/* Brilho externo */}
        <div className="absolute inset-0 rounded-full shadow-[0_0_60px_rgba(255,209,102,0.15)] pointer-events-none" />
        
        <motion.svg
          width={WHEEL_SIZE}
          height={WHEEL_SIZE}
          viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
          animate={controls}
          style={{ rotate: rotation }}
          className="drop-shadow-2xl"
        >
          {/* Bordas do círculo externo */}
          <circle cx={CENTER} cy={CENTER} r={RADIUS + 8} fill="#FFD166" opacity="0.15" />
          <circle cx={CENTER} cy={CENTER} r={RADIUS + 4} fill="none" stroke="#FFD166" strokeWidth="2" opacity="0.4" />

          {/* Segmentos */}
          {segments.map((seg, i) => {
            const startAngle = i * segmentAngle;
            const endAngle = startAngle + segmentAngle;
            const midAngle = startAngle + segmentAngle / 2;
            const labelPos = polarToCartesian(CENTER, CENTER, RADIUS * 0.68, midAngle);
            const path = buildSegmentPath(CENTER, CENTER, RADIUS, startAngle, endAngle);

            return (
              <g key={seg.id}>
                <path
                  d={path}
                  fill={seg.color}
                  stroke="#0B0F1A"
                  strokeWidth="1.5"
                />
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  fill={seg.textColor}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={seg.prizeAmount === 0 ? '9' : '13'}
                  fontWeight="bold"
                  fontFamily="Inter, sans-serif"
                  transform={`rotate(${midAngle}, ${labelPos.x}, ${labelPos.y})`}
                >
                  {seg.prizeAmount === 0 ? '✕' : seg.label}
                </text>
              </g>
            );
          })}

          {/* Centro da roleta */}
          <circle cx={CENTER} cy={CENTER} r={40} fill="#0B0F1A" stroke="#FFD166" strokeWidth="3" />
          <text x={CENTER} y={CENTER} textAnchor="middle" dominantBaseline="middle" fontSize="24">🎡</text>
        </motion.svg>
      </div>

      {/* Botão de girar */}
      <div className="mt-8">
        {!hasSpun && (
          <Button
            size="lg"
            onClick={handleSpin}
            disabled={isSpinning}
            className="px-16 py-5 text-xl uppercase tracking-wider shadow-[0_0_30px_rgba(255,209,102,0.3)]"
          >
            {isSpinning ? '🎰 Girando...' : '🎯 GIRAR!'}
          </Button>
        )}
        {hasSpun && (
          <div className="text-center animate-pulse">
            <p className="text-muted text-sm">Processando resultado...</p>
          </div>
        )}
      </div>
    </div>
  );
}
