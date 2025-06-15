import { useState } from "react";
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

interface Vote {
  voterId: string;
  vote: "truth" | "lie";
}

interface RoundResult {
  roundNumber: number;
  targetPlayer: Player;
  question: Question;
  targetAnswer: "yes" | "no" | null;
  votes: Vote[];
  drank: boolean;
}

const personalQuestions: Question[] = [
  {
    id: "q1",
    text: "คุณเคยแอบชอบเพื่อนสนิทไหม? (Have you ever had a secret crush on a close friend?)",
  },
  {
    id: "q2",
    text: "คุณเคยแกล้งป่วยเพื่อเลี่ยงงาน/เรียนไหม? (Have you ever faked sickness to skip work/school?)",
  },
  {
    id: "q3",
    text: "คุณเคยขโมยของเล็กๆ น้อยๆ ไหม? (Have you ever stolen something small?)",
  },
  {
    id: "q4",
    text: "คุณเคยนินทาเพื่อนสนิทลับหลังไหม? (Have you ever gossiped about a close friend behind their back?)",
  },
  {
    id: "q5",
    text: "คุณเคยโกหกพ่อแม่เรื่องใหญ่ๆ ไหม? (Have you ever told a big lie to your parents?)",
  },
  {
    id: "q6",
    text: "คุณเคยแอบกินขนมหมดคนเดียวแล้วโทษคนอื่นไหม? (Have you ever secretly eaten all the snacks and blamed someone else?)",
  },
  {
    id: "q7",
    text: "คุณเคยหลับในที่ทำงาน/ในห้องเรียนไหม? (Have you ever fallen asleep at work/in class?)",
  },
  {
    id: "q8",
    text: "คุณเคยแอบส่องโซเชียลมีเดียของแฟนเก่าไหม? (Have you ever secretly stalked an ex's social media?)",
  },
  {
    id: "q9",
    text: "คุณเคยแกล้งทำเป็นไม่รู้จักเพื่อนตอนเจอในที่ที่ไม่คาดคิดไหม? (Have you ever pretended not to know a friend when you met them unexpectedly?)",
  },
  {
    id: "q10",
    text: "คุณเคยส่งข้อความผิดคนแล้วทำเป็นเนียนไหม? (Have you ever sent a text to the wrong person and played it off cool?)",
  },
];

const LieDetectorGame = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState<string>("");
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [currentRound, setCurrentRound] = useState<RoundResult | null>(null);
  const [roundState, setRoundState] = useState<
    "asking" | "answering" | "voting" | "revealing"
  >("asking");
  const [targetPlayerAnswer, setTargetPlayerAnswer] = useState<
    "yes" | "no" | null
  >(null);
  const [playerVotes, setPlayerVotes] = useState<{
    [key: string]: "truth" | "lie" | null;
  }>({});
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
    if (players.length === 0 || personalQuestions.length === 0) return;

    setRoundNumber((prev) => prev + 1);
    setTargetPlayerAnswer(null);
    setPlayerVotes({});

    const randomTargetIndex = Math.floor(Math.random() * players.length);
    const targetPlayer = players[randomTargetIndex];

    const randomQuestionIndex = Math.floor(
      Math.random() * personalQuestions.length
    );
    const question = personalQuestions[randomQuestionIndex];

    setCurrentRound({
      roundNumber: roundNumber + 1,
      targetPlayer,
      question,
      targetAnswer: null,
      votes: [],
      drank: false,
    });
    setRoundState("answering");
  };

  const handleTargetAnswer = (answer: "yes" | "no") => {
    setTargetPlayerAnswer(answer);
    setCurrentRound((prevRound) =>
      prevRound ? { ...prevRound, targetAnswer: answer } : null
    );
    setRoundState("voting");
  };

  const submitVote = (voterId: string, vote: "truth" | "lie") => {
    setPlayerVotes((prevVotes) => ({
      ...prevVotes,
      [voterId]: vote,
    }));
  };

  const revealResults = () => {
    if (!currentRound || !currentRound.targetAnswer) return;

    const votesArray: Vote[] = Object.keys(playerVotes)
      .filter((id) => id !== currentRound.targetPlayer.id)
      .map((id) => ({
        voterId: id,
        vote: playerVotes[id] as "truth" | "lie",
      }));

    let lieVotes = 0;
    votesArray.forEach((v) => {
      if (v.vote === "lie") lieVotes++;
    });

    const majoritySaysLie = lieVotes > votesArray.length / 2;
    const drank = majoritySaysLie;

    const updatedRound = { ...currentRound, votes: votesArray, drank: drank };
    setCurrentRound(updatedRound);
    setRoundHistory((prevHistory) => [updatedRound, ...prevHistory]);
    setRoundState("revealing");
  };

  const resetGame = () => {
    setPlayers([]);
    setNewPlayerName("");
    setGameStarted(false);
    setCurrentRound(null);
    setRoundState("asking");
    setTargetPlayerAnswer(null);
    setPlayerVotes({});
    setRoundHistory([]);
    setRoundNumber(0);
  };

  return (
    <>
      <BackButton />
      <main className="flex flex-col items-center justify-center min-h-screen py-20 bg-background text-textLight px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-primary animate-glow mb-8 text-center">
          อย่าโกหกนะ! (Lie Detector)
        </h1>
        <p className="text-xl text-textLight mb-12 text-center">
          ระบบสุ่มคำถาม เช่น &quot;คุณเคยแอบชอบเพื่อนสนิทไหม?&quot; ผู้เล่นตอบ
          แล้วคนอื่นโหวตว่าโกหกไหม ถ้าเสียงส่วนใหญ่บอกว่าโกหก ต้องดื่ม
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
            {currentRound && (
              <div className="mb-8">
                <h2 className="text-3xl font-semibold text-primary mb-4">
                  Round {currentRound.roundNumber}
                </h2>
                <p className="text-xl text-textLight mb-4">
                  Target Player:{" "}
                  <span className="font-bold text-primary">
                    {currentRound.targetPlayer.name}
                  </span>
                </p>
                <p className="text-2xl font-bold text-textLight mb-6">
                  Question: &quot;{currentRound.question.text}&quot;
                </p>

                {roundState === "answering" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3 className="text-2xl font-semibold text-textLight mb-4">
                      {currentRound.targetPlayer.name}, your answer:
                    </h3>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => handleTargetAnswer("yes")}
                        className="btn btn-primary bg-green-600 hover:bg-green-700"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => handleTargetAnswer("no")}
                        className="btn btn-primary bg-red-600 hover:bg-red-700"
                      >
                        No
                      </button>
                    </div>
                  </motion.div>
                )}

                {roundState === "voting" && targetPlayerAnswer !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-xl text-textLight mb-4">
                      Target's Answer:{" "}
                      <span className="font-bold text-primary">
                        {targetPlayerAnswer.toUpperCase()}
                      </span>
                    </p>
                    <h3 className="text-2xl font-semibold text-textLight mb-4">
                      Other Players, vote:
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {players
                        .filter((p) => p.id !== currentRound.targetPlayer.id)
                        .map((player) => (
                          <div
                            key={player.id}
                            className="glass-card p-4 flex flex-col items-center justify-center"
                          >
                            <p className="text-lg font-bold text-textLight mb-2">
                              {player.name}
                            </p>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => submitVote(player.id, "truth")}
                                className={`btn btn-sm ${
                                  playerVotes[player.id] === "truth"
                                    ? "bg-green-500"
                                    : "btn-primary"
                                }`}
                              >
                                Truth
                              </button>
                              <button
                                onClick={() => submitVote(player.id, "lie")}
                                className={`btn btn-sm ${
                                  playerVotes[player.id] === "lie"
                                    ? "bg-red-500"
                                    : "btn-primary"
                                }`}
                              >
                                Lie
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                    <button
                      onClick={revealResults}
                      className="btn btn-primary w-full mt-8"
                      disabled={
                        Object.keys(playerVotes).filter(
                          (id) => id !== currentRound.targetPlayer.id
                        ).length !==
                        players.length - 1
                      }
                    >
                      Reveal Results
                    </button>
                  </motion.div>
                )}

                {roundState === "revealing" &&
                  currentRound.targetAnswer !== null && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <p className="text-xl text-textLight mb-4">
                        Target's Answer:{" "}
                        <span className="font-bold text-primary">
                          {currentRound.targetAnswer.toUpperCase()}
                        </span>
                      </p>
                      <h3 className="text-2xl font-semibold text-textLight mb-4">
                        Votes:
                      </h3>
                      <ul className="space-y-2 mb-6">
                        {currentRound.votes.map((vote) => (
                          <motion.li
                            key={vote.voterId}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.3,
                              delay:
                                0.1 *
                                players.findIndex((p) => p.id === vote.voterId),
                            }}
                            className={`text-lg ${
                              vote.vote === "lie"
                                ? "text-red-400"
                                : "text-primary"
                            }`}
                          >
                            {players.find((p) => p.id === vote.voterId)?.name}:{" "}
                            {vote.vote.toUpperCase()}
                          </motion.li>
                        ))}
                      </ul>

                      <AnimatePresence mode="wait">
                        <motion.p
                          key={currentRound.drank ? "drank" : "no-drank"}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                          className={`text-4xl font-bold ${
                            currentRound.drank
                              ? "text-red-500 animate-pulse"
                              : "text-primary animate-glow"
                          }`}
                        >
                          {currentRound.drank
                            ? "DRINK! (Majority said Lie)"
                            : "NO DRINK! (Majority said Truth)"}
                        </motion.p>
                      </AnimatePresence>
                      <button
                        onClick={startNewRound}
                        className="btn btn-primary w-full mt-8"
                      >
                        Next Round
                      </button>
                    </motion.div>
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
                <li
                  key={`${round.roundNumber}-${round.targetPlayer.id}`}
                  className="glass-card p-4"
                >
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
                    <span className="font-bold">
                      {round.targetAnswer?.toUpperCase()}
                    </span>
                  </p>
                  <p className="text-lg text-textLight">
                    Result:{" "}
                    <span
                      className={`font-bold ${
                        round.drank ? "text-red-400" : "text-primary"
                      }`}
                    >
                      {round.drank ? "DRANK!" : "NO DRINK!"}
                    </span>
                  </p>
                  <p className="text-md text-textLight/70">Votes:</p>
                  <ul className="list-disc list-inside ml-4">
                    {round.votes.map((vote, idx) => (
                      <li
                        key={idx}
                        className={`${
                          vote.vote === "lie" ? "text-red-400" : "text-primary"
                        }`}
                      >
                        {players.find((p) => p.id === vote.voterId)?.name}:{" "}
                        {vote.vote.toUpperCase()}
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

export default LieDetectorGame;
