const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const { protectedRoute } = require("../utils/protectedRoute");

// Create
router.post("/create",async (req, res) => {
  try {
    const newPost = new Post({ ...req.body });
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(400).json("Error Create Post !!~");
  }
});

// Get (ID)
router.get("/get/:id", async (req, res) => {
  try {
    const findPost = await Post.findById(req.params.id);
    if (!findPost) return res.status(404).json({ error: "Post Not Found 😔" });
    res.status(200).json(findPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Get (ALL)
router.get("/all/get", async (req, res) => {
  try {
    const getAllPosts = await Post.find();
    res.status(200).json(getAllPosts);
  } catch (error) {
    res.status(400).json("Error Get Post !!~");
  }
});

// Delete
router.delete("/delete/:id",  async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post Deleted Successful 🥰" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//UPDATE POST
router.put("/update/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    await post.updateOne({ $set: req.body }, { new: true });
    res.status(200).json("Updated Post Success ☻♥");
  } catch (error) {
    res.status(400).json("Error Update Post !!~");
  }
});

// Create a new information post
router.post('/createInfoPost', async (req, res) => {
  try {
    const { title, content } = req.body;
    const currentPost = await Post.findOne({ isCurrent: true });
    if (currentPost) {
      currentPost.isCurrent = false;
      await currentPost.save();
    }
    const newPost = new Post({
      title,
      content,
      isInfo: true,
      isCurrent: true,
    });
    await newPost.save();
    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Could not create post" });
  }
});
// Get all posts
router.get('/getAllPosts', async (req, res) => {
  try {
    const posts = await Post.find({ isInfo: true });
    res.json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Could not fetch posts" });
  }
});
router.put('/updateIsCurrent/:id', async (req, res) => {
  try {
    const postId = req.params.id;

    // Find the post to update
    const postToUpdate = await Post.findById(postId);
    await postToUpdate.updateOne({ $set: req.body }, { new: true });
    res.status(200).json("Updated Post Success ☻♥");

    if (!postToUpdate) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the post is already current
    if (postToUpdate.isCurrent) {
      return res.status(400).json({ error: "Post is already set as current" });
    }

    // Find the current post and update it to set isCurrent to false
    const currentPost = await Post.findOne({ isCurrent: true });
    if (currentPost) {
      currentPost.isCurrent = false;
      await currentPost.save();
    }

    // Update the target post to set isCurrent to true
    postToUpdate.isCurrent = true;
    await postToUpdate.save();
    res.status(200).json({ message: "Post updated successfully", post: postToUpdate });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Could not update post" });
  }
})




module.exports = router;
