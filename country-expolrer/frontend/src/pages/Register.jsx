import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import {
  FiUserPlus,
  FiUser,
  FiMail,
  FiLock,
  FiAlertCircle,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { BiWorld } from "react-icons/bi";

import { register, clearError } from "../redux/slices/authSlice";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [activeField, setActiveField] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const formRef = useRef(null);
  const controls = useAnimation();

  const { isAuthenticated, status, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      // Show success animation before redirecting
      setShowSuccess(true);
      const timeout = setTimeout(() => {
        navigate("/");
      }, 1500);

      return () => clearTimeout(timeout);
    }

    // Clear any existing errors when component unmounts
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  // Background particles
  const particles = Array(15)
    .fill()
    .map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 10 + 5,
      duration: Math.random() * 20 + 15,
    }));

  const validateForm = () => {
    const errors = {};
    const { username, email, password, confirmPassword } = formData;

    if (!username) {
      errors.username = "Username is required";
    } else if (username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email address is invalid";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFocus = (field) => {
    setActiveField(field);
  };

  const handleBlur = () => {
    setActiveField(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear field-specific error when typing
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: "",
      });
    }

    // Clear API error when typing
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Form shake animation if invalid
    if (!validateForm()) {
      controls.start({
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.5 },
      });
      return;
    }

    const { username, email, password } = formData;
    dispatch(register({ username, email, password }));
  };

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return 0;

    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 10) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const getStrengthColor = (strength) => {
    if (strength <= 1) return "bg-red-500";
    if (strength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = (strength) => {
    if (strength <= 1) return "Weak";
    if (strength <= 3) return "Medium";
    return "Strong";
  };

  // Success animation
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

  return (
    <div className="max-w-md mx-auto py-10 px-4 relative overflow-hidden">
      {/* Background particles */}
      <div className="fixed inset-0 -z-10 overflow-hidden opacity-10 pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400"
            initial={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              top: [
                `${particle.y}%`,
                `${(particle.y + 30) % 100}%`,
                `${particle.y}%`,
              ],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

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
              className="bg-white dark:bg-gray-800 rounded-2xl p-10 shadow-2xl flex flex-col items-center"
            >
              <motion.div
                className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-6"
                initial={{ scale: 0 }}
                animate={{
                  scale: [0, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ duration: 0.5 }}
              >
                <FiCheck className="text-4xl text-green-500 dark:text-green-300" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">
                Registration Successful!
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Your account has been created successfully. Redirecting you
                now...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div ref={formRef} animate={controls} className="relative">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
        >
          {/* Card glow effects */}
          <motion.div
            className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500/20 to-cyan-400/20 blur-xl"
            animate={{
              opacity: [0.5, 0.8, 0.5],
              scale: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "mirror",
            }}
          />

          <div className="relative p-8">
            {/* Header */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
                whileHover={{
                  rotate: 360,
                  scale: 1.1,
                  transition: { duration: 0.8 },
                }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-400 mb-4 shadow-lg shadow-indigo-500/30"
              >
                <FiUserPlus className="text-3xl text-white" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-500 mb-1"
              >
                Create your account
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 dark:text-gray-300"
              >
                Join Country Explorer today
              </motion.p>
            </motion.div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 rounded-lg border-l-4 border-red-500 flex items-start"
                >
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 0.5 }}
                    className="text-red-500 mt-1 mr-3 flex-shrink-0"
                  >
                    <FiAlertCircle size={20} />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                      Registration Error
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-200 mt-1">
                      {error}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => dispatch(clearError())}
                    className="text-red-500 dark:text-red-300 ml-2"
                  >
                    <FiX size={18} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ x: 5 }}
                  className="relative"
                >
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Username
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <motion.div
                        animate={{
                          color:
                            activeField === "username" || formData.username
                              ? "#6366f1"
                              : "#9ca3af",
                        }}
                      >
                        <FiUser />
                      </motion.div>
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      value={formData.username}
                      onChange={handleChange}
                      onFocus={() => handleFocus("username")}
                      onBlur={handleBlur}
                      className={`input pl-10 pr-4 py-3 w-full transition-all duration-300 border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/50 group-hover:border-indigo-500 dark:group-hover:border-indigo-400
                      ${
                        formErrors.username
                          ? "border-red-500 focus:ring-red-500/50 dark:focus:ring-red-400/50"
                          : ""
                      }
                      `}
                    />
                    <AnimatePresence>
                      {activeField === "username" && (
                        <motion.span
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          exit={{ width: 0 }}
                          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-600 to-cyan-500"
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                  <AnimatePresence>
                    {formErrors.username && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-1.5 text-sm text-red-500 flex items-center"
                      >
                        <FiAlertCircle className="mr-1 flex-shrink-0" />{" "}
                        {formErrors.username}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ x: 5 }}
                  className="relative"
                >
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Email address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <motion.div
                        animate={{
                          color:
                            activeField === "email" || formData.email
                              ? "#6366f1"
                              : "#9ca3af",
                        }}
                      >
                        <FiMail />
                      </motion.div>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => handleFocus("email")}
                      onBlur={handleBlur}
                      className={`input pl-10 pr-4 py-3 w-full transition-all duration-300 border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/50 group-hover:border-indigo-500 dark:group-hover:border-indigo-400
                      ${
                        formErrors.email
                          ? "border-red-500 focus:ring-red-500/50 dark:focus:ring-red-400/50"
                          : ""
                      }
                      `}
                    />
                    <AnimatePresence>
                      {activeField === "email" && (
                        <motion.span
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          exit={{ width: 0 }}
                          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-600 to-cyan-500"
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                  <AnimatePresence>
                    {formErrors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-1.5 text-sm text-red-500 flex items-center"
                      >
                        <FiAlertCircle className="mr-1 flex-shrink-0" />{" "}
                        {formErrors.email}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ x: 5 }}
                  className="relative"
                >
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <motion.div
                        animate={{
                          color:
                            activeField === "password" || formData.password
                              ? "#6366f1"
                              : "#9ca3af",
                        }}
                      >
                        <FiLock />
                      </motion.div>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => handleFocus("password")}
                      onBlur={handleBlur}
                      className={`input pl-10 pr-4 py-3 w-full transition-all duration-300 border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/50 group-hover:border-indigo-500 dark:group-hover:border-indigo-400
                      ${
                        formErrors.password
                          ? "border-red-500 focus:ring-red-500/50 dark:focus:ring-red-400/50"
                          : ""
                      }
                      `}
                    />
                    <AnimatePresence>
                      {activeField === "password" && (
                        <motion.span
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          exit={{ width: 0 }}
                          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-600 to-cyan-500"
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Password strength indicator */}
                  {formData.password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-2"
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 flex-1 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                          <motion.div
                            className={`h-full ${getStrengthColor(
                              passwordStrength
                            )}`}
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(passwordStrength / 5) * 100}%`,
                            }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                        <span className="text-xs font-medium">
                          {getStrengthText(passwordStrength)}
                        </span>
                      </div>

                      <ul className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 space-y-1">
                        <li className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full mr-1.5 ${
                              formData.password.length >= 6
                                ? "bg-green-500"
                                : "bg-gray-300 dark:bg-gray-600"
                            }`}
                          />
                          At least 6 characters
                        </li>
                        <li className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full mr-1.5 ${
                              /[A-Z]/.test(formData.password)
                                ? "bg-green-500"
                                : "bg-gray-300 dark:bg-gray-600"
                            }`}
                          />
                          At least 1 uppercase letter
                        </li>
                        <li className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full mr-1.5 ${
                              /[0-9]/.test(formData.password)
                                ? "bg-green-500"
                                : "bg-gray-300 dark:bg-gray-600"
                            }`}
                          />
                          At least 1 number
                        </li>
                      </ul>
                    </motion.div>
                  )}

                  <AnimatePresence>
                    {formErrors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-1.5 text-sm text-red-500 flex items-center"
                      >
                        <FiAlertCircle className="mr-1 flex-shrink-0" />{" "}
                        {formErrors.password}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ x: 5 }}
                  className="relative"
                >
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Confirm password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <motion.div
                        animate={{
                          color:
                            activeField === "confirmPassword" ||
                            formData.confirmPassword
                              ? "#6366f1"
                              : "#9ca3af",
                        }}
                      >
                        <FiLock />
                      </motion.div>
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onFocus={() => handleFocus("confirmPassword")}
                      onBlur={handleBlur}
                      className={`input pl-10 pr-4 py-3 w-full transition-all duration-300 border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/50 group-hover:border-indigo-500 dark:group-hover:border-indigo-400
                      ${
                        formErrors.confirmPassword
                          ? "border-red-500 focus:ring-red-500/50 dark:focus:ring-red-400/50"
                          : ""
                      }
                      `}
                    />
                    <AnimatePresence>
                      {activeField === "confirmPassword" && (
                        <motion.span
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          exit={{ width: 0 }}
                          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-600 to-cyan-500"
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Password match indicator */}
                    {formData.confirmPassword && formData.password && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {formData.confirmPassword === formData.password ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-green-500"
                          >
                            <FiCheck />
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-red-500"
                          >
                            <FiX />
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                  <AnimatePresence>
                    {formErrors.confirmPassword && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-1.5 text-sm text-red-500 flex items-center"
                      >
                        <FiAlertCircle className="mr-1 flex-shrink-0" />{" "}
                        {formErrors.confirmPassword}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full py-3 px-4 flex justify-center items-center rounded-md shadow-lg shadow-indigo-500/20 transition-all duration-300 relative overflow-hidden group"
                  >
                    {/* Gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-cyan-500 group-hover:scale-105 transition-transform duration-300"></div>

                    {/* Shimmering effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <motion.div
                        className="absolute w-20 h-full transform -skew-x-12 bg-white/20"
                        animate={{ left: ["-20%", "120%"] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.5,
                          repeatDelay: 1,
                          ease: "easeInOut",
                        }}
                      />
                    </div>

                    <span className="relative z-10 text-white font-medium flex items-center">
                      {status === "loading" ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            repeat: Infinity,
                            duration: 1,
                            ease: "linear",
                          }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                      ) : (
                        <BiWorld className="mr-2 text-lg" />
                      )}
                      {status === "loading"
                        ? "Creating account..."
                        : "Register"}
                    </span>
                  </button>
                </motion.div>
              </div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-center"
            >
              <p className="text-gray-600 dark:text-gray-300">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-indigo-600 dark:text-indigo-400 font-medium relative group"
                >
                  <span className="relative z-10">Log in</span>
                  <motion.span
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.2 }}
                  />
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
