import { useMemo } from 'react';
import type { Consultant } from '../types/campaign';

export function useSpinQueue(consultants: Consultant[]) {
  const queue = useMemo(() => {
    return consultants.filter(c => c.pendingSpins > 0);
  }, [consultants]);

  const currentConsultant = queue.length > 0 ? queue[0] : null;
  const isQueueEmpty = queue.length === 0;

  return {
    queue,
    currentConsultant,
    isQueueEmpty
  };
}
