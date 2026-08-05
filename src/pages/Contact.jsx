import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { FiMail, FiPhone, FiMapPin, FiSend } from "react-icons/fi";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // validation
    if (!form.name || !form.email || !form.message) {
      return alert("Please fill all fields");
    }

    try {
      // Construct mailto link to redirect user to mail client (e.g., Chrome/Gmail web/app client)
      const recipient = "abishiva05@gmail.com";
      const subject = encodeURIComponent(`New Message from ${form.name} via Slotify Contact`);
      const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`);
      
      window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;

      setSuccess("Redirecting to your mail client...");
      setForm({ name: "", email: "", message: "" });

      setTimeout(() => {
        setSuccess("");
      }, 4000);

    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300 mb-4">
            Contact Us
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
            Have questions about parking slots, booking issues, or feedback? 
            We'd love to hear from you.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Left Info Card */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-cyan-400 mb-6">
                Get In Touch
              </h2>

              <div className="space-y-6">
                {/* mail */}
                <div className="flex items-start gap-4 group">
                  <div className="bg-cyan-400/10 p-3 rounded-xl border border-cyan-400/20 group-hover:bg-cyan-400/20 transition">
                    <FiMail className="text-cyan-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-200">Email</h3>
                    <a 
                      href="mailto:abishiva05@gmail.com" 
                      className="text-cyan-400 hover:underline text-sm font-medium"
                    >
                      abishiva05@gmail.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 group">
                  <div className="bg-cyan-400/10 p-3 rounded-xl border border-cyan-400/20 group-hover:bg-cyan-400/20 transition">
                    <FiPhone className="text-cyan-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-200">Phone</h3>
                    <p className="text-gray-400 text-sm">
                      +91 98765 43210
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4 group">
                  <div className="bg-cyan-400/10 p-3 rounded-xl border border-cyan-400/20 group-hover:bg-cyan-400/20 transition">
                    <FiMapPin className="text-cyan-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-200">Location</h3>
                    <p className="text-gray-400 text-sm">
                      Chennai, Tamil Nadu, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Hours Box */}
            <div className="mt-10 bg-cyan-400/5 border border-cyan-400/20 rounded-2xl p-5">
              <h3 className="text-lg font-semibold text-cyan-300 mb-1">Support Hours</h3>
              <p className="text-gray-300 text-sm">Monday - Sunday</p>
              <p className="text-gray-400 text-sm">9:00 AM - 8:00 PM</p>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
            <h2 className="text-2xl font-bold text-cyan-400 mb-6">Send Message</h2>
            
            {/* Success Message */}
            {success && (
              <div className="mb-5 bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 px-4 py-3 rounded-xl text-sm animate-fade-in">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Enter Your Name" 
                  value={form.name} 
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-cyan-400 focus:bg-white/10 transition"
                />
              </div>

              <div>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Enter Your Email" 
                  value={form.email} 
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-cyan-400 focus:bg-white/10 transition"
                />
              </div>

              <div>
                <textarea 
                  rows="5" 
                  name="message" 
                  placeholder="Enter Your Message" 
                  value={form.message} 
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-cyan-400 focus:bg-white/10 transition resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full bg-cyan-400 text-slate-950 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-cyan-300 active:scale-[0.99] transition shadow-lg shadow-cyan-400/20 cursor-pointer"
              >
                <FiSend /> Send Message
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Contact;