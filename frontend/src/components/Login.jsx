import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthUserContext } from '../Context/Authcontext';
import { Userdatacontext } from '../Context/UserContext';

export default function Login() {
  const { serveruri } = useContext(AuthUserContext);
  let { userdata, setuserdata } = useContext(Userdatacontext);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const loginbutton = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${serveruri}/api/login`, {
        email,
        password,
      }, { withCredentials: true });

      if (res.data.success) {
        toast.success("Login successful");
        setuserdata(res.data);
        setTimeout(() => navigate('/Welcome'), 1000);
      } else {
        toast.error(res.data.message || "Invalid credentials");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
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
        transition={Slide}
      />

      <div className="w-full h-screen bg-white flex flex-col items-center justify-start">
        <div className="p-6 lg:p-8 w-full h-[80px] flex items-center">
          <h1 className="text-3xl ms-4 mt-2 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-500 to-red-500 drop-shadow-lg tracking-wide">
            Siraj
            <span className="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
              Verse
            </span>
          </h1>
        </div>

        <form
          onSubmit={loginbutton}
          className="w-[90%] max-w-[400px] mt-[50px] bg-white shadow-md rounded-lg px-6 py-6 flex flex-col gap-6"
        >
          <h1 className="text-2xl font-bold text-gray-800">Login</h1>

          <div className="flex flex-col gap-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              className="h-10 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[black] shadow-sm text-sm"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="h-10 w-full px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[black] shadow-sm text-sm pr-16"
              />
              <span
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[black] text-sm cursor-pointer"
              >
                {showPassword ? 'hide' : 'show'}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 mt-2 rounded-full text-[black] font-semibold text-sm border border-[black] bg-[white] hover:text-[15px] transition duration-300 ease-in-out flex items-center justify-center"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Logging In...
              </>
            ) : (
              'Login'
            )}
          </button>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-blue-600 font-medium relative group inline-block"
            >
              <span className="relative z-10">Sign Up</span>
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-600 group-hover:w-full transition-all duration-300 ease-in-out"></span>
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}