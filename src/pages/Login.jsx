import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';
import { setUser } from '../services/auth';
import Navbar from '../components/Navbar';
import { FiArrowLeft } from "react-icons/fi";

function Login() {

  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // empty validation
    if (!form.email || !form.password) {
      return showMessage("Please fill all fields", "error")
    }

    try {
      // get the users data from db.json
      const response = await API.get("/users")

      //compare credentials
      const user = response.data.find((d) =>
        d.email === form.email && d.password === form.password);

      //Invalid credentials
      if (!user) {
        return showMessage("Invalid credentials", "error");
      }

      //save the logged user in local store
      setUser(user);
      showMessage("Login Successful", "success");
      setTimeout(() => {

        if (location.state?.from === "/booking") {

          navigate("/booking", {
            state: {
              lot: location.state.lot,
              selectedSlot: location.state.selectedSlot
            }
          });

        } else {

          navigate("/dashboard");

        }

      }, 100);
    }
    catch (err) {
      console.log(err);
      showMessage("Something went wrong", "error");
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
        <Link to='/' className='absolute z-50 text-cyan-400 top-3 left-4  md:top-6 md:left-6 flex flex-col md:flex-row items-center gap-2 hover:text-cyan-300 transition duration-300
                '><FiArrowLeft size={26} className='p-1 text-xl md:text-2xl rounded-full bg-cyan-400/10 backdrop-blur-md border border-cyan-400/30 ' /></Link>
      </div>

      <div className='absolute w-[180px] md:w-[300px] h-[250px] md:h-[180px] bg-cyan-400 blur-[90px] md:blur-[120px] opacity-20 rounded-full top-10 left-10'></div>
      <div className='absolute w-[180px] md:w-[300px] h-[250px] md:h-[180px] bg-cyan-400 blur-[90px] md:blur-[120px] opacity-20 rounded-full bottom-10 right-10'></div>
      {/* card */}
      <div className='min-h-screen flex items-start md:items-center justify-center pt-24 sm:pt-20 md:pt-0'>
        <div className='w-full max-w-[320px] sm:max-w-md bg-white/5 border border-white/10 p-4 md:p-8 rounded-2xl backdrop-blur-lg'>
          <h1 className='text-2xl md:text-4xl font-bold text-center text-cyan-400 drop-shadow-[0_0_10px_#22d3ee] mb-1 md:mb-2'>Welcome Back</h1>

          <p className='text-center text-gray-300 mb-4 md:mb-8'>Login to your Slotify account</p>

          {/* Form */}
          <form onSubmit={handleLogin}>

            {
              message && (
                <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium transition-all
            ${type === "success" ? "bg-green-500/20 border border-green-400 text-green-300" : "bg-red-500/20 border border-red-400 text-red-300"
                  }`}>

                  {message}
                </div>
              )
            }
            <input onChange={handleChange} name="email" type="email" placeholder='Enter Email' className='w-full py-2.5 px-4 md:p-4 mb-3 md:mb-5 rounded-xl bg-white/10 border border-gray-600 text-white outline-none focus:border-cyan-400' />
            <input onChange={handleChange} name="password" type="password" placeholder='Enter Password' className='w-full py-2.5 px-4 md:p-4 mb-3 md:mb-5 rounded-xl bg-white/10 border border-gray-600 text-white outline-none focus:border-cyan-400' />

            <button type="submit" className='w-full cursor-pointer bg-cyan-400 text-black py-2.5 md:py-3.5 rounded-xl font-bold shadow-[0_0_20px_#22d3ee] hover:scale-105 transition hover:bg-cyan-400 duration-300 cursor-pointer'>Login</button>
          </form>
          <p className='text-center text-gray-300 mt-4 md:mt-6 text-sm md:text-base'>Don't have an account? <Link to='/signup' className='text-cyan-400'>Register</Link></p>


        </div>
      </div>
    </div>
  )
}

export default Login