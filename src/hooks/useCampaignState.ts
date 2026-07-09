import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { createInitialState } from '../services/campaignStorageService';
import { exportCampaignJson, importCampaignJson } from '../services/campaignExportService';
import type { CampaignState, Consultant, SpinHistoryItem, WheelSegment } from '../types/campaign';
import { STORAGE_KEY } from '../constants/wheelConfig';

export function useCampaignState() {
  const [state, setState] = useLocalStorage<CampaignState>(STORAGE_KEY, createInitialState());

  const addConsultant = useCallback((name: string, enrollments: number) => {
    setState(prev => {
      const existing = prev.consultants.find(
        c => c.name.trim().toLowerCase() === name.trim().toLowerCase()
      );
      if (existing) {
        // Acumula matrículas
        return {
          ...prev,
          consultants: prev.consultants.map(c =>
            c.id === existing.id
              ? {
                  ...c,
                  totalEnrollments: c.totalEnrollments + enrollments,
                  totalSpins: c.totalSpins + enrollments,
                  pendingSpins: c.pendingSpins + enrollments,
                }
              : c
          ),
          updatedAt: new Date().toISOString(),
        };
      }
      const newConsultant: Consultant = {
        id: crypto.randomUUID(),
        name: name.trim(),
        totalEnrollments: enrollments,
        totalSpins: enrollments,
        completedSpins: 0,
        pendingSpins: enrollments,
        totalPrizeAmount: 0,
      };
      return {
        ...prev,
        consultants: [...prev.consultants, newConsultant],
        updatedAt: new Date().toISOString(),
      };
    });
  }, [setState]);

  const removeConsultant = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      consultants: prev.consultants.filter(c => c.id !== id),
      updatedAt: new Date().toISOString(),
    }));
  }, [setState]);

  const performSpin = useCallback((consultantId: string, result: WheelSegment) => {
    setState(prev => {
      const consultant = prev.consultants.find(c => c.id === consultantId);
      if (!consultant || consultant.pendingSpins <= 0) return prev;

      const actualPrize = result.prizeAmount > 0 && prev.availableBalance >= result.prizeAmount
        ? result.prizeAmount
        : 0;

      const historyItem: SpinHistoryItem = {
        id: crypto.randomUUID(),
        consultantId,
        consultantName: consultant.name,
        createdAt: new Date().toISOString(),
        resultLabel: actualPrize > 0 ? result.label : 'Não foi dessa vez',
        prizeAmount: actualPrize,
        balanceBefore: prev.availableBalance,
        balanceAfter: prev.availableBalance - actualPrize,
        status: actualPrize > 0 ? 'prize' : 'no_prize',
      };

      return {
        ...prev,
        availableBalance: prev.availableBalance - actualPrize,
        totalPaidPrizes: prev.totalPaidPrizes + actualPrize,
        consultants: prev.consultants.map(c =>
          c.id === consultantId
            ? {
                ...c,
                completedSpins: c.completedSpins + 1,
                pendingSpins: c.pendingSpins - 1,
                totalPrizeAmount: c.totalPrizeAmount + actualPrize,
              }
            : c
        ),
        spinHistory: [...prev.spinHistory, historyItem],
        updatedAt: new Date().toISOString(),
      };
    });
  }, [setState]);

  const skipSpin = useCallback((consultantId: string) => {
    setState(prev => ({
      ...prev,
      consultants: prev.consultants.map(c =>
        c.id === consultantId
          ? { ...c, pendingSpins: c.pendingSpins - 1, completedSpins: c.completedSpins + 1 }
          : c
      ),
      updatedAt: new Date().toISOString(),
    }));
  }, [setState]);

  const exportJson = useCallback(() => exportCampaignJson(state), [state]);

  const importJson = useCallback(async (file: File) => {
    const imported = await importCampaignJson(file);
    setState(imported);
  }, [setState]);

  const clearData = useCallback(() => {
    setState(createInitialState());
  }, [setState]);

  const resetCampaign = useCallback(() => {
    setState(createInitialState());
  }, [setState]);

  return {
    state,
    addConsultant,
    removeConsultant,
    performSpin,
    skipSpin,
    exportJson,
    importJson,
    clearData,
    resetCampaign,
  };
}
