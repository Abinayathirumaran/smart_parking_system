import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Outlet } from "react-router-dom";


function SidebarLayout({ children }) {

    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("userData"));

    const handleLogout = () => {
        localStorage.removeItem("userData");
        navigate("/login");
    };

    const linkClass = ({ isActive }) => isActive ? "text-cyan-400 font-semibold" : "text-gray-300 hover:text-cyan-400";
    return (
        <div className='flex min-h-screen bg-slate-950 text-white'>

            {/* mobile top bar */}
            <div className='md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 p-4 flex justify-between items-center
            border-b border-white/10'>
                <h1 className='text-cyan-400 font-bold'>Slotify</h1>

                <button className='text-2xl text-cyan-400' onClick={() => setOpen(!open)}>
                    {open ? "✕" : "☰"}
                </button>
            </div>

            {/* sidebar */}
            {/* sidebar is visible(normal position )- sidebar moves completely out of screen(hidden) but on lg screen always open*/}

            <div className={`fixed h-screen  top-0 left-0  w-64 bg-slate-900 border-r border-white/10 p-6 flex flex-col gap-6 transition-transform duration-300 z-40
                ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0 "}`}>

                {/* logo */}
                <h1 className='text-2xl font-bold text-cyan-400'>Slotify</h1>

                {/* user */}
                <div className='bg-slate-800 p-3 rounded-lg'>
                    <p className='text-gray-400 text-sm'>Welcome</p>
                    <p className='font-semibold'>{user?.username || "Guest"}</p>
                </div>

                {/* links */}
                <div className='flex flex-col gap-4 mt-4'>
                    <NavLink to="/" className={linkClass}>
                        Home
                    </NavLink>
                    <NavLink to="/dashboard" className={linkClass}>
                        Dashboard
                    </NavLink>
                    <NavLink to="/slotarea" className={linkClass}>
                        Slots
                    </NavLink>
                    <NavLink to="/contact" className={linkClass}>
                       Contact
                    </NavLink>
                </div>

                {/* logout */}
                <button onClick={handleLogout} className='cursor-pointer mt-auto bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg'>Logout</button>
            </div>
            {/* overlay(mobile) */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/50 lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/*main content */}
            <div className="flex-1 p-6 mt-16 lg:mt-0 ml-0 lg:ml-64">
                {children}
            </div>
        </div>
    );
}

export default SidebarLayout