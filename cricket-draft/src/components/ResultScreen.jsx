import React, { useState, useEffect } from 'react';
import { Trophy, RefreshCw, Share2 } from 'lucide-react';
import { sfx } from '../game/soundEffects';

export default function ResultScreen({ engine }) {
  const { player1, player2, restartGame } = engine;
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    sfx.playVictory();
  }, []);

  const getPlayerScore = (p) => p.squad.reduce((sum, member) => sum + (member.purchasePrice ?? member.price), 0);
  
  const score1 = getPlayerScore(player1);
  const score2 = getPlayerScore(player2);

  let winner = null;
  let loser = null;

  if (score1 > score2) {
    winner = player1;
    loser = player2;
  } else if (score2 > score1) {
    winner = player2;
    loser = player1;
  } else {
    // Tie breaker on budget
    if (player1.budget > player2.budget) {
      winner = player1;
      loser = player2;
    } else if (player2.budget > player1.budget) {
      winner = player2;
      loser = player1;
    }
  }

  const generateSummary = () => {
    let summary = `🏏 Cricket Draft Results 🏏\n\n`;
    
    summary += `${player1.name} (Budget left: ₹${player1.budget})\n`;
    player1.squad.forEach((p, i) => {
      summary += `${i + 1}. ${p.name} (₹${p.purchasePrice ?? p.price})\n`;
    });
    
    summary += `\n${player2.name} (Budget left: ₹${player2.budget})\n`;
    player2.squad.forEach((p, i) => {
      summary += `${i + 1}. ${p.name} (₹${p.purchasePrice ?? p.price})\n`;
    });
    
    return summary;
  };

  const handleShare = () => {
    const text = generateSummary();
    if (navigator.share) {
      navigator.share({
        title: 'Cricket Draft Result',
        text: text
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const [simulating, setSimulating] = useState(false);
  const [matchResult, setMatchResult] = useState(null);

  const calculateSynergy = (squad) => {
    let batters = 0, bowlers = 0, allrounders = 0, wks = 0;
    squad.forEach(p => {
      if (p.role.includes('Batter')) batters++;
      if (p.role.includes('Bowler')) bowlers++;
      if (p.role.includes('All Rounder')) allrounders++;
      if (p.role.includes('Wicket Keeper')) wks++;
    });
    // Balanced team bonus
    if (batters >= 1 && bowlers >= 1 && allrounders >= 1 && wks >= 1) return 15;
    return 0;
  };

  const simulateMatch = () => {
    setSimulating(true);
    setTimeout(() => {
      const p1Base = player1.squad.reduce((sum, p) => sum + ((p.purchasePrice ?? p.price) * 10), 0);
      const p2Base = player2.squad.reduce((sum, p) => sum + ((p.purchasePrice ?? p.price) * 10), 0);
      
      const p1Synergy = calculateSynergy(player1.squad);
      const p2Synergy = calculateSynergy(player2.squad);

      const p1Power = p1Base + p1Synergy;
      const p2Power = p2Base + p2Synergy;
      
      const p1Runs = Math.floor(p1Power * 1.5) + Math.floor(Math.random() * 30);
      const p1Wickets = Math.floor(Math.random() * 8) + 2;
      
      const p2Runs = Math.floor(p2Power * 1.5) + Math.floor(Math.random() * 30);
      const p2Wickets = Math.floor(Math.random() * 8) + 2;

      setMatchResult({
        p1: { runs: p1Runs, wickets: p1Wickets, synergy: p1Synergy, rating: p1Power },
        p2: { runs: p2Runs, wickets: p2Wickets, synergy: p2Synergy, rating: p2Power },
        winner: p1Runs > p2Runs ? player1.name : (p2Runs > p1Runs ? player2.name : 'Tie')
      });
      setSimulating(false);
      sfx.playVictory();
    }, 2500);
  };

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center max-w-4xl mx-auto animate-pop-in">
      
      {!matchResult && !simulating && (
        <>
          <div className="text-center mb-8">
            <div className="inline-flex justify-center items-center bg-game-gold text-white p-4 rounded-full mb-4 shadow-lg animate-celebrate">
              <Trophy className="w-12 h-12" />
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">
              {winner ? `${winner.name} DRAFTED BEST!` : 'IT\'S A TIE!'}
            </h1>
            <button 
              onClick={simulateMatch}
              className="mt-6 py-3 px-8 bg-purple-600 hover:bg-purple-700 text-white font-black text-xl rounded-full shadow-lg transition-transform active:scale-95 animate-pulse"
            >
              🚀 SIMULATE T20 MATCH 🚀
            </button>
          </div>

          <div className="w-full flex flex-col md:flex-row gap-6 mb-10">
            {[player1, player2].map((p, idx) => {
              const score = getPlayerScore(p);
              const isWinner = winner === p;
              return (
                <div key={idx} className={`flex-1 bg-white rounded-3xl shadow-lg p-6 border-t-4 ${isWinner ? 'border-game-gold' : 'border-gray-200'}`}>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{p.name}</h2>
                      <div className="text-sm font-bold text-gray-500 mt-1">SQUAD RATING: <span className="text-game-blue">{score}</span></div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500 font-bold uppercase block">Budget Left</span>
                      <span className="text-xl font-black text-game-green">₹{p.budget}</span>
                    </div>
                  </div>
                
                <div className="space-y-3">
                  {p.squad.map((member, i) => (
                    <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-400 font-bold w-4">{i + 1}.</span>
                        <span className="font-semibold text-gray-800">{member.name}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-500">₹{member.purchasePrice ?? member.price}</span>
                    </div>
                  ))}
                </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {simulating && (
        <div className="text-center py-20">
          <div className="text-6xl mb-6 animate-spin">🏏</div>
          <h2 className="text-3xl font-black text-gray-800">Simulating Match...</h2>
          <p className="text-gray-500 mt-2">Crunching player stats and playing 20 overs...</p>
        </div>
      )}

      {matchResult && !simulating && (
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden mb-10">
          <div className="bg-gray-900 p-6 text-center">
            <h2 className="text-game-gold font-black text-2xl tracking-widest uppercase">Match Result</h2>
            <p className="text-white mt-2 text-xl">{matchResult.winner === 'Tie' ? 'MATCH TIED' : `${matchResult.winner} WON THE MATCH!`}</p>
          </div>
          
          <div className="p-8 space-y-8">
            {/* Player 1 Stats */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-2xl font-bold text-gray-800">{player1.name}</span>
                <span className="text-4xl font-black text-game-blue">{matchResult.p1.runs}/{matchResult.p1.wickets}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-4 mb-1">
                <div className="bg-game-blue h-4 rounded-full transition-all duration-1000" style={{ width: `${Math.min((matchResult.p1.rating / 500) * 100, 100)}%` }}></div>
              </div>
              <div className="flex justify-between text-xs font-bold text-gray-500 uppercase">
                <span>Team Rating: {matchResult.p1.rating}</span>
                {matchResult.p1.synergy > 0 && <span className="text-game-green">+ Synergy Bonus!</span>}
              </div>
            </div>

            <div className="flex justify-center">
              <span className="text-gray-300 font-black italic text-xl px-4 py-1 bg-gray-50 rounded-full">VS</span>
            </div>
            
            {/* Player 2 Stats */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-2xl font-bold text-gray-800">{player2.name}</span>
                <span className="text-4xl font-black text-game-blue">{matchResult.p2.runs}/{matchResult.p2.wickets}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-4 mb-1">
                <div className="bg-game-blue h-4 rounded-full transition-all duration-1000" style={{ width: `${Math.min((matchResult.p2.rating / 500) * 100, 100)}%` }}></div>
              </div>
              <div className="flex justify-between text-xs font-bold text-gray-500 uppercase">
                <span>Team Rating: {matchResult.p2.rating}</span>
                {matchResult.p2.synergy > 0 && <span className="text-game-green">+ Synergy Bonus!</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button
          onClick={restartGame}
          className="flex-1 flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-game-blue hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-game-blue transition-transform active:scale-95"
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          PLAY AGAIN
        </button>
        
        <button
          onClick={handleShare}
          className="flex-1 flex justify-center items-center py-4 px-4 border border-gray-200 rounded-xl shadow-sm text-lg font-bold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-transform active:scale-95"
        >
          <Share2 className="mr-2 h-5 w-5" />
          {copied ? 'COPIED!' : 'SHARE RESULT'}
        </button>
      </div>
    </div>
  );
}
