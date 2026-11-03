import React, { useContext, useState, useEffect } from 'react';
import { Userdatacontext } from '../Context/UserContext';
import { AuthUserContext } from '../Context/Authcontext'
import { User, MapPin, Calendar, Briefcase, GraduationCap, Award, Users, Mail, Edit } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import { Copy, Check } from "lucide-react";


export default function ViewProfile() {
  const { userdata, edit, setedit } = useContext(Userdatacontext);
  const { serveruri } = useContext(AuthUserContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

const handleCopy = async () => {
  await navigator.clipboard.writeText(profileData._id);
  setCopied(true);

  setTimeout(() => {
    setCopied(false);
  }, 2000);
};
  const Hend1 = () => {
    navigate('/userpost');
  };

  useEffect(() => {
    if (userdata?.user) {
      setProfileData(userdata.user);
      setLoading(false);
    }
  }, [userdata]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (firstname, lastname) => {
    return `${firstname?.charAt(0) || ''}${lastname?.charAt(0) || ''}`.toUpperCase();
  };

  const hasItems = (array) => {
    return array && Array.isArray(array) && array.length > 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">No Profile Data</h2>
          <p className="text-gray-600">Unable to load profile information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      <div className="relative mt-[100px] md:mt-[60px] ">
        <div className="h-40 sm:h-48 md:h-56 lg:h-64 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 overflow-hidden">
          {profileData.coverimg ? (
            <img 
              src={profileData.coverimg} 
              alt="Cover" 
              className="w-full h-full object-fill"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800"></div>
          )}
        </div>
        
      
        <div className="absolute -bottom-12 md:-bottom-16 left-4 md:left-8">
          <div className="relative">
            {profileData.profileimg ? (
              <img 
                src={profileData.profileimg} 
                alt={`${profileData.firstname} ${profileData.lastname}`}
                className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border-4 border-white bg-white object-cover"
              />
            ) : (
              <div className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border-4 border-white bg-blue-600 flex items-center justify-center">
                <span className="text-white text-xl md:text-2xl lg:text-3xl font-bold">
                  {getInitials(profileData.firstname, profileData.lastname)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-16 md:pt-20 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div className="mb-3 md:mb-0">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {profileData.firstname} {profileData.lastname}
                  </h1>
                  <p className="text-gray-600 mb-2 text-sm md:text-base">@{profileData.username}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{profileData.email}</span>
                    </div>
                    {profileData.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {profileData.location}
                      </div>
                    )}
                    {profileData.gender && (
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {profileData.gender}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500 self-start md:self-auto">
                  <Users className="h-4 w-4" />
                  {profileData.connection?.length || 0} connections
                </div>
              </div>
              
              {profileData.headline && (
                <div className="border-t pt-4">
                  <p className="text-gray-700 italic leading-relaxed text-sm md:text-base">"{profileData.headline}"</p>
                </div>
              )}
            </div>

         
            {hasItems(profileData.skills) && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900">Skills</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 md:px-3 md:py-1 bg-blue-100 text-blue-800 rounded-full text-xs md:text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

           
            {hasItems(profileData.experience) && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
                <div className="flex items-center gap-2 mb-4 md:mb-6">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900">Experience</h2>
                </div>
                <div className="space-y-4 md:space-y-6">
                  {profileData.experience.map((exp, index) => (
                    <div key={index} className="relative pl-6 border-l-2 border-blue-100">
                      <div className="absolute -left-2 top-0 w-3 h-3 md:w-4 md:h-4 bg-blue-600 rounded-full mt-2"></div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1 text-base md:text-lg">{exp.title || 'Untitled Position'}</h3>
                        <p className="text-blue-600 font-medium mb-2 text-sm md:text-base">{exp.company || 'Unknown Company'}</p>
                        <div className="flex items-center gap-2 text-gray-500 text-xs md:text-sm mb-2">
                          <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                          <span>{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</span>
                        </div>
                        {exp.description && (
                          <p className="text-gray-600 text-xs md:text-sm leading-relaxed">{exp.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          
            {hasItems(profileData.education) && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
                <div className="flex items-center gap-2 mb-4 md:mb-6">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900">Education</h2>
                </div>
                <div className="space-y-4 md:space-y-6">
                  {profileData.education.map((edu, index) => (
                    <div key={index} className="relative pl-6 border-l-2 border-blue-100">
                      <div className="absolute -left-2 top-0  w-3 h-3 md:w-4 md:h-4 bg-blue-600 rounded-full mt-2"></div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1 text-base md:text-lg">{edu.college || 'Unknown Institution'}</h3>
                        <p className="text-blue-600 font-medium mb-2 text-sm md:text-base">{edu.degree || 'Unknown Degree'}</p>
                        <div className="flex items-center gap-2 text-gray-500 text-xs md:text-sm mb-2">
                          <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                          <span>{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</span>
                        </div>
                        {edu.field && <p className="text-gray-600 text-xs md:text-sm">{edu.field}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 md:space-y-6">
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">Account Details</h2>
              <div className="space-y-2 md:space-y-3">
                <div>
                  <span className="text-xs md:text-sm text-gray-500 block">Member Since</span>
                  <span className="text-gray-900 font-medium text-sm md:text-base">
                    {formatDate(profileData.createdAt)}
                  </span>
                </div>
                <div>
                  <span className="text-xs md:text-sm text-gray-500 block">Last Updated</span>
                  <span className="text-gray-900 font-medium text-sm md:text-base">
                    {formatDate(profileData.updatedAt)}
                  </span>
                </div>
                <div>
                  <span className="text-xs md:text-sm text-gray-500 block">Profile ID</span>
                  <div className="flex items-center gap-2">
  <span className="text-gray-900 font-mono text-xs md:text-xs break-all">
    {profileData._id}
  </span>

  <button
    onClick={handleCopy}
    className="p-1.5 rounded-md hover:bg-gray-100 transition"
    title="Copy ID"
  >
    {copied ? (
      <Check className="w-4 h-4 text-green-600" />
    ) : (
      <Copy className="w-4 h-4 text-gray-600" />
    )}
  </button>
</div>
                </div>
              </div>
            </div>

           
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">Profile Stats</h2>
              <div className="space-y-3 md:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm md:text-base">Skills</span>
                  <span className="font-semibold text-blue-600 text-sm md:text-base">
                    {profileData.skills?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm md:text-base">Experience</span>
                  <span className="font-semibold text-blue-600 text-sm md:text-base">
                    {profileData.experience?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm md:text-base">Education</span>
                  <span className="font-semibold text-blue-600 text-sm md:text-base">
                    {profileData.education?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm md:text-base">Connections</span>
                  <span className="font-semibold text-blue-600 text-sm md:text-base">
                    {profileData.connection?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <button 
          onClick={Hend1}
          className="mb-10 px-5 py-2 border border-gray-800 text-gray-800 rounded-full 
                     font-medium text-sm md:text-base 
                     hover:bg-gray-800 hover:text-white 
                     transition duration-300 ease-in-out shadow-sm"
        >
          Show all posts
        </button>
      </div>

      <div className="mt-10"> 
        <Footer/>
      </div>
    </div>
  );
}