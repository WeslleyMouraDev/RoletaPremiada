import React from 'react';
import { GoldTitle } from '../ui/GoldTitle';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import type { CampaignState, Consultant } from '../../types/campaign';

type SpinQueueScreenProps = {
  state: CampaignState;
  onSpin: (consultant: Consultant) => void;
  onSkip: (consultantId: string) => void;
  onBack: () => void;
  onFinishCampaign: () => void;
};

export function SpinQueueScreen({
  state,
  onSpin,
  onSkip,
  onBack,
  onFinishCampaign,
}: SpinQueueScreenProps) {
  const { consultants, availableBalance } = state;

  // Filtra consultores com giros pendentes
  const queue = consultants.filter(c => c.pendingSpins > 0);
  const currentConsultant = queue.length > 0 ? queue[0] : null;
  const nextInQueue = queue.slice(1);

  const handleSkipClick = () => {
    if (!currentConsultant) return;
    if (window.confirm(`Tem certeza que deseja pular o giro de ${currentConsultant.name}? O giro pendente será descontado.`)) {
      onSkip(currentConsultant.id);
    }
  };

  return (
    <div className="min-h-screen bg-bg p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl flex flex-col flex-1">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-muted hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <GoldTitle size="sm">Fila de Giros</GoldTitle>
          </div>
          
          <div className="text-right">
            <span className="text-muted text-xs block">Saldo de Prêmios</span>
            <span className="font-black text-green text-lg">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(availableBalance)}
            </span>
          </div>
        </div>

        {/* Fila Vazia ou Ativa */}
        {!currentConsultant ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <Card className="max-w-md p-8 flex flex-col items-center">
              <span className="text-6xl mb-6">🏁</span>
              <h3 className="text-2xl font-bold text-white mb-2">Fila Concluída!</h3>
              <p className="text-muted text-sm mb-8">
                Todos os consultores da lista já realizaram seus giros ou a fila está vazia.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Button variant="secondary" onClick={onBack} fullWidth>
                  Voltar ao Painel
                </Button>
                <Button onClick={onFinishCampaign} fullWidth>
                  Ver Resumo Final
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1 items-stretch">
            
            {/* Card do Giro Atual (Destaque) */}
            <div className="md:col-span-2 flex">
              <Card className="w-full flex flex-col justify-between border-gold/20 shadow-[0_0_30px_rgba(255,209,102,0.05)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold to-orange" />
                
                <div className="pt-6">
                  <span className="text-gold text-xs font-bold uppercase tracking-wider bg-gold/10 px-3 py-1 rounded-full border border-gold/20 inline-block mb-6">
                    A Vez de Girar
                  </span>
                  
                  <h2 className="text-3xl md:text-4xl font-black text-white mb-2 truncate">
                    {currentConsultant.name}
                  </h2>
                  <p className="text-muted text-sm mb-8">
                    Matrículas cadastradas: <span className="text-white font-bold">{currentConsultant.totalEnrollments}</span>
                  </p>

                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 mb-4 flex items-center justify-between">
                    <div>
                      <span className="text-muted text-xs block uppercase font-semibold">Giros Restantes</span>
                      <span className="text-3xl font-black text-white mt-1">
                        {currentConsultant.pendingSpins}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-muted text-xs block uppercase font-semibold">Giros Efetuados</span>
                      <span className="text-3xl font-black text-green mt-1">
                        {currentConsultant.completedSpins}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Button variant="secondary" onClick={handleSkipClick} className="flex-1">
                    🚫 Pular Giro
                  </Button>
                  <Button onClick={() => onSpin(currentConsultant)} className="flex-[2] py-4 text-lg">
                    🎯 Ir para Roleta
                  </Button>
                </div>
              </Card>
            </div>

            {/* Lista de Espera */}
            <div className="md:col-span-1 flex">
              <Card className="w-full flex flex-col">
                <h3 className="text-base font-bold text-white mb-4 pb-2 border-b border-white/10 flex items-center gap-2">
                  <span>⏳</span> Lista de Espera
                </h3>
                
                {nextInQueue.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-12 text-muted">
                    <span className="text-3xl mb-2">🎈</span>
                    <span className="text-xs">Ninguém na espera depois. Último giro!</span>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto space-y-3 max-h-[350px] pr-1">
                    {nextInQueue.map((c, i) => (
                      <div key={c.id} className="p-3 bg-white/[0.01] border border-white/5 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <span className="text-white font-semibold block truncate max-w-[120px]">
                            {c.name}
                          </span>
                          <span className="text-muted text-[10px]">{i + 2}º da fila</span>
                        </div>
                        <span className="bg-white/5 text-gold font-bold px-2.5 py-1 rounded-full">
                          {c.pendingSpins} giros
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
