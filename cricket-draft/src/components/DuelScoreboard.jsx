import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield } from 'lucide-react';

export default function DuelScoreboard({ engine, isDark = true }) {
  const { player1, player2, settings, auctionState, myPlayerNum } = engine;
  const maxSquad = settings.squadSize;
  const currentTurn = auctionState.currentTurn;

  // Render squad slot indicator blocks
  const renderSlots = (squad, align = 'left') => {
    return (
      <div className={`flex items-center gap-1 ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
        {Array.from({ length: maxSquad }).map((_, i) => {
          const filled = i < squad.length;
          return (
            <span
              key={i}
              className={`h-2 rounded-xs transition-all duration-300 ${
                maxSquad <= 5 ? 'w-3.5' : maxSquad <= 7 ? 'w-2.5' : 'w-1.5'
              } ${
                filled
                  ? 'bg-[#CCFF00] shadow-[0_0_8px_rgba(204,255,0,0.6)]'
                  : 'bg-[#1E2533] border border-white/5'
              }`}
              title={filled ? squad[i]?.name : `Open Slot ${i + 1}`}
            />
          );
        })}
      </div>
    );
  };

  const isP1Turn = currentTurn === 1;
  const isP2Turn = currentTurn === 2;

  return (
    <div className="w-full bg-[#121620]/95 backdrop-blur-xl rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] border border-white/10 p-2 sm:p-2.5 transition-all">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-1.5 sm:gap-2">
        {/* ================= P1 CARD (LEFT FIGHTER) ================= */}
        <div 
          className={`flex flex-col p-2 sm:p-2.5 rounded-xl transition-all relative overflow-hidden ${
            isP1Turn 
              ? 'bg-[#182030] border-2 border-[#CCFF00] shadow-[0_0_20px_rgba(204,255,0,0.2)] ring-1 ring-[#CCFF00]/40 scale-[1.01]' 
              : 'bg-[#0B0E14]/80 border border-white/5 opacity-80'
          }`}
        >
          {/* Active fighter top bar */}
          {isP1Turn && (
            <div className="absolute top-0 inset-x-0 h-0.5 bg-[#CCFF00] shadow-[0_0_10px_#CCFF00]" />
          )}

          <div className="flex items-center gap-1 mb-1">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black ${
              isP1Turn ? 'bg-[#CCFF00] text-[#0B0E14]' : 'bg-[#1E2533] text-gray-400'
            }`}>
              1
            </div>
            <span className="text-xs sm:text-sm font-black truncate max-w-[85px] sm:max-w-[125px] text-white">
              {player1.name}
            </span>
            {myPlayerNum === 1 && (
              <span className="text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase bg-[#CCFF00]/20 text-[#CCFF00] border border-[#CCFF00]/40">
                You
              </span>
            )}
          </div>

          <div className="flex items-baseline justify-between mt-0.5">
            <span className="text-[9px] font-black uppercase tracking-wider text-gray-400">
              Purse
            </span>
            <span className="text-base sm:text-lg font-bebas tracking-wide text-[#CCFF00]">
              ₹{player1.budget} <span className="text-[10px] font-sans font-bold text-gray-400">CR</span>
            </span>
          </div>

          <div className="mt-1.5 flex items-center justify-between">
            {renderSlots(player1.squad, 'left')}
            <span className="text-[9px] font-black text-gray-400 ml-1">
              {player1.squad.length}/{maxSquad}
            </span>
          </div>
        </div>

        {/* ================= VS CENTER OCTAGON BADGE ================= */}
        <div className="flex flex-col items-center justify-center px-0.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-[#0B0E14] text-[#CCFF00] font-bebas text-sm flex items-center justify-center shadow-lg border border-white/15">
              VS
            </div>
            {/* Animated Turn Ping */}
            <motion.div
              animate={{
                x: isP1Turn ? -10 : isP2Turn ? 10 : 0,
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none"
            >
              <Zap className="w-3.5 h-3.5 text-[#CCFF00] fill-[#CCFF00] drop-shadow-[0_0_8px_#CCFF00]" />
            </motion.div>
          </div>
          <span className="text-[8px] font-black mt-2 tracking-widest uppercase text-gray-400">
            {isP1Turn ? 'P1 TURN' : 'P2 TURN'}
          </span>
        </div>

        {/* ================= P2 CARD (RIGHT FIGHTER) ================= */}
        <div 
          className={`flex flex-col p-2 sm:p-2.5 rounded-xl transition-all relative overflow-hidden ${
            isP2Turn 
              ? 'bg-[#182030] border-2 border-[#CCFF00] shadow-[0_0_20px_rgba(204,255,0,0.2)] ring-1 ring-[#CCFF00]/40 scale-[1.01]' 
              : 'bg-[#0B0E14]/80 border border-white/5 opacity-80'
          }`}
        >
          {/* Active fighter top bar */}
          {isP2Turn && (
            <div className="absolute top-0 inset-x-0 h-0.5 bg-[#CCFF00] shadow-[0_0_10px_#CCFF00]" />
          )}

          <div className="flex items-center justify-end gap-1 mb-1">
            {myPlayerNum === 2 && (
              <span className="text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase bg-[#CCFF00]/20 text-[#CCFF00] border border-[#CCFF00]/40">
                You
              </span>
            )}
            <span className="text-xs sm:text-sm font-black truncate max-w-[85px] sm:max-w-[125px] text-right text-white">
              {player2.name}
            </span>
            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black ${
              isP2Turn ? 'bg-[#CCFF00] text-[#0B0E14]' : 'bg-[#1E2533] text-gray-400'
            }`}>
              2
            </div>
          </div>

          <div className="flex items-baseline justify-between mt-0.5">
            <span className="text-base sm:text-lg font-bebas tracking-wide text-[#CCFF00]">
              ₹{player2.budget} <span className="text-[10px] font-sans font-bold text-gray-400">CR</span>
            </span>
            <span className="text-[9px] font-black uppercase tracking-wider text-gray-400">
              Purse
            </span>
          </div>

          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-[9px] font-black text-gray-400 mr-1">
              {player2.squad.length}/{maxSquad}
            </span>
            {renderSlots(player2.squad, 'right')}
          </div>
        </div>
      </div>
    </div>
  );
}
