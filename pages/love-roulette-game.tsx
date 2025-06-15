import { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

interface Player {
  id: string;
  name: string;
}

interface LoveDare {
  id: string;
  text: string;
}

interface RoundResult {
  roundNumber: number;
  players: [Player, Player];
  dare: LoveDare;
  refused: boolean;
}

const loveDares: LoveDare[] = [
  {
    id: "d1",
    text: "สบตา 10 วินาที (Stare into each other's eyes for 10 seconds)",
  },
  {
    id: "d2",
    text: "เลือกว่าชอบใครในวง (Choose someone in the group you like)",
  },
  {
    id: "d3",
    text: "บอกข้อดีของอีกฝ่ายมา 3 ข้อ (Tell 3 good qualities of the other person)",
  },
  {
    id: "d4",
    text: "เล่าความทรงจำที่ตลกที่สุดที่เคยทำด้วยกัน (Share the funniest memory you have together)",
  },
  {
    id: "d5",
    text: "ให้กำลังใจกันและกัน (Give words of encouragement to each other)",
  },
  {
    id: "d6",
    text: "จ้องหน้ากันและยิ้มให้กัน (Stare at each other and smile)",
  },
  {
    id: "d7",
    text: "เล่าความประทับใจแรกที่มีต่อกัน (Share your first impression of each other)",
  },
  {
    id: "d8",
    text: "ให้คำแนะนำเรื่องความรักกับอีกฝ่าย (Give love advice to each other)",
  },
];

const LoveRouletteGame = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState<string>("");
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [currentRound, setCurrentRound] = useState<RoundResult | null>(null);
  const [roundHistory, setRoundHistory] = useState<RoundResult[]>([]);
  const [roundNumber, setRoundNumber] = useState(0);

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
    if (players.length < 2 || loveDares.length === 0) return;

    setRoundNumber((prev) => prev + 1);
    setCurrentRound(null);
    setSpinning(true);

    // Simulate spinning delay
    setTimeout(() => {
      const shuffledPlayers = [...players].sort(() => 0.5 - Math.random());
      const player1 = shuffledPlayers[0];
      const player2 = shuffledPlayers[1];

      const randomDareIndex = Math.floor(Math.random() * loveDares.length);
      const selectedDare = loveDares[randomDareIndex];

      setCurrentRound({
        roundNumber: roundNumber + 1,
        players: [player1, player2],
        dare: selectedDare,
        refused: false,
      });
      setSpinning(false);
    }, 2000); // 2-second spin animation
  };

  const handleDareResult = (refused: boolean) => {
    if (currentRound) {
      const updatedRound = { ...currentRound, refused: refused };
      setCurrentRound(updatedRound);
      setRoundHistory((prev) => [updatedRound, ...prev]);
    }
  };

  const resetGame = () => {
    setPlayers([]);
    setNewPlayerName("");
    setGameStarted(false);
    setSpinning(false);
    setCurrentRound(null);
    setRoundHistory([]);
    setRoundNumber(0);
  };

  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-screen py-20 bg-background text-textLight px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-primary animate-glow mb-8 text-center">
          เหล้าหัวใจ (Love Roulette)
        </h1>
        <p className="text-xl text-textLight mb-12 text-center">
          หมุนวงล้อ เลือกคู่ที่ต้องเล่น &apos;เกมรัก&apos; เช่น สบตา 10 วินาที
          หรือ เลือกว่าชอบใครในวง ถ้าไม่กล้า = ดื่ม!
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

            {spinning ? (
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2,
                  ease: "easeOut",
                  repeat: Infinity,
                  repeatType: "loop",
                }}
                className="w-48 h-48 rounded-full bg-gradient-to-br from-primary to-accent mx-auto flex items-center justify-center text-white text-3xl font-bold mb-8"
              >
                Spinning...
              </motion.div>
            ) : currentRound ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-xl text-textLight mb-4">
                  Players:{" "}
                  <span className="font-bold text-primary">
                    {currentRound.players[0].name}
                  </span>{" "}
                  &amp;{" "}
                  <span className="font-bold text-primary">
                    {currentRound.players[1].name}
                  </span>
                </p>
                <p className="text-2xl font-bold text-textLight mb-6">
                  Dare: &quot;{currentRound.dare.text}&quot;
                </p>

                {!currentRound.refused && (
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => handleDareResult(false)}
                      className="btn btn-primary bg-green-600 hover:bg-green-700"
                    >
                      Accepted!
                    </button>
                    <button
                      onClick={() => handleDareResult(true)}
                      className="btn btn-primary bg-red-600 hover:bg-red-700"
                    >
                      Refused (Drink!)
                    </button>
                  </div>
                )}

                {currentRound.refused !== null && ( // Show result only after choice is made
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={currentRound.refused ? "refused" : "accepted"}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className={`text-4xl font-bold mt-8 ${
                        currentRound.refused
                          ? "text-red-500 animate-pulse"
                          : "text-primary animate-glow"
                      }`}
                    >
                      {currentRound.refused ? "DRINK!" : "DARE ACCEPTED!"}
                    </motion.p>
                  </AnimatePresence>
                )}
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
                  key={`${result.roundNumber}-${result.players[0].id}-${result.players[1].id}`}
                  className="glass-card p-4"
                >
                  <p className="text-xl font-bold text-primary mb-2">
                    Round {result.roundNumber}
                  </p>
                  <p className="text-lg text-textLight">
                    Players: {result.players[0].name} &amp;{" "}
                    {result.players[1].name}
                  </p>
                  <p className="text-lg text-textLight mb-2">
                    Dare: &quot;{result.dare.text}&quot;
                  </p>
                  <p className="text-lg text-textLight">
                    Result:{" "}
                    <span
                      className={`font-bold ${
                        result.refused ? "text-red-400" : "text-primary"
                      }`}
                    >
                      {result.refused ? "DRANK!" : "ACCEPTED!"}
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

export default LoveRouletteGame;
