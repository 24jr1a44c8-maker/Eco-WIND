
export enum RecycleCategory {
  PLASTIC = 'PLASTIC',
  GLASS = 'GLASS',
  METAL = 'METAL',
  PAPER = 'PAPER',
  ELECTRONICS = 'ELECTRONICS',
  UNKNOWN = 'UNKNOWN'
}

export type ActivityType = 'RECYCLE' | 'REDEEM' | 'CASH_OUT';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  amount: number; // positive for recycle, negative for redeem/cashout
  timestamp: number;
  category?: RecycleCategory; // for recycle
  provider?: string; // for redeem/cashout
  currencyAmount?: number; // The converted cash value
}

export interface User {
  email: string;
  password?: string;
  balance: number;
  totalItems: number;
  totalWeight: number;
  activities: Activity[];
}

export interface Voucher {
  id: string;
  provider: string;
  amount: number;
  cost: number;
  category: 'FOOD' | 'SHOPPING' | 'MALL';
  image: string;
  description: string;
}

export interface UserState {
  balance: number;
  totalItems: number;
  totalWeight: number;
}

export interface GeminiResponse {
  itemName: string;
  category: RecycleCategory;
  confidence: number;
  estimatedValue: number;
  recyclabilityScore: number;
}
