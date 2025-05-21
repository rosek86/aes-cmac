import type { webcrypto } from "node:crypto";
import { BufferTools } from "./BufferTools";

export class AesCmac {
  private readonly blockSize = 16;
  private readonly supportedLengths = [16, 24, 32];

  private subkeys?: { key1: Uint8Array; key2: Uint8Array };
  private key: webcrypto.CryptoKey | PromiseLike<webcrypto.CryptoKey>;

  public constructor(key: Uint8Array) {
    if (key instanceof Uint8Array === false) {
      throw new Error("The key must be provided as a Uint8Array.");
    }

    if (this.supportedLengths.includes(key.length) === false) {
      throw new Error("Key size must be 128, 192, or 256 bits.");
    }

    // note that this is a Promise<CryptoKey> at this point, which we await in aes()
    this.key = crypto.subtle.importKey("raw", key, "AES-CBC", false, ["encrypt"]);
  }

  private async generateSubkeys(): Promise<{
    key1: Uint8Array;
    key2: Uint8Array;
  }> {
    const rb = Uint8Array.from([
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x87,
    ]);

    const z = new Uint8Array(this.blockSize);
    const l = await this.aes(z);

    let key1 = BufferTools.bitShiftLeft(l);
    if (l[0]! & 0x80) {
      key1 = BufferTools.xor(key1, rb);
    }

    let key2 = BufferTools.bitShiftLeft(key1);
    if (key1[0]! & 0x80) {
      key2 = BufferTools.xor(key2, rb);
    }

    return { key1, key2 };
  }

  public async getSubKeys(): Promise<{ key1: Uint8Array; key2: Uint8Array }> {
    // subkeys are generated lazily because we cannot await in a constructor
    if (!this.subkeys) {
      this.subkeys = await this.generateSubkeys();
    }

    const key1 = new Uint8Array(this.blockSize);
    key1.set(this.subkeys.key1);

    const key2 = new Uint8Array(this.blockSize);
    key2.set(this.subkeys.key2);

    return { key1, key2 };
  }

  public async calculate(message: Uint8Array): Promise<Uint8Array> {
    if (message instanceof Uint8Array === false) {
      throw new Error("The message must be provided as a Uint8Array.");
    }

    const blockCount = this.getBlockCount(message);

    let x = new Uint8Array(this.blockSize);
    let y = new Uint8Array(0);

    for (let i = 0; i < blockCount - 1; i++) {
      const from = i * this.blockSize;
      const block = message.slice(from, from + this.blockSize);
      y = BufferTools.xor(x, block);
      x = await this.aes(y);
    }

    y = BufferTools.xor(x, await this.getLastBlock(message));
    x = await this.aes(y);

    return x;
  }

  private getBlockCount(message: Uint8Array): number {
    const blockCount = Math.ceil(message.length / this.blockSize);
    return blockCount === 0 ? 1 : blockCount;
  }

  private async aes(message: Uint8Array): Promise<Uint8Array<ArrayBuffer>> {
    const iv = new Uint8Array(this.blockSize);

    /// because constructors cannot be async, we await the key import here
    if ("then" in this.key) {
      this.key = await this.key;
    }

    const aesCiphertext = (await crypto.subtle.encrypt(
      { name: "AES-CBC", iv },
      this.key,
      message,
    )) as ArrayBuffer;

    return new Uint8Array(aesCiphertext.slice(0, 16));
  }

  private async getLastBlock(message: Uint8Array): Promise<Uint8Array> {
    if (!this.subkeys) {
      this.subkeys = await this.generateSubkeys();
    }

    const blockCount = this.getBlockCount(message);
    const paddedBlock = this.padding(message, blockCount - 1);

    let complete = false;
    if (message.length > 0) {
      complete = message.length % this.blockSize === 0;
    }

    const key = complete ? this.subkeys.key1 : this.subkeys.key2;
    return BufferTools.xor(paddedBlock, key);
  }

  private padding(message: Uint8Array, blockIndex: number): Uint8Array {
    const block = new Uint8Array(this.blockSize);

    const from = blockIndex * this.blockSize;

    const slice = message.slice(from, from + this.blockSize);
    block.set(slice);

    if (slice.length !== this.blockSize) {
      block[slice.length] = 0x80;
    }

    return block;
  }
}
