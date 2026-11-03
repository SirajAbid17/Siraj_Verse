import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthUserContext } from '../Context/Authcontext';
 

export default function Signup() {
  const [firstname, setfirstname] = useState('');
  const [lastname, setlastname] = useState('');
  const [username, setusername] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [shows, setshows] = useState(false);

  const navigate = useNavigate();
  const { serveruri } = useContext(AuthUserContext); 
  const handlesignup = async (e) => {
    
    e.preventDefault();

    if (password.length < 8) {
      toast.error("🔐 Password must be at least 8 characters long", {
        position: "top-center",
      });
      return;
    }

    setLoading(true);

    try {
      const result = await axios.post(
        `${serveruri}/api/signup`, 
        {
          firstname,
          lastname,
          username,
          email,
          password,
        },
        { withCredentials: true }
      );
      console.log(result.data);
      toast.success("Signup successful!");
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

 return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        transition={Slide}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
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
  onSubmit={handlesignup}
  className="w-[90%] max-w-[400px] bg-white shadow-md rounded-lg px-6 py-8 flex flex-col gap-5"
>
  <h1 className="text-2xl font-bold text-gray-800 text-center">Signup</h1>

  <input
    type="text"
    value={firstname}
    onChange={(e) => setfirstname(e.target.value)}
    placeholder="First name"
    required
    className="h-10 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black shadow-sm text-sm"
  />

  <input
    type="text"
    value={lastname}
    onChange={(e) => setlastname(e.target.value)}
    placeholder="Last name"
    required
    className="h-10 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black shadow-sm text-sm"
  />

  <input
    type="text"
    value={username}
    onChange={(e) => setusername(e.target.value)}
    placeholder="Username"
    required
    className="h-10 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black shadow-sm text-sm"
  />

  <input
    type="email"
    value={email}
    onChange={(e) => setemail(e.target.value)}
    placeholder="Email address"
    required
    className="h-10 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black shadow-sm text-sm"
  />

  <div className="relative">
    <input
      type={shows ? 'text' : 'password'}
      value={password}
      onChange={(e) => setpassword(e.target.value)}
      placeholder="Create password"
      required
      minLength={8}
      className="h-12 w-full px-4 pr-16 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black shadow-sm text-sm"
    />
    <span
      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black text-sm cursor-pointer select-none"
      onClick={() => setshows(!shows)}
    >
      {shows ? 'Hide' : 'Show'}
    </span>
  </div>

  <button
  type="submit"
  disabled={loading}
  className="w-full h-10 mt-2 rounded-full text-black font-semibold text-sm border border-black bg-white hover:bg-black hover:text-white transition duration-300 ease-in-out flex items-center justify-center"
>
  {loading ? (
    <>
      <FaSpinner className="animate-spin mr-2" />
      Signing Up...
    </>
  ) : (
    'Sign Up'
  )}
</button>


  <p className="mt-[-10px] text-center text-sm text-gray-600">
  Already have an account?{' '}
  <Link
    to="/login"
    className="text-blue-600 font-medium relative group inline-block"
  >
    <span className="relative z-10">Login</span>
    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-600 group-hover:w-full transition-all duration-300 ease-in-out"></span>
  </Link>
</p>

</form>

      </div>
    </>
  );
}

 

