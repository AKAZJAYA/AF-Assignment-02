import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  FiArrowLeft,
  FiHeart,
  FiMap,
  FiUsers,
  FiGlobe,
  FiDollarSign,
  FiMessageSquare,
  FiMapPin,
  FiClock,
  FiFlag,
  FiPhone,
  FiGrid,
  FiExternalLink,
  FiCompass,
  FiBookOpen,
  FiStar,
  FiHash,
  FiNavigation,
  FiPercent,
  FiActivity,
  FiShield,
  FiLayers,
  FiGift,
  FiSunrise,
  FiCornerDownRight,
} from "react-icons/fi";
import { BiWorld } from "react-icons/bi";
import { IoEarthOutline } from "react-icons/io5";
import confetti from "canvas-confetti";

import {
  fetchCountryByCode,
  clearCurrentCountry,
} from "../redux/slices/countriesSlice";
import {
  addToFavorites,
  removeFromFavorites,
} from "../redux/slices/favoritesSlice";

const CountryDetails = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const flagRef = useRef(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Additional state for advanced details toggle
  const [showAdvancedDetails, setShowAdvancedDetails] = useState(false);

  // For 3D card tilt effect
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const shadowBlur = useTransform(rotateX, [-10, 0, 10], [10, 15, 10]);

  const { currentCountry, status, error } = useSelector(
    (state) => state.countries
  );
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { favorites } = useSelector((state) => state.favorites);
  const { darkMode } = useSelector((state) => state.theme);

  const isFavorite = favorites.includes(code);

  // Check if we're on a mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    dispatch(fetchCountryByCode(code));
    window.scrollTo({ top: 0, behavior: "smooth" });
    return () => {
      dispatch(clearCurrentCountry());
    };
  }, [dispatch, code]);

  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(code));
    } else {
      dispatch(addToFavorites(code));
      // Show confetti effect when adding to favorites
      if (!isMobile) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  const formatNumber = (num) => {
    return num?.toLocaleString() || "N/A";
  };

  // Handle mouse move for 3D effect
  const handleMouseMove = (e) => {
    if (!flagRef.current || isMobile) return;

    const rect = flagRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const centerX = rect.left + width / 2;
    const centerY = rect.top + height / 2;

    const rotateXValue = ((e.clientY - centerY) / height) * -10;
    const rotateYValue = ((e.clientX - centerX) / width) * 10;

    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
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

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const cardHoverVariants = {
    hover: {
      scale: 1.02,
      boxShadow: darkMode
        ? "0 0 20px 0 rgba(99, 102, 241, 0.4)"
        : "0 10px 30px -10px rgba(99, 102, 241, 0.3)",
      transition: { duration: 0.3 },
    },
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-[60vh] py-20">
        <div className="relative">
          <div
            className={`animate-spin rounded-full h-20 w-20 border-4 ${
              darkMode
                ? "border-t-indigo-400 border-r-cyan-300 border-b-teal-300 border-l-blue-400"
                : "border-t-indigo-500 border-r-cyan-400 border-b-teal-400 border-l-blue-500"
            }`}
          ></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <IoEarthOutline
              className={`text-2xl text-${
                darkMode ? "indigo-400" : "indigo-500"
              } animate-pulse`}
            />
          </div>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20 max-w-xl mx-auto px-4"
      >
        <div
          className={`${
            darkMode ? "bg-red-900/20" : "bg-red-50"
          } p-8 rounded-3xl shadow-lg border ${
            darkMode ? "border-red-800/30" : "border-red-200"
          }`}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className={`w-24 h-24 mx-auto rounded-full ${
              darkMode ? "bg-red-900/50" : "bg-red-100"
            } flex items-center justify-center mb-6`}
          >
            <span className="text-red-500 text-4xl">!</span>
          </motion.div>
          <h2
            className={`text-3xl font-bold ${
              darkMode ? "text-red-400" : "text-red-600"
            } mb-4`}
          >
            Error Loading Country
          </h2>
          <p
            className={`${
              darkMode ? "text-gray-300" : "text-gray-600"
            } mb-8 max-w-sm mx-auto`}
          >
            {error}
          </p>
          <motion.button
            whileHover={{
              scale: 1.05,
              backgroundColor: darkMode ? "#F43F5E" : "#FEE2E2",
              color: darkMode ? "white" : "#EF4444",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className={`px-6 py-3 rounded-full font-medium ${
              darkMode
                ? "bg-red-600 text-white"
                : "bg-red-50 text-red-500 border border-red-200"
            } shadow-lg transition-all duration-300`}
          >
            Back to home
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (!currentCountry) {
    return null;
  }

  return (
    <div
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 ${
        darkMode ? "text-white" : "text-gray-900"
      }`}
      ref={containerRef}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top navigation bar */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-between items-center mb-8 sm:mb-12 gap-3 sm:gap-4"
        >
          <motion.button
            whileHover={{
              x: -5,
              backgroundColor: darkMode ? "#374151" : "#F9FAFB",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 text-sm sm:text-base px-5 py-3 rounded-full ${
              darkMode
                ? "bg-gray-800 hover:bg-gray-700 text-white"
                : "bg-white hover:bg-gray-100 text-gray-800 border border-gray-200"
            } shadow-md transition-all duration-300`}
          >
            <FiArrowLeft className="animate-pulse-subtle" />
            <span>Back to Explore</span>
          </motion.button>

          {isAuthenticated && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleFavorite}
              className={`flex items-center gap-2 text-sm sm:text-base px-5 py-3 rounded-full shadow-md transition-all duration-300 ${
                isFavorite
                  ? "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600"
                  : darkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-white"
                  : "bg-white hover:bg-gray-100 text-gray-800 border border-gray-200"
              }`}
            >
              <motion.div
                animate={
                  isFavorite
                    ? {
                        scale: [1, 1.2, 1],
                        rotate: [0, 15, -15, 0],
                      }
                    : {}
                }
                transition={{ duration: 0.5 }}
              >
                <FiHeart className={`${isFavorite ? "fill-current" : ""}`} />
              </motion.div>
              <span>
                {isFavorite ? "Saved to Favorites" : "Add to Favorites"}
              </span>
            </motion.button>
          )}
        </motion.div>

        {/* Hero Section with Flag and Country name */}
        <motion.div variants={itemVariants} className="mb-12 sm:mb-16">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
            <div
              className="md:col-span-2 relative group"
              ref={flagRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <motion.div
                className="absolute -inset-1 rounded-2xl"
                style={{
                  backgroundImage: `linear-gradient(to right, ${
                    darkMode ? "#4F46E5, #0EA5E9" : "#6366F1, #22D3EE"
                  })`,
                  filter: "blur(15px)",
                  opacity: 0.4,
                }}
                whileHover={{ opacity: 0.7 }}
                transition={{ duration: 0.3 }}
              />

              <motion.div
                className="relative h-64 xs:h-72 sm:h-80 md:h-96 lg:h-[28rem] overflow-hidden rounded-2xl shadow-2xl"
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: "preserve-3d",
                  boxShadow: `0 15px ${shadowBlur}px rgba(0, 0, 0, 0.2)`,
                  perspective: 1000,
                }}
              >
                <img
                  src={currentCountry.flag}
                  alt={`Flag of ${currentCountry.name}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Flag overlay with subtle gradient */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: "translateZ(20px)",
                  }}
                />

                {/* Floating badge */}
                <motion.div
                  className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-medium ${
                    darkMode
                      ? "bg-indigo-900/80 text-indigo-200 backdrop-blur-sm"
                      : "bg-indigo-50/80 text-indigo-600 backdrop-blur-sm border border-indigo-100"
                  }`}
                  style={{
                    transformStyle: "preserve-3d",
                    transform: "translateZ(30px)",
                  }}
                  whileHover={{ scale: 1.1 }}
                >
                  {currentCountry.region}
                </motion.div>
              </motion.div>
            </div>

            <div className="md:col-span-3 flex flex-col justify-center">
              <div
                className={`p-6 sm:p-8 rounded-2xl ${
                  darkMode ? "bg-gray-800/80" : "bg-white/80"
                } backdrop-blur-sm shadow-lg border ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="flex items-center mb-4">
                    <div
                      className={`w-10 h-10 rounded-full ${
                        darkMode ? "bg-indigo-900/50" : "bg-indigo-100"
                      } flex items-center justify-center mr-3`}
                    >
                      <FiGlobe className="text-indigo-500" />
                    </div>
                    <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-500">
                      {currentCountry.name}
                    </h1>
                  </div>

                  <div className="h-1 w-24 sm:w-32 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full mb-6"></div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                    <KeyInfoCard
                      icon={<FiUsers />}
                      label="Population"
                      value={formatNumber(currentCountry.population)}
                      darkMode={darkMode}
                      color="indigo"
                    />

                    <KeyInfoCard
                      icon={<FiMapPin />}
                      label="Capital"
                      value={currentCountry.capital || "N/A"}
                      darkMode={darkMode}
                      color="cyan"
                    />

                    <KeyInfoCard
                      icon={<FiFlag />}
                      label="Subregion"
                      value={currentCountry.subregion || "N/A"}
                      darkMode={darkMode}
                      color="indigo"
                    />

                    <KeyInfoCard
                      icon={<FiCompass />}
                      label="Area"
                      value={
                        currentCountry.area
                          ? `${formatNumber(currentCountry.area)} km²`
                          : "N/A"
                      }
                      darkMode={darkMode}
                      color="cyan"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Info Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
        >
          <DetailCard
            icon={<FiDollarSign />}
            title="Currencies"
            color="indigo"
            darkMode={darkMode}
          >
            {currentCountry.currencies &&
            currentCountry.currencies.length > 0 ? (
              <ul className="space-y-2">
                {currentCountry.currencies.map((currency, index) => (
                  <li key={index} className="flex items-center">
                    <span
                      className={`inline-block w-8 h-8 mr-3 rounded-full ${
                        darkMode ? "bg-indigo-900/30" : "bg-indigo-50"
                      } flex items-center justify-center text-indigo-500 font-mono`}
                    >
                      {currency.symbol || "$"}
                    </span>
                    <span>{currency.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">
                Information not available
              </p>
            )}
          </DetailCard>

          <DetailCard
            icon={<FiMessageSquare />}
            title="Languages"
            color="cyan"
            darkMode={darkMode}
          >
            {currentCountry.languages && currentCountry.languages.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {currentCountry.languages.map((language, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm ${
                      darkMode
                        ? "bg-cyan-900/30 text-cyan-300"
                        : "bg-cyan-50 text-cyan-700"
                    }`}
                  >
                    {language}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">
                Information not available
              </p>
            )}
          </DetailCard>

          <DetailCard
            icon={<FiClock />}
            title="Timezones"
            color="indigo"
            darkMode={darkMode}
          >
            {currentCountry.timezones && currentCountry.timezones.length > 0 ? (
              <div className="text-sm space-y-1 max-h-32 overflow-y-auto pr-2 scrollbar-thin">
                {Array.isArray(currentCountry.timezones) ? (
                  currentCountry.timezones.map((timezone, index) => (
                    <div
                      key={index}
                      className={`py-1.5 px-3 rounded ${
                        index % 2 === 0
                          ? darkMode
                            ? "bg-gray-700/50"
                            : "bg-gray-50"
                          : ""
                      }`}
                    >
                      {timezone}
                    </div>
                  ))
                ) : (
                  <div className="py-1.5 px-3">{currentCountry.timezones}</div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">
                Information not available
              </p>
            )}
          </DetailCard>

          <DetailCard
            icon={<FiPhone />}
            title="Calling Codes"
            color="cyan"
            darkMode={darkMode}
          >
            {currentCountry.callingCodes &&
            currentCountry.callingCodes.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {Array.isArray(currentCountry.callingCodes) ? (
                  currentCountry.callingCodes.map((code, index) => (
                    <div
                      key={index}
                      className={`px-4 py-2 rounded-lg ${
                        darkMode
                          ? "bg-cyan-900/20 border border-cyan-800/30"
                          : "bg-cyan-50 border border-cyan-100"
                      } font-mono text-center`}
                    >
                      {code.includes("+") ? code : `+${code}`}
                    </div>
                  ))
                ) : (
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      darkMode
                        ? "bg-cyan-900/20 border border-cyan-800/30"
                        : "bg-cyan-50 border border-cyan-100"
                    } font-mono text-center`}
                  >
                    {currentCountry.callingCodes.includes("+")
                      ? currentCountry.callingCodes
                      : `+${currentCountry.callingCodes}`}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">
                Information not available
              </p>
            )}
          </DetailCard>

          <DetailCard
            icon={<FiGrid />}
            title="Top Level Domain"
            color="indigo"
            darkMode={darkMode}
          >
            {currentCountry.topLevelDomain &&
            currentCountry.topLevelDomain.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {Array.isArray(currentCountry.topLevelDomain) ? (
                  currentCountry.topLevelDomain.map((domain, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1.5 rounded ${
                        darkMode
                          ? "bg-indigo-900/30 text-indigo-300"
                          : "bg-indigo-50 text-indigo-700"
                      } font-mono`}
                    >
                      {domain}
                    </span>
                  ))
                ) : (
                  <span
                    className={`px-3 py-1.5 rounded ${
                      darkMode
                        ? "bg-indigo-900/30 text-indigo-300"
                        : "bg-indigo-50 text-indigo-700"
                    } font-mono`}
                  >
                    {currentCountry.topLevelDomain}
                  </span>
                )}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">
                Information not available
              </p>
            )}
          </DetailCard>

          <DetailCard
            icon={<FiBookOpen />}
            title="Native Name"
            color="cyan"
            darkMode={darkMode}
          >
            <p className="text-lg font-medium">
              {currentCountry.nativeName ||
                currentCountry.name ||
                "Information not available"}
            </p>
          </DetailCard>
        </motion.div>

        {/* Border Countries Section */}
        {currentCountry.borders && currentCountry.borders.length > 0 && (
          <motion.div
            variants={itemVariants}
            className={`p-6 sm:p-8 rounded-2xl ${
              darkMode ? "bg-gray-800/90" : "bg-white/90"
            } backdrop-blur-sm shadow-lg border ${
              darkMode ? "border-gray-700" : "border-gray-200"
            } mb-10`}
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center">
              <BiWorld
                className={`mr-3 text-2xl text-${
                  darkMode ? "indigo-400" : "indigo-500"
                }`}
              />
              Neighboring Countries
            </h2>

            <div className="flex flex-wrap gap-3 sm:gap-4">
              {currentCountry.borders.map((border, index) => (
                <motion.div
                  key={border}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 + index * 0.05 }}
                >
                  <Link
                    to={`/country/${border}`}
                    className={`px-4 py-2.5 text-sm ${
                      darkMode
                        ? "bg-gradient-to-br from-indigo-900/50 to-cyan-900/50 hover:from-indigo-800/50 hover:to-cyan-800/50 text-white"
                        : "bg-gradient-to-br from-indigo-50 to-cyan-50 hover:from-indigo-100 hover:to-cyan-100 text-gray-800"
                    } rounded-lg shadow-sm transition-all duration-300 inline-flex items-center gap-2`}
                  >
                    <FiFlag className="text-sm" />
                    <span>{border}</span>
                    <FiExternalLink className="text-xs opacity-70" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Advanced Country Details */}
        <motion.div variants={itemVariants} className="mb-8">
          <button
            onClick={() => setShowAdvancedDetails(!showAdvancedDetails)}
            className={`flex w-full items-center justify-between p-5 rounded-xl ${
              darkMode
                ? "bg-gray-800 hover:bg-gray-750 text-white"
                : "bg-white hover:bg-gray-50 text-gray-800"
            } border ${
              darkMode ? "border-gray-700" : "border-gray-200"
            } shadow-md transition-all duration-300`}
          >
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full ${
                  darkMode ? "bg-cyan-900/30" : "bg-cyan-100"
                } flex items-center justify-center mr-3`}
              >
                <FiLayers
                  className={`text-${darkMode ? "cyan-400" : "cyan-500"}`}
                />
              </div>
              <span className="text-lg font-semibold">
                Advanced Country Information
              </span>
            </div>
            <motion.div
              animate={{ rotate: showAdvancedDetails ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <FiCornerDownRight
                className={`text-xl ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
            </motion.div>
          </button>

          <AnimatePresence>
            {showAdvancedDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {/* Maps Links */}
                  {currentCountry.maps &&
                    (currentCountry.maps.googleMaps ||
                      currentCountry.maps.openStreetMaps) && (
                      <DetailCard
                        icon={<FiMap />}
                        title="Interactive Maps"
                        color="cyan"
                        darkMode={darkMode}
                      >
                        <div className="space-y-3">
                          {currentCountry.maps.googleMaps && (
                            <a
                              href={currentCountry.maps.googleMaps}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`block p-3 rounded-lg ${
                                darkMode
                                  ? "bg-gray-700 hover:bg-gray-650 text-white"
                                  : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                              } transition-colors duration-300 flex items-center`}
                            >
                              <FiNavigation className="mr-2 text-blue-500" />
                              <span>Google Maps</span>
                              <FiExternalLink className="ml-auto text-sm opacity-70" />
                            </a>
                          )}

                          {currentCountry.maps.openStreetMaps && (
                            <a
                              href={currentCountry.maps.openStreetMaps}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`block p-3 rounded-lg ${
                                darkMode
                                  ? "bg-gray-700 hover:bg-gray-650 text-white"
                                  : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                              } transition-colors duration-300 flex items-center`}
                            >
                              <FiNavigation className="mr-2 text-green-500" />
                              <span>OpenStreetMap</span>
                              <FiExternalLink className="ml-auto text-sm opacity-70" />
                            </a>
                          )}
                        </div>
                      </DetailCard>
                    )}

                  {/* Coat of Arms */}
                  {currentCountry.coatOfArms && (
                    <DetailCard
                      icon={<FiShield />}
                      title="Coat of Arms"
                      color="indigo"
                      darkMode={darkMode}
                    >
                      <div className="flex justify-center">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="relative w-40 h-40"
                        >
                          <img
                            src={currentCountry.coatOfArms}
                            alt={`Coat of Arms of ${currentCountry.name}`}
                            className="object-contain w-full h-full"
                          />
                        </motion.div>
                      </div>
                    </DetailCard>
                  )}

                  {/* Country Status */}
                  <DetailCard
                    icon={<FiHash />}
                    title="Country Status"
                    color="cyan"
                    darkMode={darkMode}
                  >
                    <div className="space-y-3">
                      <StatusBadge
                        label="UN Member"
                        value={currentCountry.unMember}
                        darkMode={darkMode}
                      />
                      <StatusBadge
                        label="Independent"
                        value={currentCountry.independent}
                        darkMode={darkMode}
                      />
                      <StatusBadge
                        label="Landlocked"
                        value={currentCountry.landlocked}
                        darkMode={darkMode}
                      />
                      {currentCountry.carSide && (
                        <div
                          className={`flex items-center justify-between p-2 rounded ${
                            darkMode ? "bg-gray-700" : "bg-gray-100"
                          }`}
                        >
                          <span className="text-sm">Driving Side</span>
                          <span
                            className={`px-3 py-1 rounded text-sm ${
                              darkMode
                                ? "bg-cyan-900/40 text-cyan-300"
                                : "bg-cyan-100 text-cyan-800"
                            }`}
                          >
                            {currentCountry.carSide.toUpperCase()}
                          </span>
                        </div>
                      )}
                      {currentCountry.startOfWeek && (
                        <div
                          className={`flex items-center justify-between p-2 rounded ${
                            darkMode ? "bg-gray-700" : "bg-gray-100"
                          }`}
                        >
                          <span className="text-sm">Week Starts On</span>
                          <span
                            className={`px-3 py-1 rounded text-sm capitalize ${
                              darkMode
                                ? "bg-cyan-900/40 text-cyan-300"
                                : "bg-cyan-100 text-cyan-800"
                            }`}
                          >
                            {currentCountry.startOfWeek}
                          </span>
                        </div>
                      )}
                    </div>
                  </DetailCard>

                  {/* Capital Information */}
                  {currentCountry.capitalInfo &&
                    currentCountry.capitalInfo.latlng && (
                      <DetailCard
                        icon={<FiMapPin />}
                        title="Capital Location"
                        color="indigo"
                        darkMode={darkMode}
                      >
                        <div className="text-center">
                          <div className="mb-3">
                            <span className="font-semibold">
                              {currentCountry.capital}
                            </span>
                          </div>
                          <div
                            className={`inline-block px-4 py-2 rounded-lg ${
                              darkMode ? "bg-indigo-900/30" : "bg-indigo-50"
                            } font-mono text-sm`}
                          >
                            {currentCountry.capitalInfo.latlng[0]}°,{" "}
                            {currentCountry.capitalInfo.latlng[1]}°
                          </div>
                          <div className="mt-3">
                            <a
                              href={`https://www.google.com/maps/place/${currentCountry.capitalInfo.latlng[0]},${currentCountry.capitalInfo.latlng[1]}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center gap-1 text-sm ${
                                darkMode ? "text-indigo-400" : "text-indigo-600"
                              } hover:underline`}
                            >
                              <span>View on map</span>
                              <FiExternalLink className="text-xs" />
                            </a>
                          </div>
                        </div>
                      </DetailCard>
                    )}

                  {/* Continents */}
                  {currentCountry.continents &&
                    currentCountry.continents.length > 0 && (
                      <DetailCard
                        icon={<FiGlobe />}
                        title="Continents"
                        color="cyan"
                        darkMode={darkMode}
                      >
                        <div className="flex flex-wrap gap-2">
                          {currentCountry.continents.map((continent, index) => (
                            <span
                              key={index}
                              className={`px-3 py-1.5 rounded-full text-sm ${
                                darkMode
                                  ? "bg-cyan-900/30 text-cyan-300"
                                  : "bg-cyan-50 text-cyan-700"
                              }`}
                            >
                              {continent}
                            </span>
                          ))}
                        </div>
                      </DetailCard>
                    )}

                  {/* Demonyms */}
                  {currentCountry.demonyms && (
                    <DetailCard
                      icon={<FiUsers />}
                      title="Demonyms"
                      color="indigo"
                      darkMode={darkMode}
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <div
                          className={`p-3 rounded-lg text-center ${
                            darkMode ? "bg-indigo-900/30" : "bg-indigo-50"
                          }`}
                        >
                          <div className="text-xs uppercase tracking-wide mb-1 opacity-70">
                            Male
                          </div>
                          <div className="font-medium">
                            {currentCountry.demonyms.male}
                          </div>
                        </div>
                        <div
                          className={`p-3 rounded-lg text-center ${
                            darkMode ? "bg-pink-900/30" : "bg-pink-50"
                          } ${darkMode ? "text-pink-300" : "text-pink-700"}`}
                        >
                          <div className="text-xs uppercase tracking-wide mb-1 opacity-70">
                            Female
                          </div>
                          <div className="font-medium">
                            {currentCountry.demonyms.female}
                          </div>
                        </div>
                      </div>
                    </DetailCard>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Map Link */}
        <motion.div variants={itemVariants} className="mb-6">
          <a
            href={`https://www.google.com/maps/place/${encodeURIComponent(
              currentCountry.name
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`block w-full ${
              darkMode
                ? "bg-gradient-to-br from-indigo-900/80 to-cyan-900/80 hover:from-indigo-800 hover:to-cyan-800"
                : "bg-gradient-to-br from-indigo-50 to-cyan-50 hover:from-indigo-100 hover:to-cyan-100"
            } rounded-2xl border ${
              darkMode ? "border-gray-700" : "border-gray-200"
            } p-8 text-center transition-all duration-300 shadow-lg group`}
          >
            <div className="flex flex-col items-center">
              <motion.div
                whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.5 }}
                className={`w-20 h-20 rounded-full ${
                  darkMode ? "bg-indigo-900/50" : "bg-indigo-100"
                } flex items-center justify-center mb-4 group-hover:shadow-lg transition-all duration-300`}
              >
                <FiMap
                  className={`text-3xl ${
                    darkMode ? "text-indigo-300" : "text-indigo-500"
                  }`}
                />
              </motion.div>

              <h3
                className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-800"
                } mb-2`}
              >
                Explore {currentCountry.name} on Maps
              </h3>

              <p
                className={`flex items-center justify-center gap-1 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                View geographical details, landmarks and more
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <FiExternalLink className="ml-1" />
                </motion.div>
              </p>
            </div>
          </a>
        </motion.div>

        {/* Additional action buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap gap-4 justify-center"
        >
          <motion.a
            href={`https://en.wikipedia.org/wiki/${encodeURIComponent(
              currentCountry.name
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-3 rounded-full text-sm inline-flex items-center gap-2 ${
              darkMode
                ? "bg-gray-800 hover:bg-gray-700 text-white"
                : "bg-white hover:bg-gray-50 text-gray-800 border border-gray-200"
            } shadow-md transition-all duration-300`}
          >
            <FiBookOpen />
            <span>Read on Wikipedia</span>
          </motion.a>

          <motion.a
            href={`https://www.google.com/search?q=${encodeURIComponent(
              currentCountry.name
            )}+tourism`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-3 rounded-full text-sm inline-flex items-center gap-2 ${
              darkMode
                ? "bg-gray-800 hover:bg-gray-700 text-white"
                : "bg-white hover:bg-gray-50 text-gray-800 border border-gray-200"
            } shadow-md transition-all duration-300`}
          >
            <FiStar />
            <span>Tourism Information</span>
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Confetti overlay */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Enhanced Key Info Card component
const KeyInfoCard = ({ icon, label, value, darkMode, color }) => (
  <motion.div
    whileHover={{
      scale: 1.05,
      boxShadow: darkMode
        ? "0 10px 25px -5px rgba(99, 102, 241, 0.3)"
        : "0 10px 25px -5px rgba(99, 102, 241, 0.2)",
    }}
    className={`${darkMode ? "bg-gray-800" : "bg-white"} ${
      darkMode ? "border-gray-700" : "border-gray-200"
    } border rounded-xl p-4 backdrop-blur-sm flex flex-col shadow-lg`}
  >
    <div
      className={`w-8 h-8 rounded-full ${
        color === "indigo"
          ? darkMode
            ? "bg-indigo-900/50"
            : "bg-indigo-100"
          : darkMode
          ? "bg-cyan-900/50"
          : "bg-cyan-100"
      } flex items-center justify-center mb-3`}
    >
      <span
        className={`text-${color === "indigo" ? "indigo" : "cyan"}-${
          darkMode ? "400" : "500"
        }`}
      >
        {icon}
      </span>
    </div>

    <div
      className={`text-xs uppercase tracking-wider ${
        darkMode ? "text-gray-400" : "text-gray-500"
      } mb-1`}
    >
      {label}
    </div>

    <div
      className={`text-base sm:text-lg font-semibold ${
        darkMode ? "text-white" : "text-gray-800"
      }`}
    >
      {value}
    </div>
  </motion.div>
);

// Enhanced Detail Card component
const DetailCard = ({ icon, title, children, color, darkMode }) => (
  <motion.div
    whileHover={{
      scale: 1.02,
      boxShadow: darkMode
        ? "0 15px 30px -10px rgba(99, 102, 241, 0.25)"
        : "0 15px 30px -10px rgba(99, 102, 241, 0.15)",
    }}
    className={`${darkMode ? "bg-gray-800" : "bg-white"} ${
      darkMode ? "border-gray-700" : "border-gray-200"
    } border rounded-xl overflow-hidden shadow-lg h-full flex flex-col`}
  >
    <div
      className={`p-5 border-b ${
        darkMode ? "border-gray-700" : "border-gray-200"
      } flex items-center gap-3`}
      style={{
        backgroundColor: darkMode
          ? color === "indigo"
            ? "rgba(99, 102, 241, 0.15)"
            : "rgba(34, 211, 238, 0.15)"
          : color === "indigo"
          ? "rgba(99, 102, 241, 0.1)"
          : "rgba(34, 211, 238, 0.1)",
      }}
    >
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center ${
          color === "indigo"
            ? darkMode
              ? "bg-indigo-900/50 text-indigo-400"
              : "bg-indigo-100 text-indigo-500"
            : darkMode
            ? "bg-cyan-900/50 text-cyan-400"
            : "bg-cyan-100 text-cyan-500"
        }`}
      >
        {icon}
      </div>
      <h3
        className={`text-lg font-bold ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        {title}
      </h3>
    </div>
    <div className="p-5 flex-1">{children}</div>
  </motion.div>
);

// StatusBadge component for boolean values
const StatusBadge = ({ label, value, darkMode }) => (
  <div
    className={`flex items-center justify-between p-2 rounded ${
      darkMode ? "bg-gray-700" : "bg-gray-100"
    }`}
  >
    <span className="text-sm">{label}</span>
    <span
      className={`px-3 py-1 rounded text-sm ${
        value
          ? darkMode
            ? "bg-green-900/40 text-green-300"
            : "bg-green-100 text-green-800"
          : darkMode
          ? "bg-red-900/40 text-red-300"
          : "bg-red-100 text-red-800"
      }`}
    >
      {value ? "Yes" : "No"}
    </span>
  </div>
);

export default CountryDetails;
