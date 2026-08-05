import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  FaParking, 
  FaUserShield, 
  FaHistory, 
  FaHeart, 
  FaChartBar, 
  FaClock, 
  FaSearch, 
  FaReceipt, 
  FaArrowRight 
} from "react-icons/fa";

function Landing() {
    // Why Choose Slotify Points
    const features = [
        {
            icon: <FaParking />,
            title: "Smart Slot Booking",
            description: "Pick your specific spot and floor in real-time before arriving, guaranteeing your parking place instantly."
        },
        {
            icon: <FaClock />,
            title: "Real-Time Availability",
            description: "Occupied slots update live on interactive maps, ensuring you always view exact parking availability."
        },
        {
            icon: <FaHeart />,
            title: "Saved Favorites",
            description: "Bookmark your go-to parking locations for instant access and seamless repeat bookings in seconds."
        },
        {
            icon: <FaUserShield />,
            title: "Role-Based Auth",
            description: "Secure user authentication and protected admin accounts tailored with personalized dashboards."
        },
        {
            icon: <FaChartBar />,
            title: "Admin Analytics",
            description: "Comprehensive administration controls to manage parking lots, monitor revenue, and analyze slot usage."
        },
        {
            icon: <FaHistory />,
            title: "Automated Slot Expiry",
            description: "Built-in timers automatically release parking slots the exact moment reservations expire."
        }
    ];

    return (
        <div className='min-h-screen bg-slate-900 text-white'>

            {/* Navbar */}
            <Navbar />

            {/* Hero Section */}
            <div
                className='min-h-[85vh] bg-cover bg-center relative flex items-center justify-center'
                style={{ backgroundImage: `url("https://i.pinimg.com/736x/73/77/35/7377354233946dc8f77d839938a5a707.jpg")` }}>

                {/* Overlay */}
                <div className='absolute inset-0 bg-black/75'></div>

                {/* Content */}
                <div className='relative z-10 flex flex-col items-center justify-center text-center px-6 py-16 max-w-4xl mx-auto'>
                    <h1 className='text-4xl md:text-6xl font-bold leading-tight mb-5 text-white'>
                        Park Smarter with <span className="text-cyan-400">Slotify</span>
                    </h1>
                    <p className='text-gray-300 text-base md:text-xl mb-8 max-w-2xl leading-relaxed'>
                        Find available slots in real time, reserve across multiple floors, and manage your bookings effortlessly.
                    </p>
                    
                    {/* CTA Buttons - Compact on Mobile */}
                    <div className='flex flex-row gap-3 md:gap-4'>
                        <a 
                            onClick={(e) => {
                                e.preventDefault(); 
                                document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
                            }} 
                            className="cursor-pointer border bg-slate-900/40 border-cyan-400 text-cyan-400 px-4 py-2 md:px-6 md:py-3 text-sm md:text-base shadow-[0_0_15px_rgba(34,211,238,0.3)] rounded-lg md:rounded-xl hover:bg-cyan-400 hover:text-black transition font-semibold"
                        >
                            How It Works
                        </a>
                        <Link 
                            to="/slotarea" 
                            className="bg-cyan-500 text-slate-950 font-semibold px-4 py-2 md:px-6 md:py-3 text-sm md:text-base rounded-lg md:rounded-xl hover:bg-cyan-400 transition shadow-[0_0_15px_rgba(34,211,238,0.3)] flex items-center gap-1.5 md:gap-2"
                        >
                            Explore Slots <FaArrowRight className="text-xs md:text-sm" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-16 px-6 max-w-6xl mx-auto bg-slate-900 text-white border-b border-white/10">
                <h2 className="text-3xl font-bold text-cyan-400 text-center mb-3">
                    How It Works
                </h2>
                <p className="text-gray-300 text-center max-w-lg mx-auto text-sm md:text-base mb-12">
                    Reserve your parking space in three easy steps.
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Step 1 */}
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 border-t-2 border-t-cyan-500 text-center">
                        <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl flex items-center justify-center text-xl mx-auto mb-4">
                            <FaSearch />
                        </div>
                        <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold block mb-1">Step 01</span>
                        <h3 className="text-lg font-bold text-white mb-2">Find Lots</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Search parking locations and check live slot availability in your area.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 border-t-2 border-t-cyan-500 text-center">
                        <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl flex items-center justify-center text-xl mx-auto mb-4">
                            <FaParking />
                        </div>
                        <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold block mb-1">Step 02</span>
                        <h3 className="text-lg font-bold text-white mb-1">Select Spot</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Pick your floor and select an open slot on the interactive floor map.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 border-t-2 border-t-cyan-500 text-center">
                        <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl flex items-center justify-center text-xl mx-auto mb-4">
                            <FaReceipt />
                        </div>
                        <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold block mb-1">Step 03</span>
                        <h3 className="text-lg font-bold text-white mb-1">Pay & Get Receipt</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Choose your duration, complete payment, and instantly receive your booking receipt.
                        </p>
                    </div>
                </div>
            </section>

            {/* Why Choose Slotify Section (Zig-Zag Timeline) */}
            <section id="about" className="py-16 px-6 max-w-5xl mx-auto bg-slate-900 text-white">

                <h2 className="text-3xl font-bold text-cyan-400 text-center mb-12">
                    Why Choose Slotify?
                </h2>

                <div className="relative">
                    {/* Central Vertical Line (Visible on md screens and up) */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-cyan-500/30 -translate-x-1/2"></div>

                    <div className="space-y-12 md:space-y-16">
                        {features.map((item, index) => {
                            const isEven = index % 2 === 0;
                            return (
                                <div key={index} className="relative flex flex-col md:flex-row items-center">
                                    
                                    {/* Timeline Center Badge */}
                                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-slate-900 border-2 border-cyan-400 text-cyan-400 items-center justify-center text-base z-10 shadow-[0_0_12px_rgba(34,211,238,0.4)]">
                                        {item.icon}
                                    </div>

                                    {/* Content Card Positioned Left or Right */}
                                    <div className={`w-full md:w-1/2 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12 md:ml-auto md:text-left'}`}>
                                        <div className="bg-slate-800/60 p-6 rounded-2xl border border-white/10 hover:border-cyan-400/50 transition duration-300 shadow-md">
                                            
                                            {/* Mobile Icon View */}
                                            <div className="flex md:hidden w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 items-center justify-center text-lg mb-3">
                                                {item.icon}
                                            </div>

                                            <h3 className="text-lg font-semibold text-white mb-2">
                                                {item.title}
                                            </h3>
                                            <p className="text-gray-300 text-sm leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Bottom CTA Banner */}
            <section className="py-12 px-6 max-w-5xl mx-auto">
                <div className="rounded-3xl bg-slate-950 border border-cyan-500/30 p-8 md:p-10 text-center shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                        Ready to Skip the Search?
                    </h2>
                    <p className="text-gray-300 text-sm md:text-base mb-6 max-w-lg mx-auto">
                        Reserve your spot now and enjoy quick, guaranteed parking.
                    </p>
                    <Link 
                        to="/slotarea" 
                        className="inline-flex items-center gap-1.5 md:gap-2 bg-cyan-500 text-slate-950 text-sm md:text-base font-bold px-5 py-2.5 md:px-7 md:py-3 rounded-lg md:rounded-xl hover:bg-cyan-400 transition"
                    >
                        Find Your Spot <FaArrowRight className="text-xs md:text-sm" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <Footer email="abishiva05@gmail.com" />

        </div>
    );
}

export default Landing;