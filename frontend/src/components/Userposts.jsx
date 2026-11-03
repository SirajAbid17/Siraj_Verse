import { useContext, useEffect, useState } from "react"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { Userdatacontext } from "../Context/UserContext"
import { AuthUserContext } from "../Context/Authcontext"
import axios from "axios"
import { FiThumbsUp, FiShare2 } from "react-icons/fi"
import { FaRegCommentDots, FaTimes } from "react-icons/fa"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useNavigate } from "react-router-dom"

export default function Userposts() {
  const { userdata, postdata, setpostdata } = useContext(Userdatacontext)
  const { serveruri } = useContext(AuthUserContext)
  const [userPosts, setUserPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedPosts, setExpandedPosts] = useState({})
  const [copiedPostId, setCopiedPostId] = useState(null)
  const [commentInputs, setCommentInputs] = useState({})
  const [activeCommentPost, setActiveCommentPost] = useState(null)
  const [expandedComments, setExpandedComments] = useState({})

  const navigate=useNavigate()
  const Homepage=()=>{
navigate('/')
  }

 
  useEffect(() => {
    if (userdata && postdata.length > 0) {
      const filteredPosts = postdata.filter((post) => post.author._id === userdata.user._id)
      const sortedPosts = filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setUserPosts(sortedPosts)
      setLoading(false)
    } else if (userdata) {
     
      fetchUserPosts()
    }
  }, [userdata, postdata])

 
  const fetchUserPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await axios.get(`${serveruri}/api/user/posts`, {
        withCredentials: true,
      })
      const sortedPosts = result.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setUserPosts(sortedPosts)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setError("Failed to load your posts. Please try again.")
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getTimeAgo = (dateString) => {
    const postDate = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now - postDate) / 1000)

    let interval = Math.floor(seconds / 31536000)
    if (interval >= 1) return `${interval} year${interval === 1 ? "" : "s"} ago`

    interval = Math.floor(seconds / 2592000)
    if (interval >= 1) return `${interval} month${interval === 1 ? "" : "s"} ago`

    interval = Math.floor(seconds / 86400)
    if (interval >= 1) return `${interval} day${interval === 1 ? "" : "s"} ago`

    interval = Math.floor(seconds / 3600)
    if (interval >= 1) return `${interval} hour${interval === 1 ? "" : "s"} ago`

    interval = Math.floor(seconds / 60)
    if (interval >= 1) return `${interval} minute${interval === 1 ? "" : "s"} ago`

    return `${Math.floor(seconds)} second${seconds === 1 ? "" : "s"} ago`
  }

  const toggleExpand = (postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }))
  }

  const handleShare = async (postId) => {
    try {
      const postUrl = `${window.location.origin}/post/${postId}`
      await navigator.clipboard.writeText(postUrl)
      setCopiedPostId(postId)
      toast.success("Link copied to clipboard!")
      setTimeout(() => setCopiedPostId(null), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
      toast.error("Failed to copy link")
    }
  }

  const handleLike = async (postId) => {
    try {
      const response = await axios.post(`${serveruri}/api/posts/${postId}/like`, {}, { withCredentials: true })

      setpostdata((prev) => prev.map((post) => (post._id === postId ? response.data : post)))

    
      setUserPosts((prev) => prev.map((post) => (post._id === postId ? response.data : post)))
    } catch (error) {
      console.error("Error liking post:", error)
      toast.error(error.response?.data?.message || "Failed to like post")
    }
  }

  const handleCommentSubmit = async (postId) => {
    const commentText = commentInputs[postId]?.trim()
    if (!commentText) return

    try {
      const response = await axios.post(
        `${serveruri}/api/posts/${postId}/comment`,
        { content: commentText },
        { withCredentials: true },
      )

      setpostdata((prev) =>
        prev.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              comments: response.data.comments || response.data,
            }
          }
          return post
        }),
      )

    
      setUserPosts((prev) =>
        prev.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              comments: response.data.comments || response.data,
            }
          }
          return post
        }),
      )

      setCommentInputs((prev) => ({ ...prev, [postId]: "" }))
      toast.success("Comment added successfully!")
    } catch (error) {
      console.error("Error adding comment:", error)
      toast.error(error.response?.data?.message || "Failed to add comment")
    }
  }

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await axios.delete(`${serveruri}/api/posts/${postId}/comment/${commentId}`, { withCredentials: true })

      setpostdata((prev) =>
        prev.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              comments: post.comments.filter((c) => c._id !== commentId),
            }
          }
          return post
        }),
      )

      
      setUserPosts((prev) =>
        prev.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              comments: post.comments.filter((c) => c._id !== commentId),
            }
          }
          return post
        }),
      )

      toast.success("Comment deleted successfully!")
    } catch (error) {
      console.error("Error deleting comment:", error)
      toast.error(error.response?.data?.message || "Failed to delete comment")
    }
  }

  const toggleCommentSection = (postId) => {
    setActiveCommentPost((prev) => (prev === postId ? null : postId))
  }

  const toggleExpandedComments = (postId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-16 pb-6">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600 text-sm">Loading your posts...</span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="pt-16 pb-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
         
          <div className="mb-6 mt-5">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">My Posts</h1>
            <p className="text-gray-600 text-sm">
              {userPosts.length} {userPosts.length === 1 ? "post" : "posts"} published
            </p>
          </div>

        
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-4 w-4 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-xs text-red-800">{error}</p>
                  <button onClick={fetchUserPosts} className="mt-1 text-xs text-red-600 hover:text-red-800 font-medium">
                    Try again
                  </button>
                </div>
              </div>
            </div>
          )}

         
          {!loading && !error && userPosts.length === 0 && (
            <div className="text-center py-8">
              <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No posts yet</h3>
              <p className="mt-1 text-xs text-gray-500">Get started by creating your first post.</p>
              <div className="mt-4">
  <button 
    className="inline-flex items-center px-4 py-2.5 border border-gray-800 shadow-sm text-sm font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50 hover:shadow-md   transition-all duration-200"
    onClick={Homepage}
  >
    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
    Create Post
  </button>
</div>
            </div>
          )}

        
          {userPosts.length > 0 && (
            <div className="space-y-3">
              {userPosts.map((post) => {
                const shouldShowSeeMore = post.description && post.description.split(" ").length > 30
                const isExpanded = expandedPosts[post._id]
                const isLiked = post.likes?.includes(userdata?.user?._id || userdata?._id)
                const showComments = activeCommentPost === post._id
                const showAllComments = expandedComments[post._id]

                return (
                  <div
                    key={post._id}
                    className="border border-gray-200 rounded-lg p-3 md:p-4 shadow-sm bg-white hover:shadow-md transition-shadow"
                  >
                  
                    <div className="flex items-start gap-2 mb-3">
                      <img
                        src={post.author.profileimg || "/default-profile.png"}
                        alt={`${post.author.firstname} ${post.author.lastname}`}
                        className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover border border-gray-200"
                        onError={(e) => {
                          e.target.src = "/default-profile.png"
                        }}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-0">
                          <div className="truncate">
                            <h3 className="font-medium text-gray-800 truncate text-sm">
                              {post.author.firstname} {post.author.lastname}
                            </h3>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-0">
                          <div className="truncate">
                            {post.author.headline && (
                              <p className="text-xs text-gray-500 truncate">{post.author.headline}</p>
                            )}
                          </div>
                          <div className="text-xs text-gray-400 whitespace-nowrap">
                            {post.createdAt && getTimeAgo(post.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>

                   
                    {post.headline && (
                      <h6 className="text-sm md:text-base font-semibold text-gray-800 mb-2">{post.headline}</h6>
                    )}

                    {post.description && (
                      <div className="mb-3">
                        <p className={`whitespace-pre-line text-gray-700 text-sm ${isExpanded ? "" : "line-clamp-3"}`}>
                          {post.description}
                        </p>
                        {shouldShowSeeMore && (
                          <button
                            onClick={() => toggleExpand(post._id)}
                            className="text-blue-500 hover:text-blue-700 text-xs mt-1 hover:underline focus:outline-none"
                          >
                            {isExpanded ? "Show less" : "Show more"}
                          </button>
                        )}
                      </div>
                    )}

                   
                    {post.media && (
                      <div className="mb-3 rounded-md overflow-hidden">
                        {post.mediaType === "image" ? (
                          <img
                            src={post.media || "/placeholder.svg"}
                            alt="Post content"
                            className="max-h-[250px] md:max-h-[350px] w-full object-contain rounded-md border border-gray-100"
                            onError={(e) => {
                              e.target.style.display = "none"
                            }}
                          />
                        ) : post.mediaType === "video" ? (
                          <video
                            controls
                            className="max-h-[250px] md:max-h-[350px] w-full rounded-md border border-gray-100"
                            onError={(e) => {
                              e.target.style.display = "none"
                            }}
                          >
                            <source src={post.media} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        ) : null}
                      </div>
                    )}

                   
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <svg className="w-3 h-3 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>{post.likes?.length || 0}</span>
                        </div>
                        <div className="flex items-center">
                          <svg
                            className="w-3 h-3 mr-1 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                          <span>{post.comments?.length || 0}</span>
                        </div>
                      </div>
                      {post.createdAt && <span className="text-xs text-gray-400">{formatDate(post.createdAt)}</span>}
                    </div>

                 
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <div className="flex gap-2 md:gap-3">
                        <button
                          onClick={() => handleLike(post._id)}
                          className={`flex items-center gap-1 transition-colors cursor-pointer ${
                            isLiked ? "text-blue-500" : "text-gray-500 hover:text-blue-500"
                          }`}
                        >
                          <FiThumbsUp size={14} />
                          <span className="text-xs">{post.likes?.length > 0 ? post.likes.length : ""} Like</span>
                        </button>
                        <button
                          onClick={() => toggleCommentSection(post._id)}
                          className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors cursor-pointer"
                        >
                          <FaRegCommentDots size={14} />
                          <span className="text-xs">
                            {post.comments?.length > 0 ? post.comments.length : ""} Comment
                          </span>
                        </button>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => handleShare(post._id)}
                          className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors"
                        >
                          <FiShare2 size={14} />
                          <span className="text-xs">Share</span>
                        </button>
                        {copiedPostId === post._id && (
                          <div className="absolute -top-8 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded flex items-center justify-center gap-1 animate-fade-in">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 text-green-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L10 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-xs">Copied!</span>
                          </div>
                        )}
                      </div>
                    </div>

               
                    {showComments && (
                      <div className="mt-2 pt-3 border-t border-gray-100">
                        <div className="flex gap-2 mb-2">
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              placeholder="Write a comment..."
                              value={commentInputs[post._id] || ""}
                              onChange={(e) =>
                                setCommentInputs((prev) => ({
                                  ...prev,
                                  [post._id]: e.target.value,
                                }))
                              }
                              onKeyPress={(e) => e.key === "Enter" && handleCommentSubmit(post._id)}
                              className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-full"
                            />
                            {commentInputs[post._id] && (
                              <button
                                onClick={() => handleCommentSubmit(post._id)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-black rounded-full px-2 py-[2px] flex justify-center items-center hover:text-black hover:bg-white border border-gray-700 text-xs"
                              >
                                Post
                              </button>
                            )}
                          </div>
                        </div>

                        {post.comments?.length > 0 && (
                          <div className="space-y-2">
                            {(showAllComments ? post.comments : post.comments.slice(0, 3)).map((comment) => (
                              <div key={comment._id} className="flex gap-2 group">
                                <img
                                  src={comment.user?.profileimg || "/default-profile.png"}
                                  alt={`${comment.user?.firstname} ${comment.user?.lastname}`}
                                  className="w-6 h-6 md:w-7 md:h-7 rounded-full object-cover flex-shrink-0"
                                  onError={(e) => {
                                    e.target.src = "/default-profile.png"
                                  }}
                                />
                                <div className="flex-1 min-w-0 border border-gray-200 bg-gray-50 rounded-lg p-2 relative">
                                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-0">
                                    <div className="flex-1 min-w-0">
                                      <span className="font-medium text-xs">
                                        {comment.user?.firstname} {comment.user?.lastname}
                                      </span>
                                      <p className="text-xs break-words whitespace-pre-wrap">{comment.content}</p>
                                    </div>
                                    <div className="text-xs text-gray-400 flex-shrink-0 self-start sm:self-auto">
                                      {getTimeAgo(comment.createdAt)}
                                    </div>
                                  </div>
                                  {(comment.user?._id === (userdata?.user?._id || userdata?._id) ||
                                    post.author._id === (userdata?.user?._id || userdata?._id)) && (
                                    <button
                                      onClick={() => handleDeleteComment(post._id, comment._id)}
                                      className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 bg-gray-200 rounded-full p-1 hover:bg-red-100 hover:text-red-500 transition-all"
                                      title="Delete comment"
                                    >
                                      <FaTimes size={8} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}

                            {post.comments.length > 3 && (
                              <button
                                className="text-xs text-blue-500 hover:text-blue-700 font-medium"
                                onClick={() => toggleExpandedComments(post._id)}
                              >
                                {showAllComments ? "Show fewer comments" : `View all ${post.comments.length} comments`}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
      <div className="mt-6">
        <Footer />
      </div>
    </div>
  )
}
