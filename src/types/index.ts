export interface CompressionResult {
  compressedData: Uint8Array;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  algorithm: string;
  processingTime: number;
  metadata?: any;
}

export interface DecompressionResult {
  decompressedData: Uint8Array;
  originalSize: number;
  decompressedSize: number;
  algorithm: string;
  processingTime: number;
}

export interface FileInfo {
  name: string;
  size: number;
  type: string;
  data: Uint8Array;
}

export interface CompressionStats {
  algorithm: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  processingTime: number;
  spaceSaved: number;
}

export type Algorithm = 'huffman' | 'rle' | 'lz77';

export interface AlgorithmInfo {
  name: string;
  description: string;
  bestFor: string[];
  complexity: 'Low' | 'Medium' | 'High';
}