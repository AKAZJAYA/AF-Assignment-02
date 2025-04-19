import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiX, FiLoader } from "react-icons/fi";
import {
  searchCountries,
  clearSearchResults,
  fetchAllCountries,
} from "../redux/slices/countriesSlice";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.countries);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      dispatch(searchCountries(searchTerm));
    } else {
      dispatch(fetchAllCountries());
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    dispatch(clearSearchResults());
    dispatch(fetchAllCountries());
  };

  // Add delay to simulate "typing" effect on page load
  useEffect(() => {
    const keywords = ["Japan", "Brazil", "Kenya", "Iceland", "Australia"];
    const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
    let currentIndex = 0;

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (currentIndex <= randomKeyword.length) {
          setSearchTerm(randomKeyword.substring(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setSearchTerm("");
          }, 1500);
        }
      }, 100);

      return () => clearInterval(interval);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl"
    >
      <form onSubmit={handleSearch}>
        <motion.div
          className={`relative flex items-center transition-all duration-300 ${
            isFocused
              ? "shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30"
              : "shadow-md"
          }`}
          animate={{ scale: isFocused ? 1.02 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            animate={{
              rotate: isFocused && searchTerm ? [0, -20, 20, -10, 10, 0] : 0,
            }}
            transition={{ duration: 0.5 }}
            className="absolute left-4 text-gray-500"
          >
            {status === "loading" ? (
              <FiLoader className="animate-spin" />
            ) : (
              <FiSearch className={isFocused ? "text-indigo-500" : ""} />
            )}
          </motion.div>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a country..."
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="input pl-10 pr-24 py-3 w-full rounded-lg"
          />

          <AnimatePresence>
            {searchTerm && (
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                type="button"
                onClick={clearSearch}
                className="absolute right-20 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <FiX className="text-gray-500" />
              </motion.button>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={status === "loading"}
            className="absolute right-0 top-0 h-full px-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white rounded-r-lg transition-all duration-300 flex items-center justify-center min-w-[80px]"
          >
            {status === "loading" ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <FiLoader className="text-white" />
              </motion.div>
            ) : (
              "Search"
            )}
          </motion.button>
        </motion.div>
      </form>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        className="text-xs text-gray-500 mt-2 ml-1"
      >
        Try searching by country name, capital, or region
      </motion.p>
    </motion.div>
  );
};

export default SearchBar;
