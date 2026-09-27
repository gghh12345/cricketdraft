import React, { useState } from 'react';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';
import { useDraftEngine } from './game/useDraftEngine';

function App() {
  const engine = useDraftEngine();

  const handleRestartConfirmation = () => {
    if (window.confirm('Are you sure you want to restart the active game?')) {
      engine.restartGame();
    }
  };

  return (
    <div className="min-h-screen bg-game-bg font-sans selection:bg-game-blue selection:text-white">
      {engine.gamePhase === 'START' && (
        <StartScreen onStart={engine.startGame} onJoin={engine.joinGame} engine={engine} />
      )}
      
      {engine.gamePhase === 'WAITING_FOR_OPPONENT' && (
        <div className="min-h-screen bg-[#0B0E14] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
          {/* Atmosphere */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(204,255,0,0.1)_0%,transparent_60%)] pointer-events-none" />
          
          <div className="bg-[#121620]/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 max-w-md w-full border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-center relative z-10 animate-pop-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161B26] border border-[#CCFF00]/30 text-xs font-black text-[#CCFF00] uppercase tracking-wider mb-4 shadow-[0_0_15px_rgba(204,255,0,0.15)]">
              <span className="w-2 h-2 rounded-full bg-[#FF2A42] animate-ping" />
              <span>MATCHMAKING OCTAGON</span>
            </div>

            <h2 className="text-3xl font-bebas tracking-wide text-white mb-2 uppercase">
              WAITING FOR OPPONENT...
            </h2>
            <p className="text-xs text-gray-400 font-medium mb-6">
              Share this 6-character Arena Code with your rival to begin the bidding war:
            </p>

            {/* Glowing PIN Display */}
            <div className="text-5xl sm:text-6xl font-bebas tracking-[0.25em] text-[#CCFF00] mb-6 py-5 px-4 bg-[#0B0E14] rounded-2xl border-2 border-[#CCFF00]/50 shadow-[0_0_30px_rgba(204,255,0,0.2)] select-all">
              {engine.roomCode}
            </div>
            
            <button 
              onClick={() => {
                navigator.clipboard.writeText(engine.roomCode);
                alert('Arena Room Code copied to clipboard!');
              }}
              className="inline-flex items-center justify-center gap-2 bg-[#CCFF00] hover:bg-[#b8e600] text-[#0B0E14] font-bebas text-xl tracking-wider py-3.5 px-6 rounded-2xl transition-all active:scale-95 mb-4 w-full shadow-[0_0_20px_rgba(204,255,0,0.25)] cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span>COPY ARENA CODE</span>
            </button>

            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Duel begins instantly when opponent connects</span>
            </p>
          </div>
        </div>
      )}
      
      {engine.gamePhase === 'DRAFTING' && (
        <GameScreen engine={engine} />
      )}
      
      {engine.gamePhase === 'RESULT' && (
        <ResultScreen engine={engine} />
      )}
    </div>
  );
}

export default App;
