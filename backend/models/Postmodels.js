const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const postschema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  headline: {
    type: String
  },
  media: {
    type: String
  },
  mediaType: {
    type: String,
    enum: ['image', 'video', null],
    default: null
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  }],
  comments: [commentSchema]
}, {timestamps: true});

const Postmodel = mongoose.model('POSTS', postschema);
module.exports = Postmodel;