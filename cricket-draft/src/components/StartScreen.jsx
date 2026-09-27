import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Users, IndianRupee, LogIn, Plus, Zap, Shield, Flame, 
  ArrowRight, ArrowLeft, Clock, Sparkles, Check, ChevronRight 
} from 'lucide-react';

export default function StartScreen({ onStart, onJoin, engine }) {
  // Navigation: 'SPLASH' (Screen 1) -> 'SETUP' (Screen 2)
  const [screenView, setScreenView] = useState('SPLASH');
  const [tab, setTab] = useState('CREATE'); // CREATE or JOIN
  
  // Player & Game Configuration
  const [p1Name, setP1Name] = useState('Captain 1');
  const [p2Name, setP2Name] = useState('Challenger 2');
  const [roomCode, setRoomCode] = useState('');
  
  // Custom Editable Starting Purse & Squad (No rigid preset locks!)
  const [budget, setBudget] = useState(50);
  const [squadSize, setSquadSize] = useState(5);
  const [mode, setMode] = useState('AUCTION');
  const [timerEnabled, setTimerEnabled] = useState(false);

  // Connection & Loading States from engine
  const isCreatingRoom = engine?.isCreatingRoom || false;
  const isJoiningRoom = engine?.isJoiningRoom || false;
  const connectionStatus = engine?.connectionStatus || 'connected';
  const backendUrl = engine?.backendUrl || '';
  const [showServerModal, setShowServerModal] = useState(false);
  const [serverUrlInput, setServerUrlInput] = useState(backendUrl);

  const quickPurseOptions = [20, 50, 100, 200];
  const squadOptions = [3, 5, 7, 11];

  const handleCreate = (e) => {
    e.preventDefault();
    if (isCreatingRoom) return;
    const finalBudget = Math.max(1, Number(budget) || 20);
    const finalSquad = Math.max(1, Number(squadSize) || 5);
    onStart(p1Name, null, finalBudget, finalSquad, mode, timerEnabled);
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (isJoiningRoom) return;
    if (!roomCode.trim()) return;
    onJoin(roomCode.trim().toUpperCase(), p2Name);
  };

  return (
    <div className="min-h-[100dvh] bg-[#0B0E14] text-white flex flex-col items-center justify-center p-3 sm:p-5 relative overflow-hidden font-sans selection:bg-[#CCFF00] selection:text-[#0B0E14]">
      {/* Background Atmosphere: Radial neon glow & subtle dark grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(204,255,0,0.08)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(11,14,20,0.95))] pointer-events-none" />
      
      {/* Subtle sports grid lines */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px' 
        }} 
      />

      <div className="w-full max-w-md relative z-10">
        <AnimatePresence mode="wait">
          {/* ========================================================
              SCREEN 1: UFC HERO SPLASH ("DRAFT THE BEST OF THE BEST")
             ======================================================== */}
          {screenView === 'SPLASH' ? (
            <motion.div
              key="splash"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center"
            >
              {/* Top UFC Pill & Server Status */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#161B26] border border-white/10 text-xs font-black tracking-widest uppercase text-[#CCFF00] shadow-[0_0_15px_rgba(204,255,0,0.15)]">
                  <span className="w-2 h-2 rounded-full bg-[#FF2A42] animate-pulse" />
                  <span>1v1 VIRAL CRICKET DUEL</span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowServerModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161B26]/90 border border-white/10 hover:border-[#CCFF00]/40 text-[10px] font-bold text-gray-300 transition-all cursor-pointer"
                  title="Configure Arena Server"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    connectionStatus === 'connected'
                      ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]'
                      : connectionStatus === 'connecting'
                      ? 'bg-amber-400 animate-ping'
                      : 'bg-rose-500'
                  }`} />
                  <span>{connectionStatus === 'connected' ? 'SERVER ONLINE' : connectionStatus === 'connecting' ? 'CONNECTING...' : 'OFFLINE'}</span>
                  <span className="text-[10px] opacity-60">⚙️</span>
                </button>
              </div>

              {connectionStatus === 'connecting' && (
                <div className="mb-3 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-medium max-w-xs animate-pulse text-center">
                  ⚡ Waking up arena server (Render free tier may take ~30s on first load)...
                </div>
              )}

              {/* Main Headline in Bebas Neue */}
              <h1 className="text-4xl sm:text-5xl font-bebas tracking-wide text-white uppercase leading-[0.95] mb-2">
                DRAFT THE <span className="text-[#CCFF00] drop-shadow-[0_0_20px_rgba(204,255,0,0.4)]">BEST</span> OF THE BEST
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 font-medium max-w-xs mb-6">
                Head-to-head live auction. Out-bid your rival for Virat Kohli, Rohit Sharma, MS Dhoni & AB de Villiers.
              </p>

              {/* Superstar Cutout Showcase (Virat Kohli Hero Card) */}
              <div className="relative w-full max-w-[290px] h-[340px] mb-6 rounded-3xl overflow-hidden bg-gradient-to-b from-[#161D2C] via-[#121622] to-[#0B0E14] border border-[#CCFF00]/30 shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex flex-col justify-end p-4 group">
                {/* Background Giant Watermark '#18' */}
                <span className="absolute top-2 right-4 text-7xl font-bebas font-black text-white/[0.04] select-none pointer-events-none">
                  #18
                </span>

                {/* Floodlight Beam */}
                <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-[#CCFF00]/15 via-transparent to-transparent pointer-events-none" />

                {/* Virat Kohli Photo */}
                <img
                  src="/players/2.jpg"
                  alt="Virat Kohli"
                  className="absolute inset-0 w-full h-full object-cover object-top filter brightness-105 contrast-110"
                />

                {/* Bottom Gradient Fade */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/40 to-transparent" />

                {/* Floating Fighter Badges on Hero */}
                <div className="relative z-10 flex items-center justify-between w-full mb-1">
                  <div className="flex items-center gap-1.5 bg-[#0B0E14]/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10 text-[10px] font-black text-[#CCFF00]">
                    <Sparkles className="w-3 h-3 fill-[#CCFF00]" />
                    <span>MARQUEE BATTER</span>
                  </div>
                  <span className="bg-[#CCFF00] text-[#0B0E14] px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider">
                    IND • RANK #1
                  </span>
                </div>

                <div className="relative z-10 text-left">
                  <div className="text-xl font-bebas tracking-wide text-white leading-tight">
                    VIRAT KOHLI
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-bold text-gray-300">
                    <span>SR: 138.4</span>
                    <span>•</span>
                    <span>AVG: 58.7</span>
                    <span>•</span>
                    <span className="text-[#CCFF00]">BASE: ₹0 (OPEN BID)</span>
                  </div>
                </div>
              </div>

              {/* Enter Arena CTA Button */}
              <button
                onClick={() => setScreenView('SETUP')}
                className="w-full py-4 px-6 rounded-2xl bg-[#CCFF00] text-[#0B0E14] font-bebas text-2xl tracking-wider uppercase hover:bg-[#b8e600] active:scale-95 transition-all shadow-[0_0_30px_rgba(204,255,0,0.35)] flex items-center justify-center gap-2 mb-3 cursor-pointer"
              >
                <span>ENTER ARENA</span>
                <ArrowRight className="w-5 h-5 stroke-[3]" />
              </button>

              {/* Direct Room Code Fast Join */}
              <button
                onClick={() => {
                  setTab('JOIN');
                  setScreenView('SETUP');
                }}
                className="text-xs font-bold text-gray-400 hover:text-white transition-colors flex items-center gap-1 py-1"
              >
                <span>Have an opponent's room code?</span>
                <span className="text-[#CCFF00] underline underline-offset-2">Join Match →</span>
              </button>
            </motion.div>
          ) : (
            /* ========================================================
               SCREEN 2: MATCH SETUP ARENA (CREATE OR JOIN)
               ======================================================== */
            <motion.div
              key="setup"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="bg-[#121620]/95 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 border border-white/10 shadow-[0_15px_50px_rgba(0,0,0,0.7)]"
            >
              {/* Back to Splash & Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <button
                  onClick={() => setScreenView('SPLASH')}
                  className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <div className="text-center">
                  <span className="font-bebas text-lg tracking-wider text-white uppercase block">
                    MATCH CONFIGURATION
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowServerModal(true)}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-[#CCFF00] transition-colors cursor-pointer"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      connectionStatus === 'connected' ? 'bg-emerald-400' : connectionStatus === 'connecting' ? 'bg-amber-400 animate-ping' : 'bg-rose-500'
                    }`} />
                    <span>{connectionStatus === 'connected' ? 'Arena Server Connected' : 'Connecting to Server...'}</span>
                    <span className="text-[9px] opacity-60">⚙️</span>
                  </button>
                </div>
                <div className="w-10" /> {/* Spacer */}
              </div>

              {/* Tab Switcher: CREATE vs JOIN */}
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-[#0B0E14] border border-white/10 mb-5">
                <button
                  type="button"
                  onClick={() => setTab('CREATE')}
                  className={`py-2.5 rounded-xl font-bebas text-sm sm:text-base tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 ${
                    tab === 'CREATE'
                      ? 'bg-[#CCFF00] text-[#0B0E14] shadow-[0_0_15px_rgba(204,255,0,0.25)]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Create Arena</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTab('JOIN')}
                  className={`py-2.5 rounded-xl font-bebas text-sm sm:text-base tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 ${
                    tab === 'JOIN'
                      ? 'bg-[#CCFF00] text-[#0B0E14] shadow-[0_0_15px_rgba(204,255,0,0.25)]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <LogIn className="w-4 h-4 stroke-[3]" />
                  <span>Join Arena</span>
                </button>
              </div>

              {tab === 'CREATE' ? (
                <form onSubmit={handleCreate} className="space-y-4">
                  {/* Player Tag */}
                  <div>
                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">
                      Your Player Tag
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Users className="h-4 w-4 text-gray-500" />
                      </div>
                      <input
                        type="text"
                        value={p1Name}
                        onChange={(e) => setP1Name(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 bg-[#0B0E14] border border-white/10 rounded-xl focus:ring-2 focus:ring-[#CCFF00] focus:border-[#CCFF00] text-white font-bold text-sm placeholder:text-gray-600 outline-none"
                        placeholder="e.g. Captain Rohit"
                        required
                      />
                    </div>
                  </div>

                  {/* CUSTOM EDITABLE STARTING PURSE */}
                  <div className="p-3 bg-[#0B0E14]/80 rounded-2xl border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[11px] font-black text-gray-300 uppercase tracking-wider flex items-center gap-1">
                        <IndianRupee className="w-3.5 h-3.5 text-[#CCFF00]" />
                        <span>Starting Purse (Custom ₹ Cr)</span>
                      </label>
                      <span className="text-[10px] text-[#CCFF00] font-bold">
                        Type any custom amount
                      </span>
                    </div>

                    {/* Direct Numeric Input with large digits */}
                    <div className="flex items-center bg-[#161B26] border border-white/10 rounded-xl px-3 py-2 focus-within:border-[#CCFF00] transition-colors mb-2.5">
                      <span className="text-xl font-bebas text-[#CCFF00] mr-2">₹</span>
                      <input
                        type="number"
                        min="1"
                        max="9999"
                        value={budget}
                        onChange={(e) => setBudget(Number(e.target.value))}
                        className="w-full bg-transparent font-bebas text-2xl text-white outline-none tracking-wider"
                      />
                      <span className="text-xs font-black text-gray-400 uppercase tracking-wider">
                        CRORE
                      </span>
                    </div>

                    {/* Quick-tap Chips */}
                    <div className="grid grid-cols-4 gap-1.5">
                      {quickPurseOptions.map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => setBudget(amount)}
                          className={`py-1.5 rounded-lg text-xs font-black transition-all ${
                            Number(budget) === amount
                              ? 'bg-[#CCFF00] text-[#0B0E14] shadow-xs'
                              : 'bg-[#161B26] text-gray-400 hover:text-white border border-white/5'
                          }`}
                        >
                          ₹{amount} Cr
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* CUSTOM SQUAD SIZE */}
                  <div className="p-3 bg-[#0B0E14]/80 rounded-2xl border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[11px] font-black text-gray-300 uppercase tracking-wider flex items-center gap-1">
                        <Trophy className="w-3.5 h-3.5 text-[#CCFF00]" />
                        <span>Squad Size (Players to Win)</span>
                      </label>
                      <span className="text-xs font-bebas text-white">
                        {squadSize} PLAYERS
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5">
                      {squadOptions.map((count) => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => setSquadSize(count)}
                          className={`py-2 rounded-xl text-xs font-black transition-all ${
                            squadSize === count
                              ? 'bg-[#CCFF00] text-[#0B0E14] shadow-xs font-bold'
                              : 'bg-[#161B26] text-gray-400 hover:text-white border border-white/5'
                          }`}
                        >
                          {count} Picks
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* GAME MODE: LIVE AUCTION vs FAST DRAFT */}
                  <div>
                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">
                      Duel Format
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setMode('AUCTION')}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          mode === 'AUCTION'
                            ? 'bg-[#161B26] border-[#CCFF00] ring-1 ring-[#CCFF00]/40'
                            : 'bg-[#0B0E14] border-white/5 hover:border-white/10 opacity-70'
                        }`}
                      >
                        <div className="flex items-center gap-1 font-black text-xs text-white">
                          <Zap className="w-3.5 h-3.5 text-[#CCFF00] fill-[#CCFF00]" />
                          <span>Live Auction</span>
                        </div>
                        <div className="text-[10px] text-gray-400 font-medium mt-0.5">
                          Real-time bid raises & folds
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMode('QUICK')}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          mode === 'QUICK'
                            ? 'bg-[#161B26] border-[#CCFF00] ring-1 ring-[#CCFF00]/40'
                            : 'bg-[#0B0E14] border-white/5 hover:border-white/10 opacity-70'
                        }`}
                      >
                        <div className="flex items-center gap-1 font-black text-xs text-white">
                          <Shield className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Fast Draft</span>
                        </div>
                        <div className="text-[10px] text-gray-400 font-medium mt-0.5">
                          Alternating snake picks
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* 20s Shot Clock Toggle */}
                  <div className="flex items-center justify-between p-3 bg-[#0B0E14]/80 border border-white/10 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <div>
                        <span className="block text-xs font-black text-white">20s Shot Clock</span>
                        <span className="block text-[10px] text-gray-400">Auto-pass if player stalls</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTimerEnabled(!timerEnabled)}
                      className={`px-3 py-1 rounded-full text-xs font-black transition-all ${
                        timerEnabled
                          ? 'bg-[#CCFF00] text-[#0B0E14] shadow-[0_0_10px_rgba(204,255,0,0.3)]'
                          : 'bg-[#161B26] text-gray-400 border border-white/10'
                      }`}
                    >
                      {timerEnabled ? 'ACTIVE' : 'OFF'}
                    </button>
                  </div>

                  {/* Launch Duel Arena CTA */}
                  <button
                    type="submit"
                    disabled={isCreatingRoom}
                    className="w-full py-4 rounded-2xl bg-[#CCFF00] text-[#0B0E14] font-bebas text-xl tracking-wider uppercase hover:bg-[#b8e600] active:scale-95 transition-all shadow-[0_0_25px_rgba(204,255,0,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isCreatingRoom ? (
                      <>
                        <div className="w-5 h-5 border-2 border-[#0B0E14] border-t-transparent rounded-full animate-spin" />
                        <span>CREATING ARENA ROOM...</span>
                      </>
                    ) : (
                      <>
                        <Trophy className="w-5 h-5 fill-[#0B0E14]" />
                        <span>LAUNCH ARENA DUEL (₹{budget} CR)</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* JOIN MATCH FORM */
                <form onSubmit={handleJoin} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">
                      Your Player Tag
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Users className="h-4 w-4 text-gray-500" />
                      </div>
                      <input
                        type="text"
                        value={p2Name}
                        onChange={(e) => setP2Name(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 bg-[#0B0E14] border border-white/10 rounded-xl focus:ring-2 focus:ring-[#CCFF00] focus:border-[#CCFF00] text-white font-bold text-sm placeholder:text-gray-600 outline-none"
                        placeholder="e.g. Challenger Virat"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">
                      Enter 6-Character Room Pin
                    </label>
                    <input
                      type="text"
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                      className="block w-full px-4 py-3.5 bg-[#0B0E14] border-2 border-white/15 focus:border-[#CCFF00] rounded-2xl text-white font-bebas tracking-[0.3em] text-center text-3xl uppercase placeholder:text-gray-700 outline-none shadow-inner"
                      placeholder="XXXXXX"
                      maxLength={6}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isJoiningRoom}
                    className="w-full py-4 rounded-2xl bg-[#CCFF00] text-[#0B0E14] font-bebas text-xl tracking-wider uppercase hover:bg-[#b8e600] active:scale-95 transition-all shadow-[0_0_25px_rgba(204,255,0,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isJoiningRoom ? (
                      <>
                        <div className="w-5 h-5 border-2 border-[#0B0E14] border-t-transparent rounded-full animate-spin" />
                        <span>CONNECTING TO ARENA...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5 stroke-[3]" />
                        <span>ENTER ARENA DUEL</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Server Config Modal */}
        {showServerModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#121620] border border-white/15 rounded-3xl p-6 max-w-sm w-full shadow-2xl">
              <h3 className="font-bebas text-2xl tracking-wide text-white uppercase mb-1">
                Arena Server Settings
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                Current connected backend URL. If hosting on Render or custom domain, enter it below:
              </p>
              
              <div className="mb-4">
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1">
                  Backend URL
                </label>
                <input
                  type="text"
                  value={serverUrlInput}
                  onChange={(e) => setServerUrlInput(e.target.value)}
                  placeholder="https://cricket-draft-backend.onrender.com"
                  className="w-full px-3 py-2.5 bg-[#0B0E14] border border-white/10 rounded-xl text-white font-mono text-xs focus:ring-2 focus:ring-[#CCFF00] outline-none"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  Default: auto-detects Render or localhost:5000
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    engine?.updateBackendUrl(serverUrlInput);
                    setShowServerModal(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#CCFF00] text-[#0B0E14] font-black text-xs uppercase tracking-wider hover:bg-[#b8e600] transition-colors cursor-pointer"
                >
                  Save & Reload
                </button>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('CRICKET_DRAFT_BACKEND_URL');
                    window.location.reload();
                  }}
                  className="px-3 py-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-white font-bold text-xs uppercase cursor-pointer"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setShowServerModal(false)}
                  className="px-3 py-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-white font-bold text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
