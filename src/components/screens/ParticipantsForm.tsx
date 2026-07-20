import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { normalizeConsultantName } from '../../utils/normalize';

type ParticipantsFormProps = {
  onAddConsultant: (name: string, enrollments: number) => void;
};

export function ParticipantsForm({ onAddConsultant }: ParticipantsFormProps) {
  const [name, setName] = useState('');
  const [enrollments, setEnrollments] = useState<number>(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = normalizeConsultantName(name);
    if (!normalized || enrollments <= 0) return;
    onAddConsultant(normalized, enrollments);
    setName('');
    setEnrollments(1);
  };

  return (
    <Card className="w-full">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span>👤</span> Cadastrar Consultor
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="consultant-name" className="block text-sm font-semibold text-muted mb-2">
            Nome do Consultor
          </label>
          <input
            id="consultant-name"
            type="text"
            required
            placeholder="Ex: João Silva"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-bg border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
          />
        </div>
        <div>
          <label htmlFor="enrollment-count" className="block text-sm font-semibold text-muted mb-2">
            Quantidade de Matrículas (Número de Giros)
          </label>
          <input
            id="enrollment-count"
            type="number"
            required
            min="1"
            max="50"
            value={enrollments}
            onChange={(e) => setEnrollments(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-4 py-3 bg-bg border border-white/10 rounded-lg text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
          />
        </div>
        <Button type="submit" fullWidth className="py-3 uppercase text-sm tracking-wider">
          Adicionar Consultor
        </Button>
      </form>
    </Card>
  );
}
