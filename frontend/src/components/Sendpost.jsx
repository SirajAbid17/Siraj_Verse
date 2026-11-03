
import React, { useRef, useState, useContext, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { BsImage, BsFileEarmarkPlay } from "react-icons/bs";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthUserContext } from "../Context/Authcontext";

export default function Sendpost({ userdata, close }) {
  const [frontendMedia, setFrontendMedia] = useState("");
  const [backendMedia, setBackendMedia] = useState(null);
  const [mediaType, setMediaType] = useState("");
  const [description, setDescription] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const mediaRef = useRef(null);
  const previewUrlRef = useRef("");

  const { serveruri } = useContext(AuthUserContext);
  const navigate = useNavigate();

  // Local development: localhost:5000
  // Production: same Vercel domain
  const getApiUrl = () => {
    const baseUrl = serveruri?.trim();

    if (baseUrl) {
      return `${baseUrl.replace(/\/+$/, "")}/api/create`;
    }

    return "/api/create";
  };

  // Clean up preview URL
  const clearPreview = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = "";
    }
  };

  useEffect(() => {
    return () => {
      clearPreview();
    };
  }, []);

  // Select image or video
  const handleMedia = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    const validVideoTypes = [
      "video/mp4",
      "video/webm",
      "video/ogg",
    ];

    const isImage = validImageTypes.includes(file.type);
    const isVideo = validVideoTypes.includes(file.type);

    if (!isImage && !isVideo) {
      toast.error("Please select a valid image or video file.");
      e.target.value = "";
      return;
    }

    // 100 MB maximum
    if (file.size > 100 * 1024 * 1024) {
      toast.error("File size must be less than 100 MB.");
      e.target.value = "";
      return;
    }

    clearPreview();

    const previewUrl = URL.createObjectURL(file);

    previewUrlRef.current = previewUrl;

    setFrontendMedia(previewUrl);
    setBackendMedia(file);
    setMediaType(isImage ? "image" : "video");
  };

  // Remove selected media
  const removeMedia = () => {
    clearPreview();

    setFrontendMedia("");
    setBackendMedia(null);
    setMediaType("");

    if (mediaRef.current) {
      mediaRef.current.value = "";
    }
  };

  // Upload post
  const uploadpost = async () => {
    if (isPosting) return;

    const trimmedDescription = description.trim();

    if (!trimmedDescription && !backendMedia) {
      toast.warning("Please add some content or media to post.");
      return;
    }

    setIsPosting(true);

    try {
      const formdata = new FormData();

      formdata.append("description", trimmedDescription);

      if (backendMedia) {
        // Must match upload.single("image") in backend
        formdata.append("image", backendMedia);
      }

      const apiUrl = getApiUrl();

      console.log("Post API URL:", apiUrl);
      console.log("Server URI:", serveruri);

      const result = await axios.post(apiUrl, formdata, {
        withCredentials: true,
        timeout: 120000,
      });

      console.log("Post created successfully:", result.data);

      toast.success("Post created successfully!");

      clearPreview();

      if (typeof close === "function") {
        close();
      }

      navigate("/postsend");

    } catch (error) {
      console.error("Post upload error:", error);

      if (error.response) {
        console.error("Backend response:", error.response.data);
        console.error("Status:", error.response.status);

        const message =
          error.response.data?.message ||
          error.response.data?.error ||
          "Unable to create post.";

        toast.error(message);
      } else if (error.request) {
        console.error("No response received from server:", error.request);

        toast.error(
          "Server is not responding. Please check your backend connection."
        );
      } else {
        toast.error(error.message || "Something went wrong.");
      }
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        closeOnClick
        pauseOnHover
        draggable
      />

      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center"
        onClick={close}
      >
        <div
          className="relative bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={close}
            className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
          >
            <FiX />
          </button>

          {/* User information */}
          <div className="flex items-center gap-4 mb-4">
            <img
              src={
                userdata?.user?.profileimg ||
                "https://via.placeholder.com/300x100?text=Profile+Image"
              }
              alt="Profile"
              className="w-[55px] h-[55px] rounded-full object-cover border border-gray-300"
            />

            <div>
              <h2 className="text-base font-semibold text-gray-800 capitalize line-clamp-1">
                {userdata?.user?.username || "Username"}
              </h2>

              <p className="text-sm text-gray-500 line-clamp-1">
                {userdata?.user?.headline || ""}
              </p>
            </div>
          </div>

          {/* Description */}
          <div
            className={`${
              frontendMedia ? "max-h-[100px]" : "max-h-[250px]"
            } overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none]`}
          >
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What do you want to talk about?"
              disabled={isPosting}
              className="border-none w-full resize-none outline-none h-[250px] text-[19px] bg-white [&::-webkit-scrollbar]:hidden"
            />
          </div>

          {/* Media selection */}
          <div className="flex justify-start items-center gap-2">
            <input
              type="file"
              hidden
              ref={mediaRef}
              onChange={handleMedia}
              accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/ogg"
            />

            <button
              type="button"
              onClick={() => mediaRef.current?.click()}
              disabled={isPosting}
              className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
              title="Add media"
            >
              <BsImage size={24} className="text-gray-600" />
            </button>

            {frontendMedia && (
              <button
                type="button"
                onClick={removeMedia}
                disabled={isPosting}
                className="p-2 rounded-full hover:bg-gray-100 text-red-500"
                title="Remove media"
              >
                <FiX size={24} />
              </button>
            )}
          </div>

          {/* Image / video preview */}
          {frontendMedia && (
            <div className="mt-2 relative">
              {mediaType === "image" ? (
                <img
                  src={frontendMedia}
                  alt="Post preview"
                  className="max-h-[250px] w-full object-contain rounded-md border border-gray-200"
                />
              ) : (
                <div className="relative">
                  <video
                    src={frontendMedia}
                    controls
                    className="max-h-[300px] w-full object-contain rounded-md border border-gray-200"
                  />

                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full">
                    <BsFileEarmarkPlay size={20} />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-3">
            <hr className="border-t border-gray-400" />
          </div>

          {/* Post button */}
          <div className="flex justify-end mt-3">
            <button
              type="button"
              onClick={uploadpost}
              disabled={
                (!description.trim() && !backendMedia) || isPosting
              }
              className="bg-white border border-black text-black px-4 py-1 text-sm rounded-full hover:bg-black hover:text-white transition flex items-center justify-center gap-2 min-w-[80px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPosting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Posting...
                </>
              ) : (
                "Post"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
