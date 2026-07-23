import type { WheelSegment } from '../types/campaign';

/**
 * Sorteia um segmento respeitando o saldo disponível.
 * Se saldo < menor prêmio, force "Não foi dessa vez".
 */
export function calculateResult(
  availableBalance: number,
  segments: WheelSegment[]
): WheelSegment {
  // Filtra segmentos válidos que não extrapolam a verba e não deixam saldo de R$ 10
  const eligible = segments.filter(s => {
    const remaining = availableBalance - s.prizeAmount;
    if (s.prizeAmount > availableBalance) return false;
    if (remaining === 10 && s.prizeAmount > 0) return false;
    return true;
  });

  const totalWeight = eligible.reduce((sum, s) => sum + s.weight, 0);
  let rand = Math.random() * totalWeight;

  for (const seg of eligible) {
    rand -= seg.weight;
    if (rand <= 0) return seg;
  }

  return eligible[eligible.length - 1];
}

/**
 * Calcula índice do segmento na roleta para parar a animação.
 * Retorna o índice (0-based) do segmento na array.
 */
export function getSegmentIndex(segments: WheelSegment[], targetId: string): number {
  return segments.findIndex(s => s.id === targetId);
}
