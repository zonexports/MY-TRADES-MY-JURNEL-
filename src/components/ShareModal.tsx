import React, { useState } from 'react';
import { X, Share2, Copy, Check, TrendingUp, Sparkles, ShieldCheck } from 'lucide-react';
import { Trade, UserProfile } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any; // Trade or summary
  profile: UserProfile;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  data,
  profile,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isSummary = data?.type === 'summary';
  const trade: Trade | null = isSummary ? null : data;

  const shareText = isSummary
    ? `🔥 FXZAIDU Professional Trading Performance\nTrader: ${profile.name} (${profile.handle})\nTags: ${profile.tags.join(', ')}\nNet P&L: $${data.netPnL.toLocaleString()}\nWin Rate: ${data.winRate}%\nTotal Trades: ${data.totalTrades}\n📈 Powered by FXZAIDU Forex & Gold Journal`
    : `🚀 FXZAIDU Trade Breakdown\nPair: ${trade?.pair} (${trade?.direction})\nResult: ${trade?.result} | P&L: $${trade?.pnl}\nSetup: ${trade?.setupType}\nLogic: ${trade?.reason}\n👑 Trader: ${profile.name} (${profile.handle})`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative overflow-hidden">
        
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6 relative z-10">
          <div className="flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-black text-white">Share Performance Card</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Preview */}
        <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-xl space-y-4 mb-6 relative z-10">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-3">
              <img src={profile.avatar} alt="DP" className="w-10 h-10 rounded-full object-cover border border-amber-500" />
              <div>
                <div className="text-sm font-bold text-white flex items-center space-x-1">
                  <span>{profile.name}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-xs text-amber-400 font-mono">{profile.handle}</div>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/30">
              FXZAIDU PRO
            </span>
          </div>

          {isSummary ? (
            <div className="space-y-3 py-2">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Overall Net Performance</div>
              <div className="text-3xl font-black text-emerald-400">
                +${data.netPnL.toLocaleString()} USD
              </div>
              <div className="flex gap-4 text-xs text-slate-300 font-mono">
                <span>Win Rate: <strong>{data.winRate}%</strong></span>
                <span>Trades: <strong>{data.totalTrades}</strong></span>
              </div>
            </div>
          ) : (
            <div className="space-y-3 py-2">
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-lg text-xs font-black ${
                  trade?.direction === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {trade?.direction} {trade?.pair}
                </span>
                <span className={`text-lg font-black ${trade && trade.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {trade && trade.pnl >= 0 ? `+$${trade?.pnl}` : `-$${Math.abs(trade?.pnl || 0)}`}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800">
                {trade?.reason}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5 pt-2">
            {profile.tags.map((t, idx) => (
              <span key={idx} className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-300 border border-slate-800 font-medium">
                #{t}
              </span>
            ))}
          </div>
        </div>

        {/* Share Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 relative z-10">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Share Text'}</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-colors"
          >
            <span>Share on WhatsApp</span>
          </button>
        </div>

      </div>
    </div>
  );
};
