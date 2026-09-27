import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, PhoneCall, RotateCcw, Users, Settings, Volume2, VolumeX, Check 
} from 'lucide-react';
import { useVoiceChat } from '../game/useVoiceChat';
import { sfx } from '../game/soundEffects';
import PlayerCard from './PlayerCard';
import PlayerColumn from './PlayerColumn';
import DuelScoreboard from './DuelScoreboard';
import BiddingDeck from './BiddingDeck';
import SquadDrawer from './SquadDrawer';
import SoldBanner from './SoldBanner';
import SettingsModal from './SettingsModal';

export default function GameScreen({ engine }) {
  const { 
    currentPlayer, 
    player1, 
    player2, 
    draftHistory, 
    roomCode, 
    settings, 
    auctionState,
    myPlayerNum,
    restartGame
  } = engine;

  const { isMuted, toggleMute, audioRef, hasError, isConnected, startCall } = useVoiceChat(roomCode, true);
  
  const [isSquadDrawerOpen, setIsSquadDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [sfxMuted, setSfxMuted] = useState(sfx.isMuted);
  const [soundTheme, setSoundTheme] = useState(() => {
    const st = sfx.soundTheme;
    return st === 'apple' ? 'ipl' : st;
  });
  const [currentTheme, setCurrentTheme] = useState(() => {
    try {
      const stored = localStorage.getItem('cricket_draft_visual_theme');
      return (stored === 'light' || stored === 'dark') ? stored : 'light';
    } catch (e) {
      return 'light';
    }
  });
  const [screenShakeEnabled, setScreenShakeEnabled] = useState(true);
  const [soldInfo, setSoldInfo] = useState(null);

  const isDark = currentTheme === 'dark';

  const handleSelectTheme = (themeId) => {
    setCurrentTheme(themeId);
    try {
      localStorage.setItem('cricket_draft_visual_theme', themeId);
    } catch (e) {}
  };

  // Sound & Event Tracking Refs
  const prevBidRef = useRef(auctionState.currentBid);
  const prevHistoryLenRef = useRef(draftHistory.length);
  const prevPlayerIdRef = useRef(currentPlayer?.id);
  const prevTimeLeftRef = useRef(auctionState.timeLeft);

  // 1. Play Bid Sound when auction bid increases
  useEffect(() => {
    if (auctionState.currentBid > prevBidRef.current) {
      sfx.playBid();
    }
    prevBidRef.current = auctionState.currentBid;
  }, [auctionState.currentBid]);

  // 2. Play Gavel Knock and show "SOLD!" Stamp when a player is drafted
  useEffect(() => {
    if (draftHistory.length > prevHistoryLenRef.current) {
      const latest = draftHistory[draftHistory.length - 1];
      if (latest) {
        sfx.playGavel();
        setSoldInfo(latest);
        const timer = setTimeout(() => {
          setSoldInfo(null);
        }, 1800);
        return () => clearTimeout(timer);
      }
    }
    prevHistoryLenRef.current = draftHistory.length;
  }, [draftHistory.length]);

  // 3. Play Card Reveal Whoosh when a new player appears
  useEffect(() => {
    if (currentPlayer && currentPlayer.id !== prevPlayerIdRef.current) {
      sfx.playCardReveal();
    }
    prevPlayerIdRef.current = currentPlayer?.id;
  }, [currentPlayer?.id]);

  // 4. Play Timer Countdown Tick (Urgent tick during last 5 seconds)
  useEffect(() => {
    if (
      settings.timerEnabled && 
      auctionState.timeLeft !== undefined && 
      auctionState.timeLeft !== prevTimeLeftRef.current
    ) {
      if (auctionState.timeLeft <= 5 && auctionState.timeLeft > 0) {
        sfx.playTick(true);
      } else if (auctionState.timeLeft > 5) {
        sfx.playTick(false);
      }
      prevTimeLeftRef.current = auctionState.timeLeft;
    }
  }, [auctionState.timeLeft, settings.timerEnabled]);

  const handleToggleSfx = () => {
    const isNowMuted = sfx.toggleMute();
    setSfxMuted(isNowMuted);
  };

  const handleRestart = () => {
    if (window.confirm('Are you sure you want to restart the draft?')) {
      restartGame();
    }
  };

  const isAuction = settings.gameMode === 'AUCTION';
  const highestBidderName = auctionState.highestBidder === 1 
    ? player1.name 
    : auctionState.highestBidder === 2 
      ? player2.name 
      : null;

  // Theme styling helpers (Obsidian Pro Sports Betting)
  const getThemeBackground = () => {
    return isDark 
      ? 'bg-[#0B0E14] text-white' 
      : 'bg-gradient-to-b from-[#EEF7EF] via-[#E4EFE5] to-[#D9ECE0] text-slate-900';
  };

  const getThemeHeader = () => {
    return isDark 
      ? 'bg-[#121620]/90 backdrop-blur-xl border-b border-white/10 text-white' 
      : 'bg-white/90 backdrop-blur-xl border-b border-emerald-900/10 text-slate-900 shadow-2xs';
  };

  const shakeClass = (soldInfo && screenShakeEnabled) ? 'animate-shake' : '';

  return (
    <div className={`h-[100dvh] max-h-[100dvh] flex flex-col selection:bg-game-blue selection:text-white overflow-hidden relative transition-colors duration-500 ${getThemeBackground()} ${shakeClass}`}>
      {/* Sold Stamp Banner overlay */}
      <SoldBanner soldInfo={soldInfo} />

      {/* ========================================================
          TOP GLOBAL HEADER
      ======================================================== */}
      <header className={`px-3 py-2 flex items-center justify-between shrink-0 z-20 transition-colors ${getThemeHeader()}`}>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-900 text-white px-2.5 py-1 rounded-full shadow-xs">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-black text-xs tracking-wider uppercase text-amber-300">
              {isAuction ? '⚡ AUCTION' : '🏏 DRAFT'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Settings Modal Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            title="Settings & Themes"
            className="p-1.5 rounded-full hover:bg-black/5 text-gray-600 hover:text-gray-900 transition-colors border border-gray-200/60 bg-white/70 backdrop-blur-xs shadow-2xs"
          >
            <Settings className="w-4 h-4" />
          </button>

          <audio ref={audioRef} autoPlay />
          {!isConnected && !hasError && (
            <button 
              onClick={startCall} 
              className="flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-black hover:bg-green-200 transition-colors"
            >
              <PhoneCall className="w-3 h-3" />
              <span className="hidden sm:inline">Voice</span>
            </button>
          )}
          {isConnected && (
            <button 
              onClick={toggleMute} 
              className={`p-1.5 rounded-full transition-colors ${
                isMuted ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
              }`} 
              title={isMuted ? "Unmute Mic" : "Mute Mic"}
            >
              {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Mobile Squad Drawer Button */}
          <button
            onClick={() => setIsSquadDrawerOpen(true)}
            className="md:hidden flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-game-blue hover:bg-blue-100 rounded-full text-xs font-black border border-blue-200 transition-colors"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Squads</span>
          </button>

          {/* Restart Button */}
          <button
            onClick={handleRestart}
            title="Restart Draft"
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ========================================================
          MOBILE VIEW (< 768px): LOCKED 100dvh 1v1 REEL VIEW
      ======================================================== */}
      <div className="flex-1 flex flex-col justify-between p-2 sm:p-3 overflow-hidden md:hidden">
        {/* Section 1: Duel Scoreboard */}
        <div className="shrink-0 mb-1">
          <DuelScoreboard engine={engine} isDark={isDark} />
        </div>

        {/* Section 2: Center Stage Spotlight */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-0 py-1 relative">
          {currentPlayer ? (
            <div className="flex flex-col items-center w-full max-w-[280px]">
              {/* Urgency Countdown Timer */}
              {settings.timerEnabled && (
                <div className={`mb-1.5 px-3 py-0.5 rounded-full text-xs font-black shadow-md flex items-center gap-1.5 ${
                  (auctionState.timeLeft || 0) <= 5
                    ? 'bg-red-600 text-white animate-bounce'
                    : isDark ? 'bg-slate-900 text-amber-400' : 'bg-slate-800 text-amber-300'
                }`}>
                  <span>⏱ {auctionState.timeLeft || 0}s</span>
                </div>
              )}

              {/* Player Card */}
              <PlayerCard player={currentPlayer} />

              {/* Auction Status Pill */}
              <div className="mt-1.5 w-full flex items-center justify-center">
                {isAuction ? (
                  auctionState.biddingActive ? (
                    auctionState.currentBid > 0 ? (
                      <div className="px-3.5 py-1 bg-[#CCFF00] text-[#0B0E14] rounded-full text-xs font-black shadow-[0_0_15px_rgba(204,255,0,0.3)] flex items-center gap-1.5 border border-[#b8e600]">
                        <span className="font-bebas text-sm tracking-wide">🔥 LEADING: ₹{auctionState.currentBid} CR</span>
                        <span className="text-[11px] font-extrabold text-[#0B0E14]/80">
                          ({highestBidderName})
                        </span>
                      </div>
                    ) : (
                      <div className={`px-3 py-0.5 rounded-full text-[11px] font-black border shadow-xs flex items-center gap-1.5 ${
                        isDark ? 'bg-[#121620] text-[#CCFF00] border-[#CCFF00]/40' : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      }`}>
                        <span>⚡ Opened at ₹0 by {highestBidderName}</span>
                      </div>
                    )
                  ) : (
                    <div className={`px-3 py-0.5 rounded-full text-[11px] font-black border shadow-xs ${
                      isDark ? 'bg-[#121620] text-gray-300 border-white/10' : 'bg-white text-slate-700 border-slate-300'
                    }`}>
                      ⚡ Opening Bid: ₹0 (Base Price)
                    </div>
                  )
                ) : (
                  <div className={`px-3 py-0.5 rounded-full text-[11px] font-black border shadow-xs ${
                    isDark ? 'bg-[#121620] text-[#CCFF00] border-[#CCFF00]/40' : 'bg-white text-slate-700 border-slate-300'
                  }`}>
                    Draft Cost: ₹{currentPlayer.price || 0} CR
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 font-black text-sm">
              All players drafted!
            </div>
          )}
        </div>

        {/* Section 3: Thumb Bidding Deck & Squad Drawer Trigger */}
        <div className="shrink-0 space-y-1.5">
          <BiddingDeck engine={engine} isDark={isDark} />

          <button
            onClick={() => setIsSquadDrawerOpen(true)}
            className="w-full py-1 text-center text-[11px] font-bold text-gray-500 hover:text-gray-800 flex items-center justify-center gap-1 transition-colors"
          >
            <span>📋 View Squads & {isAuction ? 'Auction Log' : 'Draft Log'} ({player1.squad.length} vs {player2.squad.length}) ▲</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          DESKTOP VIEW (>= 768px): 3-COLUMN FULL STADIUM VIEW
      ======================================================== */}
      <div className="hidden md:flex flex-1 overflow-y-auto p-4 max-w-6xl mx-auto w-full gap-6">
        <div className="w-1/3 flex-shrink-0">
          <PlayerColumn 
            player={player1} 
            playerNum={1} 
            isActive={auctionState.currentTurn === 1} 
            engine={engine} 
          />
        </div>

        <div className="flex-1 flex flex-col items-center justify-start space-y-6 pt-4">
          {currentPlayer ? (
            <div key={currentPlayer.id} className="w-full relative flex flex-col items-center">
              {settings.timerEnabled && (
                <div className={`mb-3 px-4 py-1 rounded-full text-base font-black shadow-lg flex items-center gap-2 ${
                  (auctionState.timeLeft || 0) <= 5 
                    ? 'bg-red-500 text-white animate-bounce' 
                    : 'bg-slate-900 text-amber-400'
                }`}>
                  <span>⏱ {auctionState.timeLeft || 0}s</span>
                </div>
              )}
              <PlayerCard player={currentPlayer} />

              <div className="mt-4 px-4 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-black text-gray-700 shadow-sm flex items-center gap-3">
                <span>Base: <span className="text-gray-900 font-extrabold">₹{currentPlayer.price || 0}</span></span>
                <span>•</span>
                {auctionState.biddingActive ? (
                  auctionState.currentBid > 0 ? (
                    <span>Leading Bid: <span className="text-emerald-600 font-black">₹{auctionState.currentBid}</span> ({highestBidderName})</span>
                  ) : (
                    <span>Opened: <span className="text-emerald-600 font-black">₹0</span> ({highestBidderName})</span>
                  )
                ) : (
                  <span>Opening Bid: <span className="text-gray-900 font-black">₹0</span></span>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 font-bold mt-10">No more players available</div>
          )}

          {draftHistory.length > 0 && (
            <div className="w-full max-w-xs mx-auto bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 text-center">Draft History</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-sm">
                {[...draftHistory].reverse().map((hist, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-gray-50 pb-2">
                    <span className="font-medium text-gray-800 truncate w-1/2">{hist.playerName}</span>
                    <span className="text-xs text-gray-500">→ {hist.draftedBy}</span>
                    <span className="font-bold text-emerald-600 ml-2">₹{hist.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-1/3 flex-shrink-0">
          <PlayerColumn 
            player={player2} 
            playerNum={2} 
            isActive={auctionState.currentTurn === 2} 
            engine={engine} 
          />
        </div>
      </div>

      {/* ========================================================
          SLIDE-UP SQUAD DRAWER (MOBILE)
      ======================================================== */}
      <SquadDrawer
        isOpen={isSquadDrawerOpen}
        onClose={() => setIsSquadDrawerOpen(false)}
        engine={engine}
        isDark={isDark}
      />

      {/* ========================================================
          SETTINGS & THEMES MODAL
      ======================================================== */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
        sfxMuted={sfxMuted}
        onToggleSfx={handleToggleSfx}
        soundTheme={soundTheme}
        onSelectSoundTheme={(theme) => {
          setSoundTheme(theme);
          sfx.setSoundTheme(theme);
        }}
        screenShakeEnabled={screenShakeEnabled}
        onToggleScreenShake={() => setScreenShakeEnabled(!screenShakeEnabled)}
        onRestart={handleRestart}
      />
    </div>
  );
}
