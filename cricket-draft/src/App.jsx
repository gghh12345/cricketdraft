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
            
            <a 
              href={`https://wa.me/?text=Hey!%20Join%20my%20Cricket%20Draft%20game.%20The%20Room%20Code%20is:%20${engine.roomCode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition-transform active:scale-95 mb-4 w-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              <span>Share on WhatsApp</span>
            </a>

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
