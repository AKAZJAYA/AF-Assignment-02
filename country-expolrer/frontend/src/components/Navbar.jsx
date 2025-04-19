import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu,
  FiX,
  FiMoon,
  FiSun,
  FiLogOut,
  FiUser,
  FiHeart,
  FiHome,
} from "react-icons/fi";

import { logout } from "../redux/slices/authSlice";
import { toggleDarkMode } from "../redux/slices/themeSlice";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // Navigation links with active state
  const navLinks = [
    { name: "Home", path: "/", icon: <FiHome /> },
    ...(isAuthenticated
      ? [
          { name: "Favorites", path: "/favorites", icon: <FiHeart /> },
          { name: "Profile", path: "/profile", icon: <FiUser /> },
        ]
      : [
          { name: "Login", path: "/login", icon: null },
          { name: "Register", path: "/register", icon: null, isButton: true },
        ]),
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg"
          : darkMode
          ? "bg-gray-900"
          : "bg-white shadow-md"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 0.5,
              }}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30"
              whileHover={{
                rotate: 360,
                transition: { duration: 0.8 },
              }}
            >
              <FiHome className="text-white text-xl" />
            </motion.div>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-500">
                Country Explorer
              </h1>
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) =>
              link.isButton ? (
                <motion.div
                  key={link.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to={link.path} className="btn btn-primary px-5 py-2">
                    {link.name}
                  </Link>
                </motion.div>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-lg hover:text-primary-light transition-colors flex items-center ${
                    location.pathname === link.path
                      ? "text-indigo-600 dark:text-indigo-400 font-medium"
                      : ""
                  }`}
                >
                  {link.icon && <span className="mr-1">{link.icon}</span>}
                  {link.name}

                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                      initial={false}
                    />
                  )}
                </Link>
              )
            )}

            {isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="text-lg hover:text-primary-light transition-colors flex items-center"
              >
                <FiLogOut className="mr-1" /> Logout
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => dispatch(toggleDarkMode())}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors animate-pulse-glow"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? (
                <motion.div
                  initial={{ rotate: -30 }}
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FiSun className="text-xl text-yellow-400" />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ rotate: 30 }}
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FiMoon className="text-xl text-indigo-600" />
                </motion.div>
              )}
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2"
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <FiX className="text-2xl" />
            ) : (
              <FiMenu className="text-2xl" />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 overflow-hidden"
            >
              <motion.div
                className="glass rounded-xl p-4 divide-y divide-gray-200 dark:divide-gray-700 shadow-xl"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.05 + 0.1 }}
                    className={i === 0 ? "" : "pt-2"}
                  >
                    <Link
                      to={link.path}
                      className={`block px-3 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800 flex items-center ${
                        location.pathname === link.path
                          ? "text-indigo-600 dark:text-indigo-400 font-medium"
                          : ""
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.icon && (
                        <span className="mr-3 text-lg">{link.icon}</span>
                      )}
                      {link.name}
                    </Link>
                  </motion.div>
                ))}

                {isAuthenticated && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: navLinks.length * 0.05 + 0.1,
                    }}
                    className="pt-2"
                  >
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800 flex items-center"
                    >
                      <FiLogOut className="mr-3 text-lg" /> Logout
                    </button>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.2,
                    delay: (navLinks.length + 1) * 0.05 + 0.1,
                  }}
                  className="pt-2"
                >
                  <button
                    onClick={() => {
                      dispatch(toggleDarkMode());
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800 flex items-center"
                  >
                    {darkMode ? (
                      <FiSun className="mr-3 text-lg text-yellow-400" />
                    ) : (
                      <FiMoon className="mr-3 text-lg text-indigo-600" />
                    )}
                    {darkMode ? "Light Mode" : "Dark Mode"}
                  </button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
