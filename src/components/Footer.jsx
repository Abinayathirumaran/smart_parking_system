import React from "react";
import { Link } from "react-router-dom";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

function Footer() {
    return (
        <footer className="bg-slate-800 text-gray-300 mt-10 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">

                {/* About */}
                <div>
                    <h2 className="text-cyan-400 text-xl font-bold mb-4">Slotify</h2>
                    <p className="text-sm text-gray-400 leading-6">
                        Slotify helps you manage bookings and schedules easily with a simple and clean interface.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h2 className="text-white font-semibold mb-4">Quick Links</h2>

                    <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="hover:text-cyan-400">Home</Link></li>
                        <li><Link to="/slotarea" className="hover:text-cyan-400">Slots</Link></li>
                        <li><Link to="/dashboard" className="hover:text-cyan-400">Dashboard</Link></li>
                        <li><Link to="/contact" className="hover:text-cyan-400">Contact</Link></li>
                        <li><Link to="/favourites" className="hover:text-cyan-400">Favourites</Link></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h2 className="text-white font-semibold mb-4">Contact Info</h2>
                    <div className="space-y-3 text-sm text-gray-400">
                        
                        {/* Direct Web Gmail Link (Opens in Chrome / Browser tab) */}
                        <a 
                            href="https://mail.google.com/mail/?view=cm&fs=1&to=abishiva05@gmail.com&su=Slotify%20Inquiry&body=Hi%20Abinaya," 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
                        >
                            <FiMail /> abishiva05@gmail.com
                        </a>

                        <p className="flex items-center gap-2"><FiPhone /> +91 98765 43210</p>
                        <p className="flex items-center gap-2"><FiMapPin /> Chennai, India</p>
                    </div>

                    {/* Social Icons */}
                    <div className="flex gap-4 mt-5 text-xl">
                        <button type="button" className="hover:text-cyan-400"><FaInstagram /></button>
                        <button type="button" className="hover:text-cyan-400"><FaFacebook /></button>
                        <button type="button" className="hover:text-cyan-400"><FaTwitter /></button>
                        <button type="button" className="hover:text-cyan-400"><FaLinkedin /></button>
                    </div>
                </div>
            </div>

            {/* Bottom Copyright */}
            <div className="border-t border-slate-700/50 text-center py-4 text-sm text-gray-400">
                &copy; 2026 Slotify - AbinayaThirumaran. All rights reserved.
            </div>

        </footer>
    );
}

export default Footer;