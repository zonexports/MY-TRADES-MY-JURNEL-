import React, { useState } from 'react';
import { Bot, Sparkles, RefreshCw, AlertCircle, Award, CheckCircle2 } from 'lucide-react';
import { Trade, UserProfile } from '../types';

interface AIMentorModalProps {
  trades: Trade[];
  profile: UserProfile;
}

export const AIMentorModal: React.FC<AIMentorModalProps> = ({ trades, profile }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAIMentorAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai-mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trades, profile }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch AI analysis.');
      }

      setAnalysis(data.analysis);
    } catch (err: any) {
      setError(err.message || 'Error connecting to Gemini AI mentor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2">
            <Bot className="w-6 h-6 text-amber-400" />
            <span>Gemini AI Trade Coach & SMC Mentor</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Get institutional Smart Money Concepts (SMC) analysis, risk management audit, and psychological coaching on your journal</p>
        </div>

        <button
          onClick={fetchAIMentorAnalysis}
          disabled={loading}
          className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/25 transition-transform hover:scale-[1.02] disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing Journal...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate AI Coaching Report</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-rose-950/40 border border-rose-500/50 rounded-2xl p-4 text-rose-300 text-sm flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Analysis Result or Placeholder */}
      {!analysis && !loading && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-amber-500/10 rounded-2xl border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Bot className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Ready for Institutional Trade Review</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Click the button above to have Gemini AI analyze your {trades.length} recorded Forex & Gold trades, pin down your execution leaks, and boost your win rate.
          </p>
        </div>
      )}

      {loading && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-16 text-center space-y-4">
          <RefreshCw className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
          <h3 className="text-lg font-bold text-white">Reviewing Order Blocks & Liquidity Sweeps...</h3>
          <p className="text-xs text-slate-400">Gemini is evaluating your win-rate, risk-to-reward ratio, and trading psychology.</p>
        </div>
      )}

      {analysis && !loading && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-white">AI Mentor Audit Report</h3>
                <p className="text-xs text-slate-400">Tailored for {profile.name} ({profile.handle})</p>
              </div>
            </div>

            <button
              onClick={fetchAIMentorAnalysis}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold border border-slate-700"
            >
              Re-Analyze
            </button>
          </div>

          <div className="text-slate-300 text-sm leading-relaxed space-y-4 whitespace-pre-line bg-slate-950 p-6 rounded-2xl border border-slate-800">
            {analysis}
          </div>
        </div>
      )}

    </div>
  );
};
