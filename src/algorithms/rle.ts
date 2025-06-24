export class RunLengthEncoding {
  compress(data: Uint8Array): Uint8Array {
    if (data.length === 0) return new Uint8Array(0);

    const result: number[] = [];
    let currentByte = data[0];
    let count = 1;

    for (let i = 1; i < data.length; i++) {
      if (data[i] === currentByte && count < 255) {
        count++;
      } else {
        // Only use RLE if we have runs of 3 or more, otherwise store literal
        if (count >= 3) {
          result.push(0, count, currentByte); // 0 marker for RLE
        } else {
          // Store as literals
          for (let j = 0; j < count; j++) {
            result.push(currentByte);
          }
        }
        currentByte = data[i];
        count = 1;
      }
    }
    
    // Handle the last run
    if (count >= 3) {
      result.push(0, count, currentByte);
    } else {
      for (let j = 0; j < count; j++) {
        result.push(currentByte);
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
      if (data[i] === 0 && i + 2 < data.length) {
        // RLE sequence
        const count = data[i + 1];
        const byte = data[i + 2];
        for (let j = 0; j < count; j++) {
          result.push(byte);
        }
        i += 3;
      } else {
        // Literal byte
        result.push(data[i]);
        i++;
      }
    }
    
    return new Uint8Array(result);
  }
}