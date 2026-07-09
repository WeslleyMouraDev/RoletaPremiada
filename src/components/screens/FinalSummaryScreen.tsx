import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { GoldTitle } from '../ui/GoldTitle';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { usePngExport } from '../../hooks/usePngExport';
import type { CampaignState } from '../../types/campaign';

type FinalSummaryScreenProps = {
  state: CampaignState;
  onRestart: () => void;
  onBack?: () => void;
};

export function FinalSummaryScreen({ state, onRestart, onBack }: FinalSummaryScreenProps) {
  const exportCardRef = useRef<HTMLDivElement>(null);
  const { exportPng, isExporting } = usePngExport();

  const { initialBudget, availableBalance, totalPaidPrizes, consultants, spinHistory } = state;
  const totalSpins = spinHistory.length;
  const winnerSpins = spinHistory.filter(h => h.status === 'prize').length;

  const ranking = [...consultants]
    .sort((a, b) => b.totalPrizeAmount - a.totalPrizeAmount)
    .filter(c => c.completedSpins > 0 || c.totalPrizeAmount > 0);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const handleExportPng = async () => {
    if (!exportCardRef.current) return;
    const date = new Date().toISOString().split('T')[0];
    await exportPng(exportCardRef.current, `roleta-premiada-hunter-${date}.png`);
  };

  const handleRestart = () => {
    if (window.confirm('Deseja iniciar uma nova campanha? Os dados atuais serão apagados.')) {
      onRestart();
    }
  };

  return (
    <div className="min-h-screen bg-bg p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl flex flex-col flex-1">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <span className="text-5xl block mb-4">🏁</span>
          <GoldTitle size="lg">Campanha Encerrada!</GoldTitle>
          <p className="text-muted mt-2">Aqui está o resumo completo dos resultados.</p>
        </motion.div>

        {/* Métricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Verba Total', value: formatCurrency(initialBudget), color: 'text-white' },
            { label: 'Prêmios Pagos', value: formatCurrency(totalPaidPrizes), color: 'text-green' },
            { label: 'Saldo Restante', value: formatCurrency(availableBalance), color: 'text-gold' },
            { label: 'Total de Giros', value: `${totalSpins} (${winnerSpins} prêmios)`, color: 'text-orange' },
          ].map((m, i) => (
            <Card key={m.label} delay={i * 0.1} className="text-center">
              <span className="text-muted text-[11px] block uppercase tracking-wider mb-1">{m.label}</span>
              <span className={`font-black text-lg ${m.color}`}>{m.value}</span>
            </Card>
          ))}
        </div>

        {/* Ranking Final */}
        <Card className="mb-10">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>🏆</span> Ranking Final de Prêmios
          </h3>
          {ranking.length === 0 ? (
            <p className="text-muted text-sm text-center py-6">Nenhum giro foi realizado.</p>
          ) : (
            <div className="space-y-3">
              {ranking.map((c, i) => (
                <div key={c.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${
                      i === 0 ? 'bg-gold text-bg' : i === 1 ? 'bg-white/30 text-white' : i === 2 ? 'bg-[#CD7F32] text-white' : 'bg-white/5 text-muted'
                    }`}>{i + 1}</span>
                    <div>
                      <span className="font-bold text-white block">{c.name}</span>
                      <span className="text-muted text-xs">{c.completedSpins} giros realizados</span>
                    </div>
                  </div>
                  <span className={`font-black text-lg ${c.totalPrizeAmount > 0 ? 'text-green' : 'text-muted'}`}>
                    {formatCurrency(c.totalPrizeAmount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          {onBack && (
            <Button
              variant="secondary"
              size="lg"
              onClick={onBack}
              className="flex-1 sm:flex-none"
            >
              ⬅️ Voltar
            </Button>
          )}
          <Button
            variant="secondary"
            size="lg"
            onClick={handleExportPng}
            disabled={isExporting}
            className="flex-1 sm:flex-none"
          >
            {isExporting ? '⏳ Exportando...' : '📸 Exportar PNG (WhatsApp)'}
          </Button>
          <Button
            variant="danger"
            size="lg"
            onClick={handleRestart}
            className="flex-1 sm:flex-none"
          >
            🔄 Nova Campanha
          </Button>
        </div>

        {/* Card de Exportação PNG (fora da viewport, mas renderizado) */}
        <div className="sr-only" aria-hidden="true">
          <div
            ref={exportCardRef}
            style={{
              width: 1080,
              height: 1920,
              backgroundColor: '#0B0F1A',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              padding: '80px 60px',
              fontFamily: 'Inter, sans-serif',
              position: 'fixed',
              top: '-9999px',
              left: '-9999px',
            }}
          >
            {/* Header do card */}
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <div style={{ fontSize: 80, marginBottom: 20 }}>🎡</div>
              <h1 style={{
                fontSize: 64,
                fontWeight: 900,
                background: 'linear-gradient(135deg, #FFF5D1, #FFD166, #D4A017)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0,
                lineHeight: 1.2,
              }}>
                Roleta Premiada
              </h1>
              <h2 style={{ fontSize: 48, fontWeight: 700, color: '#FFFFFF', marginTop: 8 }}>HUNTER</h2>
              <p style={{ color: '#9CA3AF', fontSize: 28, marginTop: 20 }}>Resultado da Campanha</p>
            </div>

            {/* Métricas */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 24,
              width: '100%',
              marginBottom: 60,
            }}>
              {[
                { label: 'Prêmios Pagos', value: formatCurrency(totalPaidPrizes), color: '#22C55E' },
                { label: 'Saldo Restante', value: formatCurrency(availableBalance), color: '#FFD166' },
                { label: 'Total de Giros', value: `${totalSpins}`, color: '#F15A24' },
                { label: 'Com Prêmio', value: `${winnerSpins}`, color: '#7B2CFF' },
              ].map(m => (
                <div key={m.label} style={{
                  backgroundColor: '#1E2A36',
                  borderRadius: 24,
                  padding: '36px 32px',
                  textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}>
                  <span style={{ color: '#9CA3AF', fontSize: 22, display: 'block', marginBottom: 8 }}>{m.label}</span>
                  <span style={{ color: m.color, fontSize: 44, fontWeight: 900 }}>{m.value}</span>
                </div>
              ))}
            </div>

            {/* Top 5 Ranking */}
            <div style={{ width: '100%', flex: 1 }}>
              <h3 style={{ color: '#FFD166', fontSize: 36, fontWeight: 800, marginBottom: 24, textAlign: 'center' }}>
                🏆 Ranking de Prêmios
              </h3>
              {ranking.slice(0, 5).map((c, i) => (
                <div key={c.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: i === 0 ? 'rgba(255,209,102,0.08)' : 'rgba(255,255,255,0.02)',
                  borderRadius: 20,
                  padding: '28px 32px',
                  marginBottom: 16,
                  border: i === 0 ? '1px solid rgba(255,209,102,0.2)' : '1px solid rgba(255,255,255,0.05)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <span style={{
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      backgroundColor: i === 0 ? '#FFD166' : i === 1 ? 'rgba(255,255,255,0.3)' : i === 2 ? '#CD7F32' : 'rgba(255,255,255,0.05)',
                      color: i === 0 ? '#0B0F1A' : '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                      fontWeight: 900,
                    }}>{i + 1}</span>
                    <span style={{ color: '#FFFFFF', fontSize: 30, fontWeight: 700 }}>{c.name}</span>
                  </div>
                  <span style={{ color: c.totalPrizeAmount > 0 ? '#22C55E' : '#9CA3AF', fontSize: 30, fontWeight: 900 }}>
                    {formatCurrency(c.totalPrizeAmount)}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <p style={{ color: '#9CA3AF', fontSize: 22, marginTop: 40, textAlign: 'center' }}>
              {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
