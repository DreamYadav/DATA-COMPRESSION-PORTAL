interface LZ77Match {
  distance: number;
  length: number;
  nextChar: number;
}

export class LZ77 {
  private readonly windowSize = 1024;
  private readonly lookaheadSize = 15;
  private readonly minMatchLength = 3;

  private findMatch(data: Uint8Array, position: number): LZ77Match {
    const windowStart = Math.max(0, position - this.windowSize);
    const windowEnd = position;
    const lookaheadEnd = Math.min(data.length, position + this.lookaheadSize);
    
    let bestDistance = 0;
    let bestLength = 0;
    
    for (let i = windowStart; i < windowEnd; i++) {
      let length = 0;
      let pos = position;
      let searchPos = i;
      
      while (pos < lookaheadEnd && 
             data[searchPos] === data[pos] && 
             length < this.lookaheadSize) {
        length++;
        pos++;
        searchPos++;
        
        if (searchPos >= windowEnd) {
          searchPos = i;
        }
      }
      
      if (length >= this.minMatchLength && length > bestLength) {
        bestLength = length;
        bestDistance = position - i;
      }
    }
    
    const nextChar = position + bestLength < data.length ? 
                    data[position + bestLength] : 0;
    
    return {
      distance: bestDistance,
      length: bestLength,
      nextChar
    };
  }

  compress(data: Uint8Array): Uint8Array {
    if (data.length === 0) return new Uint8Array(0);

    const result: number[] = [];
    let position = 0;
    
    while (position < data.length) {
      const match = this.findMatch(data, position);
      
      if (match.length >= this.minMatchLength) {
        // Encode as match: flag(1) + distance(2) + length(1) + nextChar(1)
        result.push(
          1, // Match flag
          (match.distance >> 8) & 0xFF,
          match.distance & 0xFF,
          match.length,
          match.nextChar
        );
        position += match.length + 1;
      } else {
        // Encode as literal: flag(0) + literal
        result.push(0, data[position]);
        position++;
      }
    }

    const compressed = new Uint8Array(result);
    
    // If compression doesn't help, return original with marker
    if (compressed.length >= data.length) {
      const uncompressed = new Uint8Array(data.length + 1);
      uncompressed[0] = 255; // Uncompressed marker
      uncompressed.set(data, 1);
      return uncompressed;
    }
    
    return compressed;
  }

  decompress(data: Uint8Array): Uint8Array {
    if (data.length === 0) return new Uint8Array(0);

    // Check for uncompressed marker
    if (data[0] === 255) {
      return data.slice(1);
    }

    const result: number[] = [];
    let i = 0;
    
    while (i < data.length) {
      const flag = data[i];
      i++;
      
      if (flag === 1 && i + 4 < data.length) {
        // Match
        const distanceHigh = data[i];
        const distanceLow = data[i + 1];
        const length = data[i + 2];
        const nextChar = data[i + 3];
        i += 4;
        
        const distance = (distanceHigh << 8) | distanceLow;
        const startPos = result.length - distance;
        
        for (let j = 0; j < length; j++) {
          if (startPos + j >= 0 && startPos + j < result.length) {
            result.push(result[startPos + j]);
          }
        }
        
        if (nextChar !== 0) {
          result.push(nextChar);
        }
      } else if (flag === 0 && i < data.length) {
        // Literal
        result.push(data[i]);
        i++;
      }
    }
    
    return new Uint8Array(result);
  }
}