import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

interface Player {
  id: string;
  name: string;
}

interface Question {
  id: string;
  text: string;
}

interface Round {
  roundNumber: number;
  targetPlayer: Player;
  question: Question;
  targetAnswer: string | null;
  guesses: { playerId: string; guess: string }[];
  result: "win" | "lose" | null;
}

const questions: Question[] = [
  { id: "q1", text: "What's your dream job?" },
  { id: "q2", text: "What's your favorite food?" },
  { id: "q3", text: "If you could travel anywhere, where would it be?" },
  { id: "q4", text: "What's one thing you can't live without?" },
  { id: "q5", text: "What's your favorite hobby?" },
];

const MindReaderGame = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState<string>("");
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [currentRound, setCurrentRound] = useState<Round | null>(null);
  const [roundState, setRoundState] = useState<
    "picking_target" | "guessing" | "revealing" | "finished"
  >("picking_target");
  const [targetAnswerInput, setTargetAnswerInput] = useState<string>("");
  const [playerGuesses, setPlayerGuesses] = useState<{ [key: string]: string }>(
    {}
  );
  const [roundHistory, setRoundHistory] = useState<Round[]>([]);

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
    if (players.length === 0 || questions.length === 0) return;

    const randomTargetIndex = Math.floor(Math.random() * players.length);
    const targetPlayer = players[randomTargetIndex];

    const randomQuestionIndex = Math.floor(Math.random() * questions.length);
    const question = questions[randomQuestionIndex];

    setCurrentRound({
      roundNumber: (currentRound?.roundNumber || 0) + 1,
      targetPlayer,
      question,
      targetAnswer: null,
      guesses: [],
      result: null,
    });
    setTargetAnswerInput("");
    setPlayerGuesses({});
    setRoundState("guessing");
  };

  const submitTargetAnswer = () => {
    if (currentRound && targetAnswerInput.trim() !== "") {
      setCurrentRound((prevRound) =>
        prevRound
          ? { ...prevRound, targetAnswer: targetAnswerInput.trim() }
          : null
      );
      setRoundState("revealing");
    }
  };

  const submitGuess = (playerId: string) => {
    if (
      currentRound &&
      playerGuesses[playerId] &&
      playerGuesses[playerId].trim() !== ""
    ) {
      const newGuesses = [
        ...currentRound.guesses,
        { playerId, guess: playerGuesses[playerId].trim() },
      ];
      setCurrentRound((prevRound) =>
        prevRound ? { ...prevRound, guesses: newGuesses } : null
      );
    } else {
      alert("Please enter your guess.");
    }
  };

  const revealResults = () => {
    if (!currentRound || !currentRound.targetAnswer) return;

    const targetAnswerLower = currentRound.targetAnswer.toLowerCase();
    let correctGuesses = 0;
    currentRound.guesses.forEach((g) => {
      if (g.guess.toLowerCase() === targetAnswerLower) {
        correctGuesses++;
      }
    });

    const mostPeopleGuessedWrong =
      correctGuesses < currentRound.guesses.length / 2;
    const result: "win" | "lose" = mostPeopleGuessedWrong ? "lose" : "win";

    setCurrentRound((prevRound) =>
      prevRound ? { ...prevRound, result } : null
    );
    setRoundHistory((prevHistory) => [
      ...prevHistory,
      { ...currentRound, result } as Round,
    ]);
  };

  const resetGame = () => {
    setPlayers([]);
    setNewPlayerName("");
    setGameStarted(false);
    setCurrentRound(null);
    setRoundState("picking_target");
    setTargetAnswerInput("");
    setPlayerGuesses({});
    setRoundHistory([]);
  };

  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-screen py-20 bg-background text-textLight px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-primary animate-glow mb-8 text-center">
          ล้วงใจ (Mind Reader)
        </h1>
        <p className="text-xl text-textLight mb-12 text-center">
          ระบบถามคำถาม แล้วผู้เล่นต้องเดาคำตอบ &quot;ของผู้ถูกเลือก&quot; ให้ตรง
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
            {currentRound && (
              <div className="text-center mb-8">
                <h2 className="text-3xl font-semibold text-primary mb-4">
                  Round {currentRound.roundNumber}
                </h2>
                <p className="text-xl text-textLight mb-4">
                  Target:{" "}
                  <span className="font-bold text-primary">
                    {currentRound.targetPlayer.name}
                  </span>
                </p>
                <p className="text-2xl font-bold text-textLight mb-6">
                  Question: &quot;{currentRound.question.text}&quot;
                </p>

                {roundState === "guessing" &&
                  currentRound.targetAnswer === null && (
                    <div className="mt-8">
                      <h3 className="text-2xl font-semibold text-textLight mb-4">
                        {currentRound.targetPlayer.name}&apos;s Answer:
                      </h3>
                      <input
                        type="text"
                        className="w-full p-3 rounded-lg bg-background/50 border border-primary/20 focus:outline-none focus:border-primary mb-4"
                        placeholder="Type your answer (Target Player)"
                        value={targetAnswerInput}
                        onChange={(e) => setTargetAnswerInput(e.target.value)}
                      />
                      <button
                        onClick={submitTargetAnswer}
                        className="btn btn-primary w-full mb-8"
                      >
                        Submit Target Answer
                      </button>

                      <h3 className="text-2xl font-semibold text-textLight mb-4">
                        Other Players' Guesses:
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {players
                          .filter((p) => p.id !== currentRound.targetPlayer.id)
                          .map((player) => (
                            <div key={player.id}>
                              <label
                                htmlFor={`guess-${player.id}`}
                                className="block text-textLight text-md mb-1"
                              >
                                {player.name}&apos;s Guess:
                              </label>
                              <input
                                type="text"
                                id={`guess-${player.id}`}
                                className="w-full p-3 rounded-lg bg-background/50 border border-primary/20 focus:outline-none focus:border-primary"
                                placeholder="Type your guess"
                                value={playerGuesses[player.id] || ""}
                                onChange={(e) =>
                                  setPlayerGuesses({
                                    ...playerGuesses,
                                    [player.id]: e.target.value,
                                  })
                                }
                              />
                            </div>
                          ))}
                      </div>
                      <button
                        onClick={revealResults}
                        className="btn btn-primary w-full mt-8"
                      >
                        Reveal Results
                      </button>
                    </div>
                  )}

                {roundState === "revealing" && currentRound.targetAnswer && (
                  <div className="mt-8">
                    <h3 className="text-2xl font-semibold text-textLight mb-4">
                      Target Answer:
                    </h3>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-3xl font-bold text-primary mb-6 animate-glow"
                    >
                      {currentRound.targetAnswer}
                    </motion.p>

                    <h3 className="text-2xl font-semibold text-textLight mb-4">
                      Guesses:
                    </h3>
                    <ul className="space-y-2 mb-6">
                      {currentRound.guesses.map((guess) => (
                        <motion.li
                          key={guess.playerId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.3,
                            delay:
                              0.1 *
                              players.findIndex((p) => p.id === guess.playerId),
                          }}
                          className={`text-lg ${
                            guess.guess.toLowerCase() ===
                            currentRound.targetAnswer?.toLowerCase()
                              ? "text-primary"
                              : "text-red-400"
                          }`}
                        >
                          {players.find((p) => p.id === guess.playerId)?.name}:{" "}
                          {guess.guess}
                        </motion.li>
                      ))}
                    </ul>

                    <AnimatePresence mode="wait">
                      {currentRound.result && (
                        <motion.div
                          key={currentRound.result}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                          className={`text-4xl font-bold ${
                            currentRound.result === "win"
                              ? "text-primary animate-glow"
                              : "text-red-500"
                          }`}
                        >
                          {currentRound.result === "win"
                            ? "WIN!"
                            : "EVERYONE DRINKS!"}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button
                      onClick={startNewRound}
                      className="btn btn-primary w-full mt-8"
                    >
                      Next Round
                    </button>
                  </div>
                )}
              </div>
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
              {roundHistory.map((round) => (
                <li key={round.roundNumber} className="glass-card p-4">
                  <p className="text-xl font-bold text-primary mb-2">
                    Round {round.roundNumber}
                  </p>
                  <p className="text-lg text-textLight">
                    Target: {round.targetPlayer.name}
                  </p>
                  <p className="text-lg text-textLight mb-2">
                    Question: &quot;{round.question.text}&quot;
                  </p>
                  <p className="text-lg text-textLight">
                    Target Answer:{" "}
                    <span className="font-bold">{round.targetAnswer}</span>
                  </p>
                  <p className="text-lg text-textLight mb-2">
                    Result:{" "}
                    <span
                      className={`font-bold ${
                        round.result === "win" ? "text-primary" : "text-red-400"
                      }`}
                    >
                      {round.result === "win" ? "WIN" : "DRINK!"}
                    </span>
                  </p>
                  <p className="text-md text-textLight/70">Guesses:</p>
                  <ul className="list-disc list-inside ml-4">
                    {round.guesses.map((guess, idx) => (
                      <li
                        key={idx}
                        className={`${
                          guess.guess.toLowerCase() ===
                          round.targetAnswer?.toLowerCase()
                            ? "text-primary"
                            : "text-red-400"
                        }`}
                      >
                        {players.find((p) => p.id === guess.playerId)?.name}:{" "}
                        {guess.guess}
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

export default MindReaderGame;
