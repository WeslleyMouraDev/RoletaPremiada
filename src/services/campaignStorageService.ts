import { STORAGE_KEY, WHEEL_SEGMENTS, INITIAL_BUDGET } from '../constants/wheelConfig';
import type { CampaignState } from '../types/campaign';

export function createInitialState(campaignType?: 'graduacao' | 'pos'): CampaignState {
  const campaignName = campaignType === 'pos'
    ? 'Roleta Premiada Hunter - Pós-Graduação'
    : 'Roleta Premiada Hunter - Graduação';

  return {
    campaignName,
    initialBudget: INITIAL_BUDGET,
    availableBalance: INITIAL_BUDGET,
    totalPaidPrizes: 0,
    consultants: [],
    spinHistory: [],
    wheelConfig: WHEEL_SEGMENTS,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function loadCampaign(): CampaignState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CampaignState;
  } catch {
    return null;
  }
}

export function saveCampaign(state: CampaignState): void {
  const toSave = { ...state, updatedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
}

export function clearCampaign(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function validateImportedData(data: unknown): data is CampaignState {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.campaignName === 'string' &&
    typeof d.initialBudget === 'number' &&
    typeof d.availableBalance === 'number' &&
    typeof d.totalPaidPrizes === 'number' &&
    Array.isArray(d.consultants) &&
    Array.isArray(d.spinHistory) &&
    Array.isArray(d.wheelConfig)
  );
}
