import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { FiArrowLeft, FiEye, FiEyeOff, FiKey } from "react-icons/fi";

function Signup() {
  // Form state
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    secretKey: ""
  });

  // Message state
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // Regex patterns
  const nameRegex = /^[a-zA-Z]{3,}$/;
  const emailRegex = /^[a-zA-Z0-9]+@mail\.com$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // 1. Empty field validation
    if (!form.username.trim() || !form.email.trim() || !form.password.trim()) {
      return showMessage("Please fill all fields", "error");
    }

    // 2. Client-side Regex validation
    if (!nameRegex.test(form.username)) {
      return showMessage("Username must be at least 3 letters", "error");
    }

    if (!emailRegex.test(form.email)) {
      return showMessage("Invalid email format : example01@mail.com", "error");
    }

    if (!passwordRegex.test(form.password)) {
      return showMessage("Password must be at least 6 chars with number", "error");
    }

    try {
      await API.post("api/auth/register", form);
      showMessage("Signup Successful!", "success");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error(err);
      // Backend validation error message
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


  const handleFillDemoKey = () => {
    setForm((prev) => ({
      ...prev,
      secretKey: "TanjoreAdmin2026"
    }));
    showMessage("Admin key applied!", "success");
  };

  return (
    <div className='min-h-screen bg-slate-950 px-4 relative overflow-hidden flex flex-col justify-center items-center'>

      {/* Back Button */}
      <div className='pt-4 pl-2 sm:pl-4 absolute top-2 left-2 md:top-6 md:left-6 z-50'>
        <Link
          to='/'
          className='text-cyan-400 flex items-center gap-2 hover:text-cyan-300 transition duration-300'
        >
          <FiArrowLeft size={26} className='p-1 text-xl md:text-2xl rounded-full bg-cyan-400/10 backdrop-blur-md border border-cyan-400/30' />
        </Link>
      </div>

      {/* Background glows */}
      <div className='absolute w-[180px] md:w-[300px] h-[250px] md:h-[180px] bg-cyan-400 blur-[90px] md:blur-[120px] opacity-20 rounded-full top-10 left-10 pointer-events-none'></div>
      <div className='absolute w-[180px] md:w-[300px] h-[250px] md:h-[180px] bg-cyan-400 blur-[90px] md:blur-[120px] opacity-20 rounded-full bottom-10 right-10 pointer-events-none'></div>

      {/* Card wrapper */}
      <div className='w-full max-w-[340px] sm:max-w-md bg-white/5 border border-white/10 p-5 sm:p-6 md:p-8 rounded-2xl backdrop-blur-lg z-10 my-12'>
        <h1 className='text-2xl md:text-4xl font-bold text-center text-cyan-400 drop-shadow-[0_0_10px_#22d3ee] mb-1 md:mb-2'>
          Create Account
        </h1>
        <p className='text-center text-gray-300 mb-6 text-sm md:text-base'>Join Slotify Today</p>

        <form onSubmit={handleSignup} className="space-y-3 md:space-y-4">

          {/* Alert message */}
          {message && (
            <div className={`px-4 py-3 rounded-lg text-xs sm:text-sm font-medium transition-all ${type === "success"
                ? "bg-green-500/20 border border-green-400 text-green-300"
                : "bg-red-500/20 border border-red-400 text-red-300"
              }`}>
              {message}
            </div>
          )}

          {/* Username input */}
          <div>
            <input onChange={handleChange} value={form.username} name="username" type="text"
              placeholder='Enter Username' className='w-full py-2.5 px-4 md:p-4 rounded-xl bg-white/10 border border-gray-600 text-white placeholder-gray-400 outline-none focus:border-cyan-400 transition duration-200 text-sm md:text-base'
            />
          </div>

          {/* Email input */}
          <div>
            <input onChange={handleChange} value={form.email} name="email" type="email"
              placeholder='Enter Email' className='w-full py-2.5 px-4 md:p-4 rounded-xl bg-white/10 border border-gray-600 text-white placeholder-gray-400 outline-none focus:border-cyan-400 transition duration-200 text-sm md:text-base'
            />
          </div>

          {/* Password Input */}
          <div className="relative w-full">
            <input onChange={handleChange} value={form.password} name="password" type={showPassword ? "text" : "password"}
              placeholder='Enter Password'className='w-full py-2.5 px-4 pr-11 md:p-4 md:pr-12 rounded-xl bg-white/10 border border-gray-600 text-white placeholder-gray-400 outline-none focus:border-cyan-400 transition duration-200 text-sm md:text-base'
            />
            <button type="button"  onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors focus:outline-none cursor-pointer'
              aria-label="Toggle password visibility"
            > {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}  </button>
          </div>

          {/* Secret key input with auto-fill */}
          <div className="space-y-1.5 pt-1">
            <input onChange={handleChange}  value={form.secretKey}  name="secretKey"
              type="password"   placeholder='Admin Access Code (Optional)'
              className='w-full py-2.5 px-4 md:p-4 rounded-xl bg-white/10 border border-gray-600 text-white placeholder-gray-400 outline-none focus:border-cyan-400 transition duration-200 text-sm md:text-base'
            />

            {/* Auto-fill Button for Reviewers / HRs */}
            <div className="flex items-center justify-between px-1 text-[11px] sm:text-xs">
              <span className="text-gray-400">Testing Admin Role?</span>
              <button
                type="button"
                onClick={handleFillDemoKey}
                className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 hover:underline cursor-pointer transition"
              >
                <FiKey size={12} /> Auto-fill Demo Key
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className='w-full bg-cyan-400 text-black py-2.5 md:py-3.5 rounded-xl font-bold shadow-[0_0_20px_#22d3ee] hover:scale-[1.02] active:scale-[0.98] hover:bg-cyan-300 transition duration-300 cursor-pointer text-sm md:text-base mt-2'
          >
            Signup
          </button>

        </form>

        <p className='text-center text-gray-300 mt-5 text-xs sm:text-sm md:text-base'>
          Already have an account?{' '}
          <Link to='/login' className='text-cyan-400 hover:underline font-medium'>
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;