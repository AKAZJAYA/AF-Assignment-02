import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  FiUser,
  FiMail,
  FiClock,
  FiEdit2,
  FiHeart,
  FiMapPin,
  FiGlobe,
  FiSettings,
  FiChevronRight,
  FiShield,
  FiStar,
  FiFlag,
  FiSearch,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import confetti from "canvas-confetti";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const { favorites } = useSelector((state) => state.favorites);
  const { countries } = useSelector((state) => state.countries);
  const { darkMode } = useSelector((state) => state.theme);
  const [activeTab, setActiveTab] = useState("account");
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showConfetti, setShowConfetti] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const profileCardRef = useRef(null);

  // Check screen size for responsive adaptations
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add event listener
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Get favorite country objects
  const favoriteCountries = countries
    .filter((country) => favorites.includes(country.alpha3Code))
    .slice(0, 4);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Random stats for demo purposes
  const memberStats = {
    daysActive: Math.floor(Math.random() * 100) + 10,
    countriesExplored: Math.floor(Math.random() * 50) + 5,
    searchCount: Math.floor(Math.random() * 200) + 20,
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    hover: {
      scale: isMobile ? 1.01 : 1.02, // Subtle scale on mobile
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { type: "spring", stiffness: 300, damping: 15 },
    },
  };

  const tabVariants = {
    active: {
      backgroundColor: darkMode ? "rgb(31, 41, 55)" : "rgb(238, 242, 255)",
      color: darkMode ? "rgb(165, 180, 252)" : "rgb(79, 70, 229)",
      scale: isMobile ? 1.02 : 1.05, // Subtle scale on mobile
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
    inactive: {
      backgroundColor: "transparent",
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  // 3D card tilt effect - adaptive for different devices
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const handleProfileCardMouseMove = (e) => {
    if (!profileCardRef.current || isMobile) return; // Disable on mobile devices
    
    const rect = profileCardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Reduce rotation intensity on smaller screens
    const intensityFactor = window.innerWidth < 1024 ? 5 : 10;
    const rotateXValue = ((y - height / 2) / height) * intensityFactor;
    const rotateYValue = ((width / 2 - x) / width) * intensityFactor;

    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);
    setIsHovering(true);
  };

  const handleProfileCardMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    setIsHovering(false);
  };

  const handleTouchMove = (e) => {
    if (!profileCardRef.current || !e.touches[0]) return;
    
    // Get the first touch
    const touch = e.touches[0];
    const rect = profileCardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    // Use more subtle rotation for touch devices
    const rotateXValue = ((y - height / 2) / height) * 3;
    const rotateYValue = ((width / 2 - x) / width) * 3;

    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);
    setIsHovering(true);
  };

  const statsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  };

  // Trigger confetti effect with device adaptations
  const triggerConfetti = () => {
    setShowConfetti(true);
    
    // Adjust confetti for different screen sizes
    const particleCount = window.innerWidth < 768 ? 70 : 100;
    const spread = window.innerWidth < 768 ? 50 : 70;
    
    confetti({
      particleCount,
      spread,
      origin: { y: 0.6 },
    });
    
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      triggerConfetti();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`max-w-6xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 ${
        darkMode ? "dark bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 sm:space-y-8"
      >
        {/* Header - Responsive typography and spacing */}
        <motion.div variants={itemVariants} className="text-center relative">
          <div className="inline-block relative">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className={`relative inline-flex items-center justify-center w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 rounded-full ${
                darkMode
                  ? "bg-gradient-to-br from-indigo-700 to-cyan-600"
                  : "bg-gradient-to-br from-indigo-500 to-cyan-400"
              } mb-3 xs:mb-4 shadow-lg cursor-pointer`}
              onClick={triggerConfetti}
            >
              <span className="text-2xl xs:text-3xl sm:text-4xl text-white font-bold">
                {user?.username.charAt(0).toUpperCase()}
              </span>
              {/* Animated ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-indigo-300"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.7, 0.3, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
            {/* Edit icon - adjusted for responsive layout */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              className={`absolute bottom-2 xs:bottom-3 right-0 w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 ${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-full shadow-md flex items-center justify-center ${
                darkMode ? "text-indigo-300" : "text-indigo-500"
              } cursor-pointer`}
            >
              <FiEdit2 size={isMobile ? 12 : 16} />
            </motion.div>
          </div>
          <motion.h1
            className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-500"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ backgroundSize: "200% auto" }}
          >
            Welcome, {user?.username}!
          </motion.h1>
          <motion.p variants={itemVariants} className="text-xs xs:text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Explore your profile and favorites
          </motion.p>
        </motion.div>

        {/* Tab navigation - Improved spacing and sizing for all screens */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 gap-1 xs:gap-2 max-w-xs xs:max-w-sm sm:max-w-md md:max-w-xl mx-auto"
        >
          {[
            { id: "account", label: "My Account", icon: <FiUser /> },
            { id: "activity", label: "Activity", icon: <FiGlobe /> },
          ].map((tab, i) => (
            <motion.button
              key={tab.id}
              custom={i}
              variants={tabVariants}
              animate={activeTab === tab.id ? "active" : "inactive"}
              whileHover={{ scale: isMobile ? 1.02 : 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center xs:justify-start px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-lg transition-all duration-200 text-xs xs:text-sm sm:text-base font-medium ${
                activeTab === tab.id
                  ? darkMode
                    ? "bg-gray-800 text-indigo-300"
                    : "bg-indigo-50 text-indigo-600"
                  : darkMode
                  ? "text-gray-400 hover:bg-gray-800"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="mr-1 xs:mr-2">{tab.icon}</span>
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Content area */}
        <div className="mt-4 xs:mt-6 sm:mt-8">
          <AnimatePresence mode="wait">
            {activeTab === "account" && (
              <motion.div
                key="account"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 lg:gap-8">
                  {/* Account Info Card */}
                  <motion.div
                    ref={profileCardRef}
                    onMouseMove={handleProfileCardMouseMove}
                    onMouseLeave={handleProfileCardMouseLeave}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleProfileCardMouseLeave}
                    style={{
                      rotateX: isHovering ? rotateX : 0,
                      rotateY: isHovering ? rotateY : 0,
                      transformStyle: "preserve-3d",
                      perspective: 1000,
                    }}
                    variants={cardVariants}
                    whileHover="hover"
                    className={`md:col-span-2 ${
                      darkMode ? "bg-gray-800" : "bg-white"
                    } rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg overflow-hidden relative`}
                  >
                    {/* 3D layers */}
                    <div className="relative p-4 xs:p-5 sm:p-6 md:p-8">
                      <div
                        style={{ transform: isMobile ? "none" : "translateZ(40px)" }}
                        className="mb-4 sm:mb-6"
                      >
                        <h2 className="text-base xs:text-lg sm:text-xl font-semibold flex items-center">
                          <FiUser className="mr-2 text-indigo-500" />
                          Account Information
                        </h2>
                        <div className="mt-1 h-1 w-16 xs:w-20 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"></div>
                      </div>
                      <div
                        className="space-y-4 sm:space-y-6"
                        style={{ transform: isMobile ? "none" : "translateZ(20px)" }}
                      >
                        <div className="flex items-start">
                          <div
                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${
                              darkMode ? "bg-gray-700" : "bg-indigo-100"
                            } flex-shrink-0 flex items-center justify-center ${
                              darkMode ? "text-indigo-300" : "text-indigo-500"
                            }`}
                          >
                            <FiUser className="text-xs sm:text-base" />
                          </div>
                          <div className="ml-3 sm:ml-4">
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Username</p>
                            <p className="text-sm sm:text-base font-medium">
                              {user?.username || "Not available"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div
                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${
                              darkMode ? "bg-gray-700" : "bg-indigo-100"
                            } flex-shrink-0 flex items-center justify-center ${
                              darkMode ? "text-indigo-300" : "text-indigo-500"
                            }`}
                          >
                            <FiMail className="text-xs sm:text-base" />
                          </div>
                          <div className="ml-3 sm:ml-4">
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Email</p>
                            <p className="text-sm sm:text-base font-medium">
                              {user?.email || "Not available"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div
                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${
                              darkMode ? "bg-gray-700" : "bg-indigo-100"
                            } flex-shrink-0 flex items-center justify-center ${
                              darkMode ? "text-indigo-300" : "text-indigo-500"
                            }`}
                          >
                            <FiClock className="text-xs sm:text-base" />
                          </div>
                          <div className="ml-3 sm:ml-4">
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                              Member since
                            </p>
                            <p className="text-sm sm:text-base font-medium">
                              {user?.createdAt
                                ? formatDate(user.createdAt)
                                : "Not available"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-6 sm:mt-8 text-right"
                        style={{ transform: isMobile ? "none" : "translateZ(30px)" }}
                      >
                        <button
                          className={`px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 text-xs xs:text-sm sm:text-base ${
                            darkMode
                              ? "bg-indigo-700 hover:bg-indigo-600"
                              : "bg-indigo-600 hover:bg-indigo-700"
                          } text-white rounded-lg inline-flex items-center transition-all duration-200 shadow-md hover:shadow-xl`}
                        >
                          <FiSettings className="mr-1.5 xs:mr-2" />
                          Edit Profile
                        </button>
                      </motion.div>
                      {/* Decorative elements - hidden on very small screens */}
                      <div
                        className={`hidden xs:block absolute -bottom-10 -left-10 w-28 sm:w-40 h-28 sm:h-40 rounded-full ${
                          darkMode ? "bg-indigo-900/10" : "bg-indigo-500/10"
                        } blur-3xl pointer-events-none`}
                      ></div>
                      <div
                        className={`hidden xs:block absolute -top-10 -right-10 w-28 sm:w-40 h-28 sm:h-40 rounded-full ${
                          darkMode ? "bg-cyan-900/10" : "bg-cyan-500/10"
                        } blur-3xl pointer-events-none`}
                      ></div>
                    </div>
                  </motion.div>
                  {/* Stats Card */}
                  <motion.div
                    variants={cardVariants}
                    whileHover="hover"
                    className={`${
                      darkMode ? "bg-gray-800" : "bg-white"
                    } rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg overflow-hidden p-4 xs:p-5 sm:p-6 md:p-8`}
                  >
                    <h2 className="text-base xs:text-lg sm:text-xl font-semibold flex items-center mb-4 sm:mb-6">
                      <FiStar className="mr-2 text-indigo-500" />
                      Statistics
                    </h2>
                    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                      <motion.div
                        custom={0}
                        variants={statsVariants}
                        className={`${
                          darkMode
                            ? "bg-gradient-to-r from-gray-800 to-gray-900"
                            : "bg-gradient-to-r from-indigo-50 to-cyan-50"
                        } p-3 xs:p-4 rounded-lg sm:rounded-xl`}
                      >
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1 sm:mb-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 10,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="text-xl sm:text-2xl md:text-3xl text-indigo-500"
                            >
                              <FiHeart />
                            </motion.div>
                          </div>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 260,
                              damping: 20,
                              delay: 0.2,
                            }}
                            className="text-2xl xs:text-3xl sm:text-4xl font-bold text-indigo-600"
                          >
                            {favorites.length}
                          </motion.div>
                          <p className="text-xs xs:text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Favorite Countries
                          </p>
                        </div>
                      </motion.div>
                      <motion.div
                        custom={1}
                        variants={statsVariants}
                        className="grid grid-cols-2 gap-2 xs:gap-3 sm:gap-4"
                      >
                        <div
                          className={`${
                            darkMode
                              ? "bg-gradient-to-br from-gray-800 to-purple-900"
                              : "bg-gradient-to-br from-indigo-50 to-purple-50"
                          } p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl`}
                        >
                          <div className="text-center">
                            <div className="text-lg xs:text-xl sm:text-2xl font-bold text-indigo-600">
                              {memberStats.daysActive}
                            </div>
                            <p className="text-2xs xs:text-xs text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">
                              Days Active
                            </p>
                          </div>
                        </div>
                        <div
                          className={`${
                            darkMode
                              ? "bg-gradient-to-br from-gray-800 to-blue-900"
                              : "bg-gradient-to-br from-cyan-50 to-blue-50"
                          } p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl`}
                        >
                          <div className="text-center">
                            <div className="text-lg xs:text-xl sm:text-2xl font-bold text-cyan-600">
                              {memberStats.searchCount}
                            </div>
                            <p className="text-2xs xs:text-xs text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">
                              Searches
                            </p>
                          </div>
                        </div>
                      </motion.div>
                      <motion.div
                        custom={2}
                        variants={statsVariants}
                        whileHover={{ scale: 1.03 }}
                        className="mt-3 sm:mt-4 md:mt-6"
                      >
                        <div
                          className={`group flex justify-between items-center py-1.5 xs:py-2 px-3 xs:px-4 rounded-lg ${
                            darkMode
                              ? "hover:bg-gray-700"
                              : "hover:bg-indigo-50"
                          } transition-all duration-200 cursor-pointer`}
                        >
                          <div className="flex items-center">
                            <div
                              className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${
                                darkMode ? "bg-gray-700" : "bg-indigo-100"
                              } flex items-center justify-center ${
                                darkMode ? "text-indigo-300" : "text-indigo-500"
                              }`}
                            >
                              <FiShield size={isMobile ? 12 : 16} />
                            </div>
                            <span className="ml-2 xs:ml-3 text-xs xs:text-sm sm:text-base font-medium">
                              Account Security
                            </span>
                          </div>
                          <motion.div
                            whileHover={{ x: 3 }}
                            whileTap={{ x: -2 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 17,
                            }}
                          >
                            <FiChevronRight
                              className={`${
                                darkMode
                                  ? "text-gray-500 group-hover:text-indigo-300"
                                  : "text-gray-400 group-hover:text-indigo-500"
                              } transition-colors duration-200`}
                              size={isMobile ? 16 : 20}
                            />
                          </motion.div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {activeTab === "activity" && (
              <motion.div
                key="activity"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  variants={cardVariants}
                  whileHover="hover"
                  className={`${
                    darkMode ? "bg-gray-800" : "bg-white"
                  } rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg overflow-hidden p-4 xs:p-5 sm:p-6 md:p-8`}
                >
                  <h2 className="text-base xs:text-lg sm:text-xl font-semibold flex items-center mb-4 sm:mb-6">
                    <FiGlobe className="mr-2 text-indigo-500" />
                    Recent Activity
                  </h2>

                  <div className="space-y-4 sm:space-y-6">
                    {/* Activity timeline */}
                    <div className="relative pl-6 xs:pl-7 sm:pl-8 border-l-2 border-indigo-200 dark:border-indigo-800">
                      {[
                        {
                          id: 1,
                          type: "search",
                          content: "Searched for countries in Europe",
                          timestamp: "2 hours ago",
                          icon: <FiSearch />,
                        },
                        {
                          id: 2,
                          type: "favorite",
                          content: "Added Japan to favorites",
                          timestamp: "Yesterday",
                          icon: <FiHeart />,
                        },
                        {
                          id: 3,
                          type: "visit",
                          content: "Viewed details for United States",
                          timestamp: "3 days ago",
                          icon: <FiMapPin />,
                        },
                      ].map((activity, i) => (
                        <motion.div
                          key={activity.id}
                          custom={i}
                          variants={statsVariants}
                          className="mb-5 sm:mb-6 md:mb-8 last:mb-0"
                        >
                          <div className="absolute -left-3 xs:-left-3.5 sm:-left-4">
                            <div
                              className={`w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 rounded-full ${
                                darkMode ? "bg-gray-700" : "bg-indigo-100"
                              } flex items-center justify-center ${
                                darkMode ? "text-indigo-300" : "text-indigo-500"
                              }`}
                            >
                              <span className="text-xs sm:text-base">{activity.icon}</span>
                            </div>
                          </div>
                          <div
                            className={`${
                              darkMode ? "bg-gray-700" : "bg-gray-50"
                            } rounded-lg p-3 xs:p-3.5 sm:p-4`}
                          >
                            <p className="text-xs xs:text-sm sm:text-base font-medium">{activity.content}</p>
                            <p className="text-2xs xs:text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {activity.timestamp}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <motion.div
                      variants={statsVariants}
                      custom={3}
                      className="text-center mt-5 sm:mt-6 md:mt-8"
                    >
                      <button
                        className={`px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 ${
                          darkMode
                            ? "bg-gray-700 hover:bg-gray-600"
                            : "bg-gray-100 hover:bg-gray-200"
                        } rounded-lg text-xs xs:text-sm sm:text-base inline-flex items-center transition-all duration-200`}
                      >
                        <FiGlobe className="mr-1.5 xs:mr-2" />
                        View Full Activity History
                      </button>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;