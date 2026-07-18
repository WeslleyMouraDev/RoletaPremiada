import type { WheelSegment } from '../types/campaign';

/**
 * Sorteia um segmento respeitando o saldo disponível.
 * Se saldo < menor prêmio, force "Não foi dessa vez".
 */
export function calculateResult(
  _availableBalance: number,
  segments: WheelSegment[]
): WheelSegment {
  // Sorteia puramente entre todos os segmentos, independente do saldo
  const totalWeight = segments.reduce((sum, s) => sum + s.weight, 0);
  let rand = Math.random() * totalWeight;

  for (const seg of segments) {
    rand -= seg.weight;
    if (rand <= 0) return seg;
  }

  return segments[segments.length - 1];
}

/**
 * Calcula índice do segmento na roleta para parar a animação.
 * Retorna o índice (0-based) do segmento na array.
 */
export function getSegmentIndex(segments: WheelSegment[], targetId: string): number {
  return segments.findIndex(s => s.id === targetId);
}
