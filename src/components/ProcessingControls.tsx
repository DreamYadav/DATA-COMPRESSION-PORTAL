import React, { useState } from 'react';
import { Play, RotateCcw, Download, Loader2 } from 'lucide-react';
import { Algorithm } from '../types';

interface ProcessingControlsProps {
  hasFile: boolean;
  algorithm: Algorithm;
  isProcessing: boolean;
  hasResult: boolean;
  onCompress: () => void;
  onDecompress: () => void;
  onDownload: () => void;
  mode: 'compress' | 'decompress';
  onModeChange: (mode: 'compress' | 'decompress') => void;
}

export const ProcessingControls: React.FC<ProcessingControlsProps> = ({
  hasFile,
  algorithm,
  isProcessing,
  hasResult,
  onCompress,
  onDecompress,
  onDownload,
  mode,
  onModeChange
}) => {
  return (
    <div className="w-full space-y-4">
      {/* Mode Selection */}
      <div className="flex bg-gray-800/50 p-2 rounded-xl border border-gray-700">
        <button
          onClick={() => onModeChange('compress')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
            mode === 'compress'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
          }`}
        >
          Compress
        </button>
        <button
          onClick={() => onModeChange('decompress')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
            mode === 'decompress'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
          }`}
        >
          Decompress
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        {mode === 'compress' ? (
          <button
            onClick={onCompress}
            disabled={!hasFile || isProcessing}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Compressing...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Compress with {algorithm.toUpperCase()}
              </>
            )}
          </button>
        ) : (
          <button
            onClick={onDecompress}
            disabled={!hasFile || isProcessing}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Decompressing...
              </>
            ) : (
              <>
                <RotateCcw className="w-5 h-5" />
                Decompress
              </>
            )}
          </button>
        )}

        <button
          onClick={onDownload}
          disabled={!hasResult}
          className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5" />
          Download
        </button>
      </div>

      {!hasFile && (
        <p className="text-center text-gray-400 text-sm">
          Upload a file to get started
        </p>
      )}
    </div>
  );
};