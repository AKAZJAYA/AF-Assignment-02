import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  const { darkMode } = useSelector((state) => state.theme);
  const location = useLocation();

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div
      className={`flex flex-col min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      } transition-colors duration-300`}
    >
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-6 md:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />

      {/* Background decorations */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        {darkMode ? (
          <>
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-indigo-900/20 blur-3xl rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-900/20 blur-3xl rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
          </>
        ) : (
          <>
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-indigo-300/20 blur-3xl rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-cyan-300/20 blur-3xl rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
          </>
        )}
      </div>
    </div>
  );
};

export default Layout;
