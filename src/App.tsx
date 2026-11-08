import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { Journal } from './components/Journal';
import { CalendarView } from './components/CalendarView';
import { AIMentorModal } from './components/AIMentorModal';
import { ProfileSection } from './components/ProfileSection';
import { TradeModal } from './components/TradeModal';
import { ShareModal } from './components/ShareModal';
import { initialTrades, defaultProfile } from './data/initialData';
import { Trade, UserProfile } from './types';
import { Youtube, MessageCircle, Instagram, ShieldCheck, Copyright } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Persistent State
  const [trades, setTrades] = useState<Trade[]>(() => {
    const saved = localStorage.getItem('fxzaidu_trades');
    return saved ? JSON.parse(saved) : initialTrades;
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('fxzaidu_profile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  // Modal States
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareData, setShareData] = useState<any>(null);

  useEffect(() => {
    localStorage.setItem('fxzaidu_trades', JSON.stringify(trades));
  }, [trades]);

  useEffect(() => {
    localStorage.setItem('fxzaidu_profile', JSON.stringify(profile));
  }, [profile]);

  // Trade handlers
  const handleSaveTrade = (trade: Trade) => {
    const exists = trades.some(t => t.id === trade.id);
    if (exists) {
      setTrades(trades.map(t => t.id === trade.id ? trade : t));
    } else {
      setTrades([...trades, trade]);
    }
  };

  const handleDeleteTrade = (id: string) => {
    if (window.confirm('Are you sure you want to delete this trade breakdown?')) {
      setTrades(trades.filter(t => t.id !== id));
    }
  };

  const handleEditTrade = (trade: Trade) => {
    setEditingTrade(trade);
    setIsTradeModalOpen(true);
  };

  const handleOpenAddTrade = () => {
    setEditingTrade(null);
    setIsTradeModalOpen(true);
  };

  const handleOpenShare = (data: any) => {
    setShareData(data);
    setIsShareModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        onOpenAddTrade={handleOpenAddTrade}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {activeTab === 'dashboard' && (
          <Dashboard
            trades={trades}
            profile={profile}
            onOpenAddTrade={handleOpenAddTrade}
            onOpenShare={handleOpenShare}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'journal' && (
          <Journal
            trades={trades}
            onOpenAddTrade={handleOpenAddTrade}
            onEditTrade={handleEditTrade}
            onDeleteTrade={handleDeleteTrade}
            onOpenShare={handleOpenShare}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView trades={trades} />
        )}

        {activeTab === 'ai-mentor' && (
          <AIMentorModal trades={trades} profile={profile} />
        )}

        {activeTab === 'profile' && (
          <ProfileSection profile={profile} onUpdateProfile={setProfile} />
        )}
      </main>

      {/* Footer with Copyright Symbol & Social Links */}
      <footer className="bg-[#0B0F19] border-t border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-black text-slate-950 text-sm shadow">
              FX
            </div>
            <div>
              <div className="text-sm font-extrabold text-white tracking-wide">FXZAIDU TERMINAL</div>
              <p className="text-xs text-slate-400">Professional Forex & Gold Trading Journal Suite</p>
            </div>
          </div>

          {/* Social Links from Profile */}
          <div className="flex items-center space-x-4">
            {profile.youtube && (
              <a
                href={profile.youtube}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-400 border border-slate-800 transition-colors"
                title="YouTube Channel"
              >
                <Youtube className="w-4 h-4" />
              </a>
            )}
            {profile.whatsapp && (
              <a
                href={profile.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 transition-colors"
                title="WhatsApp Contact"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            )}
            {profile.instagram && (
              <a
                href={profile.instagram}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-pink-400 border border-slate-800 transition-colors"
                title="Instagram Profile"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Copyright Symbol Footer */}
          <div className="text-xs text-slate-500 flex items-center space-x-1.5 font-medium">
            <Copyright className="w-3.5 h-3.5" />
            <span>2026 FXZAIDU. All rights reserved. Professional Forex & Gold Trading Journal.</span>
          </div>

        </div>
      </footer>

      {/* Modals */}
      <TradeModal
        isOpen={isTradeModalOpen}
        onClose={() => setIsTradeModalOpen(false)}
        onSave={handleSaveTrade}
        editingTrade={editingTrade}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        data={shareData}
        profile={profile}
      />

    </div>
  );
}
