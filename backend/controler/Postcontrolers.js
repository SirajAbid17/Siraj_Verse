
const Postmodel = require("../models/Postmodels");

const createpost = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description?.trim() && !req.file) {
      return res.status(400).json({
        success: false,
        message: "Post content or media is required",
      });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    const mediaType = req.file
      ? req.file.mimetype.startsWith("video")
        ? "video"
        : "image"
      : null;

    const newpost = await Postmodel.create({
      author: req.user.id,
      description: description || "",
      media: req.file ? req.file.path : null,
      mediaType,
    });

    const populatedPost = await Postmodel.findById(newpost._id)
      .populate(
        "author",
        "firstname lastname username profileimg headline location"
      );

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: populatedPost,
    });

  } catch (error) {
    console.error("Post creation error:", error);

    return res.status(500).json({
      success: false,
      message: "Error creating post",
      error: error.message,
    });
  }
};

const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Postmodel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId.toString()
    );

    const updatedPost = await Postmodel.findByIdAndUpdate(
      postId,
      alreadyLiked
        ? { $pull: { likes: userId } }
        : { $addToSet: { likes: userId } },
      { new: true }
    ).populate(
      "author",
      "firstname lastname profileimg headline location"
    );

    return res.status(200).json(updatedPost);

  } catch (error) {
    console.error("Like post error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content?.trim()) {
      return res.status(400).json({
        message: "Comment content is required",
      });
    }

    const post = await Postmodel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      content: content.trim(),
      user: userId,
    });

    await post.save();

    const populatedPost = await Postmodel.findById(postId)
      .populate("comments.user", "firstname lastname profileimg");

    return res.status(201).json(populatedPost.comments);

  } catch (error) {
    console.error("Add comment error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.id;

    const post = await Postmodel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (
      comment.user.toString() !== userId.toString() &&
      post.author.toString() !== userId.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized to delete this comment",
      });
    }

    comment.deleteOne();
    await post.save();

    return res.status(200).json({
      message: "Comment deleted successfully",
    });

  } catch (error) {
    console.error("Delete comment error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const userPosts = await Postmodel.find({
      author: req.user.id,
    })
      .populate(
        "author",
        "firstname lastname username profileimg headline location"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json(userPosts);

  } catch (error) {
    console.error("Get user posts error:", error);
    return res.status(500).json({
      message: "Error fetching user posts",
      error: error.message,
    });
  }
};

module.exports = {
  createpost,
  likePost,
  addComment,
  deleteComment,
  getUserPosts,
};
