import { useEffect, useState } from "react";
import { useFlashcardStore } from "../store/flashcardStore";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  EyeOff,
  Home,
  Sparkles,
  X,
} from "lucide-react";

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
    resetToHome: storeResetToHome,
  } = useFlashcardStore();

  const [isCompleted, setIsCompleted] = useState(false);

  const onComplete = () => {
    setIsCompleted(true);
    setIsFlipped(false);
    console.log("Flashcard session completed.");
  };

  const resetToHome = () => {
    setIsCompleted(false);
    setIsFlipped(false);
    storeResetToHome();
  };

  useEffect(() => {
    if (showFlashcard) {
      setIsCompleted(false);
      setIsFlipped(false);
    }
  }, [showFlashcard, setIsFlipped]);

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
            onComplete();
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
      setIsFlipped(false);
      setTimeout(() => {
        if (currentCard === flashcards.length - 1) {
          onComplete();
        } else {
          nextCard();
        }
      }, 300);
    } else {
      if (currentCard === flashcards.length - 1) {
        onComplete();
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
      }, 300);
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
        className="fixed inset-0 z-50  flex flex-col min-h-screen"
      >
        <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]"></div>

        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="px-4 sm:px-6 py-4"
        >
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={resetToHome}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Go home"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                  {currentTopic}
                </h1>
                <p className="text-sm text-gray-500">
                  {isCompleted
                    ? "Completed!"
                    : `${currentCard + 1} of ${flashcards.length}`}
                </p>
              </div>
            </div>
            <button
              onClick={exportFlashcards}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Export flashcards"
            >
              <Download className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 ">
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-purple-700"
                initial={{ width: 0 }}
                animate={{
                  width: `${((currentCard + 1) / flashcards.length) * 100}%`,
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Main Flashcard Content */}
        <div className="md:flex-1 flex pt-16 md:pt-0  items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-md flex justify-center flex-col mx-auto">
            {isCompleted ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
                  className="w-16 h-16 bg-purple-700 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-8 h-8 text-white" />
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                    Well Done!
                  </h2>
                  <p className="text-gray-600 mb-8 text-base sm:text-lg">
                    You've completed all {flashcards.length} flashcards
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={resetToHome}
                    className="px-6 py-3 bg-purple-700 text-white font-medium rounded-lg hover:bg-purple-800 transition-colors inline-flex items-center space-x-2"
                  >
                    <Home className="w-4 h-4" />
                    <span>Back to Home</span>
                  </motion.button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="aspect-[4/5] max-h-[500px]"
              >
                <motion.div
                  className="relative w-full h-full cursor-pointer"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  style={{ transformStyle: "preserve-3d" }}
                  onClick={() => setIsFlipped(!isFlipped)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {/* Front - Question */}
                  <div
                    className="absolute inset-0 bg-white rounded-xl border-3 border-purple-300 shadow-sm flex flex-col"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center text-center">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Eye className="w-5 h-5 text-purple-700" />
                      </div>
                      <div className="text-xs font-medium text-purple-700 uppercase tracking-wider mb-4">
                        Question
                      </div>
                      <p className="text-gray-900 text-lg sm:text-xl font-medium leading-relaxed">
                        {flashcards[currentCard].question}
                      </p>
                    </div>
                    <div className="p-4 border-t border-purple-200 text-center text-xs text-purple-600 font-medium flex justify-center gap-2">
                      <span>Click</span>
                      <span>or</span>
                      <kbd className="kbd">Space</kbd>
                      <span>/</span>
                      <kbd className="kbd">Enter</kbd>
                    </div>
                  </div>

                  {/* Back - Answer */}
                  <div
                    className="absolute inset-0 bg-gradient-to-bl from-purple-50 to-white rounded-xl border-3 border-purple-300 shadow-sm flex flex-col"
                    style={{
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center text-center">
                      <div className="w-10 h-10 bg-purple-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-xs font-medium text-purple-700 uppercase tracking-wider mb-4">
                        Answer
                      </div>
                      <p className="text-gray-900 text-lg sm:text-xl font-semibold leading-relaxed">
                        {flashcards[currentCard].answer}
                      </p>
                    </div>
                    <div className="p-4 border-t border-purple-200 text-center text-xs text-purple-600 font-medium flex justify-center gap-2">
                      <span>Click</span>
                      <span>or</span>
                      <kbd className="kbd">Space</kbd>
                      <span>/</span>
                      <kbd className="kbd">Enter</kbd>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation */}
        {!isCompleted && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="p-4 sm:p-6"
          >
            <div className="max-w-4xl mx-auto">
              {/* Mobile */}
              <div className="flex sm:hidden justify-center items-center space-x-4 mt-4">
                <button
                  onClick={handlePrev}
                  disabled={currentCard === 0}
                  className="p-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="p-3 rounded-full bg-white text-purple-600 shadow-lg ring-2 ring-purple-300 hover:ring-purple-400 transition-all duration-300"
                >
                  {isFlipped ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={handleNext}
                  className="p-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition shadow-sm"
                >
                  {currentCard === flashcards.length - 1 ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Desktop */}
              <div className="hidden sm:flex justify-center gap-4 items-center mt-4">
                <button
                  onClick={handlePrev}
                  disabled={currentCard === 0}
                  className="py-2.5 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center space-x-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="py-2.5 px-6 bg-white text-purple-700 font-medium rounded-lg ring-2 ring-purple-400 hover:ring-purple-500 shadow-md transition-all flex items-center space-x-2"
                >
                  {isFlipped ? (
                    <>
                      <Eye className="w-4 h-4" />
                      <span>Show Question</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4" />
                      <span>Show Answer</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleNext}
                  className="py-2.5 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all shadow-sm flex items-center space-x-2"
                >
                  {currentCard === flashcards.length - 1 ? (
                    <>
                      <span>Finish</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </>
                  ) : (
                    <>
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default FlashcardModal;
