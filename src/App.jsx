// import React, { useState, useEffect, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Plus,
//   Brain,
//   Sparkles,
//   RotateCcw,
//   Eye,
//   EyeOff,
//   Sun,
//   Moon,
//   Trash2,
//   Download,
//   Upload,
//   Zap,
//   X,
//   ChevronLeft,
//   ChevronRight,
//   Settings,
//   BookOpen,
//   ArrowLeft,
//   ArrowRight,
//   Space,
//   Keyboard,
// } from "lucide-react";
// import { useForm } from "react-hook-form";
// import "./App.css";
// import logo from "./assets/image.png"
// const FlashcardGenerator = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     watch,
//   } = useForm({
//     defaultValues: { topic: "", difficulty: "easy", numCards: 5 },
//   });

//   const [flashcards, setFlashcards] = useState([]);
//   const [savedSets, setSavedSets] = useState([]);
//   const [currentCard, setCurrentCard] = useState(0);
//   const [isFlipped, setIsFlipped] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [apiKey, setApiKey] = useState("");
//   const [showApiInput, setShowApiInput] = useState(false);
//   const [isDark, setIsDark] = useState(false);
//   const [error, setError] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const [showFlashcard, setShowFlashcard] = useState(false);
//   const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

//   // Load data from memory storage on component mount
//   useEffect(() => {
//     try {
//       const savedApiKey = sessionStorage.getItem("gemini-api-key");
//       const savedFlashcards = sessionStorage.getItem("flashcard-sets");

//       if (savedApiKey) {
//         setApiKey(savedApiKey);
//       }

//       if (savedFlashcards) {
//         setSavedSets(JSON.parse(savedFlashcards));
//       }
//     } catch (err) {
//       console.error("Error loading saved data:", err);
//     }
//   }, []);

//   // Save flashcard sets to memory storage
//   const saveFlashcardSet = useCallback(
//     (cards, topicName) => {
//       try {
//         const newSet = {
//           id: Date.now(),
//           topic: topicName,
//           difficulty,
//           cards,
//           createdAt: new Date().toISOString(),
//         };

//         const updatedSets = [newSet, ...savedSets.slice(0, 9)]; // Keep last 10 sets
//         setSavedSets(updatedSets);
//         sessionStorage.setItem("flashcard-sets", JSON.stringify(updatedSets));
//       } catch (err) {
//         console.error("Error saving flashcard set:", err);
//       }
//     },
//     [savedSets]
//   );

//   // Keyboard navigation
//   useEffect(() => {
//     const handleKeyPress = (e) => {
//       if (!showFlashcard || flashcards.length === 0) return;

//       // Prevent default only for our handled keys
//       switch (e.key) {
//         case "ArrowLeft":
//           e.preventDefault();
//           prevCard();
//           break;
//         case "ArrowRight":
//           e.preventDefault();
//           nextCard();
//           break;
//         case " ":
//         case "Enter":
//           e.preventDefault();
//           setIsFlipped(!isFlipped);
//           break;
//         case "Escape":
//           e.preventDefault();
//           setShowFlashcard(false);
//           break;
//         case "?":
//           e.preventDefault();
//           setShowKeyboardHelp(!showKeyboardHelp);
//           break;
//       }
//     };

//     window.addEventListener("keydown", handleKeyPress);
//     return () => window.removeEventListener("keydown", handleKeyPress);
//   }, [showFlashcard, flashcards.length, isFlipped, showKeyboardHelp]);

//   const topic = watch("topic");

//   const onSubmit = (data) => {
//     if (!isLoading && data.topic.trim()) {
//       generateFlashcards(data);
//     }
//   };

//   const generateFlashcards = async (data) => {
//     if (!apiKey.trim()) {
//       setError("Please enter your Gemini API key");
//       setShowApiInput(true);
//       return;
//     }

//     if (!topic.trim()) {
//       setError("Please enter a topic");
//       return;
//     }

//     setIsLoading(true);
//     setError("");

//     try {
//       const prompt = `Generate ${data.numCards} flashcards about "${data.topic}" at ${data.difficulty} difficulty level.
//       Format the response as a JSON array with objects containing "question" and "answer" fields.
//       Make questions clear and concise, answers detailed but not too long.
//       Ensure questions test understanding, not just memorization.
//       Return only the JSON array, no additional text.`;

//       const response = await fetch(
//         `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             contents: [
//               {
//                 parts: [
//                   {
//                     text: prompt,
//                   },
//                 ],
//               },
//             ],
//           }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`API Error: ${response.status}`);
//       }

//       const data = await response.json();
//       const generatedText = data.candidates[0].content.parts[0].text;

//       const cleanedText = generatedText
//         .replace(/```json\n?|\n?```/g, "")
//         .trim();
//       const cards = JSON.parse(cleanedText);

//       if (Array.isArray(cards) && cards.length > 0) {
//         setFlashcards(cards);
//         setCurrentCard(0);
//         setIsFlipped(false);
//         setShowForm(false);
//         setShowFlashcard(true);

//         // Save API key and flashcard set
//         sessionStorage.setItem("gemini-api-key", apiKey);
//         saveFlashcardSet(cards, topic);
//       } else {
//         throw new Error("Invalid response format");
//       }
//     } catch (err) {
//       console.error("Error generating flashcards:", err);
//       setError(
//         "Failed to generate flashcards. Please check your API key and try again."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const loadSavedSet = (set) => {
//     setFlashcards(set.cards);
//     setCurrentCard(0);
//     setIsFlipped(false);
//     setShowFlashcard(true);
//     setTopic(set.topic);
//     setDifficulty(set.difficulty);
//   };

//   const nextCard = () => {
//     setCurrentCard((prev) => (prev + 1) % flashcards.length);
//     setIsFlipped(false);
//   };

//   const prevCard = () => {
//     setCurrentCard(
//       (prev) => (prev - 1 + flashcards.length) % flashcards.length
//     );
//     setIsFlipped(false);
//   };

//   const exportFlashcards = () => {
//     const dataStr = JSON.stringify(flashcards, null, 2);
//     const dataBlob = new Blob([dataStr], { type: "application/json" });
//     const url = URL.createObjectURL(dataBlob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `flashcards-${topic.replace(/\s+/g, "-")}.json`;
//     link.click();
//     URL.revokeObjectURL(url);
//   };

//   const HeroSection = () => (
//     <motion.section
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="min-h-screen flex-col flex items-center justify-center relative overflow-hidden px-4 md:px-10 py-20"
//     >
//       <div className="flex justify-between">
//         <div className="absolute top-6 left-6 flex items-center space-x-3 z-20">
//           <img src={logo} alt="Cardly logo" className="h-10 sm:h-14" />

//         </div>

//         <motion.button
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 1.5 }}
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={() => setIsDark(!isDark)}
//           className={`absolute top-6 right-6 p-3 rounded-full z-20 backdrop-blur-sm transition-all duration-300 shadow-md ${
//             isDark
//               ? "bg-gray-800/80 hover:bg-gray-700/80"
//               : "bg-white/80 hover:bg-white"
//           }`}
//           aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
//         >
//           {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
//         </motion.button>
//       </div>
//       {/* Animated Background Bubbles */}
//       <div className="absolute inset-0 overflow-hidden">
//         <motion.div
//           animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
//           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
//           className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-fuchsia-500/20 to-purple-600/20 rounded-full blur-3xl"
//         />
//         <motion.div
//           animate={{ rotate: [360, 0], scale: [1.2, 1, 1.2] }}
//           transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
//           className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-500/20 to-fuchsia-600/20 rounded-full blur-3xl"
//         />
//       </div>

//       {/* Content Container */}
//       <div className="relative z-10 text-center max-w-4xl w-full">
//         {/* Logo & Theme Toggle */}

//         {/* Main Headline */}
//         <motion.h1
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.3 }}
//           className="text-4xl sm:text-5xl md:text-7xl font-black bg-gradient-to-r from-black via-purple-700 to-purple-600 bg-clip-text text-transparent leading-tight mb-6"
//         >
//           AI Flashcards
//         </motion.h1>

//         {/* Subtitle */}
//         <motion.p
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.5 }}
//           className={`text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed ${
//             isDark ? "text-gray-300" : "text-gray-600"
//           }`}
//         >
//           Generate powerful, smart, and personalized flashcards with the help of
//           AI — designed for focused, fast learning.
//         </motion.p>

//         {/* CTA Buttons */}
//         <motion.div
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.7 }}
//           className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"
//         >
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => setShowForm(true)}
//             className="group px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-semibold text-sm sm:text-base rounded-xl transition-all shadow-xl relative"
//           >
//             <div className="flex items-center space-x-2">
//               <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
//               <span>Create Flashcards</span>
//             </div>
//             <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-400 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity -z-10" />
//           </motion.button>

//           {savedSets.length > 0 && (
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setShowForm(true)}
//               className={`px-6 py-3 font-semibold text-sm sm:text-base rounded-xl transition-all backdrop-blur-sm border shadow-sm ${
//                 isDark
//                   ? "bg-gray-800/50 hover:bg-gray-700/50 border-gray-700 text-white"
//                   : "bg-white/70 hover:bg-white/90 border-gray-200 text-gray-800"
//               }`}
//             >
//               <div className="flex items-center space-x-2">
//                 <BookOpen className="w-5 h-5" />
//                 <span>My Flashcards ({savedSets.length})</span>
//               </div>
//             </motion.button>
//           )}
//         </motion.div>
//       </div>
//     </motion.section>
//   );

//   const FormModal = () => (
//     <AnimatePresence>
//       {showForm && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//           onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
//         >
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0, y: 20 }}
//             animate={{ scale: 1, opacity: 1, y: 0 }}
//             exit={{ scale: 0.9, opacity: 0, y: 20 }}
//             className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
//               isDark
//                 ? "bg-gray-900 border border-gray-700"
//                 : "bg-white border border-gray-200"
//             } rounded-3xl shadow-2xl`}
//           >
//             {/* Header */}
//             <div className="sticky top-0 p-6 border-b border-gray-700/50 bg-gradient-to-r from-fuchsia-500/10 to-purple-600/10 backdrop-blur-sm">
//               <div className="flex justify-between items-center">
//                 <div className="flex items-center space-x-3">
//                   <div className="p-2 bg-gradient-to-r from-fuchsia-500 to-purple-600 rounded-full">
//                     <Settings className="w-5 h-5 text-white" />
//                   </div>
//                   <h2 className="text-2xl font-bold">Create Flashcards</h2>
//                 </div>
//                 <button
//                   onClick={() => setShowForm(false)}
//                   className={`p-2 rounded-full ${
//                     isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
//                   } transition-colors`}
//                   aria-label="Close form"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>
//             </div>

//             <form className="p-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
//               {/* API Key Section */}
//               <AnimatePresence>
//                 {!apiKey && (
//                   <motion.div
//                     initial={{ opacity: 0, height: 0 }}
//                     animate={{ opacity: 1, height: "auto" }}
//                     exit={{ opacity: 0, height: 0 }}
//                     className="mb-6"
//                   >
//                     <div
//                       className={`p-4 rounded-xl ${
//                         isDark
//                           ? "bg-yellow-900/20 border border-yellow-700/50"
//                           : "bg-yellow-50 border border-yellow-200"
//                       }`}
//                     >
//                       <div className="flex items-center space-x-2 mb-3">
//                         <Zap className="w-5 h-5 text-yellow-500" />
//                         <h3 className="font-semibold">
//                           Gemini API Key Required
//                         </h3>
//                       </div>
//                       <input
//                         type="password"
//                         value={apiKey}
//                         onChange={(e) => setApiKey(e.target.value)}
//                         placeholder="Enter your Gemini API key..."
//                         className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors ${
//                           isDark
//                             ? "bg-gray-800 border-gray-600 focus:border-fuchsia-500"
//                             : "bg-white border-gray-300 focus:border-fuchsia-500"
//                         }`}
//                         aria-label="Gemini API Key"
//                       />
//                       <p
//                         className={`text-xs mt-2 ${
//                           isDark ? "text-gray-400" : "text-gray-600"
//                         }`}
//                       >
//                         Get your free API key from Google AI Studio. Your key is
//                         stored securely in your browser.
//                       </p>
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>

//               {/* Form Fields */}
//               <div>
//                 <label
//                   className={`block text-sm font-semibold mb-2 ${
//                     isDark ? "text-gray-300" : "text-gray-700"
//                   }`}
//                 >
//                   Topic *
//                 </label>
//                 <input
//                   {...register("topic", { required: "Topic is required" })}
//                   placeholder="e.g., World War II, Calculus..."
//                   className={`w-full px-4 py-3 rounded-xl border-2 text-lg focus:outline-none transition-colors ${
//                     isDark
//                       ? "bg-gray-800 border-gray-700 focus:border-fuchsia-500"
//                       : "bg-gray-50 border-gray-300 focus:border-fuchsia-500"
//                   }`}
//                   aria-label="Topic"
//                 />
//                 {errors.topic && (
//                   <p className="text-sm text-red-500 mt-1">
//                     {errors.topic.message}
//                   </p>
//                 )}
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                 <div>
//                   <label
//                     className={`block text-sm font-semibold mb-2 ${
//                       isDark ? "text-gray-300" : "text-gray-700"
//                     }`}
//                   >
//                     Difficulty
//                   </label>
//                   <select
//                     {...register("difficulty")}
//                     className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors ${
//                       isDark
//                         ? "bg-gray-800 border-gray-700 focus:border-fuchsia-500"
//                         : "bg-gray-50 border-gray-300 focus:border-fuchsia-500"
//                     }`}
//                   >
//                     <option value="easy">Easy - Basic</option>
//                     <option value="medium">Medium - Moderate</option>
//                     <option value="hard">Hard - Advanced</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label
//                     className={`block text-sm font-semibold mb-2 ${
//                       isDark ? "text-gray-300" : "text-gray-700"
//                     }`}
//                   >
//                     Number of Cards
//                   </label>
//                   <select
//                     {...register("numCards")}
//                     className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors ${
//                       isDark
//                         ? "bg-gray-800 border-gray-700 focus:border-fuchsia-500"
//                         : "bg-gray-50 border-gray-300 focus:border-fuchsia-500"
//                     }`}
//                   >
//                     {[3, 5, 10, 15, 20].map((n) => (
//                       <option key={n} value={n}>
//                         {n} Cards
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               {error && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl"
//                   role="alert"
//                 >
//                   <p className="text-red-400 text-sm">{error}</p>
//                 </motion.div>
//               )}

//               {/* Submit Button */}
//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 type="submit"
//                 disabled={isLoading || !topic.trim()}
//                 className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white font-bold text-lg rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
//               >
//                 {isLoading ? (
//                   <>
//                     <motion.div
//                       animate={{ rotate: 360 }}
//                       transition={{
//                         duration: 1,
//                         repeat: Infinity,
//                         ease: "linear",
//                       }}
//                     >
//                       <RotateCcw className="w-6 h-6" />
//                     </motion.div>
//                     <span>Generating Flashcards...</span>
//                   </>
//                 ) : (
//                   <>
//                     <Sparkles className="w-6 h-6" />
//                     <span>Generate Flashcards</span>
//                   </>
//                 )}
//               </motion.button>

//               {/* Saved Sets */}
//               {savedSets.length > 0 && (
//                 <div className="mt-8 pt-6 border-t border-gray-700/50">
//                   <h3 className="text-lg font-semibold mb-4 flex items-center">
//                     <BookOpen className="w-5 h-5 mr-2 text-fuchsia-500" />
//                     Recent Flashcard Sets
//                   </h3>
//                   <div className="space-y-3 max-h-60 overflow-y-auto">
//                     {savedSets.slice(0, 5).map((set) => (
//                       <motion.button
//                         key={set.id}
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                         onClick={() => loadSavedSet(set)}
//                         className={`w-full p-4 text-left rounded-xl ${
//                           isDark
//                             ? "bg-gray-800 hover:bg-gray-700 border border-gray-700"
//                             : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
//                         } transition-colors`}
//                       >
//                         <div className="flex justify-between items-start">
//                           <div>
//                             <h4 className="font-semibold truncate">
//                               {set.topic}
//                             </h4>
//                             <p
//                               className={`text-sm ${
//                                 isDark ? "text-gray-400" : "text-gray-600"
//                               }`}
//                             >
//                               {set.cards.length} cards • {set.difficulty}
//                             </p>
//                           </div>
//                           <span
//                             className={`text-xs ${
//                               isDark ? "text-gray-500" : "text-gray-500"
//                             }`}
//                           >
//                             {new Date(set.createdAt).toLocaleDateString()}
//                           </span>
//                         </div>
//                       </motion.button>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </form>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );

//   const FlashcardModal = () => (
//     <AnimatePresence>
//       {showFlashcard && flashcards.length > 0 && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//         >
//           {/* Header */}
//           <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
//             <div className="flex items-center space-x-4">
//               <button
//                 onClick={() => setShowFlashcard(false)}
//                 className="p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors"
//                 aria-label="Close flashcards"
//               >
//                 <X className="w-6 h-6 text-white" />
//               </button>
//               <div className="text-white">
//                 <span className="text-lg font-semibold">{topic}</span>
//                 <div className="text-sm opacity-75">
//                   Card {currentCard + 1} of {flashcards.length}
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center space-x-2">
//               <button
//                 onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
//                 className="p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors"
//                 aria-label="Keyboard shortcuts"
//               >
//                 <Keyboard className="w-6 h-6 text-white" />
//               </button>
//               <button
//                 onClick={exportFlashcards}
//                 className="p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors"
//                 aria-label="Export flashcards"
//               >
//                 <Download className="w-6 h-6 text-white" />
//               </button>
//             </div>
//           </div>

//           {/* Progress Bar */}
//           <div className="absolute top-20 left-4 right-4 h-1 bg-white/20 rounded-full overflow-hidden">
//             <motion.div
//               className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-600"
//               initial={{ width: 0 }}
//               animate={{
//                 width: `${((currentCard + 1) / flashcards.length) * 100}%`,
//               }}
//               transition={{ duration: 0.3 }}
//             />
//           </div>

//           {/* Flashcard Container - 9:16 Aspect Ratio */}
//           <div
//             className="relative w-full max-w-sm mx-auto"
//             style={{ aspectRatio: "9/10" }}
//           >
//             <div className="absolute inset-0 perspective-1000">
//               <motion.div
//                 key={currentCard}
//                 initial={{ rotateY: 90, opacity: 0 }}
//                 animate={{ rotateY: 0, opacity: 1 }}
//                 exit={{ rotateY: -90, opacity: 0 }}
//                 transition={{ duration: 0.4 }}
//                 className="relative w-full h-full cursor-pointer"
//                 onClick={() => setIsFlipped(!isFlipped)}
//               >
//                 <motion.div
//                   className="absolute inset-0 w-full h-full preserve-3d"
//                   animate={isFlipped ? "back" : "front"}
//                   variants={{
//                     front: { rotateY: 0 },
//                     back: { rotateY: 180 },
//                   }}
//                   transition={{ duration: 0.6 }}
//                   style={{ transformStyle: "preserve-3d" }}
//                 >
//                   {/* Front of Card */}
//                   <div className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 border-2 border-purple-500/30 rounded-3xl p-8 flex flex-col justify-center items-center text-center shadow-2xl">
//                     <div className="flex items-center space-x-2 mb-6">
//                       <div className="p-3 bg-gradient-to-r from-fuchsia-500 to-purple-600 rounded-full">
//                         <Eye className="w-6 h-6 text-white" />
//                       </div>
//                       <span className="text-purple-300 font-medium">
//                         Question
//                       </span>
//                     </div>
//                     <h3 className="text-lg font-bold flex items-center h-full text-white mb-8 leading-relaxed">
//                       {flashcards[currentCard].question}
//                     </h3>
//                     <div className="mt-auto">
//                       <p className="text-purple-300 text-sm flex items-center justify-center space-x-2">
//                         <Space className="w-4 h-4" />
//                         <span>Tap or press Space to reveal</span>
//                       </p>
//                     </div>
//                   </div>

//                   {/* Back of Card */}
//                   <div
//                     className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-purple-900 via-fuchsia-900 to-purple-900 border-2 border-fuchsia-500/30 rounded-3xl p-8 flex flex-col justify-center items-center text-center shadow-2xl"
//                     style={{ transform: "rotateY(180deg)" }}
//                   >
//                     <div className="flex items-center space-x-2 mb-6">
//                       <div className="p-3 bg-gradient-to-r from-purple-500 to-fuchsia-600 rounded-full">
//                         <EyeOff className="w-6 h-6 text-white" />
//                       </div>
//                       <span className="text-fuchsia-300 font-medium">
//                         Answer
//                       </span>
//                     </div>
//                     <div className="flex-1 flex items-center justify-center">
//                       <p className="text-lg text-white leading-relaxed">
//                         {flashcards[currentCard].answer}
//                       </p>
//                     </div>
//                   </div>
//                 </motion.div>
//               </motion.div>
//             </div>
//           </div>

//           {/* Navigation Controls */}
//           <div className="absolute bottom-8 left-4 right-4 flex justify-center items-center space-x-6">
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={prevCard}
//               className="p-4 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors"
//               aria-label="Previous card"
//             >
//               <ChevronLeft className="w-8 h-8 text-white" />
//             </motion.button>

//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setIsFlipped(!isFlipped)}
//               className="px-8 py-4 bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white font-bold rounded-2xl transition-all duration-200 shadow-lg"
//             >
//               <div className="flex items-center space-x-2">
//                 <RotateCcw className="w-5 h-5" />
//                 <span>Flip Card</span>
//               </div>
//             </motion.button>

//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={nextCard}
//               className="p-4 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors"
//               aria-label="Next card"
//             >
//               <ChevronRight className="w-8 h-8 text-white" />
//             </motion.button>
//           </div>

//           {/* Keyboard Help */}
//           <AnimatePresence>
//             {showKeyboardHelp && (
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-sm rounded-2xl p-6 text-white max-w-sm w-full mx-4"
//               >
//                 <h3 className="text-lg font-bold mb-4 text-center">
//                   Keyboard Shortcuts
//                 </h3>
//                 <div className="space-y-3 text-sm">
//                   {[
//                     { keys: ["←", "→"], desc: "Navigate cards" },
//                     { keys: ["Space", "Enter"], desc: "Flip card" },
//                     { keys: ["Esc"], desc: "Close flashcards" },
//                     { keys: ["?"], desc: "Toggle this help" },
//                   ].map((shortcut, i) => (
//                     <div key={i} className="flex justify-between items-center">
//                       <div className="flex space-x-2">
//                         {shortcut.keys.map((key, j) => (
//                           <kbd
//                             key={j}
//                             className="px-2 py-1 bg-gray-700 rounded text-xs font-mono"
//                           >
//                             {key}
//                           </kbd>
//                         ))}
//                       </div>
//                       <span className="text-gray-300">{shortcut.desc}</span>
//                     </div>
//                   ))}
//                 </div>
//                 <button
//                   onClick={() => setShowKeyboardHelp(false)}
//                   className="w-full mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
//                 >
//                   Got it
//                 </button>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );

//   return (
//     <div
//       className={`transition-all duration-500 ${
//         isDark
//           ? "bg-gradient-to-br from-gray-900 via-purple-900/50 to-black text-white"
//           : "bg-gradient-to-br from-white via-purple-50 to-fuchsia-100 text-gray-900"
//       }`}
//     >
//       {!showForm && !showFlashcard && <HeroSection />}
//       <FormModal />
//       <FlashcardModal />

//       <style jsx>{`
//         .perspective-1000 {
//           perspective: 1000px;
//         }
//         .preserve-3d {
//           transform-style: preserve-3d;
//         }
//         .backface-hidden {
//           backface-visibility: hidden;
//         }

//         /* Accessibility improvements */
//         @media (prefers-reduced-motion: reduce) {
//           * {
//             animation-duration: 0.01ms !important;
//             animation-iteration-count: 1 !important;
//             transition-duration: 0.01ms !important;
//           }
//         }

//         /* Focus styles for keyboard navigation */
//         button:focus-visible {
//           outline: 2px solid #a855f7;
//           outline-offset: 2px;
//         }

//         input:focus-visible,
//         select:focus-visible {
//           outline: 2px solid #a855f7;
//           outline-offset: 2px;
//         }

//         /* High contrast mode support */
//         @media (prefers-contrast: high) {
//           .bg-gradient-to-r {
//             background: #a855f7 !important;
//           }
//         }

//         /* Scrollbar styling */
//         ::-webkit-scrollbar {
//           width: 8px;
//         }

//         ::-webkit-scrollbar-track {
//           background: rgba(0, 0, 0, 0.1);
//           border-radius: 4px;
//         }

//         ::-webkit-scrollbar-thumb {
//           background: rgba(168, 85, 247, 0.5);
//           border-radius: 4px;
//         }

//         ::-webkit-scrollbar-thumb:hover {
//           background: rgba(168, 85, 247, 0.7);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default FlashcardGenerator;






import { useEffect } from "react";
import "./App.css";
import { useFlashcardStore } from "./store/flashcardStore";
import HeroSection from "./components/HeroSection";
import FormModal from "./components/FormModal";
import SavedSetsModal from "./components/SavedSetsModal";
import FlashcardModal from "./components/FlashcardModal";
import { Toaster } from "react-hot-toast";

// Main App Component
export default function App() {
  const { initializeData } = useFlashcardStore();

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  return (
    <div className="min-h-screen">
      <HeroSection />
      <FormModal />
      <SavedSetsModal />
      <FlashcardModal />
      <Toaster
        toastOptions={{
          style: {
            background: "linear-gradient(135deg, #ffffff, #f3e8ff)", // light to soft lavender
            color: "#2e003e", // deep purple for text
            border: "1px solid #d8b4fe", // soft purple border
            boxShadow: "0 2px 8px rgba(174, 122, 255, 0.2)", // subtle purple glow
          },
          success: {
            iconTheme: {
              primary: "#9333ea", // vibrant purple
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444", // modern red
              secondary: "#ffffff",
            },
          },
        }}
      />
    </div>
  );
}
