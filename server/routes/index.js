const express = require("express");
const router = express.Router();

router.use("/", require("./ping.js"));
router.use("/", require("./save.js"));
router.use("/", require("./fetch.js"));

module.exports = router;
