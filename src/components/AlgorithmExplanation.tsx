import React from 'react';
import { Algorithm } from '../types';
import { Layers, RotateCcw, Zap, BookOpen, Lightbulb, Settings, TrendingUp } from 'lucide-react';

interface AlgorithmExplanationProps {
  algorithm: Algorithm;
}

const algorithmDetails = {
  huffman: {
    name: 'Huffman Coding',
    icon: <Layers className="w-6 h-6" />,
    color: 'blue',
    description: 'A variable-length encoding algorithm that assigns shorter codes to more frequent characters.',
    howItWorks: [
      'Analyze character frequencies in the input data',
      'Build a binary tree with frequent characters closer to root',
      'Assign binary codes: left=0, right=1',
      'Replace characters with their variable-length codes',
      'Store the tree structure for decompression'
    ],
    advantages: [
      'Optimal compression for known character frequencies',
      'No information loss (lossless compression)',
      'Excellent for text and source code',
      'Mathematically proven optimal for single-symbol encoding'
    ],
    disadvantages: [
      'Requires two passes through data',
      'Tree overhead for small files',
      'Not suitable for uniform data distribution'
    ],
    bestFor: ['Text files', 'Source code', 'XML/JSON data', 'Natural language text'],
    complexity: 'O(n log n)',
    typicalRatio: '15-40% reduction'
  },
  rle: {
    name: 'Run-Length Encoding',
    icon: <RotateCcw className="w-6 h-6" />,
    color: 'green',
    description: 'Compresses consecutive identical bytes into count-value pairs.',
    howItWorks: [
      'Scan input data sequentially',
      'Count consecutive identical bytes',
      'Replace runs of 3+ bytes with (count, value)',
      'Store single/double bytes as literals',
      'Add markers to distinguish runs from literals'
    ],
    advantages: [
      'Extremely simple implementation',
      'Very fast processing speed',
      'Excellent for repetitive data',
      'Low memory requirements'
    ],
    disadvantages: [
      'Poor performance on random data',
      'Can increase file size if no repetition',
      'Limited compression scope'
    ],
    bestFor: ['Simple graphics', 'Bitmap images', 'Fax data', 'Solid color regions'],
    complexity: 'O(n)',
    typicalRatio: '10-80% reduction (highly data-dependent)'
  },
  lz77: {
    name: 'LZ77 Compression',
    icon: <Zap className="w-6 h-6" />,
    color: 'purple',
    description: 'Dictionary-based compression using a sliding window to find repeated sequences.',
    howItWorks: [
      'Maintain a sliding window of recent data',
      'Search for matches in the window',
      'Encode matches as (distance, length, next_char)',
      'Store non-matching bytes as literals',
      'Slide window forward and repeat'
    ],
    advantages: [
      'Good general-purpose compression',
      'Adapts to data patterns automatically',
      'No need to store dictionary',
      'Works well with mixed content'
    ],
    disadvantages: [
      'Moderate compression ratios',
      'Window size limits match distance',
      'More complex than RLE'
    ],
    bestFor: ['Mixed content', 'Binary files', 'General purpose', 'Unknown data types'],
    complexity: 'O(n²) worst case, O(n) average',
    typicalRatio: '20-50% reduction'
  }
};

export const AlgorithmExplanation: React.FC<AlgorithmExplanationProps> = ({ algorithm }) => {
  const details = algorithmDetails[algorithm];
  const colorClasses = {
    blue: 'border-blue-500/30 bg-blue-500/10',
    green: 'border-green-500/30 bg-green-500/10',
    purple: 'border-purple-500/30 bg-purple-500/10'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-6 rounded-xl border ${colorClasses[details.color as keyof typeof colorClasses]} backdrop-blur-sm`}>
        <div className="flex items-center gap-4 mb-4">
          <div className={`p-3 bg-${details.color}-500 rounded-xl`}>
            {details.icon}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{details.name}</h3>
            <p className="text-gray-300">{details.description}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 bg-gray-800/50 rounded-lg">
            <div className="text-lg font-bold text-white">{details.complexity}</div>
            <div className="text-gray-400 text-sm">Time Complexity</div>
          </div>
          <div className="text-center p-3 bg-gray-800/50 rounded-lg">
            <div className="text-lg font-bold text-white">{details.typicalRatio}</div>
            <div className="text-gray-400 text-sm">Typical Compression</div>
          </div>
          <div className="text-center p-3 bg-gray-800/50 rounded-lg">
            <div className="text-lg font-bold text-white">{details.bestFor.length}</div>
            <div className="text-gray-400 text-sm">Optimal Use Cases</div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="w-5 h-5 text-blue-400" />
          <h4 className="text-xl font-semibold text-white">How It Works</h4>
        </div>
        <div className="space-y-3">
          {details.howItWorks.map((step, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              <p className="text-gray-300">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Advantages & Disadvantages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <h4 className="text-xl font-semibold text-white">Advantages</h4>
          </div>
          <div className="space-y-2">
            {details.advantages.map((advantage, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300">{advantage}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            <h4 className="text-xl font-semibold text-white">Considerations</h4>
          </div>
          <div className="space-y-2">
            {details.disadvantages.map((disadvantage, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300">{disadvantage}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Best Use Cases */}
      <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-5 h-5 text-purple-400" />
          <h4 className="text-xl font-semibold text-white">Optimal Use Cases</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {details.bestFor.map((useCase, index) => (
            <div key={index} className="p-3 bg-gray-700/50 rounded-lg text-center">
              <p className="text-gray-300 font-medium">{useCase}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};