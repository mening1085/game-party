import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BackButton from "@/components/BackButton";

interface Player {
  id: string;
  name: string;
}

interface Question {
  id: string;
  text: string;
}

interface RoundResult {
  roundNumber: number;
  player: Player;
  question: Question;
  confessed: boolean;
}

const secretQuestions: Question[] = [
  {
    id: "q1",
    text: "What's the most embarrassing thing you've done in public?",
  },
  {
    id: "q2",
    text: "What's a secret talent you have that no one knows about?",
  },
  { id: "q3", text: "What's the wildest thing you've ever done?" },
  { id: "q4", text: "What's one thing you're secretly afraid of?" },
  { id: "q5", text: "What's the biggest lie you've ever told?" },
  { id: "q6", text: "Have you ever cheated on a test or game?" },
  { id: "q7", text: "What's the most annoying habit you have?" },
  { id: "q8", text: "What's one thing you pretend to like but actually hate?" },
  { id: "q9", text: "What's the weirdest dream you've ever had?" },
  { id: "q10", text: "What's your most irrational fear?" },
];

const ConfessIn10SecGame = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState<string>("");
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
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
      handleConfession(false); // Time's up, player drinks
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
    if (players.length === 0 || secretQuestions.length === 0) return;

    setRoundNumber((prev) => prev + 1);
    setRoundResult(null);
    setTimer(10);

    const randomPlayerIndex = Math.floor(Math.random() * players.length);
    setCurrentPlayer(players[randomPlayerIndex]);

    const randomQuestionIndex = Math.floor(
      Math.random() * secretQuestions.length
    );
    setCurrentQuestion(secretQuestions[randomQuestionIndex]);

    setRoundActive(true);
  };

  const handleConfession = (confessed: boolean) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setRoundActive(false);

    if (currentPlayer && currentQuestion) {
      const result: RoundResult = {
        roundNumber: roundNumber,
        player: currentPlayer,
        question: currentQuestion,
        confessed: confessed,
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
    setCurrentPlayer(null);
    setCurrentQuestion(null);
    setTimer(10);
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
          สิบวิสารภาพ (Confess in 10 Sec)
        </h1>
        <p className="text-xl text-textLight mb-12 text-center">
          ระบบสุ่มคำถามลับแรงๆ ผู้เล่นต้องตอบภายใน 10 วินาที ถ้าไม่กล้า = ดื่ม!
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

            {roundActive && currentPlayer && currentQuestion ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-xl text-textLight mb-4">
                  Player:{" "}
                  <span className="font-bold text-primary">
                    {currentPlayer.name}
                  </span>
                </p>
                <p className="text-2xl font-bold text-textLight mb-6">
                  Question: &quot;{currentQuestion.text}&quot;
                </p>

                <div className="text-5xl font-bold text-red-500 animate-pulse mb-8">
                  {timer}
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => handleConfession(true)}
                    className="btn btn-primary bg-green-600 hover:bg-green-700"
                  >
                    Confess!
                  </button>
                  <button
                    onClick={() => handleConfession(false)}
                    className="btn btn-primary bg-red-600 hover:bg-red-700"
                  >
                    Drink!
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
                  Player: {roundResult.player.name}
                </p>
                <p className="text-xl text-textLight mb-4">
                  Question: &quot;{roundResult.question.text}&quot;
                </p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={roundResult.confessed ? "confessed" : "drank"}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className={`text-4xl font-bold ${
                      roundResult.confessed
                        ? "text-primary animate-glow"
                        : "text-red-500"
                    }`}
                  >
                    {roundResult.confessed ? "CONFESSED!" : "DRANK!"}
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
                    Question: &quot;{result.question.text}&quot;
                  </p>
                  <p className="text-lg text-textLight">
                    Result:{" "}
                    <span
                      className={`font-bold ${
                        result.confessed ? "text-primary" : "text-red-400"
                      }`}
                    >
                      {result.confessed ? "CONFESSED" : "DRANK!"}
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

export default ConfessIn10SecGame;
