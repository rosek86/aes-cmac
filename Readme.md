# AES-CMAC

AES CMAC implementation in typescript.

## Install

```
npm i aes-cmac
```

## Examples

### NodeJS (CommonJS)

```js
const AesCmac = require('aes-cmac').AesCmac;

const key = Buffer.from('2b7e151628aed2a6abf7158809cf4f3c', 'hex');
const msg = Buffer.from('6bc1bee22e409f96e93d7e117393172a', 'hex');

const aesCmac = new AesCmac(key);
console.log(aesCmac.calculate(msg).toString('hex'));
```

### NodeJS (ECMAScript modules)

```js
import { AesCmac } from 'aes-cmac';

const key = Buffer.from('2b7e151628aed2a6abf7158809cf4f3c', 'hex');
const msg = Buffer.from('6bc1bee22e409f96e93d7e117393172a', 'hex');

const aesCmac = new AesCmac(key);
console.log(aesCmac.calculate(msg).toString('hex'));
```

## References

- https://github.com/allan-stewart/node-aes-cmac
- https://tools.ietf.org/html/rfc4493
  