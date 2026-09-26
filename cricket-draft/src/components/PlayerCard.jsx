import React from 'react';

export default function PlayerCard({ player }) {
  if (!player) return null;

  return (
    <div className="relative w-64 mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-game-blue transform transition-all animate-pop-in">

      <div className="h-48 bg-gray-100 flex justify-center items-end relative overflow-hidden">
        {/* Placeholder styling since images might not be transparent cutouts */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-300 to-transparent opacity-50"></div>
        <img 
          src={player.image} 
          alt={player.name}
          className="h-full object-cover w-full z-0"
          onError={(e) => {
            e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'; // fallback
          }}
        />
      </div>
      <div className="p-4 text-center bg-white z-10 relative border-t border-gray-100 flex flex-col items-center">
        <h2 className="text-xl font-bold text-gray-900 leading-tight">{player.name}</h2>
        <div className="flex items-center justify-center space-x-2 mt-1 mb-3">
          <span className="text-sm text-gray-500 font-medium uppercase tracking-wider">{player.role}</span>
          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-bold">{player.country}</span>
        </div>
        <div className="bg-slate-800 text-white font-extrabold px-3 py-1 rounded-full shadow-sm flex items-baseline space-x-1.5">
          <span className="text-[10px] text-slate-300 uppercase tracking-widest font-bold">ICC Rank</span>
          <span className="text-sm text-game-gold">#{player.iccRanking || player.id}</span>
        </div>
      </div>
    </div>
  );
}
