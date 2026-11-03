import React, { useRef, useState, useContext } from 'react';
import { FiX } from 'react-icons/fi';
import { BsImage, BsFileEarmarkPlay } from 'react-icons/bs';
import { FaSpinner } from 'react-icons/fa';
import { Userdatacontext } from '../Context/UserContext';
import axios from 'axios';
import { AuthUserContext } from '../Context/Authcontext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

export default function Sendpost({ userdata, close }) {
  const { edit, setedit } = useContext(Userdatacontext);
  const [frontendMedia, setFrontendMedia] = useState("");
  const [backendMedia, setBackendMedia] = useState("");
  const [mediaType, setMediaType] = useState(""); 
  const [description, setDescription] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const mediaRef = useRef();
  const { serveruri } = useContext(AuthUserContext);
  const navigate = useNavigate();

  const handleMedia = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    
    if (validImageTypes.includes(file.type)) {
      setMediaType('image');
      setBackendMedia(file);
      setFrontendMedia(URL.createObjectURL(file));
    } else if (validVideoTypes.includes(file.type)) {
      setMediaType('video');
      setBackendMedia(file);
      setFrontendMedia(URL.createObjectURL(file));
    } else {
      toast.error('Please select a valid image or video file');
    }
  };

  const removeMedia = () => {
    setFrontendMedia("");
    setBackendMedia("");
    setMediaType("");
  };

  const uploadpost = async () => {
    try {
      if (!description && !backendMedia) {
        toast.warning("Please add some content or media to post");
        return;
      }

      if (!serveruri) {
        toast.error("Server connection error");
        return;
      }

      setIsPosting(true);
      
      let formdata = new FormData();
      formdata.append("description", description);
      
      if (backendMedia) {
        formdata.append("image", backendMedia);
      }

      const apiUrl = `${serveruri}${serveruri.endsWith('/') ? '' : '/'}api/create`;
      
      const result = await axios.post(apiUrl, formdata, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });

 console.log(result)
     
      close();
      navigate('/postsend'); 
      
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Error creating post");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <div 
        className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center"
        onClick={close}
      >
        <div 
          className="relative bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md "
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={close}
            className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
          >
            <FiX />
          </button>

          <div className="flex items-center gap-4 mb-4">
            <img
              src={userdata?.user?.profileimg || "https://via.placeholder.com/300x100?text=Profile+Image"}
              alt="Profile"
              className="w-[55px] h-[55px] rounded-full object-cover border border-gray-300"
            />
            <div>
              <h2 className="text-base font-semibold text-gray-800 capitalize line-clamp-1">
                {userdata?.user?.username || "Username"}
              </h2>
              <p className="text-sm text-gray-500 line-clamp-1">{userdata?.user?.headline}</p>
            </div>
          </div>

          <div className={`${frontendMedia ? "max-h-[100px]" : "max-h-[250px]"} overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none]`}>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What do you want to talk about?"
              className="border-none w-full resize-none outline-none h-[250px] text-[19px] bg-white [&::-webkit-scrollbar]:hidden"
            ></textarea>
          </div>

          <div className='flex justify-start items-center gap-2'>
            <input 
              type="file" 
              hidden 
              ref={mediaRef} 
              onChange={handleMedia} 
              accept="image/*, video/*" 
            />
            <button 
              onClick={() => mediaRef.current.click()} 
              className="p-2 rounded-full hover:bg-gray-100"
              title="Add media"
            >
              <BsImage size={24} className='text-gray-600' />
            </button>
            {frontendMedia && (
              <button 
                onClick={removeMedia}
                className="p-2 rounded-full hover:bg-gray-100 text-red-500"
                title="Remove media"
              >
                <FiX size={24} />
              </button>
            )}
          </div>

          {frontendMedia && (
            <div className="mt-2 relative">
              {mediaType === 'image' ? (
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

          <div className='mt-1'>
            <hr className="border-t-1 border-gray-400" />
          </div>

          <div className="flex justify-end mt-2">
            <button 
              onClick={uploadpost}
              className="bg-white border cursor-pointer border-black text-black px-4 py-1 text-sm rounded-full hover:bg-black hover:text-white transition flex items-center justify-center gap-2 min-w-[80px]"
              disabled={(!description && !frontendMedia) || isPosting}
            >
              {isPosting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Posting...
                </>
              ) : (
                'Post'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}