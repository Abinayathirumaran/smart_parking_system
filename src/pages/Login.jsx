import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';
import { setUser } from '../services/auth';
import { FiArrowLeft, FiEye, FiEyeOff } from "react-icons/fi";
import { jwtDecode } from 'jwt-decode';

function Login() {

  // form State
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  //message state
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  //password show/hide state
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // 1. Empty field validation

    if (!form.email.trim() || !form.password.trim()) {
      return showMessage("Please fill all fields", "error");
    }

    try {
      // POST API - Base URL maps to http://localhost:5000/api/auth/login
      const response = await API.post("/api/auth/login", form);

      if (response.data.token) {
        // save token to localStorage for authenticated requests

        setUser(response.data.token);
      }
      showMessage("Login Successful", "success");

      //grab the role from readymade backend res data(auth.js)
      const userRole = response.data.role;

      setTimeout(() => {
        if (location.state?.selectedSlot && location.state?.lot) {
          navigate("/booking", {
            state: {
              lot: location.state.lot,
              selectedSlot: location.state.selectedSlot
            }
          });
        } else if (userRole === "admin") {
          navigate("/admin-dashboard"); 
        } else {
          navigate("/dashboard");
        }
      }, 1500);

    } catch (err) {
      console.error(err);
      const serverMessage = err.response?.data?.message || "Something went wrong";
      showMessage(serverMessage, "error");
    }
  };

  const showMessage = (msg, typ) => {
    setMessage(msg);
    setType(typ);

    setTimeout(() => {
      setMessage("");
      setType("");
    }, 3000);
  };

  return (
    <div className='min-h-screen bg-slate-950 px-4 relative overflow-hidden'>
      <div className='pt-4 pl-2 sm:pl-4 md:absolute md:top-6 md:left-6 z-50'>
        <Link to='/' className='absolute z-50 text-cyan-400 top-3 left-4 md:top-6 md:left-6 flex flex-col md:flex-row items-center gap-2 hover:text-cyan-300 transition duration-300'>
          <FiArrowLeft size={26} className='p-1 text-xl md:text-2xl rounded-full bg-cyan-400/10 backdrop-blur-md border border-cyan-400/30' />
        </Link>
      </div>

      <div className='absolute w-[180px] md:w-[300px] h-[250px] md:h-[180px] bg-cyan-400 blur-[90px] md:blur-[120px] opacity-20 rounded-full top-10 left-10'></div>
      <div className='absolute w-[180px] md:w-[300px] h-[250px] md:h-[180px] bg-cyan-400 blur-[90px] md:blur-[120px] opacity-20 rounded-full bottom-10 right-10'></div>

      <div className='min-h-screen flex items-start md:items-center justify-center pt-24 sm:pt-20 md:pt-0'>
        <div className='w-full max-w-[320px] sm:max-w-md bg-white/5 border border-white/10 p-4 md:p-8 rounded-2xl backdrop-blur-lg'>
          <h1 className='text-2xl md:text-4xl font-bold text-center text-cyan-400 drop-shadow-[0_0_10px_#22d3ee] mb-1 md:mb-2'>Welcome Back</h1>
          <p className='text-center text-gray-300 mb-4 md:mb-8'>Login to your Slotify account</p>

          <form onSubmit={handleLogin}>
            {message && (
              <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium transition-all ${type === "success" ? "bg-green-500/20 border border-green-400 text-green-300" : "bg-red-500/20 border border-red-400 text-red-300"
                }`}>
                {message}
              </div>
            )}
            <input onChange={handleChange} value={form.email} name="email" type="email" placeholder='Enter Email' className='w-full py-2.5 px-4 md:p-4 mb-3 md:mb-5 rounded-xl bg-white/10 border border-gray-600 text-white outline-none focus:border-cyan-400' />

            {/* password container */}
            <div className="relative mb-3 md:mb-5">
              <input onChange={handleChange} value={form.password} name="password" type={showPassword ? "text" : "password"} placeholder='Enter Password' className='w-full py-2.5 px-4 md:p-4 mb-3 md:mb-5 rounded-xl bg-white/10 border border-gray-600 text-white outline-none focus:border-cyan-400' />

              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/3 -translate-y-1/2 text-gray-400 hover:text-cyan-400 cursor-pointer transition"
              >{showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />} </button>
            </div>
            <button type="submit" className='w-full cursor-pointer bg-cyan-400 text-black py-2.5 md:py-3.5 rounded-xl font-bold shadow-[0_0_20px_#22d3ee] hover:scale-105 transition hover:bg-cyan-400 duration-300'>
              Login
            </button>
          </form>
          <p className='text-center text-gray-300 mt-4 md:mt-6 text-sm md:text-base'>Don't have an account? <Link to='/signup' className='text-cyan-400'>Register</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;