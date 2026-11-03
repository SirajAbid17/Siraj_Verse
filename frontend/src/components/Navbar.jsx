import React, { useContext, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FaHome, FaUserFriends } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { motion } from "framer-motion";
import { Userdatacontext } from "../Context/UserContext";
import { AuthUserContext } from "../Context/Authcontext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ImCross } from "react-icons/im";
import { MdOutlineWork } from "react-icons/md";

export default function Navbar({ onSearch, onClearSearch }) {
  const { userdata, setuserdata } = useContext(Userdatacontext);
  const navigate = useNavigate();
  const [showpopdata, setShowpopdata] = useState(false);
  const { serveruri } = useContext(AuthUserContext);
  const [searchQuery, setSearchQuery] = useState("");

  const ShowBTn = () => {
    setShowpopdata(!showpopdata);
  };

  const HandleSignout = async () => {
    try {
      const result = await axios.get(`${serveruri}/api/logout`, {
        withCredentials: true
      });
      setuserdata(null);
      navigate('/login');
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery(""); 
    if (onClearSearch) {
      onClearSearch(); 
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white text-black shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4 py-3 md:px-8 transition-all duration-300 min-h-[75px] space-y-3 sm:space-y-0">
       
        <div className="order-2 sm:order-1 w-full md:w-[60%] lg:w-[70%] flex items-center justify-between gap-2 md:gap-4">
          <div className="flex-shrink-0 flex items-center min-w-[50px] md:min-w-[60px]">
            <img
              src="./svi.png"
              alt="Logo"
              className="h-[40px] md:h-[50px] w-auto object-contain"
            />
            <h1 className="hidden lg:block text-xl ms-[-20px] mt-[-3px] lg:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-500 to-red-500 drop-shadow-lg tracking-wide">
              Siraj
              <span className="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
                Verse
              </span>
            </h1>
          </div>

          <div className="flex-1 max-w-[400px] md:max-w-[500px] flex items-center bg-gray-100 rounded-full px-3 py-1 md:py-2">
            <FiSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search posts, people, or hashtags..."
              className="bg-transparent outline-none w-full text-xs md:text-sm"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button 
                onClick={handleClearSearch}
                className="text-gray-500 hover:text-gray-600 transition-colors"
              >
                <ImCross size={12} />
              </button>
            )}
          </div>
        </div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="order-1 sm:order-2 w-full md:w-auto flex items-center justify-around sm:justify-end space-x-4 md:space-x-6 mb-2 sm:mb-0"
        >
          <div 
            className="flex flex-col items-center text-xs md:text-sm hover:text-blue-500 transition duration-200 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <FaHome size={20} className="md:size-[22px]" />
            <span className="mt-1">Home</span>
          </div>

          <div 
            className="flex flex-col items-center text-xs md:text-sm hover:text-blue-500 transition duration-200 cursor-pointer"
            onClick={() => navigate('/network')}
          >
            <FaUserFriends size={20} className="md:size-[22px]" />
            <span className="mt-1">Network</span>
          </div>


        <a href="https://pk.indeed.com/?from=gnav-messaging--messaging-webapp" target="_blank">  <div 
            className="flex flex-col items-center text-xs md:text-sm hover:text-blue-500 transition duration-200 cursor-pointer"
          >
            <MdOutlineWork  size={20} className="md:size-[22px]" />
            <span className="mt-1">Jobs</span>
          </div>
          </a> 

          <div 
            onClick={ShowBTn} 
            className="flex flex-col items-center text-xs md:text-sm hover:scale-105 transition duration-200 cursor-pointer"
          >
            <img
              src={userdata?.user?.profileimg || "https://cdn-icons-png.flaticon.com/128/848/848043.png"}
              alt="Profile"
              className="w-5 h-5 md:w-6 md:h-6 rounded-full border border-gray-300 object-cover"
            />
            <span className="mt-1">Profile</span>
          </div>
        </motion.div>

        {showpopdata && (
          <div className={`absolute top-[110px] sm:top-[70px] md:top-[78px] right-[10px] sm:right-[2px] px-4 py-3 bg-white border border-gray-300 rounded-lg w-[200px] md:w-[220px] hover:shadow-md transition-all duration-200 z-50`}>
            <div className="flex flex-col items-center space-y-3 md:space-y-4">
              <div className="flex flex-col items-center w-full">
                <img
                  src={userdata?.user?.profileimg || "https://cdn-icons-png.flaticon.com/128/848/848043.png"}
                  alt="Profile"
                  className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-blue-100 mb-2 object-cover"
                />
                
                {userdata && userdata.user && (
                  <div className="text-xs md:text-sm text-gray-700 text-center">
                    Welcome, <span className="text-blue-600 font-bold">{userdata.user.username}</span>
                  </div>
                )}
              </div>


              <button 
                onClick={() => {
                  navigate('/profile');
                  setShowpopdata(false);
                }}
                className="w-full bg-white border border-blue-500 text-blue-600 px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm font-medium hover:bg-blue-50 transition duration-200"
              >
                View Profile
              </button>

              <div className="w-full h-px bg-gray-200 my-1"></div>

              <div 
                onClick={() => {
                  navigate('/network');
                  setShowpopdata(false);
                }}
                className="flex items-center w-full px-2 py-1 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded transition duration-200 cursor-pointer"
              >
                <FaUserFriends size={16} className="mr-2 md:mr-3" />
                <span className="text-xs md:text-sm">My Network</span>
              </div>

              <button 
                onClick={HandleSignout}
                className="w-full mt-1 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-white text-gray-700 border border-gray-300 hover:border-red-400 hover:text-red-500 hover:bg-red-50 transition duration-200 text-xs md:text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}