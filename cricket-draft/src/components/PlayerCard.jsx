import React from 'react';
import { motion } from 'framer-motion';
import { Award, Sparkles, TrendingUp } from 'lucide-react';

export default function PlayerCard({ player }) {
  if (!player) return null;

  const getCountryBadge = (country = 'IND') => {
    const c = country.toUpperCase();
    const flags = {
      IND: '🇮🇳 IND',
      AUS: '🇦🇺 AUS',
      ENG: '🇬🇧 ENG',
      SA: '🇿🇦 SA',
      WI: '🌴 WI',
      PAK: '🇵🇰 PAK',
      AFG: '🇦🇫 AFG',
      NZ: '🇳🇿 NZ',
      SL: '🇱🇰 SL'
    };
    return flags[c] || c;
  };

  const getRoleStyle = (role = '') => {
    const r = role.toLowerCase();
    if (r.includes('batter') || r.includes('batsman')) {
      return { 
        icon: '🏏', 
        label: 'BATTER',
        bg: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
        stat1Label: 'SR',
        stat1Val: `${132 + (player.id % 24)}.4`,
        stat2Label: 'AVG',
        stat2Val: `${42 + (player.id % 14)}.8`,
        sparkPath: "M0,25 Q15,10 30,18 T60,8 T90,14 T120,4",
        form: "82*, 51, 117"
      };
    }
    if (r.includes('bowler')) {
      return { 
        icon: '🎳', 
        label: 'BOWLER',
        bg: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
        stat1Label: 'ECON',
        stat1Val: `${(6.2 + (player.id % 7) * 0.25).toFixed(1)}`,
        stat2Label: 'WKTS',
        stat2Val: `${95 + (player.id % 85)}`,
        sparkPath: "M0,15 Q15,22 30,8 T60,18 T90,6 T120,2",
        form: "3/18, 2/24, 4/31"
      };
    }
    if (r.includes('all rounder') || r.includes('all-rounder')) {
      return { 
        icon: '⚡', 
        label: 'ALL-ROUNDER',
        bg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
        stat1Label: 'SR',
        stat1Val: `${140 + (player.id % 18)}.0`,
        stat2Label: 'ECON',
        stat2Val: `${(7.0 + (player.id % 6) * 0.2).toFixed(1)}`,
        sparkPath: "M0,20 Q15,6 30,14 T60,5 T90,12 T120,3",
        form: "45* & 2w, 71, 3w"
      };
    }
    if (r.includes('keeper')) {
      return { 
        icon: '🧤', 
        label: 'WK-BATTER',
        bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
        stat1Label: 'SR',
        stat1Val: `${136 + (player.id % 20)}.2`,
        stat2Label: 'DISM',
        stat2Val: `${75 + (player.id % 45)}`,
        sparkPath: "M0,22 Q15,12 30,19 T60,7 T90,15 T120,5",
        form: "64*, 38, 52*"
      };
    }
    return { 
      icon: '🏏', 
      label: 'BATTER',
      bg: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
      stat1Label: 'SR',
      stat1Val: '130.0',
      stat2Label: 'AVG',
      stat2Val: '40.0',
      sparkPath: "M0,20 Q15,10 30,15 T60,8 T90,12 T120,4",
      form: "50, 42, 60"
    };
  };

  const roleStyle = getRoleStyle(player.role);
  const isSuperstar = [1, 2, 3, 32, 45, 48, 50].includes(player.id);
  const rankNum = player.iccRanking || (player.id <= 10 ? player.id : (player.id % 20) + 1);

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0, y: 15 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="relative w-full max-w-[270px] sm:max-w-[290px] mx-auto bg-[#121620] rounded-3xl overflow-hidden border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.8)]"
    >
      {/* Photo Area with UFC Atmosphere */}
      <div className="h-44 sm:h-52 bg-gradient-to-b from-[#182030] via-[#121620] to-[#0B0E14] flex justify-center items-end relative overflow-hidden">
        
        {/* Giant UFC Watermark Ranking Number in background */}
        <span className="absolute top-1 right-2 text-8xl font-bebas font-black text-white/[0.04] select-none pointer-events-none z-0">
          #{rankNum}
        </span>

        {/* Stadium Floodlight Cone */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#CCFF00]/12 via-transparent to-transparent pointer-events-none z-1" />

        {/* Player Portrait Image */}
        <img 
          src={player.image} 
          alt={player.name}
          className="h-full object-cover w-full z-1 object-top filter brightness-105 contrast-105"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.target.src = '/players/1.jpg';
          }}
        />

        {/* Dark bottom vignette & gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121620] via-[#121620]/30 to-transparent pointer-events-none z-2" />

        {/* Top Badges (Left: Role, Right: Country) */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1">
          <span className={`text-[10px] font-black backdrop-blur-md px-2.5 py-0.5 rounded-full border shadow-xs flex items-center gap-1 ${roleStyle.bg}`}>
            <span>{roleStyle.icon}</span>
            <span>{roleStyle.label}</span>
          </span>
          {isSuperstar && (
            <span className="text-[9px] font-black bg-[#CCFF00] text-[#0B0E14] px-1.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(204,255,0,0.4)] flex items-center gap-0.5 uppercase tracking-wider">
              <Sparkles className="w-2.5 h-2.5 fill-[#0B0E14]" />
              <span>SUPERSTAR</span>
            </span>
          )}
        </div>

        <div className="absolute top-2.5 right-2.5 z-10">
          <span className="text-[10px] font-black bg-[#0B0E14]/85 text-white backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10 shadow-xs">
            {getCountryBadge(player.country)}
          </span>
        </div>

        {/* Bottom Left: Rank Badge */}
        <div className="absolute bottom-2 left-2.5 z-10 flex items-center gap-1 bg-[#0B0E14]/90 backdrop-blur-md text-[#CCFF00] font-bebas text-xs px-2 py-0.5 rounded-lg border border-[#CCFF00]/30 shadow">
          <Award className="w-3 h-3 text-[#CCFF00]" />
          <span>RANK #{rankNum}</span>
        </div>

        {/* Bottom Right: Mini Performance Sparkline */}
        <div className="absolute bottom-2 right-2.5 z-10 flex items-center gap-1.5 bg-[#0B0E14]/90 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/10">
          <TrendingUp className="w-3 h-3 text-[#CCFF00]" />
          <svg className="w-12 h-3.5 overflow-visible" viewBox="0 0 120 30">
            <path
              d={roleStyle.sparkPath}
              fill="none"
              stroke="#CCFF00"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Fighter Info & Betting Stats Bar */}
      <div className="p-3 bg-[#121620] border-t border-white/10 text-center relative z-10">
        <h2 className="text-xl sm:text-2xl font-bebas tracking-wide text-white leading-tight uppercase truncate">
          {player.name}
        </h2>

        {/* Sports Betting Stats Row */}
        <div className="mt-2 grid grid-cols-3 gap-1.5 py-1.5 px-2 bg-[#0B0E14] rounded-xl border border-white/5">
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-wider">
              {roleStyle.stat1Label}
            </span>
            <span className="text-xs font-black text-white">
              {roleStyle.stat1Val}
            </span>
          </div>

          <div className="flex flex-col items-center border-x border-white/5">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-wider">
              {roleStyle.stat2Label}
            </span>
            <span className="text-xs font-black text-white">
              {roleStyle.stat2Val}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-wider">
              FORM
            </span>
            <span className="text-[10px] font-black text-[#CCFF00] truncate max-w-[65px]">
              {roleStyle.form}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
