import React, { useState } from 'react';
import { Trophy, Users, IndianRupee, LogIn, Plus } from 'lucide-react';

export default function StartScreen({ onStart, onJoin }) {
  const [tab, setTab] = useState('CREATE'); // CREATE or JOIN
  const [p1Name, setP1Name] = useState('Player 1');
  const [p2Name, setP2Name] = useState('Player 2');
  const [roomCode, setRoomCode] = useState('');
  const [budget, setBudget] = useState(20);
  const [squadSize, setSquadSize] = useState(5);
  const [mode, setMode] = useState('AUCTION');

  const handleCreate = (e) => {
    e.preventDefault();
    onStart(p1Name, null, budget, squadSize, mode);
  };

  const handleJoin = (e) => {
    e.preventDefault();
    onJoin(roomCode.toUpperCase(), p2Name);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 animate-pop-in">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-game-blue tracking-tight uppercase">Cricket<br/>Draft</h1>
          <p className="text-gray-500 mt-2 font-medium">Multiplayer Edition</p>
        </div>

        <div className="flex mb-6 rounded-xl bg-gray-100 p-1">
          <button
            onClick={() => setTab('CREATE')}
            className={`flex-1 py-2 text-sm font-bold flex items-center justify-center space-x-2 rounded-lg transition-colors ${tab === 'CREATE' ? 'bg-white shadow text-game-blue' : 'text-gray-500'}`}
          >
            <Plus className="w-4 h-4" />
            <span>Create Room</span>
          </button>
          <button
            onClick={() => setTab('JOIN')}
            className={`flex-1 py-2 text-sm font-bold flex items-center justify-center space-x-2 rounded-lg transition-colors ${tab === 'JOIN' ? 'bg-white shadow text-game-blue' : 'text-gray-500'}`}
          >
            <LogIn className="w-4 h-4" />
            <span>Join Room</span>
          </button>
        </div>

        {tab === 'CREATE' ? (
          <form onSubmit={handleCreate} className="space-y-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={p1Name}
                onChange={(e) => setP1Name(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-game-blue focus:border-game-blue bg-gray-50"
                placeholder="Your Name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget (₹)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IndianRupee className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    min="10"
                    max="100"
                    className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-game-blue focus:border-game-blue bg-gray-50"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Squad Size</label>
                <select
                  value={squadSize}
                  onChange={(e) => setSquadSize(Number(e.target.value))}
                  className="block w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-game-blue focus:border-game-blue bg-gray-50"
                >
                  <option value={5}>5 Players</option>
                  <option value={7}>7 Players</option>
                  <option value={11}>11 Players</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Game Mode</label>
              <div className="flex rounded-xl shadow-sm bg-gray-100 p-1">
                <button
                  type="button"
                  onClick={() => setMode('QUICK')}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                    mode === 'QUICK' ? 'bg-white text-game-blue shadow' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Quick Draft
                </button>
                <button
                  type="button"
                  onClick={() => setMode('AUCTION')}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                    mode === 'AUCTION' ? 'bg-white text-game-blue shadow' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Auction
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-game-blue hover:bg-blue-800 transition-transform active:scale-95"
            >
              <Trophy className="mr-2 h-6 w-6" />
              CREATE ROOM
            </button>
          </form>
        ) : (
          <form onSubmit={handleJoin} className="space-y-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={p2Name}
                onChange={(e) => setP2Name(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-game-blue focus:border-game-blue bg-gray-50"
                placeholder="Your Name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Code</label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-game-blue focus:border-game-blue bg-gray-50 font-black tracking-widest text-center text-xl uppercase"
                placeholder="XXXXXX"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-game-green hover:bg-green-700 transition-transform active:scale-95"
            >
              <LogIn className="mr-2 h-6 w-6" />
              JOIN GAME
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
