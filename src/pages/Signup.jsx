import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../services/api'
import { FiArrowLeft } from "react-icons/fi";

function Signup() {
  // form state
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });



  const navigate = useNavigate();

  // Regex pattern 
  const nameRegex = /^[a-zA-Z]{3,}$/;
  const emailRegex = /^[a-zA-Z0-9]+@mail\.com$/
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    
    e.preventDefault();

     // 1. Empty field validation
   if (!form.username.trim() || !form.email.trim() || !form.password.trim()) {
  return showMessage("Please fill all fields", "error");
}
    //validation
    if (!nameRegex.test(form.username)) {
      return showMessage("Username must be at least 3 letters", "error");
    }

    if (!emailRegex.test(form.email)) {
      return showMessage("Emai format example01@mail.com", "error")
    }

    if (!passwordRegex.test(form.password)) {
      return showMessage("Password must be atleast 6 chars with number", "error")
    }

    try {
      // Find duplicate user
      const response = await API.get("/users");

      const exist = response.data.find(user => user.email === form.email);
      if (exist) {
        return showMessage("User already registered", "error");

      }
      // if not exist save this user
      await API.post("/users", form);

      showMessage("Signup Successful", "success");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      console.log(err);
      showMessage("Something went wrong", "error");
    }

  };

  // message state
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

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
        <Link to='/' className='absolute z-50 text-cyan-400 top-3 left-4  md:top-6 md:left-6 flex flex-col md:flex-row items-center gap-2 hover:text-cyan-300 transition duration-300
           '><FiArrowLeft size={26} className='p-1 text-xl md:text-2xl rounded-full bg-cyan-400/10 backdrop-blur-md border border-cyan-400/30 ' /></Link>
      </div>

      <div className='absolute w-[180px] md:w-[300px] h-[250px] md:h-[180px] bg-cyan-400 blur-[90px] md:blur-[120px] opacity-20 rounded-full top-10 left-10'></div>
      <div className='absolute w-[180px] md:w-[300px] h-[250px] md:h-[180px] bg-cyan-400 blur-[90px] md:blur-[120px] opacity-20 rounded-full bottom-10 right-10'></div>
      {/* 
Card */}
      <div className='min-h-screen flex items-start md:items-center justify-center pt-24 sm:pt-20 md:pt-0'>
        <div className='w-full max-w-[320px] sm:max-w-md bg-white/5 border border-white/10 p-4 md:p-8 rounded-2xl backdrop-blur-lg'>
          <h1 className='text-2xl md:text-4xl font-bold text-center text-cyan-400 drop-shadow-[0_0_10px_#22d3ee] mb-1 md:mb-2'>Create Account</h1>
          <p className='text-center text-gray-300 mb-4 md:mb-8'>Join Slotify Today</p>



          <form onSubmit={handleSignup}>

            {
              message && (
                <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium transition-all
            ${type === "success" ? "bg-green-500/20 border border-green-400 text-green-300" : "bg-red-500/20 border border-red-400 text-red-300"
                  }`}>

                  {message}
                </div>
              )
            }
            <input onChange={handleChange} name="username" type="text" placeholder='Enter Username' className='w-full py-2.5 px-4 md:p-4 mb-3 md:mb-5 rounded-xl bg-white/10 border border-gray-600 text-white outline-none focus:border-cyan-400' />
            <input onChange={handleChange} name="email" type="email" placeholder='Enter Email' className='w-full py-2.5 px-4 md:p-4 mb-3 md:mb-5 rounded-xl bg-white/10 border border-gray-600 text-white outline-none focus:border-cyan-400' />
            <input onChange={handleChange} name="password" type="password" placeholder='Enter Password' className='w-full py-2.5 px-4 md:p-4 mb-3 md:mb-5 rounded-xl bg-white/10 border border-gray-600 text-white outline-none focus:border-cyan-400' />
            <button type="submit" className='w-full cursor-pointer bg-cyan-400 text-black py-2.5 md:py-3.5 rounded-xl font-bold shadow-[0_0_20px_#22d3ee] hover:scale-105 transition hover:bg-cyan-400 duration-300 cursor-pointer'>
              Signup</button>
          </form>
          <p className='text-center text-gray-300 mt-4 md:mt-6 text-sm md:text-base'>Already have an account? <Link to='/login' className='text-cyan-400'>Login</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Signup