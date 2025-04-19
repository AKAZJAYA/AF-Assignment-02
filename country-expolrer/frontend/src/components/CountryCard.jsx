import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { FiHeart, FiInfo } from "react-icons/fi";
import {
  addToFavorites,
  removeFromFavorites,
} from "../redux/slices/favoritesSlice";

const CountryCard = ({ country }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { favorites } = useSelector((state) => state.favorites);
  const dispatch = useDispatch();

  const isFavorite = favorites.includes(country.alpha3Code);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFavorite) {
      dispatch(removeFromFavorites(country.alpha3Code));
    } else {
      dispatch(addToFavorites(country.alpha3Code));
    }
  };

  // Card flip animation
  const cardVariants = {
    hover: {
      rotateY: 10,
      rotateX: 10,
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      variants={cardVariants}
      whileHover="hover"
      className="card group"
      style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
    >
      <Link to={`/country/${country.alpha3Code}`} className="block h-full">
        <div className="relative h-40 overflow-hidden">
          <motion.img
            src={country.flag}
            alt={`Flag of ${country.name}`}
            className="w-full h-full object-cover"
            initial={{ filter: "brightness(1)" }}
            whileHover={{
              filter: [
                "brightness(1)",
                "hue-rotate(45deg) brightness(1.3)",
                "contrast(1.5) saturate(1.8) hue-rotate(90deg)",
                "invert(0.2) brightness(1.1) hue-rotate(-45deg)",
                "sepia(0.5) saturate(2) hue-rotate(30deg)",
                "contrast(1.2) brightness(1.1) grayscale(0.3)",
                "brightness(1)",
              ],
              scale: [1, 1.2, 0.9, 1.3, 0.8, 1.1, 1],
              rotate: [0, 8, -12, 15, -10, 5, 0],
              x: [0, 15, -15, 10, -20, 5, 0],
              y: [0, -10, 15, -5, 20, -5, 0],
              borderRadius: [
                "0%",
                "30% 70% 70% 30% / 30% 30% 70% 70%",
                "50% 50% 50% 50% / 60% 40% 60% 40%",
                "20% 80% 20% 80% / 40% 40% 60% 60%",
                "80% 20% 80% 20% / 50% 50% 50% 50%",
                "0%",
              ],
              boxShadow: [
                "0px 0px 0px rgba(0,0,0,0)",
                "10px 10px 20px rgba(79, 70, 229, 0.4)",
                "-10px 5px 15px rgba(236, 72, 153, 0.3)",
                "0px -10px 25px rgba(6, 182, 212, 0.5)",
                "10px 5px 15px rgba(79, 70, 229, 0.2)",
                "0px 0px 0px rgba(0,0,0,0)",
              ],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: [0.25, 0.1, 0.25, 1],
              times: [0, 0.2, 0.4, 0.6, 0.8, 0.9, 1],
            }}
          />

          {/* 3D perspective layer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100"
            initial={{ rotateX: 0 }}
            whileHover={{
              rotateX: [0, 10, -5, 7, 0],
              rotateY: [0, -15, 5, -10, 0],
              backgroundImage: [
                "linear-gradient(to top, transparent, rgba(255, 255, 255, 0.05), transparent)",
                "linear-gradient(to right, transparent, rgba(79, 70, 229, 0.1), transparent)",
                "linear-gradient(to bottom, transparent, rgba(236, 72, 153, 0.1), transparent)",
                "linear-gradient(to left, transparent, rgba(6, 182, 212, 0.1), transparent)",
                "linear-gradient(to top, transparent, rgba(255, 255, 255, 0.05), transparent)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            style={{ transformStyle: "preserve-3d" }}
          />

          {/* Glinting effect */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 overflow-hidden pointer-events-none"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            <motion.div
              className="w-20 h-[500%] bg-white/30 blur-md absolute -translate-x-1/2 -translate-y-1/2"
              initial={{ top: "0%", left: "0%", rotate: 35 }}
              animate={{
                top: ["0%", "100%", "0%"],
                left: ["0%", "100%", "0%"],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {isAuthenticated && (
            <motion.button
              onClick={toggleFavorite}
              whileTap={{ scale: 0.9 }}
              className={`absolute top-3 right-3 p-2 rounded-full ${
                isFavorite
                  ? "bg-red-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              } shadow-md transition-all duration-300`}
            >
              <FiHeart
                className={`${
                  isFavorite ? "fill-current" : ""
                } transition-all duration-300`}
              />
            </motion.button>
          )}

          <motion.div
            className="absolute bottom-0 left-0 w-full py-1 px-3 bg-gradient-to-t from-black/70 to-transparent text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"
            initial={{ y: "100%" }}
            whileHover={{ y: 0 }}
          >
            <div className="flex items-center text-xs">
              <FiInfo className="mr-1" /> Click for details
            </div>
          </motion.div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
            {country.name}
          </h3>
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-medium">Population:</span>{" "}
              {country.population.toLocaleString()}
            </p>
            <p>
              <span className="font-medium">Region:</span> {country.region}
            </p>
            <p>
              <span className="font-medium">Capital:</span>{" "}
              {country.capital || "N/A"}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CountryCard;
