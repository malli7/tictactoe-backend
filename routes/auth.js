const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const User = require("../models/User");
const JWT_SECRET = "passwordledu";
const fetchUser = require("../middleware/fetchUser");

//create user
router.post(
  "/createuser",
  [
    body("email", "enter a valid email").isEmail(),
    body("password", "enter a valid password").isLength({ min: 5 }),
    body("name", "enter a valid name").isLength({ min: 3 }),
    body("userName", "enter a valid name").isLength({ min: 3 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password, name, userName } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ errors: "account with this email already exists" });
    }
    user = await User.findOne({ userName });
    if (user) {
      return res.status(400).json({ errors: "username already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const secPas = await bcrypt.hash(password, salt);
    user = await User.create({
      name: name,
      email: email,
      password: secPas,
      userName: userName,
    });

    const data = {
      user: {
        id: user.id,
      },
    };
    const authtoken = jwt.sign(data, JWT_SECRET);
    res.json({ authtoken });
  }
);

//login user
router.post(
  "/login",
  [
    body("userName", "enter a valid user name").isLength({ min: 3 }),
    body("password", "enter a valid password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { userName, password } = req.body;
    let user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({ errors: "please enter valid credentials" });
    }
    const comparePasswords = await bcrypt.compare(password, user.password);
    if (!comparePasswords) {
      return res.status(400).json({ errors: "please enter valid credentials" });
    }
    const data = {
      user: {
        id: user.id,
      },
    };
    const authtoken = jwt.sign(data, JWT_SECRET);
    res.json({ authtoken });
  }
);

//get current user details from authtoken
router.get("/getuserdetails", fetchUser, async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId);
  res.json(user);
});


//get current user details from authtoken
router.post("/getuserdetailsid", async (req, res) => {
  const {userId} = req.body;
  const user = await User.findById(userId);
  res.json(user);
});


module.exports = router;
