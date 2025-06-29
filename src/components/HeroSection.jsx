import { Brain, Github, Library, Linkedin, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import Button from './ui/Button';
import { useFlashcardStore } from '../store/flashcardStore';
import { useState } from 'react';

const socials = [
  {
    id: "github",
    icon: <Github className="w-5 h-5" />,
    label: "Deepak Kumar",
    username: "@kumardeepak16",
    href: "https://github.com/kumardeepak16",
  },
  {
    id: "linkedin",
    icon: <Linkedin className="w-5 h-5" />,
    label: "Deepak Kumar",
    username: "@deepakkumar1916",
    href: "https://linkedin.com/in/deepakkumar1916",
  },
];

// Main Components
const HeroSection = () => {
    const { savedSets, setShowForm, setShowSavedSets } = useFlashcardStore();
    const [hoveredIcon, setHoveredIcon] = useState(null);

    return (
      <section className="min-h-screen heading flex flex-col items-center justify-center relative overflow-hidden px-4 md:px-10 py-20 ">
        <div class="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_140%)]"></div>

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-10 py-4">
          {/* Logo + App Name */}
          <div className="flex items-center space-x-1">
            {/* SVG Logo */}
            <motion.svg
              className="w-8 h-8 text-purple-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{
                rotateY: [0, 180, 0], // flip forward and back
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
              <path d="M7 8h10M7 12h6" />
            </motion.svg>
            <span className="text-2xl lg:text-3xl font-extrabold text-gray-800 tracking-wide">
              Cardly AI
            </span>
          </div>
          {/* Social Icons */}
          <div className="flex items-center space-x-6">
            {socials.map((item) => (
              <div
                key={item.id}
                className="relative flex items-center space-x-2 group"
                onMouseEnter={() => setHoveredIcon(item.id)}
                onMouseLeave={() => setHoveredIcon(null)}
              >
                {/* Icon with slide effect */}
                <motion.a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900"
                  title={item.id}
                  animate={{
                    x: hoveredIcon === item.id ? -6 : 0,
                    transition: { type: "spring", stiffness: 400, damping: 30 },
                  }}
                >
                  {item.icon}
                </motion.a>

                {/* Name + Username appears on hover */}
                <AnimatePresence>
                  {hoveredIcon === item.id && (
                    <motion.a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.2 }}
                      className="hidden lg:inline-block text-sm text-purple-700 font-medium underline hover:text-purple-900"
                    >
                      {item.label}{" "}
                      <span className="text-gray-500">{item.username}</span>
                    </motion.a>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl w-full">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-100 rounded-full text-purple-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Cardly • AI-Powered Flashcards</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-7xl font-black bg-gradient-to-r from-gray-900 via-purple-700 to-indigo-600 bg-clip-text text-transparent leading-tight mb-6"
          >
            Train Your Brain <br />
            with{" "}
            <span className="text-white bg-gradient-to-r from-purple-500 to-black/80 px-3  rounded-md inline-block shadow-sm">
              Cardly
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-md md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Create intelligent flashcards instantly with AI. Study smarter,
            retain better, and learn faster — all with Cardly.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="md"
              onClick={() => setShowForm(true)}
              className="group"
            >
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Create Flashcards</span>
              </div>
            </Button>

            {savedSets.length > 0 && (
              <Button
                variant="ghost"
                size="md"
                onClick={() => setShowSavedSets(true)}
              >
                <div className="flex items-center space-x-2">
                  <Library className="w-5 h-5" />
                  <span>My Sets ({savedSets.length})</span>
                </div>
              </Button>
            )}
          </motion.div>
        </div>
      </section>
    );
  };
  
export default HeroSection