import { motion } from "framer-motion";
import { useFlashcardStore } from "../store/flashcardStore";
import { useForm } from "react-hook-form";
import Modal from "./ui/Modal";
import Card from "./ui/Card";
import Button from "./ui/Button";
import { Loader2, Sparkles, Zap } from "lucide-react";

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
  const generateFlashcards = async (data) => {
    if (!apiKey.trim()) {
      setError("Please enter your Gemini API key");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
        const prompt = `You are a professional content creator for educational apps.

        Generate ${
          data.numCards
        } beginner-friendly flashcards on the topic of "${
          data.topic
        }", suitable for quick learning at a "${
          data.difficulty
        }" difficulty level.
        
        Each flashcard must be a JSON object in this format:
        {
          "question": "A short, factual question",
          "answer": "${
            data.type === "one-word"
              ? "A clear, direct answer (1–5 words)"
              : "A short, clear explanation (1–2 sentences)"
          }"
        }
        
        Requirements:
        - Keep questions simple, specific, and easy to understand.
        - Use beginner-friendly language and avoid abstract or conceptual questions.
        - Ensure answers are ${
          data.type === "one-word"
            ? "factual, concise, and easy to memorize"
            : "short, informative, and beginner-friendly"
        }.
        - Do NOT include any extra explanations, instructions, or formatting.
        - Only return a strict JSON array of flashcard objects.
        
        Output format:
        [
          {
            "question": "...",
            "answer": "..."
          }
        ]
        
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
        className="p-4 space-y-3"
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Difficulty Level
            </label>
            <select
              {...register("difficulty")}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            >
              <option value="easy" className="bg-purple-50">
                Easy - Beginner
              </option>
              <option value="medium" className="bg-purple-100">
                Medium - Intermediate
              </option>
              <option value="hard" className="bg-purple-200">
                Hard - Advanced
              </option>
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

              {[5, 10, 15, 20].map((n) => (
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
                  <Loader2 className="w-5 h-5" />
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
export default FormModal;
