import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Eye } from 'lucide-react';
import { Trade } from '../types';

interface CalendarViewProps {
  trades: Trade[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ trades }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 10, 1)); // November 2026 default
  const [selectedDateTrades, setSelectedDateTrades] = useState<{ date: string; trades: Trade[] } | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Days in month
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Group trades by YYYY-MM-DD
  const tradesByDate: { [key: string]: Trade[] } = {};
  trades.forEach(t => {
    if (!tradesByDate[t.date]) {
      tradesByDate[t.date] = [];
    }
    tradesByDate[t.date].push(t);
  });

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2">
            <CalendarIcon className="w-6 h-6 text-amber-400" />
            <span>Interactive P&L Calendar</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Calendar-wise trading performance and daily profit & loss breakdown</p>
        </div>

        {/* Month switcher */}
        <div className="flex items-center space-x-4 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800">
          <button onClick={prevMonth} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-base font-bold text-white w-36 text-center">
            {monthNames[month]} {year}
          </span>
          <button onClick={nextMonth} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        
        {/* Days Header */}
        <div className="grid grid-cols-7 gap-2 mb-3 text-center">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-xs font-bold uppercase tracking-wider text-slate-400 py-2">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Cells */}
        <div className="grid grid-cols-7 gap-2">
          
          {/* Empty cells for offset */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-28 bg-slate-950/40 rounded-2xl border border-slate-900 opacity-40"></div>
          ))}

          {/* Actual days */}
          {Array.from({ length: totalDays }).map((_, i) => {
            const dayNum = i + 1;
            const formattedMonth = String(month + 1).padStart(2, '0');
            const formattedDay = String(dayNum).padStart(2, '0');
            const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
            
            const dayTrades = tradesByDate[dateStr] || [];
            const dayPnL = dayTrades.reduce((acc, t) => acc + (Number(t.pnl) || 0), 0);
            const hasTrades = dayTrades.length > 0;

            return (
              <div
                key={dateStr}
                onClick={() => hasTrades && setSelectedDateTrades({ date: dateStr, trades: dayTrades })}
                className={`h-28 rounded-2xl p-2.5 flex flex-col justify-between border transition-all ${
                  hasTrades
                    ? dayPnL >= 0
                      ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500 cursor-pointer shadow-lg'
                      : 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500 cursor-pointer shadow-lg'
                    : 'bg-slate-950/60 border-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-bold ${hasTrades ? 'text-white' : 'text-slate-500'}`}>
                    {dayNum}
                  </span>
                  {hasTrades && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 font-mono">
                      {dayTrades.length}T
                    </span>
                  )}
                </div>

                {hasTrades && (
                  <div className="text-center mt-auto">
                    <div className={`text-xs font-black ${dayPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {dayPnL >= 0 ? `+$${dayPnL.toLocaleString()}` : `-$${Math.abs(dayPnL).toLocaleString()}`}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 flex items-center justify-center space-x-1">
                      <Eye className="w-3 h-3 text-amber-400" />
                      <span>View Trades</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

        </div>
      </div>

      {/* Date Trades Detail Modal */}
      {selectedDateTrades && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-black text-white">Trades Executed on {selectedDateTrades.date}</h3>
                <p className="text-xs text-slate-400">Total Trades: {selectedDateTrades.trades.length}</p>
              </div>
              <button
                onClick={() => setSelectedDateTrades(null)}
                className="text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-bold"
              >
                Close ✕
              </button>
            </div>

            <div className="space-y-4">
              {selectedDateTrades.trades.map((trade) => (
                <div key={trade.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                        trade.direction === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {trade.direction} {trade.pair}
                      </span>
                      <span className="text-xs text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded">
                        {trade.setupType}
                      </span>
                    </div>
                    <div className={`text-sm font-black ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {trade.pnl >= 0 ? `+$${trade.pnl.toLocaleString()}` : `-$${Math.abs(trade.pnl).toLocaleString()}`}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <strong>Logic:</strong> {trade.reason}
                  </p>

                  {trade.screenshot && (
                    <div className="rounded-xl overflow-hidden border border-slate-800 h-28">
                      <img src={trade.screenshot} alt="Trade chart" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
