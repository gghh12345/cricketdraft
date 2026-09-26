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
      {engine.gamePhase === 'DRAFTING' && (
        <button 
          onClick={handleRestartConfirmation}
          className="fixed top-4 right-4 z-50 text-xs font-bold text-gray-500 hover:text-gray-800 bg-white/80 px-3 py-1 rounded-full shadow-sm"
        >
          Restart
        </button>
      )}

      {engine.gamePhase === 'START' && (
        <StartScreen onStart={engine.startGame} onJoin={engine.joinGame} />
      )}
      
      {engine.gamePhase === 'WAITING_FOR_OPPONENT' && (
        <div className="min-h-screen flex items-center justify-center p-4 text-center">
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Waiting for Opponent...</h2>
            <p className="text-gray-500 mb-6">Share this Room Code with your friend:</p>
            <div className="text-5xl font-black text-game-blue tracking-widest mb-8 p-4 bg-blue-50 rounded-xl border-2 border-game-blue border-dashed">
              {engine.roomCode}
            </div>
            <p className="text-sm text-gray-400">The game will start automatically when they join.</p>
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
