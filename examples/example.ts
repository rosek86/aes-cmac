import { AesCmac } from "../src/AesCmac";

(async () => {
  const key = Buffer.from("2b7e151628aed2a6abf7158809cf4f3c", "hex");
  const msg = Buffer.from("6bc1bee22e409f96e93d7e117393172a", "hex");

  const aesCmac = new AesCmac(key);
  const result = Buffer.from(await aesCmac.calculate(msg));

  console.log(result.toString("hex"));
})();
