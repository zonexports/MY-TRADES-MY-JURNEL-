import React, { useState } from 'react';
import { User, Youtube, MessageCircle, Instagram, ShieldCheck, Plus, X, Camera, Save } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileSectionProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ profile, onUpdateProfile }) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [newTag, setNewTag] = useState('');
  const [savedMessage, setSavedMessage] = useState(false);

  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  ];

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    if (!formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
    }
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tagToRemove),
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2">
            <User className="w-6 h-6 text-amber-400" />
            <span>Trader Profile & Social Suite</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage your DP avatar, institutional trader tags, YouTube, WhatsApp, and Instagram links</p>
        </div>

        {savedMessage && (
          <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-4 py-2 rounded-xl text-xs font-bold animate-pulse">
            Profile Updated Successfully!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* DP Avatar Section */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Camera className="w-5 h-5 text-amber-400" />
            <span>Profile Picture (DP)</span>
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <img
                src={formData.avatar}
                alt="Profile DP"
                className="w-28 h-28 rounded-full object-cover border-4 border-amber-500 shadow-xl"
              />
              <span className="absolute bottom-1 right-1 bg-amber-500 text-slate-950 p-1.5 rounded-full shadow">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>

            <div className="flex-1 space-y-4 w-full">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Custom Avatar Image URL
                </label>
                <input
                  type="url"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Or Choose Preset Avatar
                </span>
                <div className="flex items-center space-x-3">
                  {presetAvatars.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Preset ${idx}`}
                      onClick={() => setFormData({ ...formData, avatar: url })}
                      className={`w-12 h-12 rounded-full object-cover cursor-pointer border-2 transition-all ${
                        formData.avatar === url ? 'border-amber-400 scale-110 shadow-lg' : 'border-slate-800 hover:border-slate-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Info & Social Links */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <h3 className="text-lg font-bold text-white">Identity & Social Channels</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Trader Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Trader Handle</label>
              <input
                type="text"
                value={formData.handle}
                onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Trader Bio</label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center space-x-1.5">
                <Youtube className="w-4 h-4 text-rose-500" />
                <span>YouTube Channel Link</span>
              </label>
              <input
                type="url"
                value={formData.youtube}
                onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                placeholder="https://youtube.com/@yourchannel"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center space-x-1.5">
                <MessageCircle className="w-4 h-4 text-emerald-500" />
                <span>WhatsApp Contact / Channel</span>
              </label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                placeholder="https://wa.me/91..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center space-x-1.5">
                <Instagram className="w-4 h-4 text-pink-500" />
                <span>Instagram Profile Link</span>
              </label>
              <input
                type="url"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                placeholder="https://instagram.com/..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Initial Account Balance ($)</label>
              <input
                type="number"
                value={formData.initialBalance}
                onChange={(e) => setFormData({ ...formData, initialBalance: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Professional Tags / Badges */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <h3 className="text-lg font-bold text-white">Professional Trader Tags & Badges</h3>
          <p className="text-xs text-slate-400">Add badges such as Liquidity Hunter, SMC Trader, Institutional Trader, Gold Sniper, etc.</p>

          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, i) => (
              <span key={i} className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-950 border border-amber-500/30 text-amber-300 text-xs font-bold">
                <span>#{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="e.g. Price Action Master"
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500 flex-1 max-w-sm"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-sm border border-slate-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Tag</span>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center space-x-2 px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/25 transition-transform hover:scale-[1.02]"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Changes</span>
          </button>
        </div>

      </form>

    </div>
  );
};
