import { motion } from "framer-motion";
const Button = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}) => {
  const baseClasses =
    "font-semibold rounded-xl heading transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-700 hover:to-gray-700 text-white shadow-lg",
    secondary:
      "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm",
    ghost:
      "bg-white/80 hover:bg-white/90 text-gray-600 backdrop-blur-sm border border-gray-200",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
