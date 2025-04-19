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
  const { darkMode } = useSelector((state) => state.theme); // Get dark mode state
  const [activeTab, setActiveTab] = useState("account");
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showConfetti, setShowConfetti] = useState(false);
  const profileCardRef = useRef(null);

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

  // Animation variants (unchanged)
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
      scale: 1.02,
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { type: "spring", stiffness: 300, damping: 15 },
    },
  };

  const tabVariants = {
    active: {
      backgroundColor: darkMode ? "rgb(31, 41, 55)" : "rgb(238, 242, 255)",
      color: darkMode ? "rgb(165, 180, 252)" : "rgb(79, 70, 229)",
      scale: 1.05,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
    inactive: {
      backgroundColor: "transparent",
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  // 3D card tilt effect
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const handleProfileCardMouseMove = (e) => {
    if (!profileCardRef.current) return;

    const rect = profileCardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate the mouse position relative to the card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate rotation values
    const rotateXValue = ((y - height / 2) / height) * 10; // 10 degrees max rotation
    const rotateYValue = ((width / 2 - x) / width) * 10;

    // Update motion values
    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);
    setIsHovering(true);
  };

  const handleProfileCardMouseLeave = () => {
    // Reset rotation when mouse leaves
    rotateX.set(0);
    rotateY.set(0);
    setIsHovering(false);
  };

  // Also add the missing statsVariants animation
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

  // Trigger confetti effect (unchanged)
  const triggerConfetti = () => {
    setShowConfetti(true);
    confetti({
      particleCount: 100,
      spread: 70,
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
      className={`max-w-6xl mx-auto px-4 py-10 ${
        darkMode ? "dark bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Dark mode toggle (optional, if you want to add a local toggle) */}
      {/* <div className="flex justify-end mb-4">
        <button
          onClick={() => dispatch(toggleDarkMode())}
          className={`px-4 py-2 rounded-lg ${
            darkMode
              ? 'bg-gray-800 text-white hover:bg-gray-700'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          } transition-all duration-200`}
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div> */}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center relative">
          <div className="inline-block relative">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className={`relative inline-flex items-center justify-center w-24 h-24 rounded-full ${
                darkMode
                  ? "bg-gradient-to-br from-indigo-700 to-cyan-600"
                  : "bg-gradient-to-br from-indigo-500 to-cyan-400"
              } mb-4 shadow-lg cursor-pointer`}
              onClick={triggerConfetti}
            >
              <span className="text-4xl text-white font-bold">
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
            {/* Edit icon */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              className={`absolute bottom-3 right-0 w-8 h-8 ${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-full shadow-md flex items-center justify-center ${
                darkMode ? "text-indigo-300" : "text-indigo-500"
              } cursor-pointer`}
            >
              <FiEdit2 size={16} />
            </motion.div>
          </div>
          <motion.h1
            className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-500"
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
          <motion.p variants={itemVariants} className="text-gray-600">
            Explore your profile and favorites
          </motion.p>
        </motion.div>

        {/* Tab navigation */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-2 gap-2 max-w-2xl mx-auto"
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
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                activeTab === tab.id
                  ? darkMode
                    ? "bg-gray-800 text-indigo-300"
                    : "bg-indigo-50 text-indigo-600"
                  : darkMode
                  ? "text-gray-400 hover:bg-gray-800"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Content area */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            {activeTab === "account" && (
              <motion.div
                key="account"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Account Info Card */}
                  <motion.div
                    ref={profileCardRef}
                    onMouseMove={handleProfileCardMouseMove}
                    onMouseLeave={handleProfileCardMouseLeave}
                    style={{
                      rotateX: isHovering ? rotateX : 0,
                      rotateY: isHovering ? rotateY : 0,
                      transformStyle: "preserve-3d",
                      perspective: 1000,
                    }}
                    variants={cardVariants}
                    whileHover="hover"
                    className={`lg:col-span-2 ${
                      darkMode ? "bg-gray-800" : "bg-white"
                    } rounded-2xl shadow-lg overflow-hidden relative`}
                  >
                    {/* 3D layers */}
                    <div className="relative p-8">
                      <div
                        style={{ transform: "translateZ(40px)" }}
                        className="mb-6"
                      >
                        <h2 className="text-xl font-semibold flex items-center">
                          <FiUser className="mr-2 text-indigo-500" />
                          Account Information
                        </h2>
                        <div className="mt-1 h-1 w-20 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"></div>
                      </div>
                      <div
                        className="space-y-6"
                        style={{ transform: "translateZ(20px)" }}
                      >
                        <div className="flex items-start">
                          <div
                            className={`w-10 h-10 rounded-full ${
                              darkMode ? "bg-gray-700" : "bg-indigo-100"
                            } flex-shrink-0 flex items-center justify-center ${
                              darkMode ? "text-indigo-300" : "text-indigo-500"
                            }`}
                          >
                            <FiUser />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm text-gray-500">Username</p>
                            <p className="font-medium">
                              {user?.username || "Not available"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div
                            className={`w-10 h-10 rounded-full ${
                              darkMode ? "bg-gray-700" : "bg-indigo-100"
                            } flex-shrink-0 flex items-center justify-center ${
                              darkMode ? "text-indigo-300" : "text-indigo-500"
                            }`}
                          >
                            <FiMail />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">
                              {user?.email || "Not available"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div
                            className={`w-10 h-10 rounded-full ${
                              darkMode ? "bg-gray-700" : "bg-indigo-100"
                            } flex-shrink-0 flex items-center justify-center ${
                              darkMode ? "text-indigo-300" : "text-indigo-500"
                            }`}
                          >
                            <FiClock />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm text-gray-500">
                              Member since
                            </p>
                            <p className="font-medium">
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
                        className="mt-8 text-right"
                        style={{ transform: "translateZ(30px)" }}
                      >
                        <button
                          className={`px-5 py-2 ${
                            darkMode
                              ? "bg-indigo-700 hover:bg-indigo-600"
                              : "bg-indigo-600 hover:bg-indigo-700"
                          } text-white rounded-lg inline-flex items-center transition-all duration-200 shadow-md hover:shadow-xl`}
                        >
                          <FiSettings className="mr-2" />
                          Edit Profile
                        </button>
                      </motion.div>
                      {/* Decorative elements */}
                      <div
                        className={`absolute -bottom-10 -left-10 w-40 h-40 rounded-full ${
                          darkMode ? "bg-indigo-900/10" : "bg-indigo-500/10"
                        } blur-3xl pointer-events-none`}
                      ></div>
                      <div
                        className={`absolute -top-10 -right-10 w-40 h-40 rounded-full ${
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
                    } rounded-2xl shadow-lg overflow-hidden p-8`}
                  >
                    <h2 className="text-xl font-semibold flex items-center mb-6">
                      <FiStar className="mr-2 text-indigo-500" />
                      Statistics
                    </h2>
                    <div className="space-y-8">
                      <motion.div
                        custom={0}
                        variants={statsVariants}
                        className={`${
                          darkMode
                            ? "bg-gradient-to-r from-gray-800 to-gray-900"
                            : "bg-gradient-to-r from-indigo-50 to-cyan-50"
                        } p-4 rounded-xl`}
                      >
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 10,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="text-3xl text-indigo-500"
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
                            className="text-4xl font-bold text-indigo-600"
                          >
                            {favorites.length}
                          </motion.div>
                          <p className="text-gray-500 text-sm mt-1">
                            Favorite Countries
                          </p>
                        </div>
                      </motion.div>
                      <motion.div
                        custom={1}
                        variants={statsVariants}
                        className="grid grid-cols-2 gap-4"
                      >
                        <div
                          className={`${
                            darkMode
                              ? "bg-gradient-to-br from-gray-800 to-purple-900"
                              : "bg-gradient-to-br from-indigo-50 to-purple-50"
                          } p-4 rounded-xl`}
                        >
                          <div className="text-center">
                            <div className="text-2xl font-bold text-indigo-600">
                              {memberStats.daysActive}
                            </div>
                            <p className="text-gray-500 text-xs mt-1">
                              Days Active
                            </p>
                          </div>
                        </div>
                        <div
                          className={`${
                            darkMode
                              ? "bg-gradient-to-br from-gray-800 to-blue-900"
                              : "bg-gradient-to-br from-cyan-50 to-blue-50"
                          } p-4 rounded-xl`}
                        >
                          <div className="text-center">
                            <div className="text-2xl font-bold text-cyan-600">
                              {memberStats.searchCount}
                            </div>
                            <p className="text-gray-500 text-xs mt-1">
                              Searches
                            </p>
                          </div>
                        </div>
                      </motion.div>
                      <motion.div
                        custom={2}
                        variants={statsVariants}
                        whileHover={{ scale: 1.05 }}
                        className="mt-6"
                      >
                        <div
                          className={`group flex justify-between items-center py-2 px-4 rounded-lg ${
                            darkMode
                              ? "hover:bg-gray-700"
                              : "hover:bg-indigo-50"
                          } transition-all duration-200 cursor-pointer`}
                        >
                          <div className="flex items-center">
                            <div
                              className={`w-8 h-8 rounded-full ${
                                darkMode ? "bg-gray-700" : "bg-indigo-100"
                              } flex items-center justify-center ${
                                darkMode ? "text-indigo-300" : "text-indigo-500"
                              }`}
                            >
                              <FiShield size={16} />
                            </div>
                            <span className="ml-3 font-medium">
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
                  } rounded-2xl shadow-lg overflow-hidden p-8`}
                >
                  <h2 className="text-xl font-semibold flex items-center mb-6">
                    <FiGlobe className="mr-2 text-indigo-500" />
                    Recent Activity
                  </h2>

                  <div className="space-y-6">
                    {/* Activity timeline */}
                    <div className="relative pl-8 border-l-2 border-indigo-200 dark:border-indigo-800">
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
                          className="mb-8 last:mb-0"
                        >
                          <div className="absolute -left-[17px]">
                            <div
                              className={`w-8 h-8 rounded-full ${
                                darkMode ? "bg-gray-700" : "bg-indigo-100"
                              } flex items-center justify-center ${
                                darkMode ? "text-indigo-300" : "text-indigo-500"
                              }`}
                            >
                              {activity.icon}
                            </div>
                          </div>
                          <div
                            className={`${
                              darkMode ? "bg-gray-700" : "bg-gray-50"
                            } rounded-lg p-4`}
                          >
                            <p className="font-medium">{activity.content}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              {activity.timestamp}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <motion.div
                      variants={statsVariants}
                      custom={3}
                      className="text-center mt-8"
                    >
                      <button
                        className={`px-5 py-2 ${
                          darkMode
                            ? "bg-gray-700 hover:bg-gray-600"
                            : "bg-gray-100 hover:bg-gray-200"
                        } rounded-lg inline-flex items-center transition-all duration-200`}
                      >
                        <FiGlobe className="mr-2" />
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
