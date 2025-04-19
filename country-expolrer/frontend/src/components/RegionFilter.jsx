import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiGlobe, FiFilter } from "react-icons/fi";

const RegionFilter = ({ regions, selectedRegion, onRegionChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Filter variants
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      height: 0,
      transition: {
        y: { stiffness: 1000 },
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      height: "auto",
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="relative z-20"
    >
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`px-4 py-3 bg-white dark:bg-[#60A5FA] shadow-md rounded-md flex items-center justify-between min-w-[200px] ${
          isOpen ? "shadow-lg ring-2 ring-indigo-300 dark:ring-blue-400" : ""
        }`}
      >
        <div className="flex items-center">
          {selectedRegion ? (
            <FiGlobe className="mr-2 text-indigo-500" />
          ) : (
            <FiFilter className="mr-2 text-indigo-500" />
          )}
          <span className="font-medium">
            {selectedRegion || "Filter by Region"}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <FiChevronDown />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#60A5FA] shadow-xl rounded-md overflow-hidden"
          >
            <motion.ul className="max-h-60 overflow-y-auto py-1">
              <motion.li
                variants={itemVariants}
                onClick={() => {
                  onRegionChange("");
                  setIsOpen(false);
                }}
                className="px-4 py-2 hover:bg-indigo-50 dark:hover:bg-[#3B82F6] cursor-pointer flex items-center text-left"
              >
                <span className="w-6 h-6 mr-2 rounded-full flex items-center justify-center bg-indigo-100 dark:bg-blue-800">
                  <FiGlobe className="text-sm text-indigo-600 dark:text-blue-300" />
                </span>
                All Regions
              </motion.li>

              {regions.map((region, index) => (
                <motion.li
                  key={region}
                  variants={itemVariants}
                  custom={index}
                  onClick={() => {
                    onRegionChange(region);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-2 hover:bg-indigo-50 dark:hover:bg-[#3B82F6] cursor-pointer flex items-center ${
                    selectedRegion === region
                      ? "bg-indigo-50 dark:bg-blue-700"
                      : ""
                  }`}
                >
                  <span className="w-6 h-6 mr-2 rounded-full flex items-center justify-center bg-indigo-100 dark:bg-blue-800">
                    <span className="text-xs font-bold text-indigo-600 dark:text-blue-300">
                      {region.charAt(0)}
                    </span>
                  </span>
                  {region}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RegionFilter;
