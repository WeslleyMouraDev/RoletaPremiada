import type { WheelSegment } from '../types/campaign';

export const INITIAL_BUDGET_GRADUACAO = 1000;
export const INITIAL_BUDGET_POS = 800;
export const STORAGE_KEY = 'roleta_premiada_hunter_state';

// 20 segmentos fixos PÓS: 13×zero, 4×R$20, 1×R$30, 1×R$50, 1×R$100
export const WHEEL_SEGMENTS_POS: WheelSegment[] = [
  { id: 'nf-1',  label: 'Não foi dessa vez', prizeAmount: 0,   weight: 1, color: '#1E2A36', textColor: '#9CA3AF' },
  { id: 'r20-1', label: 'R$ 20',             prizeAmount: 20,  weight: 1, color: '#22C55E', textColor: '#FFFFFF' },
  { id: 'nf-2',  label: 'Não foi dessa vez', prizeAmount: 0,   weight: 1, color: '#1E2A36', textColor: '#9CA3AF' },
  { id: 'nf-3',  label: 'Não foi dessa vez', prizeAmount: 0,   weight: 1, color: '#1E2A36', textColor: '#9CA3AF' },
  { id: 'r20-2', label: 'R$ 20',             prizeAmount: 20,  weight: 1, color: '#22C55E', textColor: '#FFFFFF' },
  { id: 'nf-4',  label: 'Não foi dessa vez', prizeAmount: 0,   weight: 1, color: '#1E2A36', textColor: '#9CA3AF' },
  { id: 'r50-1', label: 'R$ 50',             prizeAmount: 50,  weight: 1, color: '#F15A24', textColor: '#FFFFFF' },
  { id: 'nf-5',  label: 'Não foi dessa vez', prizeAmount: 0,   weight: 1, color: '#1E2A36', textColor: '#9CA3AF' },
  { id: 'nf-6',  label: 'Não foi dessa vez', prizeAmount: 0,   weight: 1, color: '#1E2A36', textColor: '#9CA3AF' },
  { id: 'r20-3', label: 'R$ 20',             prizeAmount: 20,  weight: 1, color: '#22C55E', textColor: '#FFFFFF' },
  { id: 'r100',  label: 'R$ 100',            prizeAmount: 100, weight: 1, color: '#7B2CFF', textColor: '#FFFFFF' },
  { id: 'nf-7',  label: 'Não foi dessa vez', prizeAmount: 0,   weight: 1, color: '#1E2A36', textColor: '#9CA3AF' },
  { id: 'nf-8',  label: 'Não foi dessa vez', prizeAmount: 0,   weight: 1, color: '#1E2A36', textColor: '#9CA3AF' },
  { id: 'r30-1', label: 'R$ 30',             prizeAmount: 30,  weight: 1, color: '#FFD166', textColor: '#0B0F1A' },
  { id: 'nf-9',  label: 'Não foi dessa vez', prizeAmount: 0,   weight: 1, color: '#1E2A36', textColor: '#9CA3AF' },
  { id: 'r20-4', label: 'R$ 20',             prizeAmount: 20,  weight: 1, color: '#22C55E', textColor: '#FFFFFF' },
  { id: 'nf-10', label: 'Não foi dessa vez', prizeAmount: 0,   weight: 1, color: '#1E2A36', textColor: '#9CA3AF' },
  { id: 'nf-11', label: 'Não foi dessa vez', prizeAmount: 0,   weight: 1, color: '#1E2A36', textColor: '#9CA3AF' },
  { id: 'nf-12', label: 'Não foi dessa vez', prizeAmount: 0,   weight: 1, color: '#1E2A36', textColor: '#9CA3AF' },
  { id: 'nf-13', label: 'Não foi dessa vez', prizeAmount: 0,   weight: 1, color: '#1E2A36', textColor: '#9CA3AF' },
];

// 20 segmentos fixos GRADUAÇÃO: 13×zero, 5×R$20, 1×R$30, 1×R$100 (sem de R$ 50)
export const WHEEL_SEGMENTS_GRADUACAO: WheelSegment[] = [
  { id: 'nf-1',  label: 'Não foi dessa vez', prizeAmount: 0,   weight: 1, color: '#1E2A36', textColor: '#9CA3AF' },
  { id: 'r20-1', label: 'R$ 20',             prizeAmount: 20,  weight: 1, color: '#22C55E', textColor: '#FFFFFF' },
  { id: 'nf-2',  label: 'Não foi dessa vez', prizeAmount: 0,   weight: 1, color: '#1E2A36', textColor: '#9CA3AF' },
  { id: 'nf-3',  label: 'Não foi dessa vez', prizeAmount: 0,   weight: 1, color: '#1E2A36', textColor: '#9CA3AF' },
  { id: 'r20-2', label: 'R$ 20',             prizeAmount: 20,  weight: 1, color: '#22C55E', textColor: '#FFFFFF' },
  { id: 'nf-4',  label: 'Não foi dessa vez', prizeAmount: 0,   weight: 1, color: '#1E2A36', textColor: '#9CA3AF' },
  { id: 'r20-5', label: 'R$ 20',             prizeAmount: 20,  weight: 1, color: '#22C55E', textColor: '#FFFFFF' }, // R$ 50 vira R$ 20
  { id: 'nf-5',  label: 'Não foi dessa vez', prizeAmount: 0,   weight: 1, color: '#1E2A36', textColor: '#9CA3AF' },
  { id: 'nf-6',  label: 'Não foi dessa vez', prizeAmount: 0,   weight: 1, color: '#1E2A36', textColor: '#9CA3AF' },
  { id: 'r20-3', label: 'R$ 20',             prizeAmount: 20,  weight: 1, color: '#22C55E', textColor: '#FFFFFF' },
  { id: 'r100',  label: 'R$ 100',            prizeAmount: 100, weight: 1, color: '#7B2CFF', textColor: '#FFFFFF' },
  { id: 'nf-7',  label: 'Não foi dessa vez', prizeAmount: 0,   weight: 1, color: '#1E2A36', textColor: '#9CA3AF' },
  { id: 'nf-8',  label: 'Não foi dessa vez', prizeAmount: 0,   weight: 1, color: '#1E2A36', textColor: '#9CA3AF' },
  { id: 'r30-1', label: 'R$ 30',             prizeAmount: 30,  weight: 1, color: '#FFD166', textColor: '#0B0F1A' },
  { id: 'nf-9',  label: 'Não foi dessa vez', prizeAmount: 0,   weight: 1, color: '#1E2A36', textColor: '#9CA3AF' },
  { id: 'r20-4', label: 'R$ 20',             prizeAmount: 20,  weight: 1, color: '#22C55E', textColor: '#FFFFFF' },
  { id: 'nf-10', label: 'Não foi dessa vez', prizeAmount: 0,   weight: 1, color: '#1E2A36', textColor: '#9CA3AF' },
  { id: 'nf-11', label: 'Não foi dessa vez', prizeAmount: 0,   weight: 1, color: '#1E2A36', textColor: '#9CA3AF' },
  { id: 'nf-12', label: 'Não foi dessa vez', prizeAmount: 0,   weight: 1, color: '#1E2A36', textColor: '#9CA3AF' },
  { id: 'nf-13', label: 'Não foi dessa vez', prizeAmount: 0,   weight: 1, color: '#1E2A36', textColor: '#9CA3AF' },
];
