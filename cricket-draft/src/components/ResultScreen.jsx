import React, { useState } from 'react';
import { Trophy, RefreshCw, Share2 } from 'lucide-react';

export default function ResultScreen({ engine }) {
  const { player1, player2, restartGame } = engine;
  const [copied, setCopied] = useState(false);

  const getPlayerScore = (p) => p.squad.reduce((sum, member) => sum + member.price, 0);
  
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
      summary += `${i + 1}. ${p.name} (₹${p.price})\n`;
    });
    
    summary += `\n${player2.name} (Budget left: ₹${player2.budget})\n`;
    player2.squad.forEach((p, i) => {
      summary += `${i + 1}. ${p.name} (₹${p.price})\n`;
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

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center max-w-4xl mx-auto animate-pop-in">
      <div className="text-center mb-8">
        <div className="inline-flex justify-center items-center bg-game-gold text-white p-4 rounded-full mb-4 shadow-lg animate-celebrate">
          <Trophy className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">
          {winner ? `${winner.name} WINS!` : 'IT\'S A TIE!'}
        </h1>
        {winner ? (
          <div className="mt-4 bg-yellow-50 border-2 border-yellow-400 p-4 rounded-2xl inline-block">
            <p className="text-xl font-bold text-yellow-800">
              Prize Won: <span className="text-game-green text-2xl">₹{loser.budget}</span>
            </p>
            <p className="text-sm text-yellow-600 font-medium">Claimed from {loser.name}'s remaining budget</p>
          </div>
        ) : (
          <p className="text-gray-500 mt-2 font-medium text-lg">A truly equal match!</p>
        )}
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
                  <span className="text-sm font-bold text-gray-500">₹{member.price}</span>
                </div>
              ))}
            </div>
            </div>
          );
        })}
      </div>

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
