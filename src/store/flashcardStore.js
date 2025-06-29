import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-hot-toast";

export const useFlashcardStore = create(
    persist(
        (set, get) => ({
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

            // Setters
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

            // Navigation
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

            // Save flashcard set
            saveFlashcardSet: async (cards, topic, difficulty) => {
                const { savedSets } = get();
                const newSet = {
                    id: Date.now(),
                    topic,
                    difficulty,
                    cards,
                    createdAt: new Date().toISOString(),
                };
                const updatedSets = [newSet, ...savedSets.slice(0, 9)];
                await set({ savedSets: updatedSets });
                toast.success("Flashcard set saved!");
            },

            // Load saved set
            loadSavedSet: async (setData) => {
                await set({
                    flashcards: setData.cards,
                    currentCard: 0,
                    isFlipped: false,
                    showFlashcard: true,
                    showSavedSets: false,
                    currentTopic: setData.topic,
                    currentDifficulty: setData.difficulty,
                });
                toast.success("Flashcard set loaded!");
            },

            // Reset everything to home
            resetToHome: async () => {
                await set({
                    showForm: false,
                    showFlashcard: false,
                    showSavedSets: false,
                    currentCard: 0,
                    isFlipped: false,
                    error: "",
                    flashcards: [], // Optional: clear flashcards when returning home
                });
            },

            // Optional init toast
            initializeData: () => {
                toast.success("Data initialized from localStorage!");
            },
        }),
        {
            name: "flashcard-storage", // Key for localStorage
            partialize: (state) => ({
                savedSets: state.savedSets,
                apiKey: state.apiKey,
            }),
        }
    )
);
