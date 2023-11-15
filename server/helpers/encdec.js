const CryptoJS = require("crypto-js");
const config = require("../config");

function decrypt(text) {
  const BufferKey = config.bufferKey;
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
    throw ex;
  }
}

function encrypt(text) {
  const key = config.bufferKey;
  const hexKey = CryptoJS.enc.Hex.parse(
    key.map((num) => num.toString(16).padStart(2, "0")).join("")
  );
  const iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");

  try {
    let encrypted = CryptoJS.AES.encrypt(text, hexKey, { iv: iv });
    encrypted = encrypted.toString();
    return encrypted;
  } catch (ex) {
    throw ex;
  }
}

module.exports = { decrypt, encrypt };
