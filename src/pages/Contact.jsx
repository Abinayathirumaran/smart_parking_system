import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { FiMail, FiPhone, FiMapPin, FiSend } from "react-icons/fi";
import API from "../services/api";


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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validation
    if (!form.name || !form.email || !form.message) {
      return alert("Please fill all fields");
    }

    try {
      await API.post("/contactMessages", { ...form, createdAt: new Date() });   //save msg in db.json
      setSuccess("Message sent successfully!");

      setForm({ name: "", email: "", message: "" });    //clear form

      setTimeout(() => {
        setSuccess("");
      }, 3000);

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
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-4"> Contact Us </h1>

          <p className="text-gray-400 max-w-2xl mx-auto">
            Have questions about parking slots, booking issues, or feedback?
            We'd love to hear from you.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Left  */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-lg">
            <h2 className="text-2xl font-bold text-cyan-400 mb-6">
              Get In Touch
            </h2>

            <div className="space-y-6">
              {/* mail */}
              <div className="flex items-start gap-4">
                <div className="bg-cyan-400/10 p-3 rounded-xl">
                  <FiMail className="text-cyan-400 text-xl" />
                </div>

                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-gray-400 text-sm">
                    support@slotify.com
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="bg-cyan-400/10 p-3 rounded-xl">
                  <FiPhone className="text-cyan-400 text-xl" />
                </div>

                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-gray-400 text-sm">
                    +91 98765 43210
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="bg-cyan-400/10 p-3 rounded-xl">
                  <FiMapPin className="text-cyan-400 text-xl" />
                </div>

                <div>
                  <h3 className="font-semibold">Location</h3>
                  <p className="text-gray-400 text-sm">
                    Chennai, Tamil Nadu, India
                  </p>
                </div>
              </div>

            </div>

            {/* info Box */}
            <div className="mt-10 bg-cyan-400/10 border border-cyan-400/20 rounded-2xl p-5">
              <h3 className="text-lg font-semibold text-cyan-300 mb-2">Support Hours  </h3>
              <p className="text-gray-300 text-sm">Monday - Sunday</p>
              <p className="text-gray-400 text-sm"> 9:00 AM - 8:00 PM</p>
            </div>

          </div>

          {/* Contact Form */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-lg">

            <h2 className="text-2xl font-bold text-cyan-400 mb-6">Send Message</h2>
            {/* Success Message */}
            {
              success && (
                <div className="mb-5 bg-green-500/20 border border-green-400 text-green-300 px-4 py-3 rounded-xl">
                  {success}
                </div>
              )
            }

            <form onSubmit={handleSubmit} className="space-y-5">

              <input type="text" name="name" placeholder="Enter Your Name" value={form.name} onChange={handleChange}
                className="w-full p-4 rounded-xl bg-white/10 border border-gray-700 outline-none focus:border-cyan-400"
              />

              <input type="email" name="email" placeholder="Enter Your Email" value={form.email} onChange={handleChange}
                className="w-full p-4 rounded-xl bg-white/10 border border-gray-700 outline-none focus:border-cyan-400" />


              <textarea rows="6" name="message" placeholder="Enter Your Message" value={form.message} onChange={handleChange}
                className="w-full p-4 rounded-xl bg-white/10 border border-gray-700 outline-none focus:border-cyan-400 resize-none"
              ></textarea>

              <button type="submit" className="w-full bg-cyan-400 text-black py-4 rounded-xl font-bold flex
                items-center justify-center gap-2 hover:bg-cyan-300 transition duration-300 cursor-pointer" >
                <FiSend />  Send Message </button>
            </form>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Contact;