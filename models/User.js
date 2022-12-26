const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  games: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "game",
    },
  ],
});

const User = mongoose.model("user", UserSchema);
module.exports = User;
