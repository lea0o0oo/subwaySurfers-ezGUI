const express = require("express");
const router = express.Router();

router.use("/", require("./ping.js"));
router.use("/", require("./save.js"));
router.use("/", require("./fetch.js"));

router.use("/", require("./decrypt.js"));
router.use("/", require("./encrypt.js"));

module.exports = router;
