import React, { useState, useCallback } from 'react';
import { FileUploader } from './components/FileUploader';
import { AlgorithmSelector } from './components/AlgorithmSelector';
import { CompressionStatsComponent } from './components/CompressionStats';
import { ProcessingControls } from './components/ProcessingControls';
import { AlgorithmExplanation } from './components/AlgorithmExplanation';
import { FileInfo, Algorithm, CompressionStats } from './types';
import { CompressionEngine } from './utils/compression';
import { downloadFile } from './utils/fileUtils';
import { Database, Zap, BookOpen, BarChart3 } from 'lucide-react';

function App() {
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);
  const [algorithm, setAlgorithm] = useState<Algorithm>('huffman');
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState<CompressionStats | null>(null);
  const [processedData, setProcessedData] = useState<{
    data: Uint8Array;
    metadata?: any;
    filename: string;
  } | null>(null);
  const [mode, setMode] = useState<'compress' | 'decompress'>('compress');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'process' | 'learn' | 'results'>('process');

  const compressionEngine = new CompressionEngine();

  const handleFileSelect = useCallback((file: FileInfo) => {
    setSelectedFile(file);
    setStats(null);
    setProcessedData(null);
    setError(null);
    setActiveTab('process');
  }, []);

  const handleCompress = useCallback(async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      const result = await compressionEngine.compress(selectedFile.data, algorithm);
      
      const compressionStats: CompressionStats = {
        algorithm: result.algorithm,
        originalSize: result.originalSize,
        compressedSize: result.compressedSize,
        compressionRatio: result.compressionRatio,
        processingTime: result.processingTime,
        spaceSaved: result.originalSize - result.compressedSize
      };

      setStats(compressionStats);
      setProcessedData({
        data: result.compressedData,
        metadata: result.metadata,
        filename: `${selectedFile.name}.${algorithm}`
      });
      setActiveTab('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Compression failed');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, algorithm, compressionEngine]);

  const handleDecompress = useCallback(async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      const result = await compressionEngine.decompress(selectedFile.data, algorithm);
      
      setProcessedData({
        data: result.decompressedData,
        filename: selectedFile.name.replace(`.${algorithm}`, '') || `decompressed_${selectedFile.name}`
      });

      const decompressionStats: CompressionStats = {
        algorithm: result.algorithm,
        originalSize: result.originalSize,
        compressedSize: result.decompressedSize,
        compressionRatio: result.decompressedSize / result.originalSize,
        processingTime: result.processingTime,
        spaceSaved: 0
      };
      
      setStats(decompressionStats);
      setActiveTab('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Decompression failed');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, algorithm, compressionEngine]);

  const handleDownload = useCallback(() => {
    if (!processedData) return;
    
    downloadFile(processedData.data, processedData.filename);
  }, [processedData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Database className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Data Compression Portal</h1>
              <p className="text-gray-400">Advanced file compression and decompression with detailed analytics</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex bg-gray-800/50 p-2 rounded-xl border border-gray-700 backdrop-blur-sm">
          <button
            onClick={() => setActiveTab('process')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'process'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <Database className="w-5 h-5" />
            Process Files
          </button>
          <button
            onClick={() => setActiveTab('learn')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'learn'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            Learn Algorithms
          </button>
          <button
            onClick={() => setActiveTab('results')}
            disabled={!stats}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'results' && stats
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            View Results
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Process Files Tab */}
        {activeTab === 'process' && (
          <div className="space-y-8">
            {/* File Upload Section */}
            <section className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
              <FileUploader
                onFileSelect={handleFileSelect}
                disabled={isProcessing}
              />
            </section>

            {/* Algorithm Selection */}
            <section className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
              <AlgorithmSelector
                selectedAlgorithm={algorithm}
                onAlgorithmChange={setAlgorithm}
                disabled={isProcessing}
              />
            </section>

            {/* Processing Controls */}
            <section className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
              <ProcessingControls
                hasFile={!!selectedFile}
                algorithm={algorithm}
                isProcessing={isProcessing}
                hasResult={!!processedData}
                onCompress={handleCompress}
                onDecompress={handleDecompress}
                onDownload={handleDownload}
                mode={mode}
                onModeChange={setMode}
              />
            </section>

            {/* Error Display */}
            {error && (
              <section className="bg-red-500/10 backdrop-blur-lg rounded-2xl p-6 border border-red-500/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500 rounded-lg">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-red-400">Processing Error</h3>
                    <p className="text-red-300">{error}</p>
                  </div>
                </div>
              </section>
            )}
          </div>
        )}

        {/* Learn Algorithms Tab */}
        {activeTab === 'learn' && (
          <div className="space-y-8">
            <AlgorithmExplanation algorithm={algorithm} />
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && stats && (
          <div className="space-y-8">
            <CompressionStatsComponent stats={stats} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-lg border-t border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-400">
            <p>Built with React, TypeScript, and advanced compression algorithms</p>
            <p className="text-sm mt-2">Supports Huffman Coding, Run-Length Encoding, and LZ77 compression with detailed analytics</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;