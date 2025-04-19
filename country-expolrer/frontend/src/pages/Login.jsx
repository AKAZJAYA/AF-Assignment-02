import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import {
  FiLogIn,
  FiMail,
  FiLock,
  FiAlertCircle,
  FiGlobe,
  FiX,
} from "react-icons/fi";

import { login, clearError } from "../redux/slices/authSlice";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showSuccess, setShowSuccess] = useState(false);
  const cardRef = useRef(null);
  const controls = useAnimation();

  const { isAuthenticated, status, error } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      setShowSuccess(true);
      const timeout = setTimeout(() => {
        navigate("/");
      }, 1500);

      return () => clearTimeout(timeout);
    }

    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      setMousePosition({ x, y });

      // Reduce tilt effect on mobile/smaller screens
      const isMobile = window.innerWidth < 768;
      const tiltFactor = isMobile ? 5 : 10;
      
      const tiltX = (y - 0.5) * tiltFactor;
      const tiltY = (x - 0.5) * -tiltFactor;

      controls.start({
        rotateX: tiltX,
        rotateY: tiltY,
        transition: { type: "spring", stiffness: 300, damping: 30 },
      });
    };

    const handleMouseLeave = () => {
      controls.start({
        rotateX: 0,
        rotateY: 0,
        transition: { type: "spring", stiffness: 300, damping: 30 },
      });
    };

    const handleTouchMove = (e) => {
      if (!cardRef.current || e.touches.length < 1) return;
      
      const touch = e.touches[0];
      const rect = cardRef.current.getBoundingClientRect();
      const x = (touch.clientX - rect.left) / rect.width;
      const y = (touch.clientY - rect.top) / rect.height;
      
      setMousePosition({ x, y });
      
      // Gentler tilt for touch devices
      const tiltX = (y - 0.5) * 3; 
      const tiltY = (x - 0.5) * -3;
      
      controls.start({
        rotateX: tiltX,
        rotateY: tiltY,
        transition: { type: "spring", stiffness: 200, damping: 40 },
      });
    };

    const handleResize = () => {
      // Reset any device-specific styles or animations
      controls.start({
        rotateX: 0,
        rotateY: 0,
        transition: { type: "spring", stiffness: 300, damping: 30 },
      });
    };

    const card = cardRef.current;
    if (card) {
      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);
      card.addEventListener("touchmove", handleTouchMove);
      card.addEventListener("touchend", handleMouseLeave);
      window.addEventListener("resize", handleResize);

      return () => {
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseleave", handleMouseLeave);
        card.removeEventListener("touchmove", handleTouchMove);
        card.removeEventListener("touchend", handleMouseLeave);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [controls]);

  const validateForm = () => {
    const errors = {};
    const { email, password } = formData;

    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: "",
      });
    }

    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      dispatch(login(formData));
    }
  };

  const gradient = {
    background: `radial-gradient(circle at ${mousePosition.x * 100}% ${
      mousePosition.y * 100
    }%, rgba(99, 102, 241, 0.3) 0%, rgba(255, 255, 255, 0) 50%)`,
  };

  const darkGradient = {
    background: `radial-gradient(circle at ${mousePosition.x * 100}% ${
      mousePosition.y * 100
    }%, rgba(99, 102, 241, 0.2) 0%, rgba(30, 30, 30, 0) 50%)`,
  };

  const successVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: {
      scale: 1.5,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  // Reduce number of floating icons on smaller screens
  const iconCount = window.innerWidth < 768 ? 6 : 12;
  
  const floatingIcons = Array(iconCount)
    .fill()
    .map((_, i) => ({
      id: i,
      icon: i % 3 === 0 ? <FiGlobe /> : i % 3 === 1 ? <FiMail /> : <FiLock />,
      size: Math.random() * (window.innerWidth < 640 ? 15 : 20) + (window.innerWidth < 640 ? 8 : 10),
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));

  return (
    <div
      className={`w-full px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 relative overflow-hidden ${
        darkMode ? "text-white" : "text-gray-900"
      }`}
    >
      {/* Background icons - fewer and smaller on mobile */}
      <div className="fixed inset-0 overflow-hidden opacity-5 sm:opacity-10 pointer-events-none">
        {floatingIcons.map((icon) => (
          <motion.div
            key={icon.id}
            className={`absolute ${
              darkMode ? "text-indigo-300" : "text-indigo-500"
            }`}
            initial={{ x: `${icon.x}%`, y: `${icon.y}%` }}
            animate={{
              y: [`${icon.y}%`, `${icon.y + 20}%`, `${icon.y}%`],
              rotate: [0, 360, 0],
            }}
            transition={{
              duration: icon.duration,
              repeat: Infinity,
              delay: icon.delay,
              ease: "easeInOut",
            }}
            style={{ fontSize: icon.size }}
          >
            {icon.icon}
          </motion.div>
        ))}
      </div>

      {/* Success Animation - Full screen on all devices */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              variants={successVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-full p-8 sm:p-10 shadow-2xl flex flex-col items-center mx-4`}
            >
              <motion.div
                className="text-4xl sm:text-5xl text-green-500 mb-3 sm:mb-4"
                initial={{ scale: 0 }}
                animate={{
                  scale: [0, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                ✓
              </motion.div>
              <h2
                className={`text-xl sm:text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Login Successful!
              </h2>
              <p className={`text-sm sm:text-base ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Redirecting you now...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Card Container with max width constraints */}
      <div className="max-w-xs xs:max-w-sm sm:max-w-md md:max-w-4xl mx-auto">
        <motion.div
          ref={cardRef}
          animate={controls}
          style={{ perspective: 1000 }}
          className="relative"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-2 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl md:shadow-2xl overflow-hidden relative"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Hover gradient effect - subtle on touch devices */}
            <div
              className="absolute inset-0 pointer-events-none z-10 opacity-0 hover:opacity-100 transition-opacity duration-300"
              style={darkMode ? darkGradient : gradient}
            />

            {/* Left side panel - hidden on mobile, animated appearance on tablets+ */}
            <div className="hidden md:block relative bg-gradient-to-br from-indigo-600 to-cyan-500 p-6 lg:p-12">
              <div className="absolute inset-0 opacity-20">
                <motion.div
                  className="absolute top-20 left-10 w-40 h-40 rounded-full bg-white blur-3xl"
                  animate={{
                    x: [0, 20, 0, -20, 0],
                    y: [0, -20, 0, 20, 0],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-cyan-200 blur-3xl"
                  animate={{
                    x: [0, -20, 0, 20, 0],
                    y: [0, 20, 0, -20, 0],
                  }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>

              <div className="relative h-full flex flex-col justify-between z-10">
                <div>
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.3,
                    }}
                    whileHover={{
                      rotate: 360,
                      scale: 1.1,
                      transition: { duration: 0.8 },
                    }}
                    className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg mb-6 lg:mb-8"
                  >
                    <FiGlobe className="text-2xl lg:text-3xl text-indigo-600" />
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-2xl lg:text-3xl font-bold text-white mb-3 lg:mb-4"
                  >
                    Welcome Back!
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-white/80 text-sm lg:text-base"
                  >
                    Log in to continue your journey exploring countries around the
                    world.
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="text-white/70 text-xs lg:text-sm relative"
                >
                  <motion.div
                    className="absolute -top-4 -left-4 text-2xl lg:text-3xl text-white/30"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    "
                  </motion.div>
                  <motion.div
                    className="absolute -bottom-4 -right-4 text-2xl lg:text-3xl text-white/30"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 }}
                  >
                    "
                  </motion.div>
                  "The world is a book and those who do not travel read only one
                  page."
                  <div className="mt-1 font-medium">— Saint Augustine</div>
                </motion.div>

                <motion.div
                  className="absolute bottom-0 right-0 w-24 lg:w-32 h-24 lg:h-32 opacity-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.1 }}
                  transition={{ delay: 1, duration: 1 }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <motion.path
                      d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      stroke="white"
                      strokeWidth="0.5"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 3, ease: "easeInOut" }}
                    />
                    <motion.path
                      d="M3.6 9H20.4M3.6 15H20.4M12 3C14.5 7.5 14.5 16.5 12 21M12 3C9.5 7.5 9.5 16.5 12 21"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      stroke="white"
                      strokeWidth="0.5"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 3, delay: 0.5, ease: "easeInOut" }}
                    />
                  </svg>
                </motion.div>
              </div>
            </div>

            {/* Right side / Main form panel - optimized padding for all screen sizes */}
            <div
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } p-6 xs:p-7 sm:p-8 md:p-10 lg:p-12 relative transition-colors duration-300`}
            >
              {/* Decorative corners - smaller on mobile */}
              <div className="absolute top-0 right-0 border-t-4 sm:border-t-6 md:border-t-8 border-r-4 sm:border-r-6 md:border-r-8 border-indigo-600/20 dark:border-indigo-400/20 w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12"></div>
              <div className="absolute bottom-0 left-0 border-b-4 sm:border-b-6 md:border-b-8 border-l-4 sm:border-l-6 md:border-l-8 border-indigo-600/20 dark:border-indigo-400/20 w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12"></div>

              {/* Header section - adaptive sizes */}
              <div className="text-center mb-6 sm:mb-8">
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  whileHover={{
                    scale: 1.1,
                    boxShadow: "0px 10px 25px rgba(79, 70, 229, 0.4)",
                    transition: { duration: 0.3 },
                  }}
                  className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-400 mb-3 sm:mb-4 shadow-lg shadow-indigo-500/30"
                >
                  <FiLogIn className="text-2xl sm:text-2xl md:text-3xl text-white" />
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-500"
                >
                  Log in to your account
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className={`${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  } mt-1 text-xs sm:text-sm`}
                >
                  Welcome back to Country Explorer
                </motion.p>
              </div>

              {/* Error Message - Full width on all devices */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`mb-4 sm:mb-6 p-2 sm:p-3 ${
                      darkMode
                        ? "bg-red-900/30 text-red-300"
                        : "bg-red-100 text-red-700"
                    } rounded-md flex items-start relative overflow-hidden`}
                  >
                    <motion.div
                      className="absolute inset-0 bg-red-500/10"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "linear",
                      }}
                    />
                    <FiAlertCircle className="text-red-500 mt-0.5 mr-2 flex-shrink-0 text-sm sm:text-base" />
                    <span className="text-xs sm:text-sm">{error}</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => dispatch(clearError())}
                      className="ml-auto text-red-500 text-sm sm:text-base"
                    >
                      <FiX />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form - Adaptive spacing and input sizes */}
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 sm:space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label
                      htmlFor="email"
                      className={`block text-xs sm:text-sm font-medium ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      } mb-1`}
                    >
                      Email address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <motion.div
                          animate={{
                            color: formData.email
                              ? "#6366f1"
                              : darkMode
                              ? "#9ca3af"
                              : "#9ca3af",
                          }}
                        >
                          <FiMail className="text-sm sm:text-base" />
                        </motion.div>
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`input pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 w-full text-xs sm:text-sm transition-all duration-300 ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                        } rounded-md focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/50 group-hover:border-indigo-500 dark:group-hover:border-indigo-400
                        ${
                          formErrors.email
                            ? "border-red-500 focus:ring-red-500/50 dark:focus:ring-red-400/50"
                            : ""
                        }
                        `}
                        placeholder="your@email.com"
                      />
                      <motion.div
                        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-600 to-cyan-500"
                        initial={{ width: 0 }}
                        animate={{ width: formData.email ? "100%" : "0%" }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <AnimatePresence>
                      {formErrors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mt-1 text-xs sm:text-sm text-red-500 flex items-center"
                        >
                          <FiAlertCircle className="mr-1 text-xs sm:text-sm" /> {formErrors.email}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label
                      htmlFor="password"
                      className={`block text-xs sm:text-sm font-medium ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      } mb-1`}
                    >
                      Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <motion.div
                          animate={{
                            color: formData.password
                              ? "#6366f1"
                              : darkMode
                              ? "#9ca3af"
                              : "#9ca3af",
                          }}
                        >
                          <FiLock className="text-sm sm:text-base" />
                        </motion.div>
                      </div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`input pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 w-full text-xs sm:text-sm transition-all duration-300 ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                        } rounded-md focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/50 group-hover:border-indigo-500 dark:group-hover:border-indigo-400
                        ${
                          formErrors.password
                            ? "border-red-500 focus:ring-red-500/50 dark:focus:ring-red-400/50"
                            : ""
                        }
                        `}
                        placeholder="••••••••"
                      />
                      <motion.div
                        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-600 to-cyan-500"
                        initial={{ width: 0 }}
                        animate={{ width: formData.password ? "100%" : "0%" }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <AnimatePresence>
                      {formErrors.password && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mt-1 text-xs sm:text-sm text-red-500 flex items-center"
                        >
                          <FiAlertCircle className="mr-1 text-xs sm:text-sm" /> {formErrors.password}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="pt-2 sm:pt-4"
                  >
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full py-2 sm:py-3 px-4 flex justify-center items-center rounded-md transition-all duration-300 relative overflow-hidden group text-sm sm:text-base"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-cyan-500 transition-transform group-hover:scale-105 duration-300"></div>

                      <div className="relative z-10 text-white font-medium flex items-center justify-center">
                        {status === "loading" ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                          />
                        ) : (
                          <motion.span
                            animate={{ x: [0, -3, 3, -2, 2, 0] }}
                            transition={{ duration: 0.5, delay: 1.2 }}
                            className="mr-2"
                          >
                            <FiLogIn className="text-sm sm:text-base" />
                          </motion.span>
                        )}
                        <span>
                          {status === "loading" ? "Logging in..." : "Log in"}
                        </span>
                      </div>

                      <motion.div
                        className="absolute -inset-full h-full w-1/4 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40"
                        animate={{ left: ["150%", "-150%"] }}
                        transition={{
                          duration: 2,
                          delay: 0.8,
                          repeat: Infinity,
                          repeatDelay: 5,
                        }}
                      />
                    </button>
                  </motion.div>
                </div>
              </form>

              {/* Sign up link - Adaptive text size */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-6 sm:mt-8 text-center"
              >
                <p className={`text-xs sm:text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className={`relative inline-block ${
                      darkMode ? "text-indigo-400" : "text-indigo-600"
                    } font-medium group`}
                  >
                    <span className="relative z-10">Register</span>
                    <motion.span
                      className={`absolute bottom-0 left-0 w-full h-0.5 ${
                        darkMode ? "bg-indigo-400" : "bg-indigo-600"
                      } rounded`}
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;