import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function SidebarLayout({ children }) {
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation(); // Keeps track of page changes to sync authentication state

    // decode the token directly from localStorage
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded);
            } catch (error) {
                console.error("Invalid token format", error);
                localStorage.removeItem("token");
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, [location]);

    // The Complete Logout Logic matching specification
    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
    };

    const linkClass = ({ isActive }) =>
        isActive ? "text-cyan-400 font-semibold" : "text-gray-300 hover:text-cyan-400";

    return (
        <div className='flex min-h-screen bg-slate-950 text-white'>

            {/* mobile top bar */}
            <div className='md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 p-4 flex justify-between items-center border-b border-white/10'>
                <h1 className='text-cyan-400 font-bold'>Slotify</h1>
                <button className='text-2xl text-cyan-400' onClick={() => setOpen(!open)}>
                    {open ? "✕" : "☰"}
                </button>
            </div>

            {/* sidebar - desktop styling preserved, mobile links gap adjusted */}
            <div className={`fixed h-screen top-0 left-0 w-64 bg-slate-900 border-r border-white/10 p-6 flex flex-col gap-6 transition-transform duration-300 z-40
                ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>

                <h1 className='text-2xl font-bold text-cyan-400'>Slotify</h1>

                {/* Welcome box reading dynamically from decoded token state */}
                <div className='bg-slate-800 p-3 rounded-lg'>
                    <p className='text-gray-400 text-sm'>Welcome</p>
                    <p className='font-semibold'>{user?.username || "Guest"}</p>
                </div>

                {/* links - smaller text (text-sm) and compact gap (gap-2.5) on mobile, normal (text-base, gap-4) on desktop */}
                <div className='flex flex-col gap-2.5 md:gap-4 mt-2 md:mt-4 text-sm md:text-base' onClick={() => setOpen(false)}>
                    <NavLink to="/" className={linkClass}>Home</NavLink>
                    <NavLink to="/slotarea" className={linkClass}>Slots</NavLink>

                    {/* Hide Dashboard link for Admin only */}
                    {user?.role !== "admin" && (
                        <>
                            <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
                            <NavLink to="/favourites" className={linkClass}>Favourites</NavLink>
                        </>
                    )}

                    <NavLink to="/contact" className={linkClass}>Contact</NavLink>

                    {/* Admin links shown exclusively if logged-in account is admin */}
                    {user?.role === "admin" && (
                        <>
                            <NavLink to="/admin-dashboard" className={linkClass}>
                                Management Panel
                            </NavLink>
                            <NavLink to="/admin/analytics" className={linkClass}>
                                Analytics & Insights
                            </NavLink>
                        </>
                    )}
                </div>

                <button
                    onClick={handleLogout}
                    className='cursor-pointer mt-auto bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition-colors duration-200 mb-2 md:mb-0'
                >
                    Logout
                </button>
            </div>

            {/* overlay */}
            {open && <div className="fixed inset-0 bg-black/50 md:hidden z-30" onClick={() => setOpen(false)} />}

            {/* main content */}
            <main className="flex-1 p-6 mt-16 md:mt-0 ml-0 md:ml-64 relative">
                {children}

                {/* Dialogflow Chat Widget - Positioned at bottom right of every page view */}
                <df-messenger
                    intent="WELCOME"
                    chat-title="Slotify-Bot"
                    agent-id="b7b433a9-0017-4e70-a917-2a52e0828fb5"
                    language-code="en"
                ></df-messenger>
            </main>
        </div>
    );
}

export default SidebarLayout;