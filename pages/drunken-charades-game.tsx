import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BackButton from "@/components/BackButton";

interface Player {
  id: string;
  name: string;
}

interface WordCategory {
  id: string;
  name: string;
  words: string[];
}

interface RoundResult {
  roundNumber: number;
  actor: Player;
  word: string;
  guessed: boolean;
}

const categories: WordCategory[] = [
  {
    id: "animals",
    name: "Animals",
    words: [
      "Dog",
      "Cat",
      "Elephant",
      "Tiger",
      "Monkey",
      "Fish",
      "Bird",
      "Snake",
    ],
  },
  {
    id: "jobs",
    name: "Jobs",
    words: [
      "Doctor",
      "Teacher",
      "Chef",
      "Engineer",
      "Artist",
      "Pilot",
      "Police Officer",
      "Firefighter",
    ],
  },
  {
    id: "actions",
    name: "Actions",
    words: [
      "Running",
      "Sleeping",
      "Eating",
      "Dancing",
      "Singing",
      "Jumping",
      "Reading",
      "Writing",
    ],
  },
  {
    id: "movies",
    name: "Movies",
    words: [
      "Titanic",
      "Star Wars",
      "Avatar",
      "The Lion King",
      "Harry Potter",
      "Jurassic Park",
      "Frozen",
      "Inception",
    ],
  },
];

const DrunkenCharadesGame = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState<string>("");
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
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
      handleGuess(false); // Time's up, actor drinks
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
    if (players.length === 0 || categories.length === 0) return;

    setRoundNumber((prev) => prev + 1);
    setRoundResult(null);
    setTimer(30);

    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
    setCurrentPlayerIndex(nextPlayerIndex);
    const actor = players[nextPlayerIndex];

    const randomCategoryIndex = Math.floor(Math.random() * categories.length);
    const selectedCategory = categories[randomCategoryIndex];
    setCurrentCategory(selectedCategory.name);

    const randomWordIndex = Math.floor(
      Math.random() * selectedCategory.words.length
    );
    setCurrentWord(selectedCategory.words[randomWordIndex]);

    setRoundActive(true);
  };

  const handleGuess = (guessed: boolean) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setRoundActive(false);

    if (players[currentPlayerIndex] && currentWord && currentCategory) {
      const result: RoundResult = {
        roundNumber: roundNumber,
        actor: players[currentPlayerIndex],
        word: currentWord,
        guessed: guessed,
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
    setCurrentCategory(null);
    setTimer(30);
    setRoundActive(false);
    setRoundResult(null);
    setRoundHistory([]);
    setRoundNumber(0);
  };

  return (
    <>
      <BackButton />
      <main className="flex flex-col items-center justify-center min-h-screen py-20 bg-background text-textLight px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-primary animate-glow mb-8 text-center">
          เหล้าใบ้คำ (Drunken Charades)
        </h1>
        <p className="text-xl text-textLight mb-12 text-center">
          ระบบให้คำ ผู้เล่นต้องแสดงท่าทางโดยห้ามพูด คนอื่นทายให้ได้ใน 30 วินาที
          ถ้าไม่ถูก = ดื่ม!
        </p>

        {!gameStarted ? (
          <div className="glass-card p-8 w-full max-w-2xl">
            <h2 className="text-3xl font-semibold text-textLight mb-6">
              Setup Game
            </h2>
            <div className="mb-6">
              <label
                htmlFor="playerName"
                className="block text-textLight text-lg mb-2"
              >
                Add Player:
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="playerName"
                  className="flex-grow p-3 rounded-lg bg-background/50 border border-primary/20 focus:outline-none focus:border-primary"
                  placeholder="Player Name"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      addPlayer();
                    }
                  }}
                />
                <button onClick={addPlayer} className="btn btn-primary ml-2">
                  Add
                </button>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-textLight mb-2">
                  Players:
                </h3>
                {players.length === 0 ? (
                  <p className="text-textLight/70">No players added yet.</p>
                ) : (
                  <ul className="list-disc list-inside">
                    {players.map((player) => (
                      <li key={player.id} className="text-textLight">
                        {player.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <button onClick={startGame} className="btn btn-primary w-full">
              Start Game
            </button>
          </div>
        ) : (
          <div className="glass-card p-8 w-full max-w-3xl text-center">
            <h2 className="text-3xl font-semibold text-primary mb-6">
              Round {roundNumber}
            </h2>

            {roundActive && players[currentPlayerIndex] && currentWord ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-xl text-textLight mb-4">
                  Actor:{" "}
                  <span className="font-bold text-primary">
                    {players[currentPlayerIndex].name}
                  </span>
                </p>
                <p className="text-2xl font-bold text-textLight mb-6">
                  Category:{" "}
                  <span className="text-accent">{currentCategory}</span>
                </p>

                <AnimatePresence mode="wait">
                  {roundActive && (
                    <motion.p
                      key={currentWord}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-5xl font-bold text-primary animate-glow mb-8"
                    >
                      {currentWord}
                    </motion.p>
                  )}
                </AnimatePresence>

                <div className="text-5xl font-bold text-red-500 animate-pulse mb-8">
                  {timer}
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => handleGuess(true)}
                    className="btn btn-primary bg-green-600 hover:bg-green-700"
                  >
                    Guessed!
                  </button>
                  <button
                    onClick={() => handleGuess(false)}
                    className="btn btn-primary bg-red-600 hover:bg-red-700"
                  >
                    Time's Up / Drink!
                  </button>
                </div>
              </motion.div>
            ) : roundResult ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-2xl font-bold text-textLight mb-4">
                  Actor: {roundResult.actor.name}
                </p>
                <p className="text-xl text-textLight mb-4">
                  Word: &quot;{roundResult.word}&quot;
                </p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={roundResult.guessed ? "guessed" : "drank"}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className={`text-4xl font-bold ${
                      roundResult.guessed
                        ? "text-primary animate-glow"
                        : "text-red-500"
                    }`}
                  >
                    {roundResult.guessed ? "GUESSED!" : "DRANK!"}
                  </motion.p>
                </AnimatePresence>
                <button
                  onClick={startNewRound}
                  className="btn btn-primary w-full mt-8"
                >
                  Next Round
                </button>
              </motion.div>
            ) : (
              <button
                onClick={startNewRound}
                className="btn btn-primary w-full"
              >
                Start Round
              </button>
            )}

            <button
              onClick={resetGame}
              className="btn btn-primary w-full mt-8 bg-blue-600 hover:bg-blue-700"
            >
              Reset Game
            </button>
          </div>
        )}

        {roundHistory.length > 0 && (
          <div className="glass-card p-6 w-full max-w-3xl mt-8">
            <h2 className="text-2xl font-semibold text-textLight mb-4">
              Game History
            </h2>
            <ul className="space-y-4">
              {roundHistory.map((result) => (
                <li
                  key={`${result.roundNumber}-${result.actor.id}`}
                  className="glass-card p-4"
                >
                  <p className="text-xl font-bold text-primary mb-2">
                    Round {result.roundNumber}
                  </p>
                  <p className="text-lg text-textLight">
                    Actor: {result.actor.name}
                  </p>
                  <p className="text-lg text-textLight mb-2">
                    Word: &quot;{result.word}&quot;
                  </p>
                  <p className="text-lg text-textLight">
                    Result:{" "}
                    <span
                      className={`font-bold ${
                        result.guessed ? "text-primary" : "text-red-400"
                      }`}
                    >
                      {result.guessed ? "GUESSED!" : "DRANK!"}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </>
  );
};

export default DrunkenCharadesGame;
