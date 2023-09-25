const express = require("express");
const router = express.Router();
const Codes = require("../schemas/codes");
const { generateCode } = require("../helpers/generateCode");
const config = require("../config");

router.get("/fetch/:code", async (req, res) => {
  try {
    const codeData = await Codes.findOne({ code: req.params.code });
    res.status(200).json({
      encrypted: codeData.encryptedData,
      decrypted: codeData.decryptedData,
      created: codeData.createdAt,
    });
  } catch (e) {
    res.status(404).json({
      error: "Code not found",
    });
  }
});

module.exports = router;
