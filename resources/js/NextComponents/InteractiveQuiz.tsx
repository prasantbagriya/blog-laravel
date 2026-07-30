'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizProps {
  question: string;
  options: string[];
  correctIndex: number;
}

export default function InteractiveQuiz({ question, options, correctIndex }: QuizProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
  };

  return (
    <div className="my-10 p-6 md:p-8 bg-white border border-gray-200 rounded-2xl shadow-sm max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
          ?
        </div>
        <h3 className="text-xl font-bold text-gray-900 m-0">{question}</h3>
      </div>
      
      <div className="space-y-3 mb-6">
        {options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = submitted && i === correctIndex;
          const isWrong = submitted && isSelected && i !== correctIndex;
          
          let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 font-medium ";
          
          if (submitted) {
            if (isCorrect) {
              btnClass += "bg-green-50 border-green-500 text-green-800";
            } else if (isWrong) {
              btnClass += "bg-red-50 border-red-500 text-red-800";
            } else {
              btnClass += "bg-gray-50 border-gray-100 text-gray-400 opacity-70";
            }
          } else {
            if (isSelected) {
              btnClass += "bg-blue-50 border-blue-500 text-blue-800";
            } else {
              btnClass += "bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-gray-50";
            }
          }

          return (
            <button
              key={i}
              onClick={() => !submitted && setSelected(i)}
              disabled={submitted}
              className={btnClass}
            >
              <div className="flex items-center justify-between">
                <span>{opt}</span>
                {submitted && isCorrect && <span className="text-green-600 font-bold">✓</span>}
                {submitted && isWrong && <span className="text-red-600 font-bold">✗</span>}
              </div>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`p-4 rounded-xl text-sm font-bold ${
              selected === correctIndex ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {selected === correctIndex ? '🎉 Correct Answer!' : '💡 Incorrect. The correct answer is highlighted above.'}
          </motion.div>
        )}
      </AnimatePresence>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className={`w-full py-3 rounded-xl font-bold transition-all ${
            selected !== null
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Submit Answer
        </button>
      )}
    </div>
  );
}
