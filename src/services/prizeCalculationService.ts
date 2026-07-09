import type { WheelSegment } from '../types/campaign';

/**
 * Sorteia um segmento respeitando o saldo disponível.
 * Se saldo < menor prêmio, force "Não foi dessa vez".
 */
export function calculateResult(
  availableBalance: number,
  segments: WheelSegment[]
): WheelSegment {
  const minPrize = Math.min(...segments.filter(s => s.prizeAmount > 0).map(s => s.prizeAmount));

  if (availableBalance < minPrize) {
    // Força segmento sem prêmio
    const noPrize = segments.find(s => s.prizeAmount === 0)!;
    return noPrize;
  }

  // Pesos iguais (weight=1), seleciona aleatoriamente
  const eligible = segments.filter(s => s.prizeAmount <= availableBalance || s.prizeAmount === 0);
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
