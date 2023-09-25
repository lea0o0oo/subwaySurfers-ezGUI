const express = require("express");
const router = express.Router();

router.get("/ping", (req, res) => {
  res.send("helo pnig");
});

module.exports = router;
