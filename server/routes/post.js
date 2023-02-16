const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const Post = require("../models/Post");

/*
    post api/posts
    create a new post
    private methods
*/
router.post("/", verifyToken, async (req, res) => {
  const { title, description, url, status } = req.body;
  if (!title) {
    return res
      .status(400)
      .json({ success: false, message: "title is required" });
  }

  try {
    const newPost = new Post({
      title,
      description,
      url: url.startsWith("https://") ? url : `https://${url}`,
      status: status || "TO LEARN",
      user: req.userId,
    });

    await newPost.save();
    res.json({ success: true, message: "Happy learning!", post: newPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Error" });
  }
});

/*
    get api/posts
    get all posts
    private methods
*/
router.get("/", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.userId }).populate("user", [
      "username",
    ]);
    res.json({ success: true, posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Error" });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  const { title, description, url, status } = req.body;
  if (!title) {
    return res
      .status(400)
      .json({ success: false, message: "title is required" });
  }

  try {
    let updatePost = {
      title,
      description: description || "",
      url: (url.startsWith("https://") ? url : `https://${url}`) || "",
      status: status || "TO LEARN",
      user: req.userId,
    };

    const condition = { _id: req.params.id, user: req.userId };
    updatePost = await Post.findOneAndUpdate(condition, updatePost, {
      new: true,
    });

    if (!updatePost) {
      return res.status(401).json({
        success: false,
        message: "Post not found or user not authorized",
      });
    }

    res.json({
      success: true,
      message: "Update successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Error" });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const condition = { _id: req.params.id, user: req.userId };
    const deletePost = await Post.findOneAndDelete(condition);

    if (!deletePost) {
      return res.status(401).json({
        success: false,
        message: "Post not found or user not authorized",
      });
    }

    res.json({
      success: true,
      message: "Delete successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Error" });
  }
});

module.exports = router;
