import { useState, useEffect } from "react";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import { FaGlassCheers, FaUndo } from "react-icons/fa";
import BackButton from "../components/BackButton";

interface Player {
  id: string;
  name: string;
  drinks: number;
}

interface GameStatement {
  id: string;
  text: string;
  category: string;
}

interface RoundHistory {
  statement: string;
  drinkers: string[];
  category: string;
}

const statements: GameStatement[] = [
  {
    id: "1",
    text: "จูบเพื่อนตัวเอง",
    category: "romance",
  },
  {
    id: "2",
    text: "แอบดูโทรศัพท์แฟน",
    category: "relationships",
  },
  {
    id: "3",
    text: "โกหกพ่อแม่เรื่องการเรียน",
    category: "family",
  },
  {
    id: "4",
    text: "แอบชอบอาจารย์",
    category: "school",
  },
  {
    id: "5",
    text: "ดื่มเหล้าจนอาเจียน",
    category: "party",
  },
  {
    id: "6",
    text: "แอบดูโทรศัพท์เพื่อน",
    category: "friendship",
  },
  {
    id: "7",
    text: "โกหกเพื่อนเรื่องการนัด",
    category: "friendship",
  },
  {
    id: "8",
    text: "แอบชอบเพื่อนสนิท",
    category: "romance",
  },
  {
    id: "9",
    text: "หลับในห้องเรียน",
    category: "school",
  },
  {
    id: "10",
    text: "แอบดูโทรศัพท์แฟนเก่า",
    category: "relationships",
  },
  {
    id: "11",
    text: "ดื่มเหล้าจนไม่รู้ตัว",
    category: "party",
  },
  {
    id: "12",
    text: "โกหกแฟนเรื่องการนัด",
    category: "relationships",
  },
  {
    id: "13",
    text: "แอบชอบเพื่อนร่วมงาน",
    category: "work",
  },
  {
    id: "14",
    text: "หลับในที่ทำงาน",
    category: "work",
  },
  {
    id: "15",
    text: "ดื่มเหล้าจนไม่สามารถเดินได้",
    category: "party",
  },
];

const NeverHaveIEverGame = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState<string>("");
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [currentStatement, setCurrentStatement] =
    useState<GameStatement | null>(null);
  const [roundActive, setRoundActive] = useState<boolean>(false);
  const [roundHistory, setRoundHistory] = useState<
    { statement: string; drinkers: string[]; category: string }[]
  >([]);
  const [roundNumber, setRoundNumber] = useState(0);

  const addPlayer = () => {
    if (newPlayerName.trim() !== "") {
      setPlayers((prevPlayers) => [
        ...prevPlayers,
        { id: Math.random().toString(), name: newPlayerName.trim(), drinks: 0 },
      ]);
      setNewPlayerName("");
    }
  };

  const removePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
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
    if (players.length === 0 || statements.length === 0) return;

    setRoundNumber((prev) => prev + 1);
    const randomStatement =
      statements[Math.floor(Math.random() * statements.length)];
    setCurrentStatement(randomStatement);
    setRoundHistory([
      ...roundHistory,
      {
        statement: randomStatement.text,
        drinkers: [],
        category: randomStatement.category,
      },
    ]);
    setRoundActive(true);
  };

  const handlePlayerDrink = (playerId: string) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === playerId
          ? { ...player, drinks: player.drinks + 1 }
          : player
      )
    );

    if (currentStatement) {
      const drinker = players.find((p) => p.id === playerId);
      if (drinker) {
        setRoundHistory((prev) => [
          {
            statement: currentStatement.text,
            drinkers: [...(prev[0]?.drinkers || []), drinker.name],
            category: currentStatement.category,
          },
          ...prev.slice(1),
        ]);
      }
    }
  };

  const resetGame = () => {
    setPlayers([]);
    setNewPlayerName("");
    setGameStarted(false);
    setCurrentStatement(null);
    setRoundActive(false);
    setRoundHistory([]);
    setRoundNumber(0);
  };

  const sortedPlayers = [...players].sort((a, b) => b.drinks - a.drinks);

  return (
    <>
      <Head>
        <title>Never Have I Ever | Game Party</title>
        <meta
          name="description"
          content="Never Have I Ever - เล่นเกม Never Have I Ever สนุกๆ กับเพื่อน"
        />
      </Head>
      <BackButton />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-5xl font-bold text-amber-400 mb-4 text-center">
            กูไม่เคย (Never Have I Ever)
          </h1>
          <p className="text-xl text-amber-200/80 text-center mb-8">
            เกมตอบคำถาม "ฉันไม่เคย..." ถ้าคุณเคยทำสิ่งนั้น คุณต้องดื่ม!
          </p>

          {!gameStarted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-amber-500/20"
            >
              <h2 className="text-2xl font-semibold text-amber-200 mb-4">
                เพิ่มผู้เล่น
              </h2>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="ชื่อผู้เล่น"
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-700/50 text-amber-100 placeholder-amber-200/50 border border-amber-500/20 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addPlayer}
                  className="px-4 py-2 rounded-lg bg-amber-500 text-gray-900 font-medium hover:bg-amber-400 transition-colors"
                >
                  เพิ่ม
                </motion.button>
              </div>

              {players.length > 0 && (
                <div className="space-y-2 mb-6">
                  {players.map((player, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded-lg bg-gray-700/30"
                    >
                      <span className="text-amber-200">{player.name}</span>
                      <button
                        onClick={() => removePlayer(index)}
                        className="text-amber-200/60 hover:text-amber-200"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                disabled={players.length < 2}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  players.length < 2
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-amber-500 text-gray-900 hover:bg-amber-400"
                }`}
              >
                เริ่มเกม
              </motion.button>
            </motion.div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-amber-500/20"
                >
                  <h2 className="text-2xl font-semibold text-amber-200 mb-4">
                    ผู้เล่นปัจจุบัน
                  </h2>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <FaGlassCheers className="w-6 h-6 text-amber-400" />
                    </div>
                    <span className="text-2xl font-bold text-amber-200">
                      {currentStatement?.text}
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-amber-500/20"
                >
                  <h2 className="text-2xl font-semibold text-amber-200 mb-4">
                    ดื่มแล้ว
                  </h2>
                  <div className="space-y-2">
                    {players.map((player) => (
                      <div
                        key={player.name}
                        className="flex items-center justify-between"
                      >
                        <span className="text-amber-200">{player.name}</span>
                        <span className="text-amber-400">
                          {player.drinks} แก้ว
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 border border-amber-500/20 mb-8"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-amber-400 mb-4">
                    {currentStatement?.text}
                  </h2>
                  <p className="text-xl text-amber-200/80 mb-6">
                    หมวด: {currentStatement?.category}
                  </p>
                </div>
              </motion.div>

              <div className="flex justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startNewRound}
                  className="px-6 py-3 rounded-lg bg-amber-500 text-gray-900 font-medium hover:bg-amber-400 transition-colors"
                >
                  คำถามถัดไป
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetGame}
                  className="px-6 py-3 rounded-lg bg-gray-700 text-amber-200 font-medium hover:bg-gray-600 transition-colors"
                >
                  เริ่มเกมใหม่
                </motion.button>
              </div>

              {roundHistory.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-amber-500/20"
                >
                  <h2 className="text-2xl font-semibold text-amber-200 mb-4">
                    ประวัติการเล่น
                  </h2>
                  <div className="space-y-2">
                    {roundHistory.map((entry, index) => (
                      <div
                        key={index}
                        className="p-2 rounded-lg bg-gray-700/30"
                      >
                        <p className="text-amber-200">
                          {entry.drinkers.join(", ")} ดื่มเมื่อ:{" "}
                          {entry.statement}
                        </p>
                        <p className="text-amber-200/80 text-sm">
                          หมวด: {entry.category}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default NeverHaveIEverGame;
