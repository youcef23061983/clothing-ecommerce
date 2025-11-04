import React, { useEffect, useState, useRef } from "react";
import img from "/images/men/banner/contact.jpg";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaFax,
  FaEnvelope,
  FaUser,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

const Contact = ({ onSubmit }) => {
  const [formStatus, setFormStatus] = useState(null);
  const form = useRef();
  const [user, setUser] = useState({ name: "", email: "", comment: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const sendEmail = (e) => {
    e.preventDefault();

    if (!user.name || !user.email || !user.comment) {
      alert("Please enter your information");
      return;
    }

    if (onSubmit) {
      onSubmit(user);
      return;
    }

    emailjs
      .sendForm("service_vgkozvc", "template_sv5btsr", form.current, {
        publicKey: import.meta.env.VITE_CONTACT_PUBLIC_KEY,
      })
      .then(
        () => {
          setFormStatus("Message sent successfully!");
          setUser({ name: "", email: "", comment: "" });
          setTimeout(() => {
            setFormStatus(null);
          }, 5000);
        },
        (error) => {
          setFormStatus(`Failed to send message: ${error.text}`);
        }
      );
  };

  useEffect(() => {
    document.title = "Contact";
  }, []);

  return (
    <div>
      {/* Header Section */}
      <div className="headerimages relative h-96 overflow-hidden">
        <img
          src={img}
          alt="contact"
          loading="lazy"
          className="detailImg w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <motion.h1
            className="text-5xl font-bold text-white text-center"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            CONTACT US
          </motion.h1>
        </div>
      </div>

      {/* Contact Content - Centered and Wider */}
      <div className=" w-8/12 mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          {/* Contact Info - Left Side */}
          <motion.div
            className="h-full"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-lg rounded-3xl p-10 border border-amber-400/30 shadow-2xl h-full flex flex-col">
              <motion.h2
                className="text-5xl font-bold text-white mb-10 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                GET IN TOUCH
              </motion.h2>

              <div className="space-y-8 flex-1">
                {[
                  {
                    icon: FaMapMarkerAlt,
                    title: "Address:",
                    content: "123 Main Street, City Center, Paris , France",
                  },
                  {
                    icon: FaPhone,
                    title: "Phone:",
                    content: "+60 3-1234 5678",
                  },
                  {
                    icon: FaFax,
                    title: "Fax:",
                    content: "+60 3-1234 5679",
                  },
                  {
                    icon: FaEnvelope,
                    title: "Email:",
                    content: "desire@gmail.com",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="touch flex items-center gap-6 p-6 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 transition-all duration-300 group border border-amber-400/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <item.icon className="text-white text-xl" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-amber-100 mb-2">
                        {item.title}
                      </h4>
                      <p className="text-amber-200 group-hover:text-white transition-colors text-lg">
                        {item.content}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form - Right Side */}
          <motion.div
            className="h-full"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-lg rounded-3xl p-10 border border-amber-400/30 shadow-2xl h-full flex flex-col">
              <motion.form
                ref={form}
                onSubmit={sendEmail}
                className="space-y-8 flex-1 flex flex-col"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex-1 space-y-8">
                  {/* Name Field */}
                  <motion.div
                    className="info group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <label
                      htmlFor="name"
                      className="block text-3xl font-bold text-white mb-3"
                    >
                      First Name:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={user.name}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-amber-500/10 border border-amber-400/30 rounded-2xl text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300 text-xxl"
                        placeholder="Enter your first name"
                      />
                      <FaUser className="absolute right-4 top-1/2 transform -translate-y-1/2 text-amber-300 text-xl" />
                    </div>
                  </motion.div>

                  {/* Email Field */}
                  <motion.div
                    className="info group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <label
                      htmlFor="email"
                      className="block text-3xl font-bold text-white mb-3"
                    >
                      Email:
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={user.email}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-amber-500/10 border border-amber-400/30 rounded-2xl text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300 text-xxl"
                        placeholder="Enter your email address"
                      />
                      <FaEnvelope className="absolute right-4 top-1/2 transform -translate-y-1/2 text-amber-300 text-xxl" />
                    </div>
                  </motion.div>

                  {/* Comment Field */}
                  <motion.div
                    className="info group flex-1 flex flex-col"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                  >
                    <label
                      htmlFor="comment"
                      className="block text-3xl font-bold text-white mb-3"
                    >
                      Comment:
                    </label>
                    <div className="relative flex-1">
                      <textarea
                        name="comment"
                        id="comment"
                        value={user.comment}
                        onChange={handleChange}
                        className="w-full h-64 px-6 py-4 bg-amber-500/10 border border-amber-400/30 rounded-2xl text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300 resize-none text-xxl"
                        placeholder="Enter your message..."
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className=" w-full py-5 px-8 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 group mt-8"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                >
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl">Submit</span>
                    <FaPaperPlane className="group-hover:translate-x-2 transition-transform duration-300 text-xl" />
                  </div>
                </motion.button>
              </motion.form>

              {/* Form Status Message */}
              {formStatus && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-6 p-4 rounded-2xl text-center font-bold backdrop-blur-lg border ${
                    formStatus.includes("successfully")
                      ? "bg-green-500/30 text-green-100 border-green-400"
                      : "bg-red-500/30 text-red-100 border-red-400"
                  } shadow-lg`}
                >
                  <div className="flex items-center justify-center gap-3">
                    {formStatus.includes("successfully") ? (
                      <FaCheckCircle className="text-green-300 text-xl" />
                    ) : (
                      <FaExclamationCircle className="text-red-300 text-xl" />
                    )}
                    <span className="text-lg">{formStatus}</span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
