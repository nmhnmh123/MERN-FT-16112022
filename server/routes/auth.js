const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/auth");

const User = require("../models/User");

/*
    get api/auth
    check if user logged in
    public 
*/
router.get("/",verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password')
    if(!user) {
      return res.status(400).json({success: false, message: 'user not found'});
    }
    res.json({success: true, user});
  } catch (error) {
    console.log(error);
    res.status(500).json({success: false, message:'Internal server error'});
  }
});

/*
    post api/auth/register
    register new user
    public 
*/
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(404)
      .json({ success: false, message: "missing username or/and password" });
  }
  try {
    const user = await User.findOne({ username });
    if (user) {
      return res
        .status(404)
        .json({ success: false, message: "username has been registered" });
    }

    const hashPassword = await argon2.hash(password);
    const newUser = new User({
      username,
      password: hashPassword,
    });
    await newUser.save();

    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.access_token_secret
    );
    res.json({ success: true, message: "register successfully", accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Error" });
  }
});

/*
    post api/auth/login
    login user
    public 
*/
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(404)
      .json({ success: false, message: "missing username or/and password" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect Username or Password" });
    }

    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect Username or Password" });
    } else {
      const accessToken = jwt.sign(
        { userId: user._id },
        process.env.access_token_secret
      );
      res.json({ success: true, message: "Login successfully", accessToken });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Error" });
  }
});

module.exports = router;
