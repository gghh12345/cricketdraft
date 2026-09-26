import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PlayerColumn({ 
  player, 
  playerNum, 
  isActive, 
  engine 
}) {
  const { 
    settings, 
    currentPlayer, 
    auctionState,
    draftPlayer,
    placeBid,
    passAuction
  } = engine;

  const maxSquad = settings.squadSize;
  const isFull = player.squad.length >= maxSquad;
  const isAuction = settings.gameMode === 'AUCTION';
  const isMe = playerNum === engine.myPlayerNum;
  const isMyTurn = isAuction && auctionState.currentTurn === playerNum && isMe;
  const isTheirTurn = isAuction && auctionState.currentTurn === playerNum && !isMe;
  
  const minBid = currentPlayer ? (auctionState.biddingActive ? auctionState.currentBid + 1 : 0) : 0;
  
  const [customBid, setCustomBid] = useState('');

  useEffect(() => {
    if (currentPlayer) {
      setCustomBid(minBid);
    }
  }, [currentPlayer, minBid]);

  const handleDraft = () => {
    if (isFull || player.budget < currentPlayer.price) return;
    draftPlayer(playerNum, currentPlayer.price);
  };

  const handleBidSubmit = () => {
    const amount = Number(customBid);
    if (amount >= minBid && amount <= player.budget) {
      placeBid(playerNum, amount);
    }
  };

  const handlePass = () => {
    if (isAuction) {
      passAuction(playerNum);
    } else {
      engine.passPlayer();
    }
  };

  return (
    <div className={`flex flex-col bg-white p-4 rounded-3xl shadow-sm border-2 ${isMyTurn ? 'border-game-blue bg-blue-50/20' : 'border-gray-100'} transition-all`}>
      <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
        <h3 className="font-bold text-xl text-gray-800">{player.name}</h3>
        <div className="text-right">
          <div className="text-xs text-gray-500 font-bold uppercase tracking-wide">Budget</div>
          <div className={`font-black text-2xl ${player.budget < minBid ? 'text-game-red' : 'text-game-green'}`}>
            ₹{player.budget}
          </div>
        </div>
      </div>

      {currentPlayer && (
        <div className="mb-6">
          {isAuction ? (
            auctionState.highestBidder === playerNum ? (
              <div className="w-full py-4 px-4 rounded-xl font-bold text-lg text-black bg-game-gold text-center cursor-default shadow-sm border border-yellow-500">
                LEADING BID (₹{auctionState.currentBid})
              </div>
            ) : isMyTurn ? (
              <div className="space-y-3">
                {isFull ? (
                  <div className="w-full py-3 px-4 rounded-xl font-bold text-lg text-white bg-gray-400 text-center cursor-not-allowed shadow-sm">
                    SQUAD FULL
                  </div>
                ) : player.budget < minBid ? (
                  <div className="w-full py-3 px-4 rounded-xl font-bold text-lg text-white bg-game-red opacity-80 text-center cursor-not-allowed shadow-sm">
                    NOT ENOUGH BUDGET
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <div className="relative w-1/2">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center font-bold text-gray-500">₹</span>
                      <input
                        type="number"
                        min={minBid}
                        max={player.budget}
                        value={customBid}
                        onChange={(e) => setCustomBid(e.target.value)}
                        className="w-full pl-7 pr-2 py-3 border-2 border-game-blue rounded-xl text-lg font-black focus:outline-none focus:ring-2 focus:ring-game-blue bg-white"
                      />
                    </div>
                    <button
                      onClick={handleBidSubmit}
                      disabled={Number(customBid) > player.budget || Number(customBid) < minBid}
                      className="w-1/2 py-3 px-2 rounded-xl font-bold text-lg text-white bg-game-blue hover:bg-blue-800 shadow-sm transition-transform active:scale-95 disabled:opacity-50 disabled:bg-gray-400"
                    >
                      BID
                    </button>
                  </div>
                )}
                
                <button
                  onClick={handlePass}
                  className="w-full py-2 px-4 rounded-xl font-bold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  {auctionState.biddingActive ? 'PASS (Let opponent win)' : 'PASS PLAYER'}
                </button>
              </div>
            ) : isTheirTurn ? (
              <div className="w-full py-4 px-4 rounded-xl font-bold text-lg text-gray-500 bg-gray-100 text-center cursor-default border-2 border-dashed border-gray-300">
                THEY ARE BIDDING...
              </div>
            ) : isMe ? (
              <div className="w-full py-4 px-4 rounded-xl font-bold text-lg text-gray-500 bg-gray-100 text-center cursor-default border-2 border-dashed border-gray-300">
                WAITING FOR OPPONENT...
              </div>
            ) : null
          ) : (
            <div className="space-y-3">
              {isMe && auctionState.currentTurn === playerNum ? (
                <>
                  {isFull ? (
                    <div className="w-full py-4 px-4 rounded-xl font-bold text-lg text-white bg-gray-400 text-center cursor-not-allowed shadow-sm">
                      SQUAD FULL
                    </div>
                  ) : player.budget < currentPlayer.price ? (
                    <div className="w-full py-4 px-4 rounded-xl font-bold text-lg text-white bg-game-red opacity-80 text-center cursor-not-allowed shadow-sm">
                      NOT ENOUGH BUDGET
                    </div>
                  ) : (
                    <button
                      onClick={handleDraft}
                      className="w-full py-4 px-4 rounded-xl font-bold text-lg text-white shadow-sm transition-transform active:scale-95 bg-game-blue hover:bg-blue-800"
                    >
                      DRAFT PLAYER
                    </button>
                  )}
                  <button
                    onClick={handlePass}
                    className="w-full py-2 px-4 rounded-xl font-bold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    PASS
                  </button>
                </>
              ) : auctionState.currentTurn === playerNum ? (
                <div className="w-full py-4 px-4 rounded-xl font-bold text-lg text-gray-500 bg-gray-100 text-center cursor-default border-2 border-dashed border-gray-300">
                  THEY ARE THINKING...
                </div>
              ) : isMe ? (
                <div className="w-full py-4 px-4 rounded-xl font-bold text-lg text-gray-500 bg-gray-100 text-center cursor-default border-2 border-dashed border-gray-300">
                  WAITING FOR OPPONENT...
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}

      <div className="flex-1">
        <div className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-2 flex justify-between">
          <span>Squad</span>
          <span>{player.squad.length} / {maxSquad}</span>
        </div>
        <ul className="space-y-2">
          <AnimatePresence>
            {Array.from({ length: maxSquad }).map((_, i) => {
              const member = player.squad[i];
              return (
                <motion.li 
                  key={member ? member.id : `empty-${i}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className={`flex justify-between items-center p-3 rounded-lg ${member ? 'bg-gray-50 border border-gray-100 shadow-sm' : 'bg-gray-50 border border-dashed border-gray-200'}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400 font-bold text-sm w-4">{i + 1}.</span>
                    {member ? (
                      <span className="font-semibold text-gray-800">{member.name}</span>
                    ) : (
                      <span className="text-gray-400 italic text-sm">Empty Slot</span>
                    )}
                  </div>
                  {member && (
                    <span className="text-xs font-bold text-game-green bg-green-50 px-2 py-1 rounded">₹{member.price}</span>
                  )}
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}
