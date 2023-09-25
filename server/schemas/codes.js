const mongoose = require("mongoose");

const codeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    encryptedData: {
      type: String,
      required: true,
    },
    decryptedData: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: () => Date.now(),
      immutable: true,
    },
    disabled: {
      type: Boolean,
      required: true,
      default: () => false,
    },
  },
  { collection: "codes" }
);

module.exports = mongoose.model("Codes", codeSchema);
