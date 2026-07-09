import { useRef } from 'react';
import { GoldTitle } from '../ui/GoldTitle';
import { Button } from '../ui/Button';
import { ParticipantsForm } from './ParticipantsForm';
import { ParticipantsList } from './ParticipantsList';
import type { CampaignState } from '../../types/campaign';

type ParticipantsScreenProps = {
  state: CampaignState;
  addConsultant: (name: string, enrollments: number) => void;
  removeConsultant: (id: string) => void;
  exportJson: () => void;
  importJson: (file: File) => Promise<void>;
  onClearData: () => void;
  onNext: () => void;
  onBack: () => void;
};

export function ParticipantsScreen({
  state,
  addConsultant,
  removeConsultant,
  exportJson,
  importJson,
  onClearData,
  onNext,
  onBack,
}: ParticipantsScreenProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await importJson(file);
      alert('Campanha importada com sucesso!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao importar arquivo.';
      alert(errorMessage);
    }
    e.target.value = ''; // Reset input
  };

  const handleClearClick = () => {
    if (window.confirm('Tem certeza que deseja apagar todos os consultores e histórico desta campanha? Essa ação é irreversível.')) {
      onClearData();
    }
  };

  return (
    <div className="min-h-screen bg-bg p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-6xl flex flex-col flex-1">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-muted hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <GoldTitle size="sm">Configurar Campanha</GoldTitle>
          </div>
          
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <Button variant="secondary" size="sm" onClick={handleImportClick}>
              📥 Importar JSON
            </Button>
            <Button variant="secondary" size="sm" onClick={exportJson} disabled={state.consultants.length === 0}>
              📤 Exportar JSON
            </Button>
            <Button variant="danger" size="sm" onClick={handleClearClick} disabled={state.consultants.length === 0}>
              🗑️ Limpar
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-8">
          <div className="lg:col-span-1">
            <ParticipantsForm onAddConsultant={addConsultant} />
          </div>
          <div className="lg:col-span-2">
            <ParticipantsList
              consultants={state.consultants}
              onRemoveConsultant={removeConsultant}
            />
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-auto pt-8 border-t border-white/10 flex justify-end">
          <Button
            size="lg"
            onClick={onNext}
            disabled={state.consultants.length === 0}
            className="px-12 uppercase text-sm tracking-wider"
          >
            Avançar para Painel ➔
          </Button>
        </div>
        
      </div>
    </div>
  );
}
