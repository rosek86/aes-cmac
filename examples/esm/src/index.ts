import { AesCmac } from "aes-cmac";

const cmac = new AesCmac(Buffer.alloc(16));
console.log(await cmac.calculate(Buffer.alloc(12, 0x2f)));
