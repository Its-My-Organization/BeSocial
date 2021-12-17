const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

// CREATE A POST
router.post("/", async (req, res) => {
  try {
    console.log("unsaved post", req.body);
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    console.log("saved post", savedPost);
    return res.status(200).json(savedPost);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// UPDATE A POST
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json("Post not found");

    if (post.userId === req.body.userId) {
      const res = await post.updateOne({ $set: req.body });
      return res.status(200).json("The post has been updated");
    } else {
      return res.status(403).json("You can update only your posts");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

// DELETE A POST
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json("Post not found");

    if (post.userId === req.body.userId) {
      const res = await post.deleteOne();
      return res.status(200).json("The post has been deleted");
    } else {
      return res.status(403).json("You can delete only your posts");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

// LIKE / DISLIKE A POST
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // if (!post) return res.status(404).json("Post Not Found");

    if (!post.likes.includes(req.body.userId)) {
      // await post.updateOne({
      //   $push: {
      //     likes: req.body.userId,
      //   },
      // });
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { likes: req.body.userId } }
      );
      res.status(200).json("You liked the post");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("You disliked the post");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET A POST
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json("Post not found");

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// GET TIMELINE POSTS
router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: req.params.userId });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friend) => Post.find({ userId: friend }))
    );
    res.status(200).json(userPosts.concat(...friendPosts));
    // res.status(200).json(posts);
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(error);
  }
});

// GET user's all POSTS
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
