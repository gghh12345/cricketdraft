import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gavel, Sparkles } from 'lucide-react';

export default function SoldBanner({ soldInfo }) {
  if (!soldInfo) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 2, opacity: 0, rotate: -15 }}
        animate={{ scale: 1, opacity: 1, rotate: -5 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', damping: 15, stiffness: 400 }}
        className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none p-4"
      >
        <div className="bg-gradient-to-r from-red-600 via-amber-600 to-red-600 text-white p-4 rounded-2xl shadow-2xl border-4 border-amber-300 transform ring-4 ring-black/40 text-center max-w-[260px] animate-pulse">
          <div className="flex items-center justify-center gap-1.5 text-amber-200 mb-0.5">
            <Gavel className="w-5 h-5 fill-amber-300" />
            <span className="text-2xl font-black tracking-widest uppercase drop-shadow-md">
              SOLD!
            </span>
          </div>
          <div className="text-sm font-extrabold text-white truncate drop-shadow">
            {soldInfo.playerName}
          </div>
          <div className="mt-1 text-xs font-black text-amber-200 bg-black/40 py-1 px-2 rounded-lg border border-amber-300/40">
            to <span className="text-white font-black">{soldInfo.draftedBy}</span> for <span className="text-amber-300 font-black">₹{soldInfo.amount}</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
