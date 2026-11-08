export type TradeResult = 'Win' | 'Loss' | 'Breakeven';
export type TradeDirection = 'BUY' | 'SELL';
export type AssetPair = 'XAUUSD' | 'EURUSD' | 'GBPUSD' | 'USDJPY' | 'AUDUSD' | 'USDCAD' | 'NZDUSD' | 'EURJPY' | 'BTCUSD' | 'NAS100';

export interface Trade {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  pair: AssetPair | string;
  direction: TradeDirection;
  entryPrice: number;
  exitPrice: number;
  lotSize: number;
  pnl: number; // in USD
  pips: number;
  result: TradeResult;
  setupType: string; // e.g. SMC Order Block, Liquidity Sweep, FVG, ChoCH
  reason: string; // Trade breakdown logic and psychology notes
  screenshot?: string; // Image URL or base64 data URL
}

export interface UserProfile {
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  tags: string[];
  youtube: string;
  whatsapp: string;
  instagram: string;
  initialBalance: number;
}
