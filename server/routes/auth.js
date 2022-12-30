
const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

router.get("/", (req, res) => res.send("test auth routes"));
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

    const hashPassword = await argon2.hash(password)
    const newUser = new User({
        username,
        password: hashPassword
    })
    await newUser.save()

    const accessToken = jwt.sign({userId: newUser._id},process.env.access_token_secret)
    res.json({ success: true, message: "register successfully", accessToken})

  } catch (error) {}
});

module.exports = router;
