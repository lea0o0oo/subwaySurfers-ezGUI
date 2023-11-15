const express = require("express");
const router = express.Router();
const converter = require("../helpers/encdec");

router.post("/encrypt", async (req, res) => {
  if (!req.body.text) {
    res.status(422).json({
      success: false,
      error: "Missing body parameter 'text'",
    });
    return;
  }

  if (
    typeof req.body.text != "string" &&
    typeof req.body.text != "object" &&
    Array.isArray(req.body.text)
  ) {
    res.status(422).json({
      success: false,
      error: "Invalid body parameter type, expected 'string' or 'object'",
    });
    return;
  }

  if (typeof req.body.text === "object")
    req.body.text = JSON.stringify(req.body.text);

  try {
    res.status(200).json({
      success: true,
      result: converter.encrypt(req.body.text),
    });
  } catch (ex) {
    res.status(500).json({
      success: true,
      result: ex.message,
    });
  }
});

module.exports = router;
