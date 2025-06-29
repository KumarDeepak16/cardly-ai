import { BookOpen, Trash2 } from "lucide-react";
import Button from "./ui/Button";
import Modal from "./ui/Modal";
import { motion } from "framer-motion";
import { useFlashcardStore } from "../store/flashcardStore";

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

export default SavedSetsModal