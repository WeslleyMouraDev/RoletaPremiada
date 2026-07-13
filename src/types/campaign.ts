export type Consultant = {
  id: string;
  name: string;
  totalEnrollments: number;
  totalSpins: number;
  completedSpins: number;
  pendingSpins: number;
  totalPrizeAmount: number;
};

export type SpinHistoryItem = {
  id: string;
  consultantId: string;
  consultantName: string;
  createdAt: string;
  resultLabel: string;
  prizeAmount: number;
  balanceBefore: number;
  balanceAfter: number;
  status: 'prize' | 'no_prize';
};

export type WheelSegment = {
  id: string;
  label: string;
  prizeAmount: number;
  weight: number;
  color: string;
  textColor: string;
};

export type CampaignState = {
  campaignName: string;
  initialBudget: number;
  availableBalance: number;
  totalPaidPrizes: number;
  consultants: Consultant[];
  spinHistory: SpinHistoryItem[];
  wheelConfig: WheelSegment[];
  createdAt: string;
  updatedAt: string;
};

export type AppScreen =
  | 'start'
  | 'participants'
  | 'dashboard'
  | 'spin-queue'
  | 'wheel'
  | 'finished-spins'
  | 'final-summary';
