import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiHeart,
  FiMap,
  FiUsers,
  FiGlobe,
  FiDollarSign,
  FiMessageSquare,
} from "react-icons/fi";

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
  const [activeTab, setActiveTab] = useState("overview");

  const { currentCountry, status, error } = useSelector(
    (state) => state.countries
  );
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { favorites } = useSelector((state) => state.favorites);
  const { darkMode } = useSelector((state) => state.theme);

  const isFavorite = favorites.includes(code);

  useEffect(() => {
    dispatch(fetchCountryByCode(code));

    // Add a nice scroll to top effect
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
    }
  };

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="relative animate-pulse-glow">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-indigo-500 border-r-cyan-400 border-b-teal-400 border-l-blue-500"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <FiGlobe className="text-indigo-500 text-lg animate-pulse" />
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
        className="text-center py-20 max-w-xl mx-auto"
      >
        <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-2xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            className="w-20 h-20 mx-auto rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mb-6"
          >
            <span className="text-red-500 text-3xl">!</span>
          </motion.div>
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Error Loading Country
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="btn btn-primary"
          >
            Go back to home
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (!currentCountry) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-wrap justify-between items-center mb-6 sm:mb-8 gap-3 sm:gap-4">
          <motion.button
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ x: -5 }}
            onClick={() => navigate(-1)}
            className="btn btn-secondary flex items-center gap-2 text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-2"
          >
            <FiArrowLeft /> Back
          </motion.button>

          {isAuthenticated && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleFavorite}
              className={`btn flex items-center gap-1 sm:gap-2 text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-2 ${
                isFavorite
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "btn-secondary"
              }`}
            >
              <FiHeart className={`${isFavorite ? "fill-current" : ""}`} />
              <span className="hidden xs:inline">{isFavorite ? "Remove from Favorites" : "Add to Favorites"}</span>
              <span className="xs:hidden">{isFavorite ? "Remove" : "Favorite"}</span>
            </motion.button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative group order-1 md:order-1"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
            <div className="relative h-56 xs:h-64 sm:h-72 md:h-80 lg:h-96 overflow-hidden rounded-xl shadow-xl">
              <img
                src={currentCountry.flag}
                alt={`Flag of ${currentCountry.name}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="order-2 md:order-2"
          >
            <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
              {currentCountry.name}
            </h1>

            <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full mb-4 sm:mb-6"></div>

            <div className="mb-6 sm:mb-8">
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 sm:gap-x-8 sm:gap-y-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="flex items-start gap-2 sm:gap-3"
                >
                  <FiUsers className="text-indigo-500 text-lg sm:text-xl mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      Population
                    </p>
                    <p className="text-sm sm:text-base font-semibold">
                      {formatNumber(currentCountry.population)}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="flex items-start gap-2 sm:gap-3"
                >
                  <FiGlobe className="text-indigo-500 text-lg sm:text-xl mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      Region
                    </p>
                    <p className="text-sm sm:text-base font-semibold">{currentCountry.region}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                  className="flex items-start gap-2 sm:gap-3"
                >
                  <FiMap className="text-indigo-500 text-lg sm:text-xl mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      Capital
                    </p>
                    <p className="text-sm sm:text-base font-semibold">
                      {currentCountry.capital || "N/A"}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                  className="flex items-start gap-2 sm:gap-3"
                >
                  <FiDollarSign className="text-indigo-500 text-lg sm:text-xl mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      Currencies
                    </p>
                    <p className="text-sm sm:text-base font-semibold truncate max-w-[180px] sm:max-w-none">
                      {currentCountry.currencies &&
                      currentCountry.currencies.length > 0
                        ? currentCountry.currencies
                            .map((c) => c.name)
                            .join(", ")
                        : "N/A"}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                  className="flex items-start gap-2 sm:gap-3 col-span-1 xs:col-span-2"
                >
                  <FiMessageSquare className="text-indigo-500 text-lg sm:text-xl mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      Languages
                    </p>
                    <p className="text-sm sm:text-base font-semibold">
                      {currentCountry.languages &&
                      currentCountry.languages.length > 0
                        ? currentCountry.languages.join(", ")
                        : "N/A"}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {currentCountry.borders && currentCountry.borders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="glass p-4 sm:p-6 rounded-xl"
          >
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center">
              <FiMap className="mr-2" /> Border Countries
            </h2>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {currentCountry.borders.map((border, index) => (
                <motion.div
                  key={border}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.6 + index * 0.05 }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: darkMode
                      ? "0 0 10px 0 rgba(79, 70, 229, 0.5)"
                      : "0 4px 20px -2px rgba(79, 70, 229, 0.25)",
                  }}
                >
                  <Link
                    to={`/country/${border}`}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-white dark:bg-[#60A5FA] rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-[#3B82F6] transition-all duration-300 inline-block"
                  >
                    {border}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default CountryDetails;
