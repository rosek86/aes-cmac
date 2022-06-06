import assert from 'assert';
import { BufferTools } from '../lib/BufferTools';

describe('buffer-tools', () => {
  describe('bitShiftLeft', () => {
    function testBitShiftLeft(input: string): string {
      return Buffer.from(
        BufferTools.bitShiftLeft(Buffer.from(input, 'hex'))
      ).toString('hex');
    }

    it('returns a buffer bitshifted left 1 bit (buffer_value << 1)', () => {
      assert.strictEqual(testBitShiftLeft('01'), '02');
      assert.strictEqual(testBitShiftLeft('02'), '04');
      assert.strictEqual(testBitShiftLeft('04'), '08');
      assert.strictEqual(testBitShiftLeft('08'), '10');
      assert.strictEqual(testBitShiftLeft('10'), '20');
      assert.strictEqual(testBitShiftLeft('20'), '40');
      assert.strictEqual(testBitShiftLeft('40'), '80');
      assert.strictEqual(testBitShiftLeft('80'), '00');
      assert.strictEqual(testBitShiftLeft('55cc33'), 'ab9866');
    });
  });

  describe('xor', () => {
    function testXor(a: string, b: string): string {
      return Buffer.from(
        BufferTools.xor(
          Buffer.from(a, 'hex'), Buffer.from(b, 'hex')
        )
      ).toString('hex');
    };

    it('returns the logical XOR of two buffers', () => {
      assert.strictEqual(testXor('5a', 'a5'), 'ff');
      assert.strictEqual(testXor('5a', '5a'), '00');
      assert.strictEqual(testXor('5a', 'ff'), 'a5');
      assert.strictEqual(testXor('5a', '00'), '5a');
      assert.strictEqual(testXor('5a', 'c3'), '99');
      assert.strictEqual(testXor('5a', '99'), 'c3');
      assert.strictEqual(testXor('abcd', '0123'), 'aaee');
      assert.strictEqual(testXor('123456', '789abc'), '6aaeea');
    });
  });

  describe('toBinaryString', () => {
    function testToBinaryString(input: string): string {
      return BufferTools.toBinaryString(Buffer.from(input, 'hex'));
    }

    it('returns the binary string representation of a buffer', () => {
      assert.strictEqual(testToBinaryString('0f'), '00001111');
      assert.strictEqual(testToBinaryString('5ac3'), '0101101011000011');
      assert.strictEqual(testToBinaryString('deadbeef'), '11011110101011011011111011101111');
    });
  });
});