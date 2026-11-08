import React, { useState, useEffect } from 'react';
import { X, Plus, Save, Image as ImageIcon, PlusCircle, MinusCircle } from 'lucide-react';
import { Trade, AssetPair, TradeDirection, TradeResult } from '../types';

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trade: Trade) => void;
  editingTrade?: Trade | null;
}

export const TradeModal: React.FC<TradeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingTrade,
}) => {
  const [formData, setFormData] = useState<Omit<Trade, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    pair: 'XAUUSD',
    direction: 'BUY',
    entryPrice: 2750.00,
    exitPrice: 2775.00,
    lotSize: 1.0,
    pnl: 500.00,
    pips: 50,
    result: 'Win',
    setupType: 'Liquidity Sweep + OB',
    reason: '',
    screenshot: '',
  });

  const [pnlStr, setPnlStr] = useState('500');

  useEffect(() => {
    if (editingTrade) {
      setFormData({
        date: editingTrade.date,
        time: editingTrade.time,
        pair: editingTrade.pair,
        direction: editingTrade.direction,
        entryPrice: editingTrade.entryPrice,
        exitPrice: editingTrade.exitPrice,
        lotSize: editingTrade.lotSize,
        pnl: editingTrade.pnl,
        pips: editingTrade.pips,
        result: editingTrade.result,
        setupType: editingTrade.setupType,
        reason: editingTrade.reason,
        screenshot: editingTrade.screenshot || '',
      });
      setPnlStr(String(editingTrade.pnl));
    } else {
      const defaultPnl = 500;
      setFormData({
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().substring(0, 5),
        pair: 'XAUUSD',
        direction: 'BUY',
        entryPrice: 2750.00,
        exitPrice: 2775.00,
        lotSize: 1.0,
        pnl: defaultPnl,
        pips: 50,
        result: 'Win',
        setupType: 'SMC Order Block',
        reason: '',
        screenshot: '',
      });
      setPnlStr(String(defaultPnl));
    }
  }, [editingTrade, isOpen]);

  if (!isOpen) return null;

  const handleResultChange = (newResult: TradeResult) => {
    let newPnl = Number(pnlStr) || 0;
    if (newResult === 'Loss' && newPnl > 0) {
      newPnl = -Math.abs(newPnl);
      setPnlStr(String(newPnl));
    } else if (newResult === 'Win' && newPnl < 0) {
      newPnl = Math.abs(newPnl);
      setPnlStr(String(newPnl));
    } else if (newResult === 'Breakeven') {
      newPnl = 0;
      setPnlStr('0');
    }
    setFormData({ ...formData, result: newResult, pnl: newPnl });
  };

  const handlePnlChange = (val: string) => {
    setPnlStr(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      let res: TradeResult = formData.result;
      if (num < 0) res = 'Loss';
      else if (num > 0) res = 'Win';
      setFormData(prev => ({ ...prev, pnl: num, result: res }));
    }
  };

  const togglePnlSign = () => {
    const num = parseFloat(pnlStr);
    if (!isNaN(num)) {
      const inverted = -num;
      setPnlStr(String(inverted));
      let res: TradeResult = formData.result;
      if (inverted < 0) res = 'Loss';
      else if (inverted > 0) res = 'Win';
      else res = 'Breakeven';
      setFormData(prev => ({ ...prev, pnl: inverted, result: res }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPnl = parseFloat(pnlStr) || 0;
    const tradeToSave: Trade = {
      id: editingTrade ? editingTrade.id : `trade-${Date.now()}`,
      ...formData,
      pnl: finalPnl,
      result: finalPnl < 0 ? 'Loss' : finalPnl > 0 ? 'Win' : 'Breakeven',
    };
    onSave(tradeToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <h2 className="text-xl font-black text-white">
            {editingTrade ? 'Edit Trade Breakdown' : 'Record New Forex / Gold Trade'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Asset Pair</label>
              <select
                value={formData.pair}
                onChange={(e) => setFormData({ ...formData, pair: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-bold"
              >
                <option value="XAUUSD">XAUUSD (Gold)</option>
                <option value="EURUSD">EURUSD</option>
                <option value="GBPUSD">GBPUSD</option>
                <option value="USDJPY">USDJPY</option>
                <option value="AUDUSD">AUDUSD</option>
                <option value="USDCAD">USDCAD</option>
                <option value="NZDUSD">NZDUSD</option>
                <option value="EURJPY">EURJPY</option>
                <option value="BTCUSD">BTCUSD</option>
                <option value="NAS100">NAS100</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Direction</label>
              <select
                value={formData.direction}
                onChange={(e) => setFormData({ ...formData, direction: e.target.value as TradeDirection })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-bold"
              >
                <option value="BUY">BUY / LONG</option>
                <option value="SELL">SELL / SHORT</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Result</label>
              <select
                value={formData.result}
                onChange={(e) => handleResultChange(e.target.value as TradeResult)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-bold"
              >
                <option value="Win">Win (Profit)</option>
                <option value="Loss">Loss (Negative)</option>
                <option value="Breakeven">Breakeven</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Lot Size</label>
              <input
                type="number"
                step="0.01"
                value={formData.lotSize}
                onChange={(e) => setFormData({ ...formData, lotSize: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Setup Type</label>
              <input
                type="text"
                value={formData.setupType}
                onChange={(e) => setFormData({ ...formData, setupType: e.target.value })}
                placeholder="e.g. Order Block"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Entry Price</label>
              <input
                type="number"
                step="0.0001"
                value={formData.entryPrice}
                onChange={(e) => setFormData({ ...formData, entryPrice: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Exit Price</label>
              <input
                type="number"
                step="0.0001"
                value={formData.exitPrice}
                onChange={(e) => setFormData({ ...formData, exitPrice: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Net P&L ($)</label>
                <button
                  type="button"
                  onClick={togglePnlSign}
                  className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 font-mono font-bold flex items-center space-x-1"
                  title="Toggle +/- Sign"
                >
                  <span>+/- Toggle</span>
                </button>
              </div>
              <input
                type="text"
                inputMode="decimal"
                value={pnlStr}
                onChange={(e) => handlePnlChange(e.target.value)}
                placeholder="e.g. 500 or -300"
                className={`w-full bg-slate-950 border rounded-xl px-4 py-2 text-sm font-black focus:outline-none ${
                  parseFloat(pnlStr) < 0 ? 'text-rose-400 border-rose-500/50' : 'text-emerald-400 border-emerald-500/50'
                }`}
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Type minus (-) for loss or use toggle</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Pips</label>
              <input
                type="number"
                value={formData.pips}
                onChange={(e) => setFormData({ ...formData, pips: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Reason & Logic */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Trading Breakdown & Logic / Psychology Notes
            </label>
            <textarea
              rows={3}
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Explain the SMC setup, liquidity sweep, session timing, and execution rationale..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Screenshot upload/URL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center space-x-1.5">
              <ImageIcon className="w-4 h-4 text-amber-400" />
              <span>Chart Screenshot URL / Image Upload Link</span>
            </label>
            <input
              type="url"
              value={formData.screenshot}
              onChange={(e) => setFormData({ ...formData, screenshot: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20"
            >
              <Save className="w-4 h-4" />
              <span>{editingTrade ? 'Update Trade' : 'Save Trade'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
