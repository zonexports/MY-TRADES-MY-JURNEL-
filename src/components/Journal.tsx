import React, { useState } from 'react';
import { 
  BookOpen, Search, Filter, PlusCircle, ExternalLink, Trash2, Edit3, 
  Share2, Image as ImageIcon, CheckCircle, XCircle, ChevronDown, ChevronUp 
} from 'lucide-react';
import { Trade } from '../types';

interface JournalProps {
  trades: Trade[];
  onOpenAddTrade: () => void;
  onEditTrade: (trade: Trade) => void;
  onDeleteTrade: (id: string) => void;
  onOpenShare: (trade: Trade) => void;
}

export const Journal: React.FC<JournalProps> = ({
  trades,
  onOpenAddTrade,
  onEditTrade,
  onDeleteTrade,
  onOpenShare,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPair, setSelectedPair] = useState('ALL');
  const [selectedResult, setSelectedResult] = useState('ALL');
  const [expandedTradeId, setExpandedTradeId] = useState<string | null>(null);
  const [activeImageModal, setActiveImageModal] = useState<string | null>(null);

  // Filter trades
  const filteredTrades = trades.filter((t) => {
    const matchesSearch = t.pair.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.setupType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPair = selectedPair === 'ALL' || t.pair === selectedPair;
    const matchesResult = selectedResult === 'ALL' || t.result === selectedResult;
    return matchesSearch && matchesPair && matchesResult;
  });

  const uniquePairs = Array.from(new Set(trades.map(t => t.pair)));

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-amber-400" />
            <span>Forex & Gold Trading Journal</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Detailed trade breakdowns, SMC setups, psychology notes, and screenshot logs</p>
        </div>

        <button
          onClick={onOpenAddTrade}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-transform hover:scale-[1.02]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Trade</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search pair, setup, logic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Pair Filter */}
          <select
            value={selectedPair}
            onChange={(e) => setSelectedPair(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Pairs</option>
            {uniquePairs.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          {/* Result Filter */}
          <select
            value={selectedResult}
            onChange={(e) => setSelectedResult(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Results</option>
            <option value="Win">Wins Only</option>
            <option value="Loss">Losses Only</option>
          </select>
        </div>
      </div>

      {/* Trades List */}
      <div className="space-y-4">
        {filteredTrades.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No trades found</h3>
            <p className="text-sm text-slate-400 mt-1">Try adjusting your search or add a new trade to your journal.</p>
          </div>
        ) : (
          filteredTrades.map((trade) => {
            const isExpanded = expandedTradeId === trade.id;
            return (
              <div
                key={trade.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl transition-all hover:border-slate-700"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  
                  {/* Left: Pair & Direction */}
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-md ${
                      trade.direction === 'BUY' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    }`}>
                      {trade.direction}
                    </div>
                    <div>
                      <div className="flex items-center space-x-3">
                        <span className="text-lg font-extrabold text-white">{trade.pair}</span>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                          trade.result === 'Win' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {trade.result}
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-400 font-mono">
                          {trade.setupType}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-slate-400 mt-1 font-mono">
                        <span>Date: {trade.date} ({trade.time})</span>
                        <span>Lot: {trade.lotSize}</span>
                        <span>Entry: {trade.entryPrice}</span>
                        <span>Exit: {trade.exitPrice}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: P&L & Actions */}
                  <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                      <div className={`text-xl font-black ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {trade.pnl >= 0 ? `+$${trade.pnl.toLocaleString()}` : `-$${Math.abs(trade.pnl).toLocaleString()}`}
                      </div>
                      <div className="text-xs text-slate-400 font-mono">
                        {trade.pips >= 0 ? `+${trade.pips} Pips` : `${trade.pips} Pips`}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onOpenShare(trade)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors"
                        title="Share Trade"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditTrade(trade)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Edit Trade"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteTrade(trade.id)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                        title="Delete Trade"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setExpandedTradeId(isExpanded ? null : trade.id)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                </div>

                {/* Expanded Details: Reason & Screenshot */}
                {isExpanded && (
                  <div className="mt-5 pt-5 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
                    <div className="md:col-span-2 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Trade Breakdown & Logic / Psychology</h4>
                      <p className="text-sm text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800/80 leading-relaxed">
                        {trade.reason || 'No detailed reason provided for this trade.'}
                      </p>
                    </div>

                    {trade.screenshot && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1">
                          <ImageIcon className="w-4 h-4" />
                          <span>Trade Screenshot</span>
                        </h4>
                        <div
                          onClick={() => setActiveImageModal(trade.screenshot!)}
                          className="relative rounded-xl overflow-hidden border border-slate-800 cursor-pointer group h-32 bg-slate-950"
                        >
                          <img
                            src={trade.screenshot}
                            alt="Trade setup"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-xs font-bold text-white bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-700">
                              View Full Size
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

      {/* Image Lightbox Modal */}
      {activeImageModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-3 px-2">
              <h3 className="text-sm font-bold text-white">Trade Chart Screenshot</h3>
              <button
                onClick={() => setActiveImageModal(null)}
                className="text-slate-400 hover:text-white px-3 py-1 rounded-lg bg-slate-800 text-xs font-bold"
              >
                Close ✕
              </button>
            </div>
            <img
              src={activeImageModal}
              alt="Fullscreen trade screenshot"
              className="w-full max-h-[80vh] object-contain rounded-2xl border border-slate-800"
            />
          </div>
        </div>
      )}

    </div>
  );
};
