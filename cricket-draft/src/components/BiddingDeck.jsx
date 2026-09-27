import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Minus, Plus, Crown, Clock, XCircle, Zap, ShieldAlert } from 'lucide-react';
import { sfx } from '../game/soundEffects';

export default function BiddingDeck({ engine, isDark = true }) {
  const { 
    settings, 
    currentPlayer, 
    auctionState, 
    player1, 
    player2, 
    myPlayerNum = 1,
    placeBid, 
    passAuction, 
    draftPlayer, 
    passPlayer 
  } = engine;

  const isAuction = settings.gameMode === 'AUCTION';
  const myPlayer = myPlayerNum === 1 ? player1 : player2;
  const opponent = myPlayerNum === 1 ? player2 : player1;
  const opponentNum = myPlayerNum === 1 ? 2 : 1;
  const maxSquad = settings.squadSize;

  const isMyTurn = auctionState.currentTurn === myPlayerNum;
  const isOpponentTurn = auctionState.currentTurn === opponentNum;
  const isLeading = isAuction && auctionState.highestBidder === myPlayerNum;
  const isSquadFull = myPlayer.squad.length >= maxSquad;

  const minBid = currentPlayer ? (auctionState.biddingActive ? auctionState.currentBid + 1 : 0) : 0;
  const canAfford = myPlayer.budget >= minBid;

  const [customBid, setCustomBid] = useState(minBid);

  const bidPercentage = myPlayer.budget > 0 ? (Number(customBid) / myPlayer.budget) * 100 : 0;
  const isAllIn = Number(customBid) >= myPlayer.budget && myPlayer.budget > 0;
  const isHighStakes = bidPercentage >= 60 && !isAllIn;

  useEffect(() => {
    if (currentPlayer) {
      setCustomBid(minBid);
    }
  }, [currentPlayer?.id, auctionState.biddingActive, auctionState.currentBid, minBid]);

  const handleBidSubmit = () => {
    const amount = Number(customBid);
    if (amount >= minBid && amount <= myPlayer.budget) {
      sfx.playBid();
      placeBid(myPlayerNum, amount);
    }
  };

  const handlePass = () => {
    sfx.playPass();
    if (isAuction) {
      passAuction(myPlayerNum);
    } else {
      passPlayer();
    }
  };

  const handleQuickDraft = () => {
    if (isSquadFull || myPlayer.budget < (currentPlayer?.price || 0)) return;
    sfx.playBid();
    draftPlayer(myPlayerNum, (currentPlayer?.price || 0));
  };

  const addBidIncrement = (increment) => {
    setCustomBid(prev => {
      const current = Number(prev) || minBid;
      const next = current + increment;
      return next <= myPlayer.budget ? next : myPlayer.budget;
    });
  };

  const setMaxBid = () => {
    setCustomBid(myPlayer.budget);
  };

  const adjustBid = (delta) => {
    setCustomBid(prev => {
      const current = Number(prev) || minBid;
      const next = current + delta;
      if (next < minBid) return minBid;
      if (next > myPlayer.budget) return myPlayer.budget;
      return next;
    });
  };

  if (!currentPlayer) return null;

  return (
    <div className="w-full bg-[#121620]/95 backdrop-blur-xl rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.7)] border border-white/10 p-3 sm:p-3.5 transition-colors">
      {/* AUCTION MODE */}
      {isAuction ? (
        <div>
          {isLeading ? (
            /* ================= LEADING BIDDER STATE ================= */
            <div className="py-3 px-4 rounded-xl bg-gradient-to-r from-[#CCFF00] via-[#b8e600] to-[#CCFF00] text-[#0B0E14] text-center shadow-[0_0_25px_rgba(204,255,0,0.3)] animate-pulse">
              <div className="flex items-center justify-center gap-1.5 font-bebas text-lg sm:text-xl tracking-wider">
                <Crown className="w-5 h-5 fill-[#0B0E14]" />
                <span>YOU HOLD HIGHEST BID: ₹{auctionState.currentBid} CR</span>
              </div>
              <p className="text-[11px] font-bold text-[#0B0E14]/80 mt-0.5">
                Waiting for {opponent.name} to counter-bid or fold...
              </p>
            </div>
          ) : isMyTurn ? (
            /* ================= MY TURN TO BID ================= */
            <div className="space-y-2.5">
              {isSquadFull ? (
                <div className="w-full py-3 rounded-xl font-bebas text-lg tracking-wider text-center bg-[#0B0E14] border border-white/10 text-gray-400">
                  SQUAD FULL ({maxSquad}/{maxSquad} PICKS REACHED)
                </div>
              ) : !canAfford ? (
                <div className="space-y-2">
                  <div className="w-full py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm text-center bg-[#FF2A42]/15 border border-[#FF2A42]/40 text-[#FF2A42]">
                    Purse Insufficient (Need ₹{minBid} Cr, Have ₹{myPlayer.budget} Cr)
                  </div>
                  <button
                    onClick={handlePass}
                    className="w-full py-3 rounded-xl font-bebas text-base tracking-wider bg-[#161B26] hover:bg-[#1E2533] text-white border border-white/10 transition-transform active:scale-98 cursor-pointer"
                  >
                    FOLD PLAYER
                  </button>
                </div>
              ) : (
                <>
                  {/* Sweat Meter: High Stakes & All-In Alert */}
                  {isAllIn ? (
                    <div className="py-1.5 px-3 rounded-xl bg-[#FF2A42] text-white text-[11px] font-black text-center flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(255,42,66,0.4)] animate-pulse">
                      <Zap className="w-4 h-4 fill-white text-white" />
                      <span>🔥 ALL-IN PURSE RISK (₹{customBid} CR)! WIN OR BUST!</span>
                    </div>
                  ) : isHighStakes ? (
                    <div className="py-1 px-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[11px] font-black text-center flex items-center justify-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>⚠️ HIGH STAKES: {Math.round(bidPercentage)}% OF YOUR PURSE!</span>
                    </div>
                  ) : null}

                  {/* Betting Increment Chips */}
                  <div className="grid grid-cols-4 gap-1.5">
                    <button
                      type="button"
                      onClick={() => addBidIncrement(1)}
                      className="py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 bg-[#0B0E14] hover:bg-[#182030] text-[#CCFF00] border border-white/10 hover:border-[#CCFF00]/40 cursor-pointer"
                    >
                      +₹1 Cr
                    </button>
                    <button
                      type="button"
                      onClick={() => addBidIncrement(2)}
                      className="py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 bg-[#0B0E14] hover:bg-[#182030] text-[#CCFF00] border border-white/10 hover:border-[#CCFF00]/40 cursor-pointer"
                    >
                      +₹2 Cr
                    </button>
                    <button
                      type="button"
                      onClick={() => addBidIncrement(5)}
                      className="py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 bg-[#0B0E14] hover:bg-[#182030] text-[#CCFF00] border border-white/10 hover:border-[#CCFF00]/40 cursor-pointer"
                    >
                      +₹5 Cr
                    </button>
                    <button
                      type="button"
                      onClick={setMaxBid}
                      className="py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 bg-gradient-to-r from-red-600/20 to-amber-500/20 hover:from-red-600/30 hover:to-amber-500/30 text-amber-300 border border-amber-500/40 cursor-pointer"
                    >
                      💥 ALL-IN
                    </button>
                  </div>

                  {/* Numeric Stepper + Place Bid Action */}
                  <div className="flex items-center gap-2">
                    {/* Stepper with Large Digital Display */}
                    <div className="flex items-center border border-white/15 focus-within:border-[#CCFF00] rounded-xl overflow-hidden bg-[#0B0E14] flex-1">
                      <button
                        type="button"
                        onClick={() => adjustBid(-1)}
                        disabled={Number(customBid) <= minBid}
                        className="px-3 py-3 transition-colors disabled:opacity-30 bg-[#161B26] text-white hover:bg-[#1E2533] cursor-pointer"
                      >
                        <Minus className="w-4 h-4 stroke-[3]" />
                      </button>
                      
                      <div className="flex-1 flex items-center justify-center font-bebas text-2xl text-white">
                        <span className="text-[#CCFF00] mr-1 text-xl">₹</span>
                        <input
                          type="number"
                          min={minBid}
                          max={myPlayer.budget}
                          value={customBid}
                          onChange={(e) => setCustomBid(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleBidSubmit();
                            }
                          }}
                          className="w-14 text-center font-bebas text-2xl text-white bg-transparent outline-none tracking-wider"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => adjustBid(1)}
                        disabled={Number(customBid) >= myPlayer.budget}
                        className="px-3 py-3 transition-colors disabled:opacity-30 bg-[#161B26] text-white hover:bg-[#1E2533] cursor-pointer"
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                      </button>
                    </div>

                    {/* Submit Bid Action Button */}
                    <button
                      onClick={handleBidSubmit}
                      disabled={Number(customBid) > myPlayer.budget || Number(customBid) < minBid}
                      className={`flex-[1.4] py-3.5 px-3 rounded-xl font-bebas text-xl tracking-wider text-[#0B0E14] transition-all active:scale-95 disabled:opacity-40 disabled:bg-gray-700 disabled:text-gray-400 flex items-center justify-center gap-1.5 cursor-pointer ${
                        isAllIn
                          ? 'bg-gradient-to-r from-[#FF2A42] via-amber-500 to-[#CCFF00] text-white shadow-[0_0_30px_rgba(255,42,66,0.5)] ring-2 ring-[#FF2A42] animate-pulse'
                          : 'bg-[#CCFF00] hover:bg-[#b8e600] shadow-[0_0_25px_rgba(204,255,0,0.35)]'
                      }`}
                    >
                      {!auctionState.biddingActive && Number(customBid) === 0 ? (
                        <span>⚡ OPEN BID ₹0</span>
                      ) : isAllIn ? (
                        <>
                          <Zap className="w-5 h-5 fill-white text-white" />
                          <span>ALL-IN ₹{customBid} CR</span>
                        </>
                      ) : (
                        <>
                          <ArrowUp className="w-5 h-5 stroke-[3]" />
                          <span>PLACE BID ₹{customBid} CR</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Fold Button */}
                  <button
                    onClick={handlePass}
                    className="w-full py-2 px-3 rounded-xl font-bold text-xs text-gray-400 hover:text-white bg-[#0B0E14] hover:bg-[#161B26] border border-white/5 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5 text-[#FF2A42]" />
                    <span>
                      {auctionState.biddingActive 
                        ? 'FOLD (Let opponent win this player)' 
                        : 'PASS (Skip player)'}
                    </span>
                  </button>
                </>
              )}
            </div>
          ) : (
            /* ================= OPPONENT TURN ================= */
            <div className="py-4 px-4 rounded-xl bg-[#0B0E14]/80 border border-white/10 text-center">
              <div className="flex items-center justify-center gap-2 font-bebas text-base sm:text-lg tracking-wider text-[#CCFF00]">
                <Clock className="w-4 h-4 animate-spin text-[#CCFF00]" />
                <span>{opponent.name.toUpperCase()} IS ON THE CLOCK...</span>
              </div>
              <p className="text-[11px] mt-1 font-medium text-gray-400">
                Opponent is reviewing their purse & odds
              </p>
            </div>
          )}
        </div>
      ) : (
        /* FAST DRAFT MODE */
        <div>
          {isMyTurn ? (
            <div className="space-y-2">
              <button
                onClick={handleQuickDraft}
                disabled={isSquadFull || myPlayer.budget < (currentPlayer?.price || 0)}
                className="w-full py-3.5 rounded-xl font-bebas text-xl tracking-wider text-[#0B0E14] bg-[#CCFF00] hover:bg-[#b8e600] shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-transform active:scale-95 disabled:bg-gray-700 disabled:text-gray-400 cursor-pointer"
              >
                DRAFT PLAYER (₹{currentPlayer.price || 0} CR)
              </button>
              <button
                onClick={handlePass}
                className="w-full py-2 rounded-xl font-bold text-xs text-gray-400 hover:text-white bg-[#0B0E14] border border-white/10 transition-colors cursor-pointer"
              >
                PASS PICK
              </button>
            </div>
          ) : (
            <div className="py-3.5 text-center text-xs font-bold rounded-xl bg-[#0B0E14]/80 border border-white/10 text-gray-400">
              Waiting for {opponent.name} to pick...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
