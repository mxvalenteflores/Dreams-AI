import React from 'react';
import { DreamAnalysis } from '../types';

interface DreamResultDisplayProps {
  analysis: DreamAnalysis;
  onReset: () => void;
}

const DreamResultDisplay: React.FC<DreamResultDisplayProps> = ({ analysis, onReset }) => {
  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in-up space-y-12">
      <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-2xl">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">Narrativa Aumentada</h2>
        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{analysis.narrative}</p>
      </div>
      
      <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-2xl">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400 mb-4">Interpretación</h2>
        <div className="text-gray-300 leading-relaxed whitespace-pre-wrap prose prose-invert prose-p:text-gray-300 prose-headings:text-teal-300 prose-strong:text-white">
          {analysis.interpretation}
        </div>
      </div>

      <button
        onClick={onReset}
        className="w-full md:w-auto mx-auto block font-bold text-lg text-white py-3 px-8 rounded-lg bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
      >
        Explorar Otro Sueño
      </button>
    </div>
  );
};

export default DreamResultDisplay;
