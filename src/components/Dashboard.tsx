import React, { useState } from 'react';
import { 
  DollarSign, TrendingUp, TrendingDown, Award, Activity, 
  BarChart3, Calendar as CalendarIcon, ArrowUpRight, ArrowDownRight, 
  Sparkles, Share2, Layers, ShieldCheck 
} from 'lucide-react';
import { Trade, UserProfile } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from 'recharts';

interface DashboardProps {
  trades: Trade[];
  profile: UserProfile;
  onOpenAddTrade: () => void;
  onOpenShare: (tradeOrSummary?: any) => void;
  onNavigateTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  trades,
  profile,
  onOpenAddTrade,
  onOpenShare,
  onNavigateTab,
}) => {
  const [timeframe, setTimeframe] = useState<'all' | 'daily' | 'weekly' | 'monthly' | 'yearly'>('all');

  // Calculations
  const totalTrades = trades.length;
  const wins = trades.filter(t => (Number(t.pnl) || 0) > 0);
  const losses = trades.filter(t => (Number(t.pnl) || 0) < 0);
  const winRate = totalTrades > 0 ? ((wins.length / totalTrades) * 100).toFixed(1) : '0';

  const netPnL = trades.reduce((acc, t) => acc + (Number(t.pnl) || 0), 0);
  
  const latestDate = trades.length > 0 ? trades[trades.length - 1].date : new Date().toISOString().split('T')[0];
  const dailyPnL = trades.filter(t => t.date === latestDate).reduce((acc, t) => acc + (Number(t.pnl) || 0), 0);
  const weeklyPnL = trades.slice(-5).reduce((acc, t) => acc + (Number(t.pnl) || 0), 0);

  const grossProfit = wins.reduce((acc, t) => acc + Math.abs(Number(t.pnl) || 0), 0);
  const grossLoss = Math.abs(losses.reduce((acc, t) => acc + (Number(t.pnl) || 0), 0));
  const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss).toFixed(2) : grossProfit > 0 ? 'Infinite' : '0';

  // Chronologically sorted trades
  const sortedTrades = [...trades].sort((a, b) => new Date(`${a.date}T${a.time || '00:00'}`).getTime() - new Date(`${b.date}T${b.time || '00:00'}`).getTime());

  // Robust Equity Curve Data generation for all timeframes
  let equityData: { date: string; pnl: number; equity: number }[] = [];

  if (sortedTrades.length === 0) {
    equityData = [{ date: 'Start', pnl: 0, equity: profile.initialBalance }];
  } else if (timeframe === 'all') {
    let cumulative = profile.initialBalance;
    equityData = sortedTrades.map((t, idx) => {
      cumulative += Number(t.pnl) || 0;
      return {
        index: idx + 1,
        date: t.date,
        pair: t.pair,
        pnl: Number(t.pnl) || 0,
        equity: cumulative,
      };
    });
  } else {
    // Grouping by timeframe with foolproof fallback so chart never disappears
    let cumulative = profile.initialBalance;
    const grouped: { [key: string]: number } = {};
    
    sortedTrades.forEach(t => {
      let key = t.date;
      if (timeframe === 'weekly') {
        const d = new Date(t.date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        key = new Date(d.setDate(diff)).toISOString().split('T')[0];
        key = `Week ${key}`;
      } else if (timeframe === 'monthly') {
        key = t.date.substring(0, 7); // YYYY-MM
      } else if (timeframe === 'yearly') {
        key = t.date.substring(0, 4); // YYYY
      }
      grouped[key] = (grouped[key] || 0) + (Number(t.pnl) || 0);
    });

    const keys = Object.keys(grouped).sort();
    
    // Always include a baseline initial point if only 1 key exists
    if (keys.length === 1) {
      equityData.push({ date: 'Baseline', pnl: 0, equity: profile.initialBalance });
    }

    keys.forEach(k => {
      const pnl = grouped[k];
      cumulative += pnl;
      equityData.push({ date: k, pnl, equity: cumulative });
    });
  }

  if (equityData.length === 0) {
    equityData = [{ date: 'Start', pnl: 0, equity: profile.initialBalance }];
  }

  // Asset breakdown (Gold XAUUSD vs Forex)
  const goldTrades = trades.filter(t => t.pair.toUpperCase().includes('XAU'));
  const forexTrades = trades.filter(t => !t.pair.toUpperCase().includes('XAU'));
  const goldPnL = goldTrades.reduce((acc, t) => acc + (Number(t.pnl) || 0), 0);
  const forexPnL = forexTrades.reduce((acc, t) => acc + (Number(t.pnl) || 0), 0);

  return (
    <div className="space-y-8 pb-12 animate-fadeIn">
      
      {/* Welcome & Profile Banner - Blue Sky 3D Glassmorphism */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 border border-sky-500/30 p-6 md:p-8 shadow-2xl shadow-sky-950/50 backdrop-blur-xl transform transition-all duration-300 hover:shadow-sky-500/20">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-sky-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/3 -mb-12 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center space-x-5">
            <div className="relative group">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-sky-400 shadow-xl group-hover:scale-105 transition-transform"
              />
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider shadow">
                PRO
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  {profile.name}
                </h1>
                <span className="text-xs text-sky-400 font-mono bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/30">
                  {profile.handle}
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-1 max-w-xl">
                {profile.bio}
              </p>
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                {profile.tags.map((tag, i) => (
                  <span key={i} className="text-xs px-3 py-1 rounded-full bg-slate-900/90 text-sky-300 font-medium border border-sky-500/30 shadow-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => onOpenShare({ type: 'summary', netPnL, winRate, totalTrades })}
              className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white font-semibold text-sm border border-sky-500/30 transition-all transform hover:-translate-y-0.5 shadow-lg shadow-sky-950"
            >
              <Share2 className="w-4 h-4 text-sky-400" />
              <span>Share Dashboard</span>
            </button>
            <button
              onClick={onOpenAddTrade}
              className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-xl shadow-sky-500/30 transition-all transform hover:-translate-y-0.5 hover:scale-[1.02]"
            >
              <span>+ Record Trade</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid - 3D Pop Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Net Total PnL */}
        <div className="bg-slate-900/90 border border-sky-500/30 rounded-3xl p-5 shadow-2xl shadow-sky-950/40 relative overflow-hidden group hover:border-sky-400 hover:-translate-y-1 transition-all duration-300 backdrop-blur-xl">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-sky-400 to-blue-600"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Net Total P&L</span>
            <div className={`p-2.5 rounded-2xl ${netPnL >= 0 ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'}`}>
              {netPnL >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            </div>
          </div>
          <div className={`text-3xl font-black tracking-tight ${netPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {netPnL >= 0 ? `+$${netPnL.toLocaleString()}` : `-$${Math.abs(netPnL).toLocaleString()}`}
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-sky-500/10 text-xs text-slate-400">
            <span>Starting: ${profile.initialBalance.toLocaleString()}</span>
            <span className="text-sky-400 font-semibold">{((netPnL / profile.initialBalance) * 100).toFixed(1)}% ROI</span>
          </div>
        </div>

        {/* Daily PnL */}
        <div className="bg-slate-900/90 border border-sky-500/30 rounded-3xl p-5 shadow-2xl shadow-sky-950/40 relative overflow-hidden group hover:border-sky-400 hover:-translate-y-1 transition-all duration-300 backdrop-blur-xl">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-emerald-400 to-emerald-600"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Daily P&L</span>
            <div className="p-2.5 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <CalendarIcon className="w-5 h-5" />
            </div>
          </div>
          <div className={`text-3xl font-black tracking-tight ${dailyPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {dailyPnL >= 0 ? `+$${dailyPnL.toLocaleString()}` : `-$${Math.abs(dailyPnL).toLocaleString()}`}
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-sky-500/10 text-xs text-slate-400">
            <span>Latest Session</span>
            <span className="text-emerald-400 font-semibold">{latestDate}</span>
          </div>
        </div>

        {/* Weekly PnL */}
        <div className="bg-slate-900/90 border border-sky-500/30 rounded-3xl p-5 shadow-2xl shadow-sky-950/40 relative overflow-hidden group hover:border-sky-400 hover:-translate-y-1 transition-all duration-300 backdrop-blur-xl">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-sky-400 to-indigo-600"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Weekly P&L</span>
            <div className="p-2.5 rounded-2xl bg-sky-500/15 text-sky-400 border border-sky-500/30">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className={`text-3xl font-black tracking-tight ${weeklyPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {weeklyPnL >= 0 ? `+$${weeklyPnL.toLocaleString()}` : `-$${Math.abs(weeklyPnL).toLocaleString()}`}
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-sky-500/10 text-xs text-slate-400">
            <span>Last 5 Sessions</span>
            <span className="text-sky-400 font-semibold">Active Trend</span>
          </div>
        </div>

        {/* Win Rate & Stats */}
        <div className="bg-slate-900/90 border border-sky-500/30 rounded-3xl p-5 shadow-2xl shadow-sky-950/40 relative overflow-hidden group hover:border-sky-400 hover:-translate-y-1 transition-all duration-300 backdrop-blur-xl">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-purple-400 to-pink-600"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Win Rate / PF</span>
            <div className="p-2.5 rounded-2xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black tracking-tight text-white">
            {winRate}% <span className="text-sm font-normal text-slate-400">({wins.length}W / {losses.length}L)</span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-sky-500/10 text-xs text-slate-400">
            <span>Profit Factor: <strong className="text-purple-400">{profitFactor}</strong></span>
            <span>Total: {totalTrades} Trades</span>
          </div>
        </div>

      </div>

      {/* Equity Curve Section - Blue Sky Glow & 3D Depth */}
      <div className="bg-slate-900/90 border border-sky-500/30 rounded-3xl p-6 md:p-8 shadow-2xl shadow-sky-950/60 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-sky-400" />
              <span>Equity Curve & Timeframe Growth</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Switch between Daily, Weekly, Monthly, and Yearly performance trajectories</p>
          </div>

          {/* Timeframe selector */}
          <div className="flex items-center space-x-1.5 bg-slate-950 p-1.5 rounded-2xl border border-sky-500/30 shadow-inner">
            {(['all', 'daily', 'weekly', 'monthly', 'yearly'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-all duration-200 ${
                  timeframe === tf
                    ? 'bg-gradient-to-r from-sky-400 to-blue-600 text-slate-950 shadow-lg shadow-sky-500/30 font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={equityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="blueSkyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} domain={['auto', 'auto']} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#020617', borderColor: '#38BDF8', borderRadius: '16px', color: '#fff', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }}
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Equity Balance']}
              />
              <Area type="monotone" dataKey="equity" stroke="#38BDF8" strokeWidth={3} fillOpacity={1} fill="url(#blueSkyGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Asset Breakdown & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gold vs Forex Performance */}
        <div className="bg-slate-900/90 border border-sky-500/30 rounded-3xl p-6 shadow-2xl shadow-sky-950/40 flex flex-col justify-between backdrop-blur-xl">
          <div>
            <h3 className="text-lg font-bold text-white mb-1 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Asset Performance</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6">Gold (XAUUSD) vs Forex Majors breakdown</p>

            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-sky-500/20 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500 shadow"></span>
                    <span className="font-bold text-white text-sm">Gold (XAUUSD)</span>
                  </div>
                  <span className="text-xs text-slate-400">{goldTrades.length} Trades Executed</span>
                </div>
                <div className={`text-lg font-black ${goldPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {goldPnL >= 0 ? `+$${goldPnL.toLocaleString()}` : `-$${Math.abs(goldPnL).toLocaleString()}`}
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-sky-500/20 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-sky-400 shadow"></span>
                    <span className="font-bold text-white text-sm">Forex Majors</span>
                  </div>
                  <span className="text-xs text-slate-400">{forexTrades.length} Trades Executed</span>
                </div>
                <div className={`text-lg font-black ${forexPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {forexPnL >= 0 ? `+$${forexPnL.toLocaleString()}` : `-$${Math.abs(forexPnL).toLocaleString()}`}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('journal')}
            className="w-full mt-6 py-3 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 font-bold text-xs uppercase tracking-wider transition-colors border border-sky-500/30"
          >
            View All Trade Breakdowns →
          </button>
        </div>

        {/* Recent Trades Preview */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-sky-500/30 rounded-3xl p-6 shadow-2xl shadow-sky-950/40 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Layers className="w-5 h-5 text-sky-400" />
              <span>Recent Trade Breakdowns</span>
            </h3>
            <button
              onClick={() => onNavigateTab('journal')}
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold"
            >
              View Journal ({trades.length})
            </button>
          </div>

          <div className="space-y-3">
            {trades.slice(-4).reverse().map((trade) => (
              <div key={trade.id} className="bg-slate-950 p-3.5 rounded-2xl border border-sky-500/20 flex items-center justify-between hover:border-sky-400/50 transition-all">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${
                    trade.direction === 'BUY' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                  }`}>
                    {trade.direction}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-sm">{trade.pair}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-sky-300 font-mono border border-sky-500/20">{trade.setupType}</span>
                    </div>
                    <p className="text-xs text-slate-400 truncate max-w-xs md:max-w-md mt-0.5">{trade.reason}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-sm font-black ${Number(trade.pnl) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {Number(trade.pnl) >= 0 ? `+$${Number(trade.pnl).toLocaleString()}` : `-$${Math.abs(Number(trade.pnl)).toLocaleString()}`}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">{trade.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
