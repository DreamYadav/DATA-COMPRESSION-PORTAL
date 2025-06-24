import { HuffmanCoding } from '../algorithms/huffman';
import { RunLengthEncoding } from '../algorithms/rle';
import { LZ77 } from '../algorithms/lz77';
import { CompressionResult, DecompressionResult, Algorithm } from '../types';

export class CompressionEngine {
  private huffman = new HuffmanCoding();
  private rle = new RunLengthEncoding();
  private lz77 = new LZ77();

  async compress(data: Uint8Array, algorithm: Algorithm): Promise<CompressionResult> {
    const startTime = performance.now();
    let compressedData: Uint8Array;
    let metadata: any = {};

    try {
      switch (algorithm) {
        case 'huffman':
          const huffmanResult = this.huffman.compress(data);
          compressedData = huffmanResult.compressed;
          metadata = { tree: huffmanResult.tree, originalLength: data.length };
          break;
        
        case 'rle':
          compressedData = this.rle.compress(data);
          break;
        
        case 'lz77':
          compressedData = this.lz77.compress(data);
          break;
        
        default:
          throw new Error(`Unsupported algorithm: ${algorithm}`);
      }

      const endTime = performance.now();
      
      // Ensure we never exceed original size
      if (compressedData.length > data.length) {
        throw new Error('Compression failed: output larger than input');
      }
      
      const compressionRatio = data.length > 0 ? (compressedData.length / data.length) : 1;

      return {
        compressedData,
        originalSize: data.length,
        compressedSize: compressedData.length,
        compressionRatio,
        algorithm,
        processingTime: endTime - startTime,
        metadata
      };
    } catch (error) {
      throw new Error(`Compression failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async decompress(data: Uint8Array, algorithm: Algorithm, metadata?: any): Promise<DecompressionResult> {
    const startTime = performance.now();
    let decompressedData: Uint8Array;

    try {
      switch (algorithm) {
        case 'huffman':
          decompressedData = this.huffman.decompress(data, metadata?.tree || new Uint8Array(0), metadata?.originalLength);
          break;
        
        case 'rle':
          decompressedData = this.rle.decompress(data);
          break;
        
        case 'lz77':
          decompressedData = this.lz77.decompress(data);
          break;
        
        default:
          throw new Error(`Unsupported algorithm: ${algorithm}`);
      }

      const endTime = performance.now();

      return {
        decompressedData,
        originalSize: data.length,
        decompressedSize: decompressedData.length,
        algorithm,
        processingTime: endTime - startTime
      };
    } catch (error) {
      throw new Error(`Decompression failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}