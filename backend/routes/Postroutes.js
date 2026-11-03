const express = require("express")
const isauthuser = require("../middleware/isauth")
const { createpost, getUserPosts } = require("../controler/Postcontrolers")
const { likePost, addComment, deleteComment } = require("../controler/Postcontrolers")
const upload = require("../middleware/fileuploadmulter")
const { Getposts } = require("../controler/Getpost")
const postroutes = express.Router()


postroutes.post('/create', isauthuser, upload.single("image"), createpost)
postroutes.get('/posts', isauthuser, Getposts)
postroutes.post('/posts/:postId/like', isauthuser, likePost)
postroutes.post('/posts/:postId/comment', isauthuser, addComment)
postroutes.delete('/posts/:postId/comment/:commentId', isauthuser, deleteComment)
postroutes.get('/user/posts', isauthuser,getUserPosts);

module.exports = postroutes