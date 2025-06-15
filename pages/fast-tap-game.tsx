import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Player {
  id: string;
  name: string;
  reactionTime: number | null;
}

interface RoundResult {
  roundNumber: number;
  players: Player[];
  slowestPlayerId: string | null;
}

const FastTapGame = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState<string>("");
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gamePhase, setGamePhase] = useState<
    "idle" | "waiting" | "ready" | "tapping"
  >("idle");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);
  const [currentRoundNumber, setCurrentRoundNumber] = useState(0);
  const [tappedPlayers, setTappedPlayers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);

  const tapButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (gamePhase === "waiting") {
      const randomDelay = Math.random() * 3000 + 1000; // 1-4 seconds
      const timer = setTimeout(() => {
        setGamePhase("ready");
        setStartTime(Date.now());
        // Optionally play a sound here
      }, randomDelay);
      return () => clearTimeout(timer);
    }
  }, [gamePhase]);

  useEffect(() => {
    if (gamePhase === "tapping" && tappedPlayers.length === players.length) {
      // All players have tapped, calculate results
      const playersWithReactionTimes = players.map((player) => ({
        ...player,
        reactionTime:
          player.reactionTime === null ? Infinity : player.reactionTime,
      }));

      const slowestPlayer = playersWithReactionTimes.reduce((prev, current) => {
        return (prev.reactionTime || Infinity) >
          (current.reactionTime || Infinity)
          ? prev
          : current;
      });

      setRoundResults((prevResults) => [
        {
          roundNumber: currentRoundNumber,
          players: playersWithReactionTimes,
          slowestPlayerId: slowestPlayer.id,
        },
        ...prevResults,
      ]);
      setShowResults(true);
      setGamePhase("idle");
    }
  }, [tappedPlayers, players, gamePhase, currentRoundNumber]);

  const addPlayer = () => {
    if (newPlayerName.trim() !== "") {
      setPlayers((prevPlayers) => [
        ...prevPlayers,
        {
          id: Math.random().toString(),
          name: newPlayerName.trim(),
          reactionTime: null,
        },
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
    startRound();
  };

  const startRound = () => {
    setCurrentRoundNumber((prev) => prev + 1);
    setGamePhase("waiting");
    setTappedPlayers([]);
    setShowResults(false);
    setPlayers((prevPlayers) =>
      prevPlayers.map((p) => ({ ...p, reactionTime: null }))
    );
  };

  const handleTap = (playerId: string) => {
    if (
      gamePhase === "ready" &&
      !tappedPlayers.includes(playerId) &&
      startTime !== null
    ) {
      const reaction = Date.now() - startTime;
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player.id === playerId
            ? { ...player, reactionTime: reaction }
            : player
        )
      );
      setTappedPlayers((prev) => [...prev, playerId]);

      if (tappedPlayers.length + 1 === players.length) {
        setGamePhase("tapping"); // All players have tapped
      }
    } else if (gamePhase === "waiting") {
      alert("Too early! You must wait for the signal.");
      setGamePhase("idle");
      resetGame();
    }
  };

  const resetGame = () => {
    setPlayers([]);
    setNewPlayerName("");
    setGameStarted(false);
    setGamePhase("idle");
    setStartTime(null);
    setRoundResults([]);
    setCurrentRoundNumber(0);
    setTappedPlayers([]);
    setShowResults(false);
  };

  const getButtonBgColor = () => {
    if (gamePhase === "ready") return "bg-green-500";
    if (gamePhase === "waiting") return "bg-yellow-500";
    return "bg-gray-700";
  };

  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-screen py-20 bg-background text-textLight px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-primary animate-glow mb-8 text-center">
          เร็วมั้ย? (Fast Tap)
        </h1>
        <p className="text-xl text-textLight mb-12 text-center">
          ระบบแสดงสีหรือคำ แล้วผู้เล่นต้องกดปุ่มเร็วที่สุด ใครช้า = ดื่ม!
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
          <div className="glass-card p-8 w-full max-w-3xl">
            <h2 className="text-3xl font-semibold text-textLight mb-6 text-center">
              Round {currentRoundNumber}
            </h2>
            <p className="text-lg text-textLight mb-8 text-center">
              {gamePhase === "idle" &&
                !showResults &&
                "Press Start Round to begin!"}
              {gamePhase === "waiting" && "Wait for the signal..."}
              {gamePhase === "ready" && (
                <span className="text-green-400 font-bold text-2xl">GO!</span>
              )}
              {gamePhase === "tapping" && "Calculating results..."}
            </p>

            <div
              className={`relative w-48 h-48 rounded-full mx-auto flex items-center justify-center transition-colors duration-300 mb-8 ${getButtonBgColor()}`}
            >
              {gamePhase === "ready" && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="text-5xl font-bold text-white"
                >
                  GO!
                </motion.div>
              )}
              {gamePhase === "waiting" && (
                <div className="w-12 h-12 border-4 border-t-4 border-primary rounded-full animate-spin"></div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {players.map((player) => (
                <button
                  key={player.id}
                  className="btn btn-primary w-full py-4 text-xl"
                  onClick={() => handleTap(player.id)}
                  disabled={
                    gamePhase !== "ready" || tappedPlayers.includes(player.id)
                  }
                >
                  {player.name}{" "}
                  {player.reactionTime !== null
                    ? `(${player.reactionTime}ms)`
                    : ""}
                </button>
              ))}
            </div>

            {showResults && (
              <div className="mt-8 text-center">
                <h3 className="text-3xl font-semibold text-textLight mb-4">
                  Results:
                </h3>
                {roundResults[0]?.slowestPlayerId ? (
                  <p className="text-red-500 font-bold text-2xl mb-4">
                    <span className="animate-pulse">
                      {
                        players.find(
                          (p) => p.id === roundResults[0]?.slowestPlayerId
                        )?.name
                      }{" "}
                      is SLOW! DRINK!
                    </span>
                  </p>
                ) : (
                  <p className="text-primary font-bold text-2xl mb-4">
                    No slowest player found this round.
                  </p>
                )}
                <button
                  onClick={startRound}
                  className="btn btn-primary w-full mt-4"
                >
                  Next Round
                </button>
              </div>
            )}

            {!showResults && gamePhase === "idle" && players.length > 0 && (
              <button onClick={startRound} className="btn btn-primary w-full">
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

        {roundResults.length > 0 && (
          <div className="glass-card p-6 w-full max-w-3xl mt-8">
            <h2 className="text-2xl font-semibold text-textLight mb-4">
              Game History
            </h2>
            <ul className="space-y-4">
              {roundResults.map((round) => (
                <li key={round.roundNumber} className="glass-card p-4">
                  <p className="text-xl font-bold text-primary mb-2">
                    Round {round.roundNumber}
                  </p>
                  <p className="text-lg text-textLight">
                    Slowest Player:{" "}
                    <span className="font-bold text-red-400">
                      {players.find((p) => p.id === round.slowestPlayerId)
                        ?.name || "N/A"}
                    </span>
                  </p>
                  <p className="text-md text-textLight/70">Reaction Times:</p>
                  <ul className="list-disc list-inside ml-4">
                    {round.players.map((player) => (
                      <li
                        key={player.id}
                        className={`${
                          player.id === round.slowestPlayerId
                            ? "text-red-400 font-bold"
                            : "text-textLight"
                        }`}
                      >
                        {player.name}:{" "}
                        {player.reactionTime !== null &&
                        player.reactionTime !== Infinity
                          ? `${player.reactionTime}ms`
                          : "Did not tap"}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </>
  );
};

export default FastTapGame;
