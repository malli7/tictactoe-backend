const mongoose = require("mongoose");
const { Schema } = mongoose;

const GameSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  opponent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  squares: [
    {
      type: String,
    },
  ],
  status: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("game", GameSchema);
