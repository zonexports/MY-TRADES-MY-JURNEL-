import React from 'react';
import { LayoutDashboard, BookOpen, Calendar, Bot, User, PlusCircle, TrendingUp, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: UserProfile;
  onOpenAddTrade: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  onOpenAddTrade,
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'journal', label: 'Trading Journal', icon: BookOpen },
    { id: 'calendar', label: 'P&L Calendar', icon: Calendar },
    { id: 'ai-mentor', label: 'AI Trade Coach', icon: Bot },
    { id: 'profile', label: 'Profile Suite', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-extrabold tracking-wider bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                  FXZAIDU
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/30">
                  PRO
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Forex & Gold Trading Terminal</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action & Profile DP */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onOpenAddTrade}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all duration-200 transform hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Add Trade</span>
            </button>

            {/* Profile Avatar */}
            <div
              onClick={() => setActiveTab('profile')}
              className="flex items-center space-x-3 pl-2 border-l border-slate-800 cursor-pointer group"
            >
              <div className="relative">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-amber-500/50 group-hover:border-amber-400 transition-colors shadow-md"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0B0F19] rounded-full"></span>
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors flex items-center space-x-1">
                  <span>{profile.name}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400 inline" />
                </div>
                <div className="text-xs text-slate-400">{profile.handle}</div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="md:hidden flex items-center justify-around bg-slate-900 border-t border-slate-800 py-2 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center p-2 rounded-lg text-xs font-medium transition-colors ${
                isActive ? 'text-amber-400 bg-slate-800' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span>{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
