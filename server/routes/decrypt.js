const express = require("express");
const router = express.Router();
const converter = require("../helpers/encdec");

router.post("/decrypt", async (req, res) => {
  if (!req.body.text) {
    res.status(422).json({
      success: false,
      error: "Missing body parameter 'text'",
    });
    return;
  }
  try {
    let finalResult = converter.decrypt(req.body.text);
    if (req.body.parsed) finalResult = JSON.parse(finalResult);
    res.status(200).json({
      success: true,
      result: finalResult,
    });
  } catch (ex) {
    res.status(500).json({
      success: true,
      result: ex.message,
    });
  }
});

module.exports = router;
