import React, { useContext } from 'react';
import { CheckCircle, Home, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IoHome } from 'react-icons/io5';
import { Userdatacontext } from '../Context/UserContext';

export default function ThanksPost() {
  const navigate = useNavigate();
  const {userdata}=useContext(Userdatacontext)

  const handleRefresh = () => {
  
    window.location.href = '/'; 
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        
  <h1 className="text-2xl font-bold text-gray-800">
  {userdata.user.firstname} {userdata.user.lastname}
</h1>

        <h1 className="text-xl font-bold text-gray-900 mb-2">Your Post Was Sent Successfully!</h1>
        <p className="text-gray-600 mb-6">
          Your post is live! Head over to the homepage to check it out.
        </p>
        
      
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
         
          <button
            onClick={handleRefresh}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-[black] hover:text-[white] text-black border border-[black] rounded-lg transition-colors"
          >
            <IoHome className="w-5 h-5" />
            Go to home  
          </button>
          
          
        </div>
      </div>
    </div>
  );
}