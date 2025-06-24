interface HuffmanNode {
  char: number;
  frequency: number;
  left?: HuffmanNode;
  right?: HuffmanNode;
}

interface HuffmanCode {
  [key: number]: string;
}

export class HuffmanCoding {
  private buildFrequencyTable(data: Uint8Array): Map<number, number> {
    const frequencies = new Map<number, number>();
    for (const byte of data) {
      frequencies.set(byte, (frequencies.get(byte) || 0) + 1);
    }
    return frequencies;
  }

  private buildHuffmanTree(frequencies: Map<number, number>): HuffmanNode {
    const nodes: HuffmanNode[] = Array.from(frequencies.entries()).map(([char, frequency]) => ({
      char,
      frequency,
    }));

    if (nodes.length === 1) {
      return {
        char: -1,
        frequency: nodes[0].frequency,
        left: nodes[0],
      };
    }

    while (nodes.length > 1) {
      nodes.sort((a, b) => a.frequency - b.frequency);
      const left = nodes.shift()!;
      const right = nodes.shift()!;
      
      const merged: HuffmanNode = {
        char: -1,
        frequency: left.frequency + right.frequency,
        left,
        right,
      };
      
      nodes.push(merged);
    }

    return nodes[0];
  }

  private generateCodes(root: HuffmanNode): HuffmanCode {
    const codes: HuffmanCode = {};
    
    const traverse = (node: HuffmanNode, code: string) => {
      if (node.char !== -1) {
        codes[node.char] = code || '0';
        return;
      }
      
      if (node.left) traverse(node.left, code + '0');
      if (node.right) traverse(node.right, code + '1');
    };
    
    traverse(root, '');
    return codes;
  }

  private serializeTree(node: HuffmanNode): Uint8Array {
    const result: number[] = [];
    
    const serialize = (n: HuffmanNode) => {
      if (n.char !== -1) {
        result.push(1, n.char);
      } else {
        result.push(0);
        if (n.left) serialize(n.left);
        if (n.right) serialize(n.right);
      }
    };
    
    serialize(node);
    return new Uint8Array(result);
  }

  private deserializeTree(data: Uint8Array, index: { value: number }): HuffmanNode {
    if (index.value >= data.length) {
      throw new Error('Invalid tree data');
    }

    const isLeaf = data[index.value] === 1;
    index.value++;

    if (isLeaf) {
      const char = data[index.value];
      index.value++;
      return { char, frequency: 0 };
    }

    const left = this.deserializeTree(data, index);
    const right = this.deserializeTree(data, index);
    return { char: -1, frequency: 0, left, right };
  }

  compress(data: Uint8Array): { compressed: Uint8Array; tree: Uint8Array } {
    if (data.length === 0) {
      return { compressed: new Uint8Array(0), tree: new Uint8Array(0) };
    }

    // Check if compression is worth it
    const frequencies = this.buildFrequencyTable(data);
    if (frequencies.size === 1) {
      // Only one unique byte - use simple encoding
      const byte = Array.from(frequencies.keys())[0];
      const result = new Uint8Array(5);
      result[0] = 255; // Special marker for single byte
      result[1] = byte;
      result[2] = (data.length >> 16) & 0xFF;
      result[3] = (data.length >> 8) & 0xFF;
      result[4] = data.length & 0xFF;
      return { compressed: result, tree: new Uint8Array(0) };
    }

    const root = this.buildHuffmanTree(frequencies);
    const codes = this.generateCodes(root);
    const tree = this.serializeTree(root);

    let bitString = '';
    for (const byte of data) {
      bitString += codes[byte];
    }

    // Calculate compressed size including tree
    const bitsNeeded = bitString.length;
    const bytesNeeded = Math.ceil(bitsNeeded / 8);
    const totalSize = bytesNeeded + tree.length + 4; // +4 for metadata

    // If compression doesn't save space, return original
    if (totalSize >= data.length) {
      const result = new Uint8Array(data.length + 1);
      result[0] = 254; // Marker for uncompressed
      result.set(data, 1);
      return { compressed: result, tree: new Uint8Array(0) };
    }

    // Pad to make it byte-aligned
    const padding = 8 - (bitString.length % 8);
    if (padding !== 8) {
      bitString += '0'.repeat(padding);
    }

    const compressedData = new Uint8Array(bytesNeeded);
    for (let i = 0; i < bitString.length; i += 8) {
      const byte = bitString.substr(i, 8);
      compressedData[i / 8] = parseInt(byte, 2);
    }

    // Create final result with metadata
    const result = new Uint8Array(4 + tree.length + compressedData.length);
    result[0] = 0; // Normal compression marker
    result[1] = tree.length;
    result[2] = (data.length >> 8) & 0xFF;
    result[3] = data.length & 0xFF;
    result.set(tree, 4);
    result.set(compressedData, 4 + tree.length);

    return { compressed: result, tree };
  }

  decompress(compressed: Uint8Array, tree: Uint8Array, originalLength?: number): Uint8Array {
    if (compressed.length === 0) {
      return new Uint8Array(0);
    }

    // Check for special cases
    if (compressed[0] === 255) {
      // Single byte compression
      const byte = compressed[1];
      const length = (compressed[2] << 16) | (compressed[3] << 8) | compressed[4];
      return new Uint8Array(length).fill(byte);
    }

    if (compressed[0] === 254) {
      // Uncompressed data
      return compressed.slice(1);
    }

    // Normal Huffman decompression
    const treeLength = compressed[1];
    const origLength = (compressed[2] << 8) | compressed[3];
    const treeData = compressed.slice(4, 4 + treeLength);
    const compressedData = compressed.slice(4 + treeLength);

    const root = this.deserializeTree(treeData, { value: 0 });
    
    let bitString = '';
    for (const byte of compressedData) {
      bitString += byte.toString(2).padStart(8, '0');
    }

    const result = new Uint8Array(origLength);
    let resultIndex = 0;
    let currentNode = root;
    
    for (const bit of bitString) {
      if (resultIndex >= origLength) break;
      
      if (currentNode.char !== -1) {
        result[resultIndex++] = currentNode.char;
        currentNode = root;
      }
      
      if (bit === '0' && currentNode.left) {
        currentNode = currentNode.left;
      } else if (bit === '1' && currentNode.right) {
        currentNode = currentNode.right;
      }
    }
    
    if (currentNode.char !== -1 && resultIndex < origLength) {
      result[resultIndex] = currentNode.char;
    }

    return result;
  }
}