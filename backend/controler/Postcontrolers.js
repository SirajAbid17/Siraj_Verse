const Postmodel = require("../models/Postmodels");

const createpost = async (req, res) => {
  try {
    const { description } = req.body;
    
    
    if (!description && !req.file) {
      return res.status(400).json({ message: "Post content or media is required" });
    }

    
    let mediaType = null;
    if (req.file) {
      mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
    }

    const newpost = await Postmodel.create({
      author: req.user.id,
      description,
      media: req.file ? req.file.path : null,  
      mediaType: mediaType
    });

    return res.status(201).json(newpost);
  } catch (error) {
    console.error("Post creation error:", error);
    return res.status(500).json({ message: "Error creating post", error: error.message });
  }
};



const likePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;

   
    const post = await Postmodel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyLiked = post.likes.includes(userId);
    
    let updatedPost;
    if (alreadyLiked) {
      updatedPost = await Postmodel.findByIdAndUpdate(
        postId,
        { $pull: { likes: userId } },
        { new: true }
      );
    } else {
      updatedPost = await Postmodel.findByIdAndUpdate(
        postId,
        { $addToSet: { likes: userId } },
        { new: true }
      );
    }

    
    const populatedPost = await Postmodel.populate(updatedPost, {
      path: 'author',
      select: 'firstname lastname profileimg headline location'
    });

    res.status(200).json(populatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const addComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({ message: "Comment content is required" });
    }

    const post = await Postmodel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = {
      content,
      user: userId
    };

    post.comments.push(newComment);
    await post.save();

   
    const populatedPost = await Postmodel.findById(postId)
      .populate("comments.user", "firstname lastname profileimg");

    res.status(201).json(populatedPost.comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
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

    const commentIndex = post.comments.findIndex(
      comment => comment._id.toString() === commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }

  
    const comment = post.comments[commentIndex];
    if (comment.user.toString() !== userId.toString() && post.author.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    post.comments.splice(commentIndex, 1);
    await post.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const userPosts = await Postmodel.find({ author: userId })
      .populate("author", "firstname lastname username profileimg headline location")
      .sort({ createdAt: -1 });
    
    return res.status(200).json(userPosts);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error fetching user posts" });
  }
};

module.exports = {
  likePost,
  addComment,
  deleteComment
};

module.exports = {
  createpost,
  likePost,
  addComment,
  deleteComment,
  getUserPosts
};