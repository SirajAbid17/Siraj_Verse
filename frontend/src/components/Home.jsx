import React, { useContext, useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { IoBookmark } from "react-icons/io5";
import { FaPen } from "react-icons/fa";
import { 
  FaUsers, 
  FaCalendarAlt, 
  FaExternalLinkAlt, 
  FaTrophy, 
  FaChartLine, 
  FaBriefcase, 
  FaCode, 
  FaRocket,
  FaQuestionCircle,
  FaUser,
  FaNetworkWired,
  FaSearch,
  FaGraduationCap,
  FaProjectDiagram,
  FaBell
} from "react-icons/fa";
import { HiOutlineNewspaper } from "react-icons/hi";
import { Userdatacontext } from '../Context/UserContext';
import Editprofile from './Editprofile';
import Footer from './Footer';
import { FiGlobe } from "react-icons/fi";
import AIchat from './AIchat';
import Sendpost from './Sendpost';
import { Link } from 'react-router-dom';
import Postcomponets from './Postcomponets';
import PostComponent from './Postcomponets';

const PostComposer = ({ userdata, Showpostpopup }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);

  

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY === 0) {
        setIsAtTop(true);
        setIsVisible(true);
      } else {
        setIsAtTop(false);
        
        if (currentScrollY > lastScrollY) {
         
          setIsVisible(false);
        } else if (currentScrollY < lastScrollY) {
          
          setIsVisible(true);
        }
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

   

  return (
    <div 
      onClick={Showpostpopup}
      className={`w-full h-[80px] bg-white border border-gray-300 hover:border-gray-400 transition-all duration-300 rounded-xl flex items-center gap-4 px-6 ${
        !isAtTop && isVisible 
          ? '' 
          : 'mt-[-16px]'
      }`}
      
    >
      <div className="relative group flex-shrink-0">
        <div className="w-[50px] h-[50px] rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-black transition-all duration-300 cursor-pointer">
          <img
            src={userdata?.user?.profileimg || "https://via.placeholder.com/300x300?text=Profile"}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 rounded-full group-hover:bg-black/10 transition-all duration-300 pointer-events-none"></div>
      </div>
      
      <button className="w-full flex items-center gap-3 text-gray-700 border border-gray-300 text-lg bg-gray-50 hover:bg-gray-100 hover:text-gray-900 px-6 py-2 rounded-full transition-all duration-200 shadow-sm">
        <span>Start a post...</span>
      </button>
    </div>
  );
};

export default function Home() {
  const { userdata, setuserdata } = useContext(Userdatacontext);
  const { edit, setedit } = useContext(Userdatacontext);
  const [spost,setshowpost] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
  const Showpostpopup = () => {
    setshowpost(!spost);
  }

   const handleClearSearch = () => {
        setSearchQuery(""); 
    };

  
  const Clickbtn = () => {
    setedit(!edit);
  }

  const [chat, setchat] = useState(false);
  const Chatbotopen = () => {
    setchat(!chat);
  }

  return (
    <>
      <div className='w-full min-h-[100vh] bg-[#ffffff]'>
        <Navbar onSearch={setSearchQuery} />
        
        <div className='flex flex-col mt-[110px] md:flex-row md:mt-[65px] items-start justify-between gap-5 p-4 w-full'>
       
         <div className="w-full min-h-[340px] md:w-[22%] flex flex-col gap-4">
  <div className="w-full lg:fixed lg:w-[21%] min-h-[340px] border border-gray-300 bg-white rounded-2xl p-4 relative">
    <div className="w-full h-[110px] cursor-pointer bg-gray-200 rounded-t-xl overflow-hidden flex items-center justify-center">
      <img 
        onClick={Clickbtn}
        src={userdata?.user?.coverimg || "https://via.placeholder.com/300x100?text=Cover+Image"} 
        alt="Cover"
        className="w-full h-full object-fill"
      />
    </div>

    <div className="absolute top-[90px] left-1/2 transform -translate-x-1/2 w-full px-4">
      <div className="flex flex-col items-center">
        <img 
          onClick={Clickbtn}
          src={userdata?.user?.profileimg || "https://cdn-icons-png.flaticon.com/128/848/848043.png"}
          alt="Profile"
          className="w-20 cursor-pointer h-20 rounded-full border-4 border-white shadow-lg bg-white object-cover"
        />
        {userdata?.user && (
          <div className="text-center mt-4 w-full">
            <h2 className="text-lg font-bold text-gray-800 mt-[-15px] capitalize">
              {userdata.user.username}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {userdata.user.location}
            </p>
            <div className="text-sm text-gray-600 mt-2 line-clamp-1">
              {userdata.user.headline}
            </div>
          </div>
        )}
      </div>
    </div>

    <div className="mt-32 pt-3 text-center border-t border-gray-200">
      <button onClick={Clickbtn}
        className="w-full py-1 mt-1 mb-2 bg-white border-2 border-[black] text-[black] font-semibold rounded-full shadow-md hover:bg-[black] hover:text-white transition-all duration-300 ease-in-out"
      >
        Edit Profile
      </button>

      <p className="text-xs mt-2 text-gray-500">Additional information goes here below the headline.</p>
      
    </div>
  </div>
</div>

          <div
            onClick={Chatbotopen}
            className="group mt-2.5 mb-0 px-1 py-1 cursor-pointer flex z-10 items-center gap-3 bg-gradient-to-r from-blue-700 to-purple-700 rounded-full top-[83%] fixed right-[7%] lg:right-[24.5%] lg:top-[81%] border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <img
              src="https://img.icons8.com/?size=100&id=QW4gWRn94FHU&format=png&color=FFFFFF"
              alt="Robot"
              className="w-9 h-9 object-cover rounded-full transform transition-transform duration-300 hover:scale-110 hover:rotate-6"
            />

            <span className="hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-black text-xs rounded-md shadow-md px-3 py-1 absolute right-[110%] whitespace-nowrap max-w-[400px]">
              AI Bot. Click to ask any question.
            </span>
          </div>

          <div className="w-full md:w-[53%] min-h-[200px] rounded-2xl py-4">
            <PostComposer userdata={userdata} Showpostpopup={Showpostpopup} />
             <Postcomponets   onClearSearch={handleClearSearch} searchQuery={searchQuery} />
          </div>

        <div className="w-full min-h-[200px] hidden md:w-[22%] md:flex flex-col gap-3.5">
  <div className="w-full lg:fixed lg:w-[21%] min-h-[160px] border border-gray-300 bg-white rounded-xl p-2.5 relative overflow-y-auto max-h-[88vh] shadow-sm"
       style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db #f3f4f6' }}>
    
  
    <div className="flex items-center gap-1.5 mb-2">
      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-1.5 rounded-full">
        <FaQuestionCircle className="text-blue-600 text-sm" />
      </div>
      <h2 className="text-xs font-semibold text-gray-800">SirajVerse Mission Control</h2>
    </div>

   
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-2 rounded-md mb-2 border border-blue-100">
      <p className="text-[11px] text-gray-700 leading-tight font-medium">
        Our mission is to help you benefit from posts, stay connected, 
        and build a strong network while guiding you to make the best use of AI.
      </p>
    </div>

    <ul className="space-y-1.5">
      <li className="flex items-start gap-2 p-1 rounded-md hover:bg-gray-50 transition-colors">
        <div className="bg-red-100 p-1 rounded-full flex-shrink-0 mt-0.5">
          <FaSearch className="text-red-600 text-[10px]" />
        </div>
        <div>
          <h3 className="text-[11px] font-semibold text-gray-800 mb-0.5">Discover Resources</h3>
          <p className="text-[11px] text-gray-600 leading-tight">
            Discover valuable resources for your growth — learning paths, 
            career guidance, and AI-powered tools.
          </p>
        </div>
      </li>
     
      <li className="flex items-start gap-2 p-1 rounded-md hover:bg-gray-50 transition-colors">
        <div className="bg-indigo-100 p-1 rounded-full flex-shrink-0 mt-0.5">
          <FaProjectDiagram className="text-indigo-600 text-[10px]" />
        </div>
        <div>
          <h3 className="text-[11px] font-semibold text-gray-800 mb-0.5">Share Projects</h3>
          <p className="text-[11px] text-gray-600 leading-tight">
            Share projects with the community, showcase skills, get feedback, 
            and build recognition in your AI journey.
          </p>
        </div>
      </li>
    </ul>

   
    <div className="mt-2 pt-2 border-t border-gray-200">
      <h3 className="text-[11px] font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Quick Links</h3>
      <div className="grid grid-cols-2 gap-1">
        <Link to={'/quicklinks'} className="text-[10px] text-blue-600 hover:text-blue-800 hover:underline transition-colors truncate">About</Link>
        <Link to={'/quicklinks'} className="text-[10px] text-blue-600 hover:text-blue-800 hover:underline transition-colors truncate">Accessibility</Link>
        <Link to={'/quicklinks'} className="text-[10px] text-blue-600 hover:text-blue-800 hover:underline transition-colors truncate">Privacy</Link>
        <Link to={'/quicklinks'} className="text-[10px] text-blue-600 hover:text-blue-800 hover:underline transition-colors truncate">User Agreement</Link>
        <Link to={'/quicklinks'} className="text-[10px] text-blue-600 hover:text-blue-800 hover:underline transition-colors truncate">Cookie Policy</Link>
        <Link to={'/quicklinks'} className="text-[10px] text-blue-600 hover:text-blue-800 hover:underline transition-colors truncate">Copyright</Link>
      </div>
    </div>
  </div>
</div>

          <Footer/>
        </div>
        
        {edit && <Editprofile />}
        {chat && <AIchat/>}
        {spost && <Sendpost userdata={userdata} close={() => setshowpost(false)} />}
      </div>
    </>
  )
}