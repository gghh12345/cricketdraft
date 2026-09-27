import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, History, Shield, IndianRupee } from 'lucide-react';

export default function SquadDrawer({ isOpen, onClose, engine, isDark = false }) {
  const { player1, player2, draftHistory, settings, myPlayerNum = 1 } = engine;
  const maxSquad = settings.squadSize;

  const [activeTab, setActiveTab] = useState('P1'); // 'P1', 'P2', 'HISTORY'

  const myPlayer = myPlayerNum === 1 ? player1 : player2;
  const opponent = myPlayerNum === 1 ? player2 : player1;

  const renderSquadList = (player, isMe) => {
    return (
      <div className="space-y-3">
        <div className={`flex justify-between items-center p-3 rounded-xl border ${
          isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div>
            <div className={`text-xs font-black uppercase tracking-wider ${
              isDark ? 'text-amber-400' : 'text-game-blue'
            }`}>
              {player.name} {isMe && '(You)'}
            </div>
            <div className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {player.squad.length} / {maxSquad} Players Picked
            </div>
          </div>
          <div className="text-right">
            <div className={`text-xs font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Budget Left
            </div>
            <div className={`text-lg font-black ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              ₹{player.budget}
            </div>
          </div>
        </div>

        <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
          {Array.from({ length: maxSquad }).map((_, i) => {
            const member = player.squad[i];
            return (
              <div
                key={member ? member.id : `empty-${i}`}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                  member 
                    ? isDark ? 'bg-slate-950/70 border-slate-800 shadow-sm' : 'bg-white border-slate-200 shadow-sm'
                    : isDark ? 'bg-slate-950/30 border-dashed border-slate-800/80' : 'bg-slate-50 border-dashed border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-5 text-center text-xs font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {i + 1}.
                  </span>
                  {member ? (
                    <div className="flex items-center gap-2.5">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className={`w-9 h-9 rounded-full object-cover border object-top ${
                          isDark ? 'border-amber-400/40 bg-slate-800' : 'border-slate-300 bg-slate-100'
                        }`}
                        onError={(e) => { e.target.src = '/players/1.jpg'; }}
                      />
                      <div>
                        <div className={`text-sm font-black leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {member.name}
                        </div>
                        <div className={`text-[10px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {member.role} • {member.country}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className={`text-xs italic ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      Empty Slot
                    </span>
                  )}
                </div>

                {member && (
                  <span className={`text-xs font-black px-2.5 py-1 rounded-lg border ${
                    isDark 
                      ? 'text-amber-300 bg-amber-500/15 border-amber-400/30' 
                      : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  }`}>
                    ₹{member.purchasePrice ?? member.price}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Drawer content */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`relative w-full max-w-lg rounded-t-3xl shadow-2xl z-10 flex flex-col max-h-[85vh] overflow-hidden border-t transition-colors ${
              isDark ? 'bg-slate-900 border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Drawer Handle */}
            <div className={`w-12 h-1.5 rounded-full mx-auto mt-3 mb-1 ${
              isDark ? 'bg-slate-700' : 'bg-slate-300'
            }`} />

            {/* Header */}
            <div className={`flex justify-between items-center px-4 py-2.5 border-b ${
              isDark ? 'border-slate-800' : 'border-slate-100'
            }`}>
              <h3 className={`font-black text-base flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                <Users className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-game-blue'}`} />
                <span>Squads & Auction Activity</span>
              </h3>
              <button 
                onClick={onClose}
                className={`p-1.5 rounded-full transition-colors ${
                  isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className={`flex p-1.5 gap-1 mx-4 my-2 rounded-xl text-xs font-bold border ${
              isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                onClick={() => setActiveTab('P1')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  activeTab === 'P1'
                    ? isDark ? 'bg-amber-400 text-slate-950 font-black shadow-sm' : 'bg-white text-game-blue font-black shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {player1.name} ({player1.squad.length}/{maxSquad})
              </button>
              <button
                onClick={() => setActiveTab('P2')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  activeTab === 'P2'
                    ? isDark ? 'bg-amber-400 text-slate-950 font-black shadow-sm' : 'bg-white text-game-blue font-black shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {player2.name} ({player2.squad.length}/{maxSquad})
              </button>
              <button
                onClick={() => setActiveTab('HISTORY')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  activeTab === 'HISTORY'
                    ? isDark ? 'bg-amber-400 text-slate-950 font-black shadow-sm' : 'bg-white text-game-blue font-black shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Activity ({draftHistory.length})
              </button>
            </div>

            {/* Body */}
            <div className="p-4 overflow-y-auto">
              {activeTab === 'P1' && renderSquadList(player1, myPlayerNum === 1)}
              {activeTab === 'P2' && renderSquadList(player2, myPlayerNum === 2)}
              {activeTab === 'HISTORY' && (
                <div className="space-y-2">
                  {draftHistory.length === 0 ? (
                    <div className={`text-center py-8 text-xs font-bold ${
                      isDark ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                      No players drafted yet
                    </div>
                  ) : (
                    [...draftHistory].reverse().map((item, idx) => (
                      <div 
                        key={idx} 
                        className={`flex justify-between items-center p-2.5 rounded-xl border text-xs ${
                          isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {item.playerName}
                          </span>
                          <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>→</span>
                          <span className={`font-bold ${isDark ? 'text-amber-400' : 'text-game-blue'}`}>
                            {item.draftedBy}
                          </span>
                        </div>
                        <span className={`font-black px-2 py-0.5 rounded border ${
                          isDark 
                            ? 'text-emerald-400 bg-emerald-500/15 border-emerald-400/30' 
                            : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                        }`}>
                          ₹{item.amount}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
