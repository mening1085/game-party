import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BackButton from "@/components/BackButton";

interface RoundResult {
  player1Word: string;
  player2Word: string;
  match: boolean;
}

const SayTheSameWordGame = () => {
  const [player1Word, setPlayer1Word] = useState<string>("");
  const [player2Word, setPlayer2Word] = useState<string>("");
  const [showWords, setShowWords] = useState<boolean>(false);
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);
  const [currentMatch, setCurrentMatch] = useState<boolean | null>(null);

  const handleSubmitWords = () => {
    setShowWords(true);
    const match = player1Word.toLowerCase() === player2Word.toLowerCase();
    setCurrentMatch(match);
    setRoundResults((prevResults) => [
      { player1Word, player2Word, match },
      ...prevResults,
    ]);
  };

  const handleNextRound = () => {
    setPlayer1Word("");
    setPlayer2Word("");
    setShowWords(false);
    setCurrentMatch(null);
  };

  return (
    <>
      <BackButton />
      <main className="flex flex-col items-center justify-center min-h-screen py-20 bg-background text-textLight px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-primary animate-glow mb-8 text-center">
          พูดคำเดียวกัน
        </h1>
        <h1 className="text-5xl md:text-7xl font-bold text-primary animate-glow mb-8 text-center">
          (Say the Same Word)
        </h1>
        <p className="text-xl text-textLight mb-12 text-center">
          ผู้เล่น 2 คนต้องพูดคำพร้อมกันให้เหมือนกัน ถ้าไม่ตรง ดื่ม!
        </p>

        <div className="glass-card p-8 w-full max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Player 1 Input */}
            <div>
              <label
                htmlFor="player1"
                className="block text-textLight text-lg mb-2"
              >
                Player 1 Word:
              </label>
              <input
                type="text"
                id="player1"
                className="w-full p-3 rounded-lg bg-background/50 border border-primary/20 focus:outline-none focus:border-primary"
                value={player1Word}
                onChange={(e) => setPlayer1Word(e.target.value)}
                disabled={showWords}
              />
            </div>

            {/* Player 2 Input */}
            <div>
              <label
                htmlFor="player2"
                className="block text-textLight text-lg mb-2"
              >
                Player 2 Word:
              </label>
              <input
                type="text"
                id="player2"
                className="w-full p-3 rounded-lg bg-background/50 border border-primary/20 focus:outline-none focus:border-primary"
                value={player2Word}
                onChange={(e) => setPlayer2Word(e.target.value)}
                disabled={showWords}
              />
            </div>
          </div>

          {!showWords ? (
            <button
              onClick={handleSubmitWords}
              className="btn btn-primary w-full"
              disabled={!player1Word || !player2Word}
            >
              Say Words!
            </button>
          ) : (
            <div className="text-center">
              <AnimatePresence mode="wait">
                {currentMatch !== null && (
                  <motion.div
                    key={currentMatch ? "match" : "no-match"}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className={`text-4xl font-bold mb-4 ${
                      currentMatch
                        ? "text-primary animate-glow"
                        : "text-red-500"
                    }`}
                  >
                    {currentMatch ? "MATCH!" : "NO MATCH!"}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-center space-x-8 text-2xl font-bold mb-6">
                <p className="text-textLight">
                  Player 1: <span className="text-primary">{player1Word}</span>
                </p>
                <p className="text-textLight">
                  Player 2: <span className="text-primary">{player2Word}</span>
                </p>
              </div>
              <button
                onClick={handleNextRound}
                className="btn btn-primary w-full"
              >
                Next Round
              </button>
            </div>
          )}
        </div>

        {roundResults.length > 0 && (
          <div className="glass-card p-6 w-full max-w-3xl mt-8">
            <h2 className="text-2xl font-semibold text-textLight mb-4">
              History
            </h2>
            <ul className="space-y-2">
              {roundResults.map((result, index) => (
                <li
                  key={index}
                  className={`flex justify-between items-center text-lg ${
                    result.match ? "text-primary" : "text-red-400"
                  }`}
                >
                  <span>
                    {result.player1Word} vs {result.player2Word}
                  </span>
                  <span className="font-bold">
                    {result.match ? "MATCH" : "DRINK!"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </>
  );
};

export default SayTheSameWordGame;
