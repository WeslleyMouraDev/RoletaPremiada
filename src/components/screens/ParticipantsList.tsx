import type { Consultant } from '../../types/campaign';
import { Card } from '../ui/Card';

type ParticipantsListProps = {
  consultants: Consultant[];
  onRemoveConsultant: (id: string) => void;
  onUpdateEnrollments: (id: string, delta: number) => void;
};

export function ParticipantsList({ consultants, onRemoveConsultant, onUpdateEnrollments }: ParticipantsListProps) {
  return (
    <Card className="w-full overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span>👥</span> Consultores Cadastrados
        </h3>
        <span className="bg-white/5 border border-white/10 text-gold text-xs px-3 py-1 rounded-full font-bold">
          {consultants.length} {consultants.length === 1 ? 'consultor' : 'consultores'}
        </span>
      </div>

      {consultants.length === 0 ? (
        <div className="text-center py-12 text-muted">
          <p className="text-3xl mb-3">📭</p>
          <p className="text-sm">Nenhum consultor cadastrado ainda.</p>
          <p className="text-xs text-white/30 mt-1">Insira os dados ao lado ou faça upload de um JSON.</p>
        </div>
      ) : (
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto pr-1">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-white/10 text-muted text-xs uppercase tracking-wider">
                <th className="py-3 font-semibold">Consultor</th>
                <th className="py-3 px-4 text-center font-semibold">Matrículas (Giros)</th>
                <th className="py-3 px-4 text-center font-semibold">Pendente</th>
                <th className="py-3 px-4 text-center font-semibold">Concluído</th>
                <th className="py-3 text-right font-semibold">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {consultants.map((c) => (
                <tr key={c.id} className="text-sm hover:bg-white/[0.02] transition-colors group">
                  <td className="py-4 font-bold text-white max-w-[150px] truncate">{c.name}</td>
                  <td className="py-4 px-4 text-center font-semibold text-gold">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onUpdateEnrollments(c.id, -1)}
                        disabled={c.totalEnrollments <= c.completedSpins}
                        className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs hover:bg-orange/20 hover:text-orange disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-black"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{c.totalEnrollments}</span>
                      <button
                        type="button"
                        onClick={() => onUpdateEnrollments(c.id, 1)}
                        className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs hover:bg-green/20 hover:text-green transition-colors font-black"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      c.pendingSpins > 0 ? 'bg-orange/20 text-orange' : 'bg-white/5 text-muted'
                    }`}>
                      {c.pendingSpins}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center text-green font-semibold">{c.completedSpins}</td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => onRemoveConsultant(c.id)}
                      className="text-muted hover:text-orange transition-colors p-2 rounded-lg hover:bg-white/5"
                      title="Remover consultor"
                      aria-label={`Remover ${c.name}`}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
