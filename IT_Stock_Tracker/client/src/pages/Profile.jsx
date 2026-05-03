import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useMode } from '../hooks/useMode';
import { Settings, Moon, Sun, CheckCircle, BookOpen, Zap, Bell, Shield } from 'lucide-react';

// 12 Stock-market themed avatars
const AVATARS = [
  { id: 'bull',     emoji: '🐂', label: 'Bull Trader'    },
  { id: 'bear',     emoji: '🐻', label: 'Bear Investor'  },
  { id: 'chart',    emoji: '📈', label: 'Chart Wizard'   },
  { id: 'diamond',  emoji: '💎', label: 'Diamond Hands'  },
  { id: 'moneybag', emoji: '💰', label: 'Money Magnet'   },
  { id: 'suit',     emoji: '👔', label: 'Wall St. Suit'  },
  { id: 'rocket',   emoji: '🚀', label: 'Moon Chaser'    },
  { id: 'magnify',  emoji: '🔍', label: 'Stock Analyst'  },
  { id: 'bank',     emoji: '🏦', label: 'The Banker'     },
  { id: 'oracle',   emoji: '🔮', label: 'Market Oracle'  },
  { id: 'lightning',emoji: '⚡',     label: 'Quick Trader'   },
  { id: 'trophy',   emoji: '🏆', label: 'Top Performer'  },
];

const PALETTES = [
  { id: 'indigo', name: 'Indigo', color: '#4f46e5', desc: 'Classic deep blue' },
  { id: 'emerald', name: 'Emerald', color: '#10b981', desc: 'Fresh market green' },
  { id: 'violet', name: 'Violet', color: '#7c3aed', desc: 'Regal purple' },
  { id: 'cyan', name: 'Cyan', color: '#0891b2', desc: 'Cool ocean blue' },
  { id: 'rose', name: 'Rose', color: '#e11d48', desc: 'Bold & energetic' },
  { id: 'ocean', name: 'Ocean', color: '#0284c7', desc: 'Deep sea depths' },
];

export default function Profile() {
  const { user, logout } = useAuth();
  const { mode, toggleMode, palette, setPalette } = useTheme();
  const { isBeginnerMode, toggleMode: toggleAppMode } = useMode();

  const [selectedAvatar, setSelectedAvatar] = useState(() => localStorage.getItem('user-avatar') || 'bull');
  const [notifications, setNotifications] = useState(() => localStorage.getItem('notif-enabled') === 'true');
  const [twoFA, setTwoFA] = useState(() => localStorage.getItem('twofa-enabled') === 'true');

  const handleAvatarSelect = (id) => {
    setSelectedAvatar(id);
    localStorage.setItem('user-avatar', id);
  };

  const handleNotifToggle = () => {
    const next = !notifications;
    setNotifications(next);
    localStorage.setItem('notif-enabled', String(next));
  };

  const handleTwoFAToggle = () => {
    const next = !twoFA;
    setTwoFA(next);
    localStorage.setItem('twofa-enabled', String(next));
  };

  const currentAvatar = AVATARS.find(a => a.id === selectedAvatar) || AVATARS[0];

  return (
    <div className="space-y-6 fade-in-up pb-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-[var(--accent-glow)]" style={{ background: 'var(--accent-primary)' }}>
          <Settings size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">Profile & Settings</h1>
          <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">Customize Your Experience</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="md:col-span-1">
          <div className="glass-card rounded-3xl p-6 text-center relative overflow-hidden group" style={{ border: '1px solid var(--card-border)' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Avatar display */}
            <div className="relative z-10 mb-4">
              <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center shadow-xl shadow-[var(--accent-glow)] text-5xl mb-2"
                style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
                {currentAvatar.emoji}
              </div>
              <span className="text-xs font-bold text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 px-3 py-1 rounded-full">{currentAvatar.label}</span>
            </div>

            <h2 className="text-base font-black text-[var(--text-primary)] relative z-10 mb-0.5">{user?.email?.split('@')[0]}</h2>
            <p className="text-xs text-[var(--text-muted)] font-medium relative z-10 mb-5">{user?.email}</p>

            {/* Mode Badge */}
            <div className="flex items-center justify-center gap-2 mb-5 relative z-10">
              <span className={`text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 ${isBeginnerMode ? 'bg-emerald-500/15 text-emerald-400' : 'bg-[var(--accent-primary)]/15 text-[var(--accent-primary)]'}`}>
                {isBeginnerMode ? <BookOpen size={12} /> : <Zap size={12} />}
                {isBeginnerMode ? 'Beginner Mode' : 'Pro Mode'}
              </span>
            </div>

            <button
              onClick={logout}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl font-bold text-sm transition-all relative z-10 text-rose-400 bg-rose-500/10 hover:bg-rose-500 hover:text-white"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        <div className="md:col-span-2 space-y-5">

          {/* Appearance */}
          <div className="glass-card rounded-3xl p-6" style={{ border: '1px solid var(--card-border)' }}>
            <h3 className="text-base font-black text-[var(--text-primary)] mb-5 flex items-center gap-2">
              <span className="text-xl">🎨</span> Appearance
            </h3>

            {/* Light / Dark Mode */}
            <div className="mb-5">
              <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-3">Interface Mode</p>
              <div className="flex rounded-2xl p-1 w-fit" style={{ background: 'var(--sidebar-border)' }}>
                {[
                  { val: 'light', label: 'Light', Icon: Sun },
                  { val: 'dark', label: 'Dark', Icon: Moon },
                ].map(({ val, label, Icon }) => (
                  <button key={val} onClick={() => mode !== val && toggleMode()}
                    className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${mode === val ? 'text-[var(--text-primary)] shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                    style={mode === val ? { background: 'var(--card-bg)' } : {}}
                  >
                    <Icon size={14} /> {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Palette */}
            <div>
              <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-3">Color Palette</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PALETTES.map(p => (
                  <button key={p.id} onClick={() => setPalette(p.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${palette === p.id ? 'shadow-md' : 'hover:opacity-80'}`}
                    style={{
                      border: `1px solid ${palette === p.id ? p.color : 'var(--card-border)'}`,
                      background: palette === p.id ? `${p.color}15` : 'var(--bg-base)',
                    }}
                  >
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow" style={{ background: p.color }}>
                      {palette === p.id && <CheckCircle size={14} />}
                    </div>
                    <div>
                      <p className="text-sm font-black" style={{ color: palette === p.id ? p.color : 'var(--text-primary)' }}>{p.name}</p>
                      <p className="text-[10px] font-semibold text-[var(--text-muted)]">{p.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Avatar Picker */}
          <div className="glass-card rounded-3xl p-6" style={{ border: '1px solid var(--card-border)' }}>
            <h3 className="text-base font-black text-[var(--text-primary)] mb-5 flex items-center gap-2">
              <span className="text-xl">🎭</span> Choose Your Avatar
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {AVATARS.map(av => (
                <button key={av.id} onClick={() => handleAvatarSelect(av.id)}
                  title={av.label}
                  className={`w-full aspect-square rounded-2xl text-3xl flex items-center justify-center transition-all hover:scale-110 ${selectedAvatar === av.id ? 'ring-2 ring-[var(--accent-primary)] shadow-lg shadow-[var(--accent-glow)] scale-110' : 'hover:ring-1 hover:ring-[var(--accent-primary)]/50'}`}
                  style={{ background: selectedAvatar === av.id ? 'var(--accent-primary)' : 'var(--bg-base)', border: '1px solid var(--card-border)' }}
                >
                  {av.emoji}
                </button>
              ))}
            </div>
            <p className="text-xs text-[var(--text-muted)] font-semibold mt-3 text-center">Selected: {currentAvatar.label}</p>
          </div>

          {/* App Mode */}
          <div className="glass-card rounded-3xl p-6" style={{ border: '1px solid var(--card-border)' }}>
            <h3 className="text-base font-black text-[var(--text-primary)] mb-2 flex items-center gap-2">
              {isBeginnerMode ? <BookOpen size={18} className="text-emerald-400" /> : <Zap size={18} className="text-[var(--accent-primary)]" />}
              App Mode
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mb-5 font-medium">
              {isBeginnerMode
                ? '🟢 Beginner Mode — educational tips, bulb icons, and Stock Market 101 are visible.'
                : '⚡ Pro Mode — a clean interface without educational overlays.'}
            </p>
            <div className="flex rounded-2xl p-1 w-fit" style={{ background: 'var(--sidebar-border)' }}>
              {[
                { val: true, label: '📚 Beginner', desc: 'Tips & 101' },
                { val: false, label: '⚡ Pro', desc: 'Clean & fast' },
              ].map(({ val, label, desc }) => (
                <button key={String(val)} onClick={() => isBeginnerMode !== val && toggleAppMode()}
                  className={`flex flex-col items-center px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${isBeginnerMode === val ? 'text-[var(--text-primary)] shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                  style={isBeginnerMode === val ? { background: 'var(--card-bg)' } : {}}
                >
                  <span>{label}</span>
                  <span className="text-[10px] font-normal text-[var(--text-muted)]">{desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Preferences (functional) */}
          <div className="glass-card rounded-3xl p-6" style={{ border: '1px solid var(--card-border)' }}>
            <h3 className="text-base font-black text-[var(--text-primary)] mb-5 flex items-center gap-2">
              <Shield size={18} className="text-[var(--accent-primary)]" /> Preferences
            </h3>
            <div className="space-y-3">
              {/* Email Notifications Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl" style={{ background: 'var(--bg-base)', border: '1px solid var(--card-border)' }}>
                <div className="flex items-center gap-3">
                  <Bell size={18} className="text-[var(--accent-primary)]" />
                  <div>
                    <p className="font-bold text-sm text-[var(--text-primary)]">Email Notifications</p>
                    <p className="text-[10px] text-[var(--text-muted)] font-semibold">Daily market summary at 4:00 PM</p>
                  </div>
                </div>
                <button
                  onClick={handleNotifToggle}
                  className={`w-12 h-6 rounded-full relative transition-colors ${notifications ? 'bg-[var(--accent-primary)]' : 'bg-[var(--sidebar-border)]'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${notifications ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              {/* 2FA Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl" style={{ background: 'var(--bg-base)', border: '1px solid var(--card-border)' }}>
                <div className="flex items-center gap-3">
                  <Shield size={18} className={twoFA ? 'text-emerald-400' : 'text-[var(--text-muted)]'} />
                  <div>
                    <p className="font-bold text-sm text-[var(--text-primary)]">Two-Factor Authentication</p>
                    <p className="text-[10px] text-[var(--text-muted)] font-semibold">{twoFA ? '✅ Enabled — Your account is secure' : 'Adds an extra layer of security'}</p>
                  </div>
                </div>
                <button
                  onClick={handleTwoFAToggle}
                  className={`w-12 h-6 rounded-full relative transition-colors ${twoFA ? 'bg-emerald-500' : 'bg-[var(--sidebar-border)]'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${twoFA ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
