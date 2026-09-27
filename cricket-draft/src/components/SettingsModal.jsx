import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Volume2, VolumeX, Palette, Play, 
  RotateCcw, Sliders, Smartphone, Check, Moon, Sun, Gavel, Zap
} from 'lucide-react';
import { sfx } from '../game/soundEffects';

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  currentTheme = 'dark', 
  onSelectTheme, 
  sfxMuted, 
  onToggleSfx,
  soundTheme,
  onSelectSoundTheme,
  screenShakeEnabled,
  onToggleScreenShake,
  onRestart
}) {
  if (!isOpen) return null;

  const isDark = currentTheme === 'dark';

  const themes = [
    {
      id: 'dark',
      name: 'Dark Theme',
      icon: <Moon className="w-5 h-5 text-amber-400" />,
      desc: 'Midnight stadium arena with glowing gold accents'
    },
    {
      id: 'light',
      name: 'Light Theme',
      icon: <Sun className="w-5 h-5 text-amber-500" />,
      desc: 'Clean bright daylight arena with crisp contrast'
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`relative w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden border transition-colors ${
            isDark 
              ? 'bg-slate-900 border-slate-700/80 text-white' 
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Mobile Drag Indicator */}
          <div className={`w-12 h-1.5 rounded-full mx-auto mt-3 mb-1 sm:hidden ${
            isDark ? 'bg-slate-700' : 'bg-slate-300'
          }`} />

          {/* Header */}
          <div className={`flex justify-between items-center px-5 py-3.5 border-b ${
            isDark ? 'border-slate-800' : 'border-slate-100'
          }`}>
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-500" />
              <h3 className="font-black text-base tracking-tight uppercase">
                Settings
              </h3>
            </div>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-full transition-colors ${
                isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 space-y-6 overflow-y-auto">
            {/* 1. THEME: LIGHT OR DARK ONLY */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-amber-500" />
                  <span>Theme</span>
                </span>
                <span className={`text-[11px] font-bold capitalize ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {currentTheme} Mode
                </span>
              </div>

              {/* 2-Option Radio Cards */}
              <div className="grid grid-cols-2 gap-2.5">
                {themes.map(t => {
                  const isSelected = currentTheme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => onSelectTheme(t.id)}
                      className={`text-left p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between min-h-[95px] ${
                        isSelected 
                          ? 'border-amber-400 bg-amber-500/10 shadow-md ring-1 ring-amber-400/50' 
                          : isDark
                            ? 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
                            : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                          {t.icon}
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-amber-400 bg-amber-400 text-slate-950' : 'border-slate-400/50'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>

                      <div className="mt-2">
                        <div className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {t.name}
                        </div>
                        <div className={`text-[10px] line-clamp-1 mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {t.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. AUDIO & SOUND THEME */}
            <div className={`border-t pt-5 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <span className="text-xs font-black uppercase tracking-wider text-amber-500 flex items-center gap-1.5 mb-3">
                <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                <span>Audio & Sound FX</span>
              </span>

              {/* Master Sound FX Toggle */}
              <div className={`flex items-center justify-between p-3.5 rounded-2xl border mb-3 ${
                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <div className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Sound Effects
                  </div>
                  <div className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Gavel knocks, cash chimes, and heartbeat ticks
                  </div>
                </div>

                <button
                  onClick={onToggleSfx}
                  className={`w-12 h-7 rounded-full p-0.5 transition-colors relative flex items-center ${
                    !sfxMuted ? 'bg-emerald-500 justify-end' : 'bg-slate-400 justify-start'
                  }`}
                >
                  <motion.div 
                    layout
                    className="w-6 h-6 rounded-full bg-white shadow-md"
                  />
                </button>
              </div>

              {/* Sound Theme Selection */}
              {!sfxMuted && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    onClick={() => {
                      onSelectSoundTheme('ipl');
                      sfx.setSoundTheme('ipl');
                      sfx.playGavel();
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      soundTheme === 'ipl'
                        ? 'border-amber-400 bg-amber-500/10 shadow-sm'
                        : isDark
                          ? 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`text-xs font-black flex items-center justify-between ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      <span className="flex items-center gap-1">
                        <Gavel className="w-3 h-3 text-amber-500" />
                        <span>IPL Auction</span>
                      </span>
                      <Play className="w-3 h-3 text-amber-500 fill-amber-500" />
                    </div>
                    <div className={`text-[10px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Hammer & cash chimes
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onSelectSoundTheme('esports');
                      sfx.setSoundTheme('esports');
                      sfx.playBid();
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      soundTheme === 'esports'
                        ? 'border-cyan-400 bg-cyan-500/10 shadow-sm'
                        : isDark
                          ? 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`text-xs font-black flex items-center justify-between ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-cyan-500" />
                        <span>Esports Hype</span>
                      </span>
                      <Play className="w-3 h-3 text-cyan-500 fill-cyan-500" />
                    </div>
                    <div className={`text-[10px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Voltage synth & power-ups
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* 3. DYNAMICS & MOTION */}
            <div className={`border-t pt-5 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <span className="text-xs font-black uppercase tracking-wider text-amber-500 flex items-center gap-1.5 mb-3">
                <Smartphone className="w-3.5 h-3.5 text-amber-500" />
                <span>Motion & Gameplay</span>
              </span>

              <div className={`flex items-center justify-between p-3.5 rounded-2xl border ${
                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <div className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Screen Shake & Impact
                  </div>
                  <div className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Vibrate & pulse effects on hammer strikes
                  </div>
                </div>

                <button
                  onClick={onToggleScreenShake}
                  className={`w-12 h-7 rounded-full p-0.5 transition-colors relative flex items-center ${
                    screenShakeEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-400 justify-start'
                  }`}
                >
                  <motion.div 
                    layout
                    className="w-6 h-6 rounded-full bg-white shadow-md"
                  />
                </button>
              </div>
            </div>

            {/* 4. ACTIONS */}
            <div className={`border-t pt-4 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <button
                onClick={() => {
                  onClose();
                  if (window.confirm('Restart active auction session?')) {
                    onRestart();
                  }
                }}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-red-500 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restart Active Match</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
