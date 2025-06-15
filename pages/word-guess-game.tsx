import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import { FaLightbulb, FaUndo } from "react-icons/fa";
import BackButton from "../components/BackButton";

interface Player {
  id: string;
  name: string;
}

interface WordSet {
  id: string;
  name: string;
  words: string[];
}

interface RoundResult {
  roundNumber: number;
  guesser: Player;
  word: string;
  guessedCorrectly: boolean;
}

const wordSets: WordSet[] = [
  {
    id: "easy",
    name: "Easy",
    words: ["Dog", "Cat", "Tree", "House", "Car", "Ball", "Book", "Chair"],
  },
  {
    id: "medium",
    name: "Medium",
    words: [
      "Elephant",
      "Television",
      "Mountain",
      "Computer",
      "Bicycle",
      "Guitar",
      "Rainbow",
      "Airplane",
    ],
  },
  {
    id: "hard",
    name: "Hard",
    words: [
      "Philosophy",
      "Quantum",
      "Serendipity",
      "Ephemeral",
      "Ubiquitous",
      "Luminous",
      "Benevolent",
      "Kaleidoscope",
    ],
  },
];

const WordGuessGame = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState<string>("");
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("easy");
  const [timer, setTimer] = useState<number>(30);
  const [roundActive, setRoundActive] = useState<boolean>(false);
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null);
  const [roundHistory, setRoundHistory] = useState<RoundResult[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [roundNumber, setRoundNumber] = useState(0);

  useEffect(() => {
    if (roundActive && timer > 0) {
      timerRef.current = setTimeout(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (roundActive && timer === 0) {
      handleGuessResult(false); // Time's up, player drinks
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timer, roundActive]);

  const addPlayer = () => {
    if (newPlayerName.trim() !== "") {
      setPlayers((prevPlayers) => [
        ...prevPlayers,
        { id: Math.random().toString(), name: newPlayerName.trim() },
      ]);
      setNewPlayerName("");
    }
  };

  const startGame = () => {
    if (players.length === 0) {
      alert("Please add at least one player to start the game.");
      return;
    }
    setGameStarted(true);
    startNewRound();
  };

  const startNewRound = () => {
    if (players.length === 0 || wordSets.length === 0) return;

    setRoundNumber((prev) => prev + 1);
    setRoundResult(null);
    setTimer(30);

    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
    setCurrentPlayerIndex(nextPlayerIndex);

    const currentWordSet = wordSets.find(
      (set) => set.id === selectedDifficulty
    );
    if (!currentWordSet || currentWordSet.words.length === 0) return;

    const randomWordIndex = Math.floor(
      Math.random() * currentWordSet.words.length
    );
    setCurrentWord(currentWordSet.words[randomWordIndex]);

    setRoundActive(true);
  };

  const handleGuessResult = (guessedCorrectly: boolean) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setRoundActive(false);

    if (players[currentPlayerIndex] && currentWord) {
      const result: RoundResult = {
        roundNumber: roundNumber,
        guesser: players[currentPlayerIndex],
        word: currentWord,
        guessedCorrectly: guessedCorrectly,
      };
      setRoundResult(result);
      setRoundHistory((prev) => [result, ...prev]);
    }
  };

  const resetGame = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPlayers([]);
    setNewPlayerName("");
    setGameStarted(false);
    setCurrentPlayerIndex(0);
    setCurrentWord(null);
    setSelectedDifficulty("easy");
    setTimer(30);
    setRoundActive(false);
    setRoundResult(null);
    setRoundHistory([]);
    setRoundNumber(0);
  };

  return (
    <>
      <Head>
        <title>เกมทายคำ | Game Party</title>
        <meta
          name="description"
          content="เกมทายคำ - เล่นเกมทายคำสนุกๆ กับเพื่อน"
        />
      </Head>
      <BackButton />
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-amber-100 flex flex-col items-center">
        <div className="w-full max-w-2xl mx-auto px-4 py-10">
          <h1 className="text-4xl font-bold mb-6 text-center">เกมทายคำ</h1>
          <div className="flex flex-col items-center gap-6">
            <AnimatePresence mode="wait">
              {currentWord && (
                <motion.div
                  key={currentWord}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center"
                >
                  <p className="text-2xl font-medium">{currentWord}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-4 mt-4">
              <button
                onClick={startNewRound}
                className="px-8 py-3 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-bold text-lg shadow-lg transition-all"
              >
                คำถัดไป
              </button>
              <button
                onClick={resetGame}
                className="px-8 py-3 rounded-full bg-purple-700 hover:bg-purple-600 text-white font-bold text-lg shadow-lg transition-all"
              >
                เริ่มใหม่
              </button>
            </div>

            <div className="mt-8 w-full">
              <h2 className="text-xl font-bold mb-2">ประวัติคำ</h2>
              {roundHistory.length === 0 ? (
                <div className="text-gray-400">ยังไม่มีประวัติ</div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {roundHistory.map((result) => (
                    <div
                      key={`${result.roundNumber}-${result.guesser.id}`}
                      className="bg-white/10 rounded-lg px-4 py-2"
                    >
                      <p className="font-medium">{result.word}</p>
                      <p className="text-sm text-gray-400">
                        Guesser: {result.guesser.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default WordGuessGame;
