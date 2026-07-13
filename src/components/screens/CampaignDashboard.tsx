import { useRef } from 'react';
import { GoldTitle } from '../ui/GoldTitle';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import type { CampaignState } from '../../types/campaign';
import { usePngExport } from '../../hooks/usePngExport';
import { exportCampaignToExcel } from '../../services/campaignExcelExportService';

type CampaignDashboardProps = {
  state: CampaignState;
  campaignType: 'graduacao' | 'pos';
  onNext: () => void;
  onBack: () => void;
  onReset: () => void;
  exportJson: () => void;
};

export function CampaignDashboard({
  state,
  campaignType,
  onNext,
  onBack,
  onReset,
  exportJson,
}: CampaignDashboardProps) {
  const { initialBudget, availableBalance, totalPaidPrizes, consultants, spinHistory } = state;
  const exportCardRef = useRef<HTMLDivElement>(null);
  const { exportPng, isExporting } = usePngExport();

  // Ordena consultores pelo valor total de prêmios recebidos (Ranking)
  const ranking = [...consultants].sort((a, b) => b.totalPrizeAmount - a.totalPrizeAmount);

  // Formata valores monetários em R$
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const handleExportPng = async () => {
    if (!exportCardRef.current) return;
    const date = new Date().toISOString().split('T')[0];
    await exportPng(exportCardRef.current, `painel-campanha-hunter-${date}.png`);
  };

  const handleResetClick = () => {
    if (window.confirm('Tem certeza que deseja zerar a campanha? Todos os giros e consultores serão resetados.')) {
      onReset();
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
            <GoldTitle size="sm">Painel da Campanha</GoldTitle>
          </div>
          
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handleExportPng} disabled={isExporting}>
              {isExporting ? '⏳...' : '📸 Exportar PNG'}
            </Button>
            <Button variant="secondary" size="sm" onClick={() => exportCampaignToExcel(state, campaignType)}>
              📊 Exportar Excel
            </Button>
            <Button variant="secondary" size="sm" onClick={exportJson}>
              📤 Exportar Relatório
            </Button>
            <Button variant="danger" size="sm" onClick={handleResetClick}>
              🔄 Resetar
            </Button>
          </div>
        </div>

        {/* Métricas Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="flex flex-col items-center md:items-start">
            <span className="text-muted text-xs font-semibold uppercase tracking-wider mb-1">Verba Disponibilizada</span>
            <span className="text-3xl font-black text-white">{formatCurrency(initialBudget)}</span>
          </Card>
          <Card className="flex flex-col items-center md:items-start relative overflow-hidden">
            <span className="text-muted text-xs font-semibold uppercase tracking-wider mb-1">Saldo em Caixa</span>
            <span className={`text-3xl font-black ${availableBalance <= 50 ? 'text-orange animate-pulse' : 'text-white'}`}>
              {formatCurrency(availableBalance)}
            </span>
            {availableBalance <= 50 && (
              <span className="absolute top-2 right-2 text-[10px] bg-orange/20 text-orange border border-orange/30 px-2 py-0.5 rounded-full font-bold uppercase">
                Verba Crítica
              </span>
            )}
          </Card>
          <Card className="flex flex-col items-center md:items-start">
            <span className="text-muted text-xs font-semibold uppercase tracking-wider mb-1">Prêmios Distribuídos</span>
            <span className="text-3xl font-black text-green">{formatCurrency(totalPaidPrizes)}</span>
          </Card>
        </div>

        {/* Seções Principais (Ranking e Histórico) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-8">
          
          {/* Ranking */}
          <Card className="w-full">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span>🏆</span> Ranking de Prêmios
            </h3>
            {ranking.length === 0 ? (
              <p className="text-muted text-sm py-6 text-center">Nenhum consultor cadastrado para gerar ranking.</p>
            ) : (
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                {ranking.map((c, index) => (
                  <div key={c.id} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-colors">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        index === 0 ? 'bg-gold text-bg' : index === 1 ? 'bg-white/30 text-white' : index === 2 ? 'bg-[#CD7F32] text-white' : 'bg-white/5 text-muted'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="font-bold text-sm text-white max-w-[180px] truncate">{c.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-green text-sm">{formatCurrency(c.totalPrizeAmount)}</span>
                      <span className="block text-[10px] text-muted">{c.completedSpins} giros concluídos</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Histórico */}
          <Card className="w-full">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span>📜</span> Histórico de Giros
            </h3>
            {spinHistory.length === 0 ? (
              <p className="text-muted text-sm py-6 text-center">Nenhum giro realizado nesta campanha.</p>
            ) : (
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {[...spinHistory].reverse().map((h) => (
                  <div key={h.id} className="flex justify-between items-center p-3 bg-white/[0.01] border border-white/5 rounded-xl text-sm">
                    <div>
                      <span className="font-bold text-white block max-w-[200px] truncate">{h.consultantName}</span>
                      <span className="text-[10px] text-muted">
                        {new Date(h.createdAt).toLocaleTimeString('pt-BR')}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className={`font-bold block ${h.status === 'prize' ? 'text-green' : 'text-muted'}`}>
                        {h.resultLabel}
                      </span>
                      {h.status === 'prize' && (
                        <span className="text-[10px] text-muted">Pago: {formatCurrency(h.prizeAmount)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

        </div>

        {/* Footer Navigation */}
        <div className="mt-auto pt-8 border-t border-white/10 flex justify-end">
          <Button
            size="lg"
            onClick={onNext}
            className="px-12 uppercase text-sm tracking-wider"
          >
            Fila de Giros ➔
          </Button>
        </div>
        
        {/* Card de Exportação PNG (fora da viewport, mas renderizado) */}
        <div 
          style={{ 
            position: 'absolute', 
            top: '-9999px', 
            left: '-9999px', 
            overflow: 'hidden', 
            width: '1080px', 
            height: '1920px' 
          }} 
          aria-hidden="true"
        >
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
            }}
          >
            {/* Header do card */}
            <div style={{ textAlign: 'center', marginBottom: 50 }}>
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
              <h2 style={{ fontSize: 48, fontWeight: 700, color: '#FFFFFF', marginTop: 8 }}>
                {campaignType === 'pos' ? 'PÓS HUNTER' : 'GRADUAÇÃO HUNTER'}
              </h2>
              <p style={{ color: '#9CA3AF', fontSize: 28, marginTop: 20 }}>Painel de Resultados</p>
            </div>

            {/* Métricas */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 24,
              width: '100%',
              marginBottom: 50,
            }}>
              {[
                { label: 'Verba Inicial', value: formatCurrency(initialBudget), color: '#FFFFFF' },
                { label: 'Prêmios Pagos', value: formatCurrency(totalPaidPrizes), color: '#22C55E' },
                { label: 'Saldo em Caixa', value: formatCurrency(availableBalance), color: availableBalance <= 50 ? '#F15A24' : '#FFD166' },
                { label: 'Total de Giros', value: `${spinHistory.length}`, color: '#7B2CFF' },
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
            <div style={{ width: '100%', flex: 1, overflow: 'hidden' }}>
              <h3 style={{ color: '#FFD166', fontSize: 36, fontWeight: 800, marginBottom: 24, textAlign: 'center' }}>
                🏆 Ranking de Prêmios (Parcial)
              </h3>
              {ranking.length === 0 ? (
                <p style={{ color: '#9CA3AF', fontSize: 24, textAlign: 'center', marginTop: 40 }}>Nenhum giro realizado.</p>
              ) : (
                ranking.slice(0, 5).map((c, i) => (
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
                ))
              )}
            </div>

            {/* Footer */}
            <p style={{ color: '#9CA3AF', fontSize: 22, marginTop: 40, textAlign: 'center' }}>
              Painel gerado em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
