const mongoose = require("mongoose");

const userschema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    activity_order: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "activities",
      },
    ],
  },
  { timestamps: true, versionKey: false },
);

module.exports = mongoose.model("users", userschema);
