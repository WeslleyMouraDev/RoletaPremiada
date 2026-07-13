import { useState, useEffect } from 'react';
import { useCampaignState } from './hooks/useCampaignState';
import { StartScreen } from './components/screens/StartScreen';
import { ParticipantsScreen } from './components/screens/ParticipantsScreen';
import { CampaignDashboard } from './components/screens/CampaignDashboard';
import { SpinQueueScreen } from './components/screens/SpinQueueScreen';
import { PrizeWheelScreen } from './components/screens/PrizeWheelScreen';
import { ResultModal } from './components/screens/ResultModal';
import { FinalSummaryScreen } from './components/screens/FinalSummaryScreen';
import { GoldTitle } from './components/ui/GoldTitle';
import type { AppScreen, Consultant, WheelSegment } from './types/campaign';

type CampaignManagerProps = {
  campaignType: 'graduacao' | 'pos';
  onExit: () => void;
};

function CampaignManager({ campaignType, onExit }: CampaignManagerProps) {
  const [screen, setScreen] = useState<AppScreen>('participants'); // Entra direto no cadastro após escolher tipo
  const [currentConsultant, setCurrentConsultant] = useState<Consultant | null>(null);
  const [lastResult, setLastResult] = useState<WheelSegment | null>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  const {
    state,
    addConsultant,
    removeConsultant,
    updateEnrollments,
    performSpin,
    skipSpin,
    exportJson,
    importJson,
    clearData,
    resetCampaign,
  } = useCampaignState(campaignType);

  // Handlers de navegação
  const handleParticipantsNext = () => setScreen('dashboard');
  const handleParticipantsBack = () => onExit(); // Voltar da config vai para seleção inicial

  const handleDashboardNext = () => setScreen('spin-queue');
  const handleDashboardBack = () => setScreen('participants');

  const handleSpinQueueBack = () => setScreen('dashboard');
  const handleSpinQueueFinish = () => setScreen('final-summary');

  const handleGoToWheel = (consultant: Consultant, autoPlay: boolean = false) => {
    setCurrentConsultant(consultant);
    setIsAutoPlay(autoPlay);
    setScreen('wheel');
  };

  const handleSkipSpin = (consultantId: string) => {
    skipSpin(consultantId);
  };

  const handleSpinComplete = (result: WheelSegment) => {
    if (!currentConsultant) return;
    performSpin(currentConsultant.id, result);
    setLastResult(result);
    setIsResultModalOpen(true);
  };

  const handleResultContinue = () => {
    setIsResultModalOpen(false);
    setLastResult(null);
    setCurrentConsultant(null);
    setScreen('spin-queue');
  };

  const handleWheelBack = () => {
    setCurrentConsultant(null);
    setScreen('spin-queue');
  };

  const handleFinalRestart = () => {
    resetCampaign();
    onExit(); // Volta para tela inicial de seleção
  };

  const handleFinalBack = () => setScreen('dashboard');

  // Orquestrador de Autoplay para o ResultModal
  useEffect(() => {
    if (isAutoPlay && isResultModalOpen && lastResult) {
      const isPrize = lastResult.prizeAmount > 0;
      // 7.5 segundos se for prêmio para curtir confete/áudio, 3 segundos se for perda
      const delay = isPrize ? 7500 : 3000;

      const timer = setTimeout(() => {
        handleResultContinue();
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isAutoPlay, isResultModalOpen, lastResult]);

  // Orquestrador de Autoplay para a fila de giros
  useEffect(() => {
    if (isAutoPlay && screen === 'spin-queue') {
      const queue = state.consultants.filter(c => c.pendingSpins > 0);
      if (queue.length > 0) {
        const timer = setTimeout(() => {
          handleGoToWheel(queue[0], true);
        }, 1500); // 1.5s na fila de giros
        return () => clearTimeout(timer);
      } else {
        setIsAutoPlay(false);
        setScreen('finished-spins');
      }
    }
  }, [isAutoPlay, screen, state.consultants]);

  // Redirecionamento da tela de giros finalizados para o resumo final (5s)
  useEffect(() => {
    if (screen === 'finished-spins') {
      const timer = setTimeout(() => {
        setScreen('final-summary');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {state.availableBalance === 0 && (
        <div className="bg-orange text-white text-center py-2 px-4 text-xs font-black tracking-wider uppercase z-50 flex items-center justify-center gap-2 shadow-lg animate-pulse">
          <span>⚠️</span> Verba de prêmios esgotada! Os próximos giros não pagarão prêmios em dinheiro.
        </div>
      )}
      
      <div className="flex-1 flex flex-col">
        {screen === 'participants' && (
          <ParticipantsScreen
            state={state}
            addConsultant={addConsultant}
            removeConsultant={removeConsultant}
            updateEnrollments={updateEnrollments}
            exportJson={exportJson}
            importJson={importJson}
            onClearData={clearData}
            onNext={handleParticipantsNext}
            onBack={handleParticipantsBack}
          />
        )}

        {screen === 'dashboard' && (
          <CampaignDashboard
            state={state}
            campaignType={campaignType}
            onNext={handleDashboardNext}
            onBack={handleDashboardBack}
            onReset={resetCampaign}
            exportJson={exportJson}
          />
        )}

        {screen === 'spin-queue' && (
          <SpinQueueScreen
            state={state}
            onSpin={handleGoToWheel}
            onSkip={handleSkipSpin}
            onBack={handleSpinQueueBack}
            onFinishCampaign={handleSpinQueueFinish}
          />
        )}

        {screen === 'wheel' && currentConsultant && (
          <PrizeWheelScreen
            consultant={currentConsultant}
            segments={state.wheelConfig}
            availableBalance={state.availableBalance}
            onSpinComplete={handleSpinComplete}
            onBack={handleWheelBack}
            autoSpin={isAutoPlay}
          />
        )}

        {screen === 'finished-spins' && (
          <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-md bg-[#0E1520] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-gold via-orange to-green" />
              <span className="text-7xl block mb-6 animate-bounce">🎉</span>
              <GoldTitle size="lg" className="mb-4">Giros Finalizados!</GoldTitle>
              <p className="text-muted text-sm leading-relaxed mb-4">
                Todos os consultores da Fila completaram seus giros.
              </p>
              <p className="text-muted text-xs">
                Aguarde... Redirecionando para o resumo em instantes.
              </p>
            </div>
          </div>
        )}

        {screen === 'final-summary' && (
          <FinalSummaryScreen
            state={state}
            campaignType={campaignType}
            onRestart={handleFinalRestart}
            onBack={handleFinalBack}
          />
        )}
      </div>

      <ResultModal
        isOpen={isResultModalOpen}
        result={lastResult}
        consultantName={currentConsultant?.name ?? ''}
        availableBalance={state.availableBalance}
        onContinue={handleResultContinue}
      />
    </div>
  );
}

export default function App() {
  const [campaignType, setCampaignType] = useState<'graduacao' | 'pos' | null>(null);

  if (campaignType === null) {
    return <StartScreen onSelectCampaign={setCampaignType} />;
  }

  // Remonta todo o CampaignManager quando altera o tipo, recarregando localStorage do zero
  return (
    <CampaignManager
      key={campaignType}
      campaignType={campaignType}
      onExit={() => setCampaignType(null)}
    />
  );
}
