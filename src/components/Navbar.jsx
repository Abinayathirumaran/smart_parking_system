import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthButtons from "./AuthButtons";
import { getUser } from "../services/auth";
import { NavLink } from "react-router-dom";
import { FiHeart } from "react-icons/fi";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const location = useLocation();
  const isLanding = location.pathname === "/";
  const user = getUser();




  return (
    <nav className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 px-4 md:px-8 lg:px-12 py-4 bg-slate-950 text-gray-300 max-w-7xl mx-auto w-full">

      {/* LOGO */}
      <div className="flex items-center gap-2 shrink-0 md:mr-8">
        <Link to="/" className="flex items-center gap-2">
        <img
          src="https://i.pinimg.com/736x/d4/69/48/d46948564182f6073f110a2fc8130ce0.jpg"
          alt="logo"
          className="w-10 h-10 object-contain"
        />
        <h1 className="text-2xl font-bold text-cyan-400">Slotify</h1>
        </Link>
      </div>

      {/* NAV */} 
      <div className="hidden md:flex items-center gap-4 lg:gap-8">
        <NavLink to="/" className={({ isActive }) => isActive
          ? "text-cyan-400 font-semibold whitespace-nowrap"
          : "text-gray-300 hover:text-cyan-400 whitespace-nowrap"
        }>Home</NavLink>
        <NavLink to="/slotarea" className={({ isActive }) => isActive ? "text-cyan-400 whitespace-nowrap font-semibold"
          : "text-gray-300 hover:text-cyan-400 whitespace-nowrap"}>Slots</NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "text-cyan-400 font-semibold whitespace-nowrap"
          : "text-gray-300 hover:text-cyan-400 whitespace-nowrap"}>Dashboard</NavLink>
        <NavLink to="/contact" className={({ isActive }) => isActive ? "text-cyan-400 font-semibold whitespace-nowrap"
          : "text-gray-300 hover:text-cyan-400 whitespace-nowrap"}>Contact</NavLink>
        <NavLink to="/favourites" className={({ isActive }) => isActive ? "text-cyan-400 font-semibold flex items-center gap-2 whitespace-nowrap" : "text-gray-300 hover:text-cyan-400 flex items-center gap-2 whitespace-nowrap"}>
          <FiHeart />Favorites
        </NavLink>
      </div>

      {/* auth (desktop) */}
      <div className="hidden md:flex gap-4 md:gap-2 shrink-0 ml-2">
        <AuthButtons />
      </div>

      {/* mobile btn */}
      <button
        className="md:hidden text-2xl text-cyan-400"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* mobile menu */}
      {
        isOpen && (
          <div className="absolute top-20 left-0 w-full bg-slate-900 flex flex-col items-center justify-center gap-6 py-6 md:hidden z-50">

            <NavLink to="/" onClick={() => setIsOpen(false)} className={({ isActive }) => isActive ? "text-cyan-400 font-semibold": "text-gray-300 hover:text-cyan-400"}>Home</NavLink>
            <NavLink to="/slotarea" onClick={() => setIsOpen(false)} className={({ isActive }) => isActive ? "text-cyan-400 font-semibold": "text-gray-300 hover:text-cyan-400"}>Slots</NavLink>
            <NavLink to="/dashboard" onClick={() => setIsOpen(false)} className={({ isActive }) => isActive ? "text-cyan-400 font-semibold": "text-gray-300 hover:text-cyan-400"}>Dashboard</NavLink>
            <NavLink to="/contact" onClick={() => setIsOpen(false)} className={({ isActive }) => isActive ? "text-cyan-400 font-semibold": "text-gray-300 hover:text-cyan-400"}>Contact</NavLink>
            <NavLink to="/favourites" onClick={() => setIsOpen(false)} className={({ isActive }) => isActive ? "text-cyan-400 font-semibold flex items-center gap-2": "text-gray-300 hover:text-cyan-400 flex items-center gap-2"}><FiHeart />
              Favorites</NavLink>

            <AuthButtons />
          </div>
        )
      }
    </nav >
  );
}

export default Navbar;