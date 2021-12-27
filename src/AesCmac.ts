import { createCipheriv } from 'crypto';
import { BufferTools } from './BufferTools';

export class AesCmac {
  private readonly algos: { [id:number]: string } = {
    16: `aes-128-cbc`,
    24: `aes-192-cbc`,
    32: `aes-256-cbc`,
  };
  private readonly blockSize = 16;

  private algo: string;
  private subkeys: { key1: Buffer; key2: Buffer; };

  public constructor(private key: Buffer) {
    if ((key instanceof Buffer) === false) {
      throw new Error(`The key must be provided as a Buffer.`);
    }
    if ((key.length in this.algos) === false) {
      throw new Error(`Key size must be 128, 192, or 256 bits.`);
    }

    this.algo = this.algos[key.length];
    this.subkeys = this.generateSubkeys();
  }

  private generateSubkeys(): { key1: Buffer; key2: Buffer; } {
    const rb = Buffer.from(`00000000000000000000000000000087`, `hex`);

    const z = Buffer.alloc(this.blockSize, 0);
    const l = this.aes(z);

    let key1 = BufferTools.bitShiftLeft(l);
    if (l[0] & 0x80) {
      key1 = BufferTools.xor(key1, rb);
    }

    let key2 = BufferTools.bitShiftLeft(key1);
    if (key1[0] & 0x80) {
      key2 = BufferTools.xor(key2, rb);
    }

    return { key1, key2 };
  }

  public getSubKeys(): { key1: Buffer; key2: Buffer } {
    const key1 = Buffer.alloc(this.blockSize);
    const key2 = Buffer.alloc(this.blockSize);

    this.subkeys.key1.copy(key1);
    this.subkeys.key2.copy(key2);

    return { key1, key2 };
  }

  public calculate(message: Buffer): Buffer {
    if ((message instanceof Buffer) === false) {
      throw new Error(`The message must be provided as a Buffer.`);
    }

    const blockCount = this.getBlockCount(message);

    let x = Buffer.alloc(this.blockSize, 0);
    let y = Buffer.alloc(0);

    for (let i = 0; i < blockCount - 1; i++) {
      const from = i * this.blockSize;
      const block = message.slice(from, from + this.blockSize);
      y = BufferTools.xor(x, block);
      x = this.aes(y);
    }

    y = BufferTools.xor(x, this.getLastBlock(message));
    x = this.aes(y);

    return x;
  }

  private getBlockCount(message: Buffer): number {
    const blockCount = Math.ceil(message.length / this.blockSize);
    return blockCount === 0 ? 1 : blockCount;
  }

  private aes(message: Buffer): Buffer {
    const z = Buffer.alloc(this.blockSize, 0);
    const cipher = createCipheriv(this.algo, this.key, z);
    const result = cipher.update(message);
    cipher.final();
    return result;
  }

  private getLastBlock(message: Buffer): Buffer {
    const blockCount = this.getBlockCount(message);
    const paddedBlock = this.padding(message, blockCount - 1);

    let complete = false;
    if (message.length > 0) {
      complete = (message.length % this.blockSize) === 0;
    }

    const key = complete ? this.subkeys.key1 : this.subkeys.key2;
    return BufferTools.xor(paddedBlock, key);
  }

  private padding(message: Buffer, blockIndex: number): Buffer {
    const block = Buffer.alloc(this.blockSize, 0);

    const from = blockIndex * this.blockSize;
    const bytes = message.copy(block, 0, from);

    if (bytes !== this.blockSize) {
      block[bytes] = 0x80;
    }

    return block;
  }
}
