import { useState } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import {
  FaGlassCheers,
  FaSpellCheck,
  FaLightbulb,
  FaDice,
  FaHeart,
  FaBrain,
  FaTachometerAlt,
  FaStopwatch,
  FaQuestion,
  FaMicrophone,
  FaGamepad,
  FaRobot,
} from "react-icons/fa";

interface Game {
  id: string;
  title: string;
  description: string;
  icon: any;
  path: string;
  category: string;
}

const games: Game[] = [
  {
    id: "never-have-i-ever",
    title: "กูไม่เคย (Never Have I Ever)",
    description: 'เกมตอบคำถาม "ฉันไม่เคย..." ถ้าคุณเคยทำสิ่งนั้น คุณต้องดื่ม!',
    icon: FaGlassCheers,
    path: "/never-have-i-ever-game",
    category: "drinking",
  },
  {
    id: "rhyme-battle",
    title: "จับคู่คำ (Rhyme Battle)",
    description: "เกมแข่งแต่งคำคล้องจอง ใครแต่งไม่ได้ต้องดื่ม!",
    icon: FaSpellCheck,
    path: "/rhyme-battle-game",
    category: "drinking",
  },
  {
    id: "word-guess",
    title: "เกมทายคำ (Word Guess)",
    description: "เกมทายคำจากคำใบ้ ใครทายไม่ได้ต้องดื่ม!",
    icon: FaLightbulb,
    path: "/word-guess-game",
    category: "drinking",
  },
  {
    id: "doraemon-card",
    title: "เกมไพ่โดเรม่อน (Doraemon Card)",
    description: "เกมไพ่สุดมันส์กับกฎพิเศษจากโดเรม่อน!",
    icon: FaDice,
    path: "/doraemon-card-game",
    category: "card",
  },
  {
    id: "love-roulette",
    title: "วงล้อรัก (Love Roulette)",
    description: "วงล้อสุ่มคำถามเกี่ยวกับความรัก",
    icon: FaHeart,
    path: "/love-roulette-game",
    category: "social",
  },
  {
    id: "mind-reader",
    title: "อ่านใจ (Mind Reader)",
    description: "เกมทายใจเพื่อน ใครทายผิดต้องโดนบทลงโทษ!",
    icon: FaBrain,
    path: "/mind-reader-game",
    category: "social",
  },
  {
    id: "fast-tap",
    title: "แตะเร็ว (Fast Tap)",
    description: "เกมแข่งแตะหน้าจอให้เร็วที่สุด",
    icon: FaTachometerAlt,
    path: "/fast-tap-game",
    category: "action",
  },
  {
    id: "confess-in-10-sec",
    title: "สารภาพใน 10 วิ (Confess in 10 Sec)",
    description: "สารภาพความลับภายใน 10 วินาที",
    icon: FaStopwatch,
    path: "/confess-in-10-sec-game",
    category: "social",
  },
  {
    id: "lie-detector",
    title: "จับโกหก (Lie Detector)",
    description: "เกมจับโกหกเพื่อน ใครโดนจับได้ต้องโดนบทลงโทษ!",
    icon: FaQuestion,
    path: "/lie-detector-game",
    category: "social",
  },
  {
    id: "drunken-charades",
    title: "ใบ้คำเมา (Drunken Charades)",
    description: "เกมใบ้คำสนุกๆ ใครใบ้ไม่ได้ต้องดื่ม!",
    icon: FaMicrophone,
    path: "/drunken-charades-game",
    category: "drinking",
  },
  {
    id: "say-the-same-word",
    title: "พูดคำเดียวกัน (Say the Same Word)",
    description: "เกมแข่งพูดคำเดียวกัน ใครพูดไม่ตรงต้องดื่ม!",
    icon: FaGamepad,
    path: "/say-the-same-word",
    category: "drinking",
  },
  {
    id: "forbidden-word",
    title: "คำต้องห้าม (Forbidden Word)",
    description: "เกมห้ามพูดคำต้องห้าม ใครเผลอพูดต้องดื่ม!",
    icon: FaRobot,
    path: "/forbidden-word-game",
    category: "drinking",
  },
];

const categories = [
  { id: "all", name: "ทั้งหมด" },
  { id: "drinking", name: "เกมดื่ม" },
  { id: "card", name: "เกมไพ่" },
  { id: "social", name: "เกมสังสรรค์" },
  { id: "action", name: "เกมแอคชั่น" },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGames = games.filter((game) => {
    const matchesCategory =
      selectedCategory === "all" || game.category === selectedCategory;
    const matchesSearch =
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Head>
        <title>Game Party - เกมสนุกๆ สำหรับปาร์ตี้</title>
        <meta
          name="description"
          content="รวมเกมสนุกๆ สำหรับปาร์ตี้ ทั้งเกมดื่ม เกมไพ่ และเกมสังสรรค์"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-amber-400 mb-4">Game Party</h1>
          <p className="text-xl text-amber-200/80">
            รวมเกมสนุกๆ สำหรับปาร์ตี้ของคุณ
          </p>
        </motion.div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="ค้นหาเกม..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-800/50 text-amber-100 placeholder-amber-200/50 border border-amber-500/20 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? "bg-amber-500 text-gray-900"
                    : "bg-gray-800/50 text-amber-200 hover:bg-gray-800/70 border border-amber-500/20"
                }`}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800/50 backdrop-blur-lg rounded-xl overflow-hidden border border-amber-500/20 hover:border-amber-500/40 transition-colors"
            >
              <a href={game.path} className="block p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <game.icon className="w-6 h-6 text-amber-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-amber-200">
                    {game.title}
                  </h2>
                </div>
                <p className="text-amber-200/80">{game.description}</p>
              </a>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredGames.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-amber-200/80 text-lg">
              ไม่พบเกมที่คุณกำลังค้นหา
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
