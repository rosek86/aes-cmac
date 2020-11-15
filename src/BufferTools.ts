export class BufferTools {
  public static bitShiftLeft(input: Buffer): Buffer {
    const output = Buffer.alloc(input.length);
    let overflow = 0;
    for (let i = input.length - 1; i >= 0; i--) {
      output[i] = (input[i] << 1) | overflow;
      overflow = input[i] & 0x80 ? 1 : 0;
    }
    return output;
  }

  public static xor(a: Buffer, b: Buffer): Buffer {
    const length = Math.min(a.length, b.length);
    const output = Buffer.alloc(length);
    for (let i = 0; i < length; i++) {
      output[i] = a[i] ^ b[i];
    }
    return output;
  }

  public static toBinaryString(buffer: Buffer): string {
    let binary = ``;
    for (let i = 0; i < buffer.length; i++) {
      for (let b = 7; b >= 0; b--) {
        binary += buffer[i] & (1 << b) ? `1` : `0`;
      }
    }
    return binary;
  }
}
