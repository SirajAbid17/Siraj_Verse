import React, { useContext, useState, useEffect, useCallback } from "react";
import { Userdatacontext } from "../Context/UserContext";
import { FiThumbsUp, FiShare2, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaRegCommentDots, FaTimes } from "react-icons/fa";
import { AuthUserContext } from "../Context/Authcontext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const getTimeAgo = (dateString) => {
  const postDate = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - postDate) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `${interval} year${interval === 1 ? "" : "s"} ago`;

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `${interval} month${interval === 1 ? "" : "s"} ago`;

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `${interval} day${interval === 1 ? "" : "s"} ago`;

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `${interval} hour${interval === 1 ? "" : "s"} ago`;

  interval = Math.floor(seconds / 60);
  if (interval >= 1)
    return `${interval} minute${interval === 1 ? "" : "s"} ago`;

  return `${Math.floor(seconds)} second${seconds === 1 ? "" : "s"} ago`;
};

export default function PostComponent({ searchQuery = "", onClearSearch }) {
  const { postdata, setpostdata, userdata } = useContext(Userdatacontext);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [copiedPostId, setCopiedPostId] = useState(null);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const { serveruri } = useContext(AuthUserContext);
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [commentErrors, setCommentErrors] = useState({});
  const [hoveredPost, setHoveredPost] = useState(null);
  

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 15;


  const filterPosts = useCallback((posts, query) => {
    if (!posts || !Array.isArray(posts)) return [];
    
    let filtered = [...posts];

    if (query.trim()) {
      const lowerCaseQuery = query.toLowerCase();
      filtered = posts.filter((post) => {
        const descMatch =
          post.description &&
          post.description.toLowerCase().includes(lowerCaseQuery);

        const authorMatch =
          post.author &&
          `${post.author.firstname} ${post.author.lastname}`
            .toLowerCase()
            .includes(lowerCaseQuery);

        const headlineMatch =
          post.author &&
          post.author.headline &&
          post.author.headline.toLowerCase().includes(lowerCaseQuery);

        const postHeadlineMatch =
          post.headline &&
          post.headline.toLowerCase().includes(lowerCaseQuery);

        return descMatch || authorMatch || headlineMatch || postHeadlineMatch;
      });
    }

    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, []);


  useEffect(() => {
    if (postdata && Array.isArray(postdata)) {
      const filtered = filterPosts(postdata, searchQuery);
      setFilteredPosts(filtered);
      
     
      if (searchQuery.trim()) {
        setCurrentPage(1);
      }
    }
  }, [postdata, searchQuery, filterPosts]);


  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const handleImageError = (imageId, type) => {
    if (type === "comment") {
      setCommentErrors((prev) => ({
        ...prev,
        [imageId]: true,
      }));
    } else {
      setImageErrors((prev) => ({
        ...prev,
        [`${imageId}_${type}`]: true,
      }));
    }
  };

  const getImageSrc = (imageUrl, imageId, type) => {
    if (type === "comment") {
      if (commentErrors[imageId] || !imageUrl) {
        return "/default-profile.png";
      }
    } else {
      if (imageErrors[`${imageId}_${type}`] || !imageUrl) {
        return "/default-profile.png";
      }
    }
    return imageUrl;
  };

  const toggleExpand = (postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleShare = async (postId) => {
    try {
      const postUrl = `${window.location.origin}/post/${postId}`;
      await navigator.clipboard.writeText(postUrl);
      setCopiedPostId(postId);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopiedPostId(null), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy link");
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await axios.post(
        `${serveruri}/api/posts/${postId}/like`,
        {},
        { withCredentials: true }
      );

     
      setpostdata((prev) => {
        if (!Array.isArray(prev)) return prev;
        
        return prev.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              likes: response.data.likes || response.data
            };
          }
          return post;
        });
      });
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error(error.response?.data?.message || "Failed to like post");
    }
  };

  const handleCommentSubmit = async (postId) => {
    const commentText = commentInputs[postId]?.trim();
    if (!commentText) return;

    try {
      const response = await axios.post(
        `${serveruri}/api/posts/${postId}/comment`,
        { content: commentText },
        { withCredentials: true }
      );

     
      setpostdata((prev) => {
        if (!Array.isArray(prev)) return prev;
        
        return prev.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              comments: response.data.comments || response.data
            };
          }
          return post;
        });
      });

      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      toast.success("Comment added successfully!");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error(error.response?.data?.message || "Failed to add comment");
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await axios.delete(
        `${serveruri}/api/posts/${postId}/comment/${commentId}`,
        { withCredentials: true }
      );

   
      setpostdata((prev) => {
        if (!Array.isArray(prev)) return prev;
        
        return prev.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              comments: post.comments.filter((c) => c._id !== commentId)
            };
          }
          return post;
        });
      });
      
      toast.success("Comment deleted successfully!");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error(error.response?.data?.message || "Failed to delete comment");
    }
  };

  const toggleCommentSection = (postId) => {
    setActiveCommentPost((prev) => (prev === postId ? null : postId));
  };

  const toggleExpandedComments = (postId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };


  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!postdata || !Array.isArray(postdata)) {
    return (
      <div className="p-4">
        <p className="text-gray-500">Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="mt-4 mb-8">
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
      
      <div className="space-y-5">
        {currentPosts.length > 0 ? (
          <>
            {currentPosts.map((post) => {
              const shouldShowSeeMore =
                post.description && post.description.split(" ").length > 30;
              const isExpanded = expandedPosts[post._id];
              const isLiked = post.likes?.includes(userdata?._id);
              const showComments = activeCommentPost === post._id;
              const showAllComments = expandedComments[post._id];
              const isHovered = hoveredPost === post._id;

              return (
                <div
                  key={post._id}
                  className="border border-gray-200 rounded-lg p-4 md:p-5 shadow-sm bg-white hover:shadow-md transition-shadow"
                  onMouseEnter={() => setHoveredPost(post._id)}
                  onMouseLeave={() => setHoveredPost(null)}
                >
                 
                  <div className="flex items-start gap-3 mb-4">
                    <img
                      src={getImageSrc(
                        post.author.profileimg,
                        post.author._id,
                        "profile"
                      )}
                      alt={`${post.author.firstname} ${post.author.lastname}`}
                      className="w-10 h-10 md:w-11 md:h-11 rounded-full object-cover border border-gray-200"
                      onError={() => handleImageError(post.author._id, "profile")}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-0">
                        <div className="truncate">
                          <h3 className="font-medium text-gray-800 truncate text-sm md:text-base">
                            {post.author.firstname} {post.author.lastname}
                          </h3>
                        </div>
                         <div className="text-gray-500 mt-1 text-xs whitespace-nowrap">
                           {post.author.location}
                        </div> 
                      </div>

                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-0">
                        <div className="truncate">
                          {post.author.headline && (
                            <p className="text-xs w-[400px] md:text-sm text-gray-500 truncate">
                              {post.author.headline}
                            </p>
                          )}
                        </div>
                        <div className="text-xs  text-gray-400 whitespace-nowrap">
                          {post.createdAt && getTimeAgo(post.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>

           
                  {post.headline && (
                    <h6 className="text-base md:text-lg font-semibold text-gray-800 mb-3">
                      {post.headline}
                    </h6>
                  )}

                  {post.description && (
                    <div className="mb-4">
                      <p
                        className={`whitespace-pre-line text-gray-700 text-sm md:text-base ${
                          isExpanded ? "" : "line-clamp-3"
                        }`}
                      >
                        {post.description}
                      </p>
                      {shouldShowSeeMore && (
                        <button
                          onClick={() => toggleExpand(post._id)}
                          className="text-blue-500 hover:text-blue-700 text-xs md:text-sm mt-1 hover:underline focus:outline-none"
                        >
                          {isExpanded ? "Show less" : "Show more"}
                        </button>
                      )}
                    </div>
                  )}

               
                  {post.media && (
                    <div className="mb-4 rounded-md overflow-hidden">
                      {post.mediaType === "image" ? (
                        <img
                          src={post.media}
                          alt="Post content"
                          className="max-h-[300px] md:max-h-[500px] w-full object-contain rounded-md border border-gray-100"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : post.mediaType === "video" ? (
                        <video
                          controls
                          className="max-h-[300px] md:max-h-[500px] w-full rounded-md border border-gray-100"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        >
                          <source src={post.media} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : null}
                    </div>
                  )}

                
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div className="flex gap-3 md:gap-4">
                      <button
                        onClick={() => handleLike(post._id)}
                        className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                          isLiked
                            ? "text-blue-500"
                            : "text-gray-500 hover:text-blue-500"
                        }`}
                      >
                        <FiThumbsUp size={16} className="md:w-[18px]" />
                        <span className="text-xs md:text-sm">
                          {(isHovered || post.likes?.length > 0) && post.likes?.length > 0 
                            ? `${post.likes.length} ` 
                            : ""
                          }Like
                        </span>
                      </button>
                      <button
                        onClick={() => toggleCommentSection(post._id)}
                        className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition-colors cursor-pointer"
                      >
                        <FaRegCommentDots size={18} className="md:w-[17px] mt-1" />
                        <span className="text-xs md:text-sm">
                          {(isHovered || post.comments?.length > 0) && post.comments?.length > 0 
                            ? `${post.comments.length} ` 
                            : ""
                          }Comment
                        </span>
                      </button>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => handleShare(post._id)}
                        className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition-colors"
                      >
                        <FiShare2 size={16} className="md:w-[18px]" />
                        <span className="text-xs md:text-sm">Share</span>
                      </button>
                      {copiedPostId === post._id && (
                        <div className="absolute -top-9 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded flex items-center justify-center gap-1 animate-fade-in">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-green-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-xs">Copied!</span>
                        </div>
                      )}
                    </div>
                  </div>

                 
                  {showComments && (
                    <div className="mt-3 pt-4 border-t border-gray-100">
                      <div className="flex gap-2 mb-3">
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
                            onKeyPress={(e) =>
                              e.key === "Enter" && handleCommentSubmit(post._id)
                            }
                            className="w-full px-3 py-2 text-xs md:text-sm border border-gray-200 rounded-full"
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
                        <div className="space-y-3">
                          {(showAllComments ? post.comments : post.comments.slice(0, 3)).map((comment) => (
                            <div key={comment._id} className="flex gap-2 group">
                              <img
                                src={getImageSrc(
                                  comment.user?.profileimg || comment.user.profileimg || './down.jpeg' ,
                                  comment.user?._id,
                                  "comment"
                                )}
                                alt={`${comment.user?.firstname} ${comment.user?.lastname}`}
                                className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover flex-shrink-0"
                                onError={() =>
                                  handleImageError(comment.user?._id, "comment")
                                }
                              />
                              <div className="flex-1 min-w-0 border border-gray-200 bg-gray-50 rounded-lg p-2 relative">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-0">
                                  <div className="flex-1 min-w-0">
                                    <span className="font-medium text-xs md:text-sm">
                                      {comment.user?.firstname}{" "}
                                      {comment.user?.lastname}
                                    </span>
                                    <p className="text-xs md:text-sm break-words whitespace-pre-wrap">
                                      {comment.content}
                                    </p>
                                  </div>
                                  <div className="text-xs text-gray-400 flex-shrink-0 self-start sm:self-auto">
                                    {getTimeAgo(comment.createdAt)}
                                  </div>
                                </div>
                                {(comment.user?._id === userdata?._id ||
                                  post.author._id === userdata?._id) && (
                                  <button
                                    onClick={() =>
                                      handleDeleteComment(post._id, comment._id)
                                    }
                                    className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 bg-gray-200 rounded-full p-1 hover:bg-red-100 hover:text-red-500 transition-all"
                                    title="Delete comment"
                                  >
                                    <FaTimes size={10} />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}

                          {post.comments.length > 3 && (
                            <button
                              className="text-xs md:text-sm text-blue-500 hover:text-blue-700 font-medium"
                              onClick={() => toggleExpandedComments(post._id)}
                            >
                              {showAllComments 
                                ? "Show fewer comments" 
                                : `View all ${post.comments.length} comments`
                              }
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            
           
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center space-x-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className={`flex items-center px-3 py-2 rounded-md text-sm ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <FiChevronLeft size={16} className="mr-1" />
                    Previous
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => goToPage(pageNumber)}
                          className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${
                            currentPage === pageNumber
                              ? "bg-blue-600 text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                    
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <span className="px-2 text-gray-500">...</span>
                    )}
                    
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <button
                        onClick={() => goToPage(totalPages)}
                        className="w-8 h-8 flex items-center justify-center rounded-md text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {totalPages}
                      </button>
                    )}
                  </div>
                  
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`flex items-center px-3 py-2 rounded-md text-sm ${
                      currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Next
                    <FiChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 px-4">
            <div className="max-w-md mx-auto">
              {searchQuery.trim() ? (
                <>
                  <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100 border border-gray-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 md:h-10 md:w-10 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-base md:text-lg font-medium text-gray-700 mb-2">
                    No matching posts found
                  </h3>
                  <p className="text-gray-500 mb-5 text-sm md:text-base">
                    We couldn't find any posts matching "{searchQuery}"
                  </p>
                  <button
                    onClick={onClearSearch}
                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-xs md:text-sm font-medium"
                  >
                    Clear search
                  </button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 md:h-10 md:w-10 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-base md:text-lg font-medium text-gray-700 mb-2">
                    No posts available
                  </h3>
                  <p className="text-gray-500 text-sm md:text-base">
                    Be the first to create a post!
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}