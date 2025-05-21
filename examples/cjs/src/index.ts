import { AesCmac } from "aes-cmac";

(async () => {
  const cmac = await new AesCmac(Buffer.alloc(16));
  console.log(await cmac.calculate(Buffer.alloc(12, 0x2f)));
})();
