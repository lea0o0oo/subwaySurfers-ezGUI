import CryptoJS from "crypto-js";

function decryptValue(text) {
  const BufferKey = [
    57, 114, 107, 120, 67, 80, 108, 106, 83, 77, 49, 71, 86, 81, 104, 87, 119,
    49, 114, 49, 114, 75, 79, 72, 71, 99, 99, 98, 50, 105, 74, 53,
  ];
  const hexKey = BufferKey.map((num) => num.toString(16).padStart(2, "0")).join(
    ""
  );

  const key = CryptoJS.enc.Hex.parse(hexKey);
  const iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");

  try {
    let decrypted = CryptoJS.AES.decrypt(text, key, { iv: iv });
    decrypted = decrypted.toString(CryptoJS.enc.Utf8);
    return decrypted;
  } catch (ex) {
    console.error(ex.message);
  }
}

function encryptValue(json) {
  if (typeof json == "object") json = JSON.stringify(json);

  const key = [
    57, 114, 107, 120, 67, 80, 108, 106, 83, 77, 49, 71, 86, 81, 104, 87, 119,
    49, 114, 49, 114, 75, 79, 72, 71, 99, 99, 98, 50, 105, 74, 53,
  ];
  const hexKey = CryptoJS.enc.Hex.parse(
    key.map((num) => num.toString(16).padStart(2, "0")).join("")
  );
  const iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");

  try {
    let encrypted = CryptoJS.AES.encrypt(json, hexKey, { iv: iv });
    encrypted = encrypted.toString();
    return encrypted;
  } catch (ex) {
    console.error(ex.message);
  }
}

export default { decryptValue, encryptValue };
