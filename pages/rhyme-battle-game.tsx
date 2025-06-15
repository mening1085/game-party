import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Player {
  id: string;
  name: string;
}

interface RoundResult {
  roundNumber: number;
  player: Player;
  startingWord: string;
  rhymingWord: string | null;
  drank: boolean;
}

// Simplified list of Thai words for rhyming. Real Thai rhyming is more complex.
// This example focuses on words ending with similar sounds for a basic demo.
const thaiWords: string[] = [
  "ปลา", // bplaa (fish)
  "มา", // maa (come)
  "หา", // haa (find)
  "ตา", // dtaa (eye)
  "นา", // naa (field)
  "กา", // gaa (crow)
  "อา", // aa (aunt/uncle)
  "ยา", // yaa (medicine)
  "ขา", // khaa (leg)
  "ฟ้า", // faa (sky)
  "ใจ", // jai (heart)
  "ไป", // bpai (go)
  "ได้", // dai (can/get)
  "ใน", // nai (in)
  "ไร", // rai (what)
  "ใหญ่", // yai (big)
  "ไม้", // mai (wood)
  "ไฟ", // fai (fire)
  "ใบ", // bai (leaf)
  "ใส่", // sai (put)
];

// Simplified rhyme check function. This is a very basic implementation
// and will not cover all nuances of Thai phonetics and rhyming rules.
const isRhyme = (word1: string, word2: string): boolean => {
  if (!word1 || !word2) return false;
  const end1 = word1.slice(-2);
  const end2 = word2.slice(-2);
  return end1 === end2; // Very basic check: last two characters match
};

const RhymeBattleGame = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState<string>("");
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [currentStartingWord, setCurrentStartingWord] = useState<string | null>(
    null
  );
  const [playerInputWord, setPlayerInputWord] = useState<string>("");
  const [timer, setTimer] = useState<number>(10);
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
      handleEndOfTurn(false); // Time's up, player drinks
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timer, roundActive, currentPlayerIndex]);

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
    if (players.length < 2) {
      alert("You need at least 2 players to start the game.");
      return;
    }
    setGameStarted(true);
    startNewRound();
  };

  const startNewRound = () => {
    if (players.length === 0 || thaiWords.length === 0) return;

    setRoundNumber((prev) => prev + 1);
    setRoundResult(null);
    setTimer(10);
    setPlayerInputWord("");

    const randomWordIndex = Math.floor(Math.random() * thaiWords.length);
    setCurrentStartingWord(thaiWords[randomWordIndex]);

    // Rotate player for next round
    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
    setCurrentPlayerIndex(nextPlayerIndex);

    setRoundActive(true);
  };

  const handleEndOfTurn = (rhymeSuccess: boolean) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setRoundActive(false);

    if (players[currentPlayerIndex] && currentStartingWord) {
      const result: RoundResult = {
        roundNumber: roundNumber,
        player: players[currentPlayerIndex],
        startingWord: currentStartingWord,
        rhymingWord: rhymeSuccess ? playerInputWord : null,
        drank: !rhymeSuccess,
      };
      setRoundResult(result);
      setRoundHistory((prev) => [result, ...prev]);
    }
  };

  const submitRhyme = () => {
    if (!playerInputWord.trim() || !currentStartingWord) {
      alert("Please enter a word.");
      return;
    }

    if (isRhyme(currentStartingWord, playerInputWord.trim())) {
      handleEndOfTurn(true);
    } else {
      alert("That doesn't rhyme! Drink!");
      handleEndOfTurn(false);
    }
  };

  const resetGame = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPlayers([]);
    setNewPlayerName("");
    setGameStarted(false);
    setCurrentPlayerIndex(0);
    setCurrentStartingWord(null);
    setPlayerInputWord("");
    setTimer(10);
    setRoundActive(false);
    setRoundResult(null);
    setRoundHistory([]);
    setRoundNumber(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-5xl md:text-7xl font-bold text-primary animate-glow mb-8 text-center">
          จับคู่คำ (Rhyme Battle)
        </h1>
        <p className="text-xl text-textLight mb-12 text-center">
          ระบบเริ่มต้นคำ เช่น &quot;ปลา&quot; แล้วผู้เล่นต้องพูดคำที่สัมผัสได้
          ใครตัน = ดื่ม!
        </p>

        {!gameStarted ? (
          <div className="glass-card p-8 w-full max-w-2xl mx-auto">
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

            {roundActive &&
            players[currentPlayerIndex] &&
            currentStartingWord ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-xl text-textLight mb-4">
                  Current Player:{" "}
                  <span className="font-bold text-primary">
                    {players[currentPlayerIndex].name}
                  </span>
                </p>
                <p className="text-2xl font-bold text-textLight mb-6">
                  Starting Word:{" "}
                  <span className="text-accent">{currentStartingWord}</span>
                </p>

                <div className="text-5xl font-bold text-red-500 animate-pulse mb-8">
                  {timer}
                </div>

                <input
                  type="text"
                  className="w-full p-3 rounded-lg bg-background/50 border border-primary/20 focus:outline-none focus:border-primary mb-4"
                  placeholder="Type your rhyming word..."
                  value={playerInputWord}
                  onChange={(e) => setPlayerInputWord(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && roundActive) {
                      submitRhyme();
                    }
                  }}
                />
                <button
                  onClick={submitRhyme}
                  className="btn btn-primary w-full"
                >
                  Submit Rhyme
                </button>
              </motion.div>
            ) : roundResult ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-2xl font-bold text-textLight mb-4">
                  Player: {roundResult.player.name}
                </p>
                <p className="text-xl text-textLight mb-4">
                  Starting Word: &quot;{roundResult.startingWord}&quot;
                </p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={roundResult.drank ? "drank" : "rhymed"}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className={`text-4xl font-bold ${
                      roundResult.drank
                        ? "text-red-500 animate-pulse"
                        : "text-primary animate-glow"
                    }`}
                  >
                    {roundResult.drank
                      ? "DRANK!"
                      : `RHYMED: ${roundResult.rhymingWord}`}
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
                  key={`${result.roundNumber}-${result.player.id}`}
                  className="glass-card p-4"
                >
                  <p className="text-xl font-bold text-primary mb-2">
                    Round {result.roundNumber}
                  </p>
                  <p className="text-lg text-textLight">
                    Player: {result.player.name}
                  </p>
                  <p className="text-lg text-textLight mb-2">
                    Starting Word: &quot;{result.startingWord}&quot;
                  </p>
                  <p className="text-lg text-textLight">
                    Result:{" "}
                    <span
                      className={`font-bold ${
                        result.drank ? "text-red-400" : "text-primary"
                      }`}
                    >
                      {result.drank
                        ? "DRANK!"
                        : `RHYMED: ${result.rhymingWord}`}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export default RhymeBattleGame;
