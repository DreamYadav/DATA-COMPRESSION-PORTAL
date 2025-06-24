import React from 'react';
import { Algorithm, AlgorithmInfo } from '../types';
import { Zap, RotateCcw, Layers } from 'lucide-react';

interface AlgorithmSelectorProps {
  selectedAlgorithm: Algorithm;
  onAlgorithmChange: (algorithm: Algorithm) => void;
  disabled?: boolean;
}

const algorithmInfo: Record<Algorithm, AlgorithmInfo & { icon: React.ReactNode }> = {
  huffman: {
    name: 'Huffman Coding',
    description: 'Variable-length encoding based on character frequency. Highly effective for text and general data compression.',
    bestFor: ['Text files', 'Source code', 'General purpose'],
    complexity: 'High',
    icon: <Layers className="w-5 h-5" />
  },
  rle: {
    name: 'Run-Length Encoding',
    description: 'Compresses sequences of identical bytes. Simple but effective for data with repeated patterns.',
    bestFor: ['Images with solid colors', 'Simple graphics', 'Bitmap data'],
    complexity: 'Low',
    icon: <RotateCcw className="w-5 h-5" />
  },
  lz77: {
    name: 'LZ77 Compression',
    description: 'Dictionary-based compression using sliding window. Good for general purpose compression.',
    bestFor: ['Mixed content', 'Binary files', 'General purpose'],
    complexity: 'Medium',
    icon: <Zap className="w-5 h-5" />
  }
};

export const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  selectedAlgorithm,
  onAlgorithmChange,
  disabled
}) => {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-white mb-4">Select Compression Algorithm</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(algorithmInfo).map(([key, info]) => {
          const algorithm = key as Algorithm;
          const isSelected = selectedAlgorithm === algorithm;
          
          return (
            <button
              key={algorithm}
              onClick={() => onAlgorithmChange(algorithm)}
              disabled={disabled}
              className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                isSelected
                  ? 'border-blue-500 bg-blue-500/10 shadow-lg scale-105'
                  : 'border-gray-600 bg-gray-800/30 hover:border-gray-500 hover:bg-gray-800/50'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-500' : 'bg-gray-700'}`}>
                  {info.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-white">{info.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    info.complexity === 'Low' ? 'bg-green-500/20 text-green-400' :
                    info.complexity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {info.complexity} Complexity
                  </span>
                </div>
              </div>
              
              <p className="text-gray-300 text-sm mb-3">{info.description}</p>
              
              <div>
                <p className="text-gray-400 text-xs mb-1">Best for:</p>
                <div className="flex flex-wrap gap-1">
                  {info.bestFor.map((item, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};