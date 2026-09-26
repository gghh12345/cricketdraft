import React from 'react';
import { Mic, MicOff, PhoneCall } from 'lucide-react';
import { useVoiceChat } from '../game/useVoiceChat';
import PlayerCard from './PlayerCard';
import PlayerColumn from './PlayerColumn';

export default function GameScreen({ engine }) {
  const { currentPlayer, player1, player2, draftHistory, roomCode } = engine;
  const { isMuted, toggleMute, audioRef, hasError, isConnected, startCall } = useVoiceChat(roomCode, true);

  return (
    <div className="min-h-screen p-4 flex flex-col max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-6 py-2 px-4 bg-white rounded-full shadow-sm">
        <h1 className="text-xl font-extrabold text-game-blue tracking-tight uppercase">Cricket Draft</h1>
        <div className="flex items-center gap-4">
          <audio ref={audioRef} autoPlay />
          {!isConnected && !hasError && (
            <button onClick={startCall} className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold hover:bg-green-200 shadow-sm transition-colors">
              <PhoneCall className="w-3 h-3" />
              Join Voice
            </button>
          )}
          {isConnected && (
            <button onClick={toggleMute} className={`p-2 rounded-full shadow-sm transition-colors ${isMuted ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`} title={isMuted ? "Unmute" : "Mute"}>
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}
          {hasError && <span className="text-xs text-red-500 font-bold bg-red-50 px-2 py-1 rounded">Mic Error</span>}
          {currentPlayer && (
            <div className="text-sm font-bold text-gray-500 flex gap-4 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
              <span>Base: <span className="text-gray-800">₹{currentPlayer.price}</span></span>
              <span>Bid: <span className="text-game-green">₹{engine.auctionState.currentBid}</span></span>
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 flex-shrink-0">
          <PlayerColumn player={player1} playerNum={1} isActive={engine.auctionState.currentTurn === 1} engine={engine} />
        </div>

        <div className="flex-1 flex flex-col items-center justify-start space-y-8 pt-4">
          {currentPlayer ? (
            <div key={currentPlayer.id} className="w-full">
              <PlayerCard player={currentPlayer} />
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
                    <span className="font-bold text-game-green ml-2">₹{hist.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-full md:w-1/3 flex-shrink-0">
          <PlayerColumn player={player2} playerNum={2} isActive={engine.auctionState.currentTurn === 2} engine={engine} />
        </div>
      </div>
    </div>
  );
}
