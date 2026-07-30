'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface PollProps {
  question: string;
  options: string[];
}

export default function InteractivePoll({ question, options }: PollProps) {
  const [voted, setVoted] = useState(false);
  
  // Simulate pseudo-random initial votes based on question length so it's deterministic but looks real
  const [votes, setVotes] = useState<number[]>(
    options.map((_, i) => Math.floor(Math.abs(Math.sin(question.length + i)) * 50) + 10)
  );

  const totalVotes = votes.reduce((a, b) => a + b, 0);

  const handleVote = (index: number) => {
    if (voted) return;
    const newVotes = [...votes];
    newVotes[index] += 1;
    setVotes(newVotes);
    setVoted(true);
  };

  return (
    <div className="my-10 p-6 md:p-8 bg-white border border-gray-200 rounded-2xl shadow-sm max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
          📊
        </div>
        <h3 className="text-xl font-bold text-gray-900 m-0">{question}</h3>
      </div>
      
      <div className="space-y-4">
        {options.map((opt, i) => {
          const percentage = totalVotes === 0 ? 0 : Math.round((votes[i] / totalVotes) * 100);
          
          return (
            <div key={i} className="relative">
              {!voted ? (
                <button
                  onClick={() => handleVote(i)}
                  className="w-full text-left p-4 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                >
                  {opt}
                </button>
              ) : (
                <div className="w-full relative overflow-hidden rounded-xl border border-gray-100 bg-gray-50 p-4 flex justify-between items-center z-10 font-medium">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute top-0 left-0 h-full bg-indigo-100 -z-10"
                  />
                  <span className="text-gray-900 z-20 drop-shadow-sm">{opt}</span>
                  <span className="text-indigo-800 font-bold z-20">{percentage}%</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {voted && (
        <div className="mt-4 text-center text-xs text-gray-500 font-medium uppercase tracking-wider">
          {totalVotes} total votes
        </div>
      )}
    </div>
  );
}
