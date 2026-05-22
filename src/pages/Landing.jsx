import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar';
import { FaParking, FaUserShield, FaHistory, FaMobileAlt, FaMoneyBillWave, FaCar, FaTachometerAlt, FaClock, FaRoute, FaDatabase } from "react-icons/fa";
import { MdOutlineEventAvailable, MdDashboardCustomize } from "react-icons/md";
import { BsBuildingFillCheck } from "react-icons/bs";
import { RiSecurePaymentLine } from "react-icons/ri";
import Footer from '../components/Footer';

function Landing() {
    return (
        <div className='min-h-screen bg-slate-900 text-white'>

            {/* Navbar */}
            <Navbar />

            {/* Hero */}
            <div
                className='min-h-screen bg-cover bg-center relative'
                style={{ backgroundImage: `url("https://i.pinimg.com/736x/73/77/35/7377354233946dc8f77d839938a5a707.jpg")` }}>

                {/* overlay */}
                <div className='absolute inset-0 bg-black/70'></div>

                {/* content */}
                <div className='relative z-10 flex flex-col items-center justify-center text-center px-6 min-h-screen'>
                    <h1 className='text-4xl md:text-6xl font-bold leading-tight mb-6 text-white'>
                        Smart Parking Management System
                    </h1>
                    <p className='text-gray-300 text-lg md:text-xl mb-8 max-w-2xl'>
                        Find, book and manage parking slots easily with Slotify
                    </p>
                    {/* buttons */}
                    <div className='flex flex-col sm:flex-row gap-4'>
                        <a onClick={(e) => {
                            e.preventDefault(); document.getElementById("about")?.scrollIntoView({
                                behavior: "smooth"
                            });
                        }} className="cursor-pointer border bg-slate-900/20 border-cyan-400 text-cyan-400 px-6 py-3 shadow-[0_0_20px_rgba(34,211,238,0.5)] rounded-xl hover:bg-cyan-400 hover:text-black transition"
                        >
                            Learn More
                        </a>

                    </div>
                </div>
            </div>

            <section id="about" className="py-20 px-6 bg-slate-950 text-white">

                <h2 className="text-3xl font-bold text-cyan-400 text-center mb-10">
                    Why Choose Slotify?
                </h2>

                <div className="grid md:grid-cols-2 gap-6">

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 border-t-2 border-t-cyan-700">
                        <h3 className="text-xl font-semibold mb-3 flex gap-2 items-center"><FaParking className='text-cyan-400' /> Smart Parking Slot Booking</h3>
                        <p className="text-gray-300">
                            Users can easily view and book available parking slots in real time.
                        </p>
                    </div>

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 border-t-2 border-t-cyan-700">
                        <h3 className="text-xl font-semibold mb-3 flex gap-2 items-start"><FaClock className='text-cyan-400' /> Real-Time Slot Availability</h3>
                        <p className="text-gray-300">
                            Booked slots automatically turn red and unavailable for other users.
                        </p>
                    </div>

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 border-t-2 border-t-cyan-700">
                        <h3 className="text-xl font-semibold mb-3 flex gap-2 items-start"><BsBuildingFillCheck className='text-cyan-400' /> Floor-wise Slot Management</h3>
                        <p className="text-gray-300">
                            Parking slots are organized based on floors for easy navigation.
                        </p>
                    </div>

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 border-t-2 border-t-cyan-700">
                        <h3 className="text-xl font-semibold mb-3 flex gap-2 items-start"><FaUserShield className='text-cyan-400' />User Authentication</h3>
                        <p className="text-gray-300">
                            Users can register, login, and securely access their dashboard.
                        </p>
                    </div>

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 border-t-2 border-t-cyan-700">
                        <h3 className="text-xl font-semibold mb-3 flex gap-2 items-start"><FaDatabase className='text-cyan-400' /> Personalized Dashboard</h3>
                        <p className="text-gray-300">
                            Each user can view:
                            Total bookings,
                            Total amount spent,
                            Latest bookings,
                            Booking history.
                        </p>
                    </div>

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 border-t-2 border-t-cyan-700">
                        <h3 className="text-xl font-semibold mb-3 flex gap-2 items-start"><FaTachometerAlt className='text-cyan-400' /> Automatic Booking Expiry</h3>
                        <p className="text-gray-300">
                            After booking duration ends:

                            booking status becomes completed,
                            parking slot becomes available again.
                        </p>
                    </div>

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 border-t-2 border-t-cyan-700">
                        <h3 className="text-xl font-semibold mb-3 flex gap-2 items-start"><FaHistory className='text-cyan-400' /> Booking History Tracking</h3>
                        <p className="text-gray-300">
                            Users can track all previous parking bookings with details.
                        </p>
                    </div>

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 border-t-2 border-t-cyan-700">
                        <h3 className="text-xl font-semibold mb-3 flex gap-2 items-start"><FaCar className='text-cyan-400' /> Vehicle Information Management</h3>
                        <p className="text-gray-300">
                            Users can store:
                            vehicle name,
                            vehicle number,
                            booking details.
                        </p>
                    </div>
                </div>
            </section>

            {/* footer */}
            <Footer />

        </div>
    )
}

export default Landing;