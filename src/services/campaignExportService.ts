import type { CampaignState } from '../types/campaign';
import { validateImportedData } from './campaignStorageService';

export function generateCampaignJsonBlob(state: CampaignState): Blob {
  const json = JSON.stringify(state, null, 2);
  return new Blob([json], { type: 'application/json' });
}

export function exportCampaignJson(state: CampaignState): void {
  const blob = generateCampaignJsonBlob(state);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const aCampaignLabel = state.campaignName.toLowerCase().includes('pós') ? 'pos' : 'graduacao';
  a.download = `roleta-premiada-${aCampaignLabel}-hunter-state-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importCampaignJson(file: File): Promise<CampaignState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (!validateImportedData(data)) {
          reject(new Error('Arquivo inválido. Não foi possível importar os dados da campanha.'));
          return;
        }
        resolve(data as CampaignState);
      } catch {
        reject(new Error('Arquivo inválido. Não foi possível importar os dados da campanha.'));
      }
    };
    reader.readAsText(file);
  });
}
