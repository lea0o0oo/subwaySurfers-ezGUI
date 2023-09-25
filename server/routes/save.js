const express = require("express");
const router = express.Router();
const Codes = require("../schemas/codes");
const { generateCode } = require("../helpers/generateCode");
const config = require("../config");

router.post("/save", async (req, res) => {
  if (req.body && req.body.encrypted) {
    const generatedCode = generateCode(config.codes["length"]);
    try {
      await Codes.create({
        code: generatedCode,
        encryptedData: req.body.encrypted,
      });
      res.status(201).json({
        code: generatedCode,
      });
    } catch (e) {
      res.status(500).json({
        error: "Internal server error",
      });
    }
  } else {
    res.status(422).json({
      error: "Missing body parameters (missing 'encrypted' parameter)",
    });
  }
});

module.exports = router;
