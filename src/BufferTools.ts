export class BufferTools {
  public static bitShiftLeft(input: Uint8Array): Uint8Array<ArrayBuffer> {
    const output = new Uint8Array(input.length);
    let overflow = 0;
    for (let i = input.length - 1; i >= 0; i--) {
      const byte = input[i]!;
      output[i] = (byte << 1) | overflow;
      overflow = byte & 0x80 ? 1 : 0;
    }
    return output;
  }

  public static xor(a: Uint8Array, b: Uint8Array): Uint8Array<ArrayBuffer> {
    const length = Math.min(a.length, b.length);
    const output = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      output[i] = a[i]! ^ b[i]!;
    }
    return output;
  }

  public static toBinaryString(input: Uint8Array): string {
    let binary = "";
    for (let i = 0; i < input.length; i++) {
      for (let b = 7; b >= 0; b--) {
        const byte = input[i]!;
        binary += byte & (1 << b) ? "1" : "0";
      }
    }
    return binary;
  }
}
