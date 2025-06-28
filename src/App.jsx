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

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { create } from "zustand";
import {
  Plus,
  Brain,
  Sparkles,
  RotateCcw,
  Eye,
  EyeOff,
  Trash2,
  Download,
  Upload,
  Zap,
  X,
  ChevronLeft,
  ChevronRight,
  Settings,
  BookOpen,
  Home,
  Space,
  CheckCircle,
  Library,
} from "lucide-react";
import { Github, Linkedin } from "lucide-react"; // assuming Lucide icons
import "./App.css";
// Zustand Store
const useFlashcardStore = create((set, get) => ({
  flashcards: [],
  savedSets: [],
  currentCard: 0,
  isFlipped: false,
  isLoading: false,
  apiKey: "",
  error: "",
  showForm: false,
  showFlashcard: false,
  showSavedSets: false,
  currentTopic: "",
  currentDifficulty: "easy",

  // Actions
  setFlashcards: (cards) => set({ flashcards: cards }),
  setSavedSets: (sets) => set({ savedSets: sets }),
  setCurrentCard: (index) => set({ currentCard: index, isFlipped: false }),
  setIsFlipped: (flipped) => set({ isFlipped: flipped }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setApiKey: (key) => set({ apiKey: key }),
  setError: (error) => set({ error }),
  setShowForm: (show) => set({ showForm: show }),
  setShowFlashcard: (show) => set({ showFlashcard: show }),
  setShowSavedSets: (show) => set({ showSavedSets: show }),
  setCurrentTopic: (topic) => set({ currentTopic: topic }),
  setCurrentDifficulty: (difficulty) => set({ currentDifficulty: difficulty }),

  nextCard: () => {
    const { flashcards, currentCard } = get();
    set({
      currentCard: (currentCard + 1) % flashcards.length,
      isFlipped: false,
    });
  },

  prevCard: () => {
    const { flashcards, currentCard } = get();
    set({
      currentCard: (currentCard - 1 + flashcards.length) % flashcards.length,
      isFlipped: false,
    });
  },

  saveFlashcardSet: (cards, topic, difficulty) => {
    const { savedSets } = get();
    const newSet = {
      id: Date.now(),
      topic,
      difficulty,
      cards,
      createdAt: new Date().toISOString(),
    };
    const updatedSets = [newSet, ...savedSets.slice(0, 9)];
    set({ savedSets: updatedSets });
    try {
      sessionStorage.setItem("flashcard-sets", JSON.stringify(updatedSets));
    } catch (err) {
      console.error("Error saving flashcard set:", err);
    }
  },

  loadSavedSet: (setData) => {
    set({
      flashcards: setData.cards,
      currentCard: 0,
      isFlipped: false,
      showFlashcard: true,
      showSavedSets: false,
      currentTopic: setData.topic,
      currentDifficulty: setData.difficulty,
    });
  },

  resetToHome: () => {
    set({
      showForm: false,
      showFlashcard: false,
      showSavedSets: false,
      currentCard: 0,
      isFlipped: false,
      error: "",
    });
  },

  initializeData: () => {
    try {
      const savedApiKey = sessionStorage.getItem("gemini-api-key");
      const savedFlashcards = sessionStorage.getItem("flashcard-sets");

      if (savedApiKey) {
        set({ apiKey: savedApiKey });
      }

      if (savedFlashcards) {
        set({ savedSets: JSON.parse(savedFlashcards) });
      }
    } catch (err) {
      console.error("Error loading saved data:", err);
    }
  },
}));

// Reusable Components
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
      "bg-gradient-to-r from-black/80 to-purple-600 hover:from-purple-700 hover:to-gray-700 text-white shadow-lg",
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

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-2xl shadow-lg border border-gray-100 ${className}`}
  >
    {children}
  </div>
);

const Modal = ({ isOpen, onClose, children, title, className = "" }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl ${className}`}
        >
          {title && (
            <div className="sticky top-0 p-3 md:p-6 bg-white/95 backdrop-blur-sm rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>
          )}
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Main Components
const HeroSection = () => {
  const { savedSets, setShowForm, setShowSavedSets } = useFlashcardStore();

  return (
    <section className="min-h-screen heading flex flex-col items-center justify-center relative overflow-hidden px-4 md:px-10 py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
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
        <div className="flex items-center space-x-4">
          <a
            href="https://github.com/kumardeepak16"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition"
            title="GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com/in/deepakkumar1916"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition"
            title="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-200/40 to-indigo-200/40 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: [360, 0], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-200/40 to-purple-200/40 rounded-full blur-3xl"
        />
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
            <span>Next-Gen AI Study Tool</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-7xl font-black bg-gradient-to-r from-gray-900 via-purple-700 to-indigo-600 bg-clip-text text-transparent leading-tight mb-6"
        >
          Master Anything <br />
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
          Create intelligent flashcards instantly with AI. Study smarter, retain
          better, and learn faster — all with Cardly.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button size="lg" onClick={() => setShowForm(true)} className="group">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Create Flashcards</span>
            </div>
          </Button>

          {savedSets.length > 0 && (
            <Button
              variant="ghost"
              size="lg"
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

const FormModal = () => {
  const {
    isLoading,
    apiKey,
    error,
    showForm,
    setApiKey,
    setError,
    setShowForm,
    setIsLoading,
    setFlashcards,
    setCurrentCard,
    setIsFlipped,
    setShowFlashcard,
    setCurrentTopic,
    setCurrentDifficulty,
    saveFlashcardSet,
  } = useFlashcardStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      topic: "",
      difficulty: "easy",
      numCards: 5,
      type: "one-word",
    },
  });

  const topic = watch("topic");
  const difficulty = watch("difficulty");

  const generateFlashcards = async (data) => {
    if (!apiKey.trim()) {
      setError("Please enter your Gemini API key");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const prompt = `You are an expert educational content creator. Generate ${
        data.numCards
      } high-quality flashcards on the topic of "${
        data.topic
      }", focused on deep understanding at a ${
        data.difficulty
      } difficulty level.

      Each flashcard must be a JSON object in this format:
      {
        "question": "A clear, concise question that tests conceptual understanding",
        "answer": "A ${
          data.type === "one-word"
            ? "single word or very short phrase"
            : "concise explanation no longer than two lines"
        }"
      }
      
      Instructions:
      - Use natural, academic language appropriate for learners.
      - Avoid yes/no questions or purely factual recall.
      - Ensure the questions encourage meaningful thinking and not just memorization.
      - The "answer" should be ${
        data.type === "one-word"
          ? "extremely short (1-3 words), precise, and unambiguous"
          : "brief but informative, written in 1-2 short sentences"
      }.
      - Return the flashcards as a **strict JSON array** of objects with no extra text, explanation, or formatting.
      
      Only return the JSON array.`;
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const responseData = await response.json();
      const generatedText = responseData.candidates[0].content.parts[0].text;

      const cleanedText = generatedText
        .replace(/```json\n?|\n?```/g, "")
        .trim();
      const cards = JSON.parse(cleanedText);

      if (Array.isArray(cards) && cards.length > 0) {
        setFlashcards(cards);
        setCurrentCard(0);
        setIsFlipped(false);
        setShowForm(false);
        setShowFlashcard(true);
        setCurrentTopic(data.topic);
        setCurrentDifficulty(data.difficulty);

        // Save API key and flashcard set
        sessionStorage.setItem("gemini-api-key", apiKey);
        saveFlashcardSet(cards, data.topic, data.difficulty);
        reset();
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error generating flashcards:", err);
      setError(
        "Failed to generate flashcards. Please check your API key and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={showForm}
      onClose={() => setShowForm(false)}
      title="Create New Flashcard Set"
    >
      <form
        className="p-6 space-y-6"
        onSubmit={handleSubmit(generateFlashcards)}
      >
        {/* API Key Section */}
        {!apiKey && (
          <Card className="p-4 bg-yellow-50 border-yellow-200">
            <div className="flex items-center space-x-2 mb-3">
              <Zap className="w-5 h-5 text-yellow-600" />
              <h3 className="font-semibold text-yellow-800">
                API Key Required
              </h3>
            </div>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key..."
              className="w-full px-4 py-3 rounded-lg border border-yellow-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white"
              aria-label="Gemini API Key"
            />
            <p className="text-xs mt-2 text-yellow-700">
              Get your free API key from Google AI Studio. Stored securely in
              your browser.
            </p>
          </Card>
        )}

        {/* Topic Input */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Topic *
          </label>
          <input
            {...register("topic", { required: "Topic is required" })}
            placeholder="e.g., Machine Learning, Ancient Rome, Organic Chemistry..."
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
            aria-label="Topic"
          />
          {errors.topic && (
            <p className="text-sm text-red-600 mt-1">{errors.topic.message}</p>
          )}
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Difficulty Level
            </label>
            <select
              {...register("difficulty")}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
            >
              <option value="easy">Easy - Beginner</option>
              <option value="medium">Medium - Intermediate</option>
              <option value="hard">Hard - Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Number of Cards
            </label>
            <select
              {...register("numCards")}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
            >
              <option value="" selected disabled>
                Select Number
              </option>

              {[5, 10, 15, 20, 25].map((n) => (
                <option key={n} value={n}>
                  {n} Cards
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Type
            </label>
            <select
              {...register("type")}
              className="w-full px-4 py-3 capitalize rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
            >
              <option value="select" selected disabled>
                Select Type
              </option>
              {["one-word", "short-answer"].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 border border-red-200 rounded-xl"
            role="alert"
          >
            <p className="text-red-700 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          {" "}
          <Button
            type="submit"
            disabled={isLoading || !topic?.trim()}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
            size="md"
          >
            {isLoading ? (
              <div className="flex gap-2 items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <RotateCcw className="w-5 h-5" />
                </motion.div>
                Generating Cards...
              </div>
            ) : (
              <div className="flex gap-2 items-center justify-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Flashcards
              </div>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const SavedSetsModal = () => {
  const {
    savedSets,
    showSavedSets,
    setShowSavedSets,
    loadSavedSet,
    setSavedSets,
  } = useFlashcardStore();

  const deleteSavedSet = (setId) => {
    const updatedSets = savedSets.filter((set) => set.id !== setId);
    setSavedSets(updatedSets);
    try {
      sessionStorage.setItem("flashcard-sets", JSON.stringify(updatedSets));
    } catch (err) {
      console.error("Error deleting flashcard set:", err);
    }
  };

  return (
    <Modal
      isOpen={showSavedSets}
      onClose={() => setShowSavedSets(false)}
      title="My Flashcard Sets"
    >
      <div className="pb-4 px-4">
        {savedSets.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-500 mb-2">
              No saved sets yet
            </h3>
            <p className="text-gray-400">
              Create your first flashcard set to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {savedSets.map((set) => (
              <motion.div
                key={set.id}
                className="p-2 border border-gray-200  rounded-xl transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 ">
                    <h4 className="font-semibold wrap-normal capitalize text-gray-900  mb-1">
                      {set.topic}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {set.cards.length} cards • {set.difficulty} •{" "}
                      {new Date(set.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2 ml-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => loadSavedSet(set)}
                    >
                      Study
                    </Button>
                    <button
                      onClick={() => deleteSavedSet(set.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Delete set"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

const FlashcardModal = () => {
  const {
    flashcards,
    currentCard,
    isFlipped,
    showFlashcard,
    currentTopic,
    setIsFlipped,
    nextCard,
    prevCard,
    resetToHome,
    setCurrentCard,
  } = useFlashcardStore();

  const [isCompleted, setIsCompleted] = useState(false);

  // Sync reset when modal re-opens
  useEffect(() => {
    if (showFlashcard) {
      setIsCompleted(false);
      setIsFlipped(false);
    }
  }, [showFlashcard, setIsFlipped]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!showFlashcard || flashcards.length === 0) return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          if (!isCompleted) prevCard();
          setIsFlipped(false);
          break;
        case "ArrowRight":
          e.preventDefault();
          if (currentCard === flashcards.length - 1) {
            setIsCompleted(true);
            setIsFlipped(false);
          } else {
            nextCard();
            setIsFlipped(false);
          }
          break;
        case " ":
        case "Enter":
          e.preventDefault();
          if (isCompleted) {
            resetToHome();
          } else {
            setIsFlipped(!isFlipped);
          }
          break;
        case "Escape":
          e.preventDefault();
          resetToHome();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    showFlashcard,
    flashcards,
    isFlipped,
    currentCard,
    isCompleted,
    nextCard,
    prevCard,
    resetToHome,
    setIsFlipped,
  ]);

  const handleNext = () => {
    if (isFlipped) {
      setIsFlipped(false); // Flip to front
      setTimeout(() => {
        if (currentCard === flashcards.length - 1) {
          setIsCompleted(true);
        } else {
          nextCard();
        }
      }, 400); // Match this to your CSS transition duration
    } else {
      if (currentCard === flashcards.length - 1) {
        setIsCompleted(true);
      } else {
        nextCard();
      }
    }
  };
  
  const handlePrev = () => {
    if (isFlipped) {
      setIsFlipped(false);
      setTimeout(() => {
        prevCard();
      }, 400);
    } else {
      prevCard();
    }
  };
  
  const exportFlashcards = () => {
    const dataStr = JSON.stringify(flashcards, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `flashcards-${currentTopic.replace(/\s+/g, "-")}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!showFlashcard || flashcards.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 text-gray-800">
          <div className="flex items-center space-x-4">
            <button
              onClick={resetToHome}
              className="p-2 bg-white/70 hover:bg-white/90 rounded-full shadow-sm transition-colors"
              aria-label="Go home"
            >
              <Home className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold">{currentTopic}</h1>
              <p className="text-sm text-gray-500">
                {isCompleted
                  ? "Completed!"
                  : `Card ${currentCard + 1} of ${flashcards.length}`}
              </p>
            </div>
          </div>

          <button
            onClick={exportFlashcards}
            className="p-2 bg-white/70 hover:bg-white/90 rounded-full shadow-sm transition-colors"
            aria-label="Export flashcards"
          >
            <Download className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mx-6 mb-6 h-2 bg-white/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
            initial={{ width: 0 }}
            animate={{
              width: `${((currentCard + 1) / flashcards.length) * 100}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-4">
          {isCompleted ? (
            // ✅ Completed Screen
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center text-gray-800 max-w-md"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-12 h-12 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold mb-4">Great Job!</h2>
              <p className="text-gray-600 mb-8 text-lg">
                You've completed all {flashcards.length} flashcards for{" "}
                {currentTopic}
              </p>
              <button
                onClick={resetToHome}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all flex items-center mx-auto"
              >
                <Home className="w-5 h-5 mr-2" />
                Go Home
              </button>
            </motion.div>
          ) : (
            // ✅ Flashcard View
            <div
              className="w-full max-w-md mx-auto"
              style={{ aspectRatio: "4/5" }}
            >
              <div
                className="relative w-full h-full perspective-1000"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div
                  className="relative w-full h-full transition-transform duration-700"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* Front */}
                  <div
                    className="absolute inset-0 p-8 flex flex-col justify-center items-center text-center bg-white/80 border border-purple-100 rounded-2xl shadow-xl shadow-purple-300 backdrop-blur"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <div className="flex items-center space-x-2 mb-6">
                      <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full shadow-md">
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-purple-600 font-medium">
                        Question
                      </span>
                    </div>
                    <h3 className="md:text-xl font-bold text-gray-900 mb-8 leading-relaxed flex-1 flex items-center">
                      {flashcards[currentCard].question}
                    </h3>
                    <div className="flex items-center justify-center space-x-2 text-purple-500 text-sm">
                      <Space className="w-4 h-4" />
                      <span>Tap or press Space to reveal</span>
                    </div>
                  </div>

                  {/* Back */}
                  <div
                    className="absolute inset-0 p-8 flex flex-col justify-center items-center text-center  border border-indigo-100 rounded-2xl shadow-xl shadow-blue-200 backdrop-blur"
                    style={{
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  >
                    <div className="flex items-center space-x-2 mb-6">
                      <div className="p-3 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full shadow-md">
                        <EyeOff className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-indigo-600 font-medium">
                        Answer
                      </span>
                    </div>
                    <div className="md:text-lg font-bold text-gray-800 mb-8 leading-relaxed flex-1 flex items-center">
                      {flashcards[currentCard].answer}
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-indigo-500 text-sm">
                      <Space className="w-4 h-4" />
                      <span>Tap or press Space to flip back</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Controls */}
        {!isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 flex justify-center gap-3"
          >
            <button
              onClick={handlePrev}
              disabled={currentCard === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-white text-gray-800 shadow-sm hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </button>

            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md hover:opacity-90 transition"
            >
              {isFlipped ? (
                <>
                  <Eye className="w-4 h-4" />
                  Show Question
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4" />
                  Show Answer
                </>
              )}
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-white text-gray-800 shadow-sm hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              {currentCard === flashcards.length - 1 ? (
                <>
                  Done
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

// Main App Component
export default function App() {
  const { initializeData } = useFlashcardStore();

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <HeroSection />
      <FormModal />
      <SavedSetsModal />
      <FlashcardModal />
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }

        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Focus styles for keyboard navigation */
        button:focus-visible {
          outline: 2px solid #a855f7;
          outline-offset: 2px;
        }

        input:focus-visible,
        select:focus-visible {
          outline: 2px solid #a855f7;
          outline-offset: 2px;
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .bg-gradient-to-r {
            background: #a855f7 !important;
          }
        }

        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.5);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.7);
        }
      `}</style>
    </div>
  );
}
