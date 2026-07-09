import { useState } from 'react';
import { useCampaignState } from './hooks/useCampaignState';
import { StartScreen } from './components/screens/StartScreen';
import { ParticipantsScreen } from './components/screens/ParticipantsScreen';
import { CampaignDashboard } from './components/screens/CampaignDashboard';
import { SpinQueueScreen } from './components/screens/SpinQueueScreen';
import { PrizeWheelScreen } from './components/screens/PrizeWheelScreen';
import { ResultModal } from './components/screens/ResultModal';
import { FinalSummaryScreen } from './components/screens/FinalSummaryScreen';
import type { AppScreen, Consultant, WheelSegment } from './types/campaign';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('start');
  const [currentConsultant, setCurrentConsultant] = useState<Consultant | null>(null);
  const [lastResult, setLastResult] = useState<WheelSegment | null>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

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
  } = useCampaignState();

  // Handlers de navegação
  const handleStart = () => setScreen('participants');

  const handleParticipantsNext = () => setScreen('dashboard');
  const handleParticipantsBack = () => setScreen('start');

  const handleDashboardNext = () => setScreen('spin-queue');
  const handleDashboardBack = () => setScreen('participants');

  const handleSpinQueueBack = () => setScreen('dashboard');
  const handleSpinQueueFinish = () => setScreen('final-summary');

  const handleGoToWheel = (consultant: Consultant) => {
    setCurrentConsultant(consultant);
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
    setScreen('start');
  };

  const handleFinalBack = () => setScreen('dashboard');

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {state.availableBalance === 0 && (
        <div className="bg-orange text-white text-center py-2 px-4 text-xs font-black tracking-wider uppercase z-50 flex items-center justify-center gap-2 shadow-lg animate-pulse">
          <span>⚠️</span> Verba de prêmios esgotada! Os próximos giros não pagarão prêmios em dinheiro.
        </div>
      )}

      <div className="flex-1 flex flex-col">
        {screen === 'start' && (
          <StartScreen onStart={handleStart} />
        )}

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
          />
        )}

        {screen === 'final-summary' && (
          <FinalSummaryScreen
            state={state}
            onRestart={handleFinalRestart}
            onBack={handleFinalBack}
          />
        )}
      </div>

      {/* ResultModal é global — aparece por cima de qualquer tela */}
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
