const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const User = require("../models/User");
const Game = require("../models/Game");
const JWT_SECRET = "passwordledu";
const fetchUser = require("../middleware/fetchUser");

//start a new game
router.post(
  "/newgame",
  [body("email", "enter a valid email").isEmail()],
  fetchUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email } = req.body;
    const userId = req.user.id;
    let currentUser = await User.findById(userId);
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: "no user with this email found" });
    }
    let id = user._id;
    if (id === userId) {
      return res.status(400).json({ errors: "you cannot play with yourself" });
    }
    let game = await Game.create({
      user: currentUser,
      opponent: user,
      squares: Array(9).fill(null),
      status: "X",
    });

    let games = currentUser.games;
    games.push(game)
    let newUser = {};
    newUser.games = games;
    currentUser = await User.findByIdAndUpdate(userId, { $set: newUser }, { new: true });

    games = user.games;
    games.push(game)
    newUser = {};
    newUser.games = games;
    user = await User.findByIdAndUpdate(id, { $set: newUser }, { new: true });


    res.json(game);
  }
);

//get game details
router.post('/getgamedetails', async (req, res) => {
  const { id } = req.body;
  const game = await Game.findById(id);
  res.json(game)
})


//update game details
router.put('/updategame', async (req, res) => {
  const { id,status, squares } = req.body;
    let game = await Game.findById(id);
    const newGame = {};
  if (status) { newGame.status = status }
  if(squares){newGame.squares = squares}
    game = await Game.findByIdAndUpdate(id, { $set: newGame }, { new: true });
    res.json(game);
})

module.exports = router;
