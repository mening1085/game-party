import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BackButton from "../components/BackButton";

const suits = ["hearts", "diamonds", "clubs", "spades"] as const;
const values = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
] as const;
const suitSymbols: Record<string, string> = {
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
  spades: "♠",
};
const suitColors: Record<string, string> = {
  hearts: "text-red-500",
  diamonds: "text-red-500",
  clubs: "text-black",
  spades: "text-black",
};
const cardRules: Record<string, string> = {
  A: "กิน 1 ชอต",
  "2": "กิน 2 ชอต",
  "3": "หาเพื่อนกิน 1 ชอต 1 คน",
  "4": "หาเพื่อนกิน 1 ชอต 2 คน",
  "5": "เลือกบัดดี้ เราโดนกินบัดดี้โดนด้วย บัดดี้โดนกินเราโดนด้วย",
  "6": "category เลือก category มา 1 อย่าง วนไปเรื่อยๆ ใครตอบไม่ได้ โดนกิน เช่น ยี่ห้อรถ นมเปรี้ยว ทีมฟุตบอล",
  "7": "นับ 1 2 3 4 5 6 .... 8 9 10 ... 11 12 13 .... ห้ามพูดว่า 7 หรือเลขที่หารด้วย 7 ลงตัว หรือถ้าคิดว่าตัวเองเนียนแกล้งพูด 9 แต่จริงๆต้องพูดว่า 8 แล้วคนพูดคนต่อไปดันพูด 10 คนที่พูด 10 ก็โดนแทน",
  "8": "ลืมบอกไปวาเกมนี้ห้ามเข้าห้องน้ำจนกว่าเกมจะจบ ยกเว้นได้ไพ่ 8",
  "9": "คนซ้ายมือเรากิน",
  "10": "คนขวามือเรากิน",
  J: "ถ้าคนถือไพ่แจ้คจับคางเมื่อไร ทุกคนต้องจับตาม ถ้าจับคนสุดท้ายกิน",
  Q: "คนอื่นห้ามคุยกับคนที่จับได้ Q ถ้าคุยเมื่อไรโดน1 ชอต",
  K: "ไพ่นรก: ทำอะไร, ทำที่ไหน, ทำอย่างไร, คนสุดท้ายทำ",
};

type Suit = (typeof suits)[number];
type Value = (typeof values)[number];
interface Card {
  suit: Suit;
  value: Value;
}
interface HistoryEntry {
  card: Card;
  rule: string;
  time: string;
}

function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value });
    }
  }
  return deck;
}

function shuffleDeck(deck: Card[]): Card[] {
  const arr = [...deck];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function DoraemonCardGame() {
  const [deck, setDeck] = useState<Card[]>(() => shuffleDeck(createDeck()));
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleDraw = () => {
    if (isDrawing || deck.length === 0) return;
    setIsDrawing(true);
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
    setTimeout(() => {
      const [card, ...rest] = deck;
      setCurrentCard(card);
      setDeck(rest);
      setHistory([
        {
          card,
          rule: cardRules[card.value],
          time: new Date().toLocaleTimeString(),
        },
        ...history,
      ]);
      setIsDrawing(false);
    }, 700);
  };

  const handleReset = () => {
    setDeck(shuffleDeck(createDeck()));
    setCurrentCard(null);
    setHistory([]);
  };

  return (
    <>
      <BackButton />
      <audio ref={audioRef} src="/sounds/card-shuffle.mp3" preload="auto" />
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-amber-100 flex flex-col items-center">
        <div className="w-full max-w-2xl mx-auto px-4 py-10">
          <h1 className="text-4xl font-bold mb-6 text-center">
            เกมไพ่โดเรม่อน
          </h1>
          <div className="flex flex-col items-center gap-6">
            <AnimatePresence>
              {isDrawing && (
                <motion.div
                  key="card-anim"
                  initial={{ y: -80, opacity: 0, rotate: -20 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 80, opacity: 0, rotate: 20 }}
                  transition={{ duration: 0.5 }}
                  className="w-56 h-80 bg-white rounded-2xl shadow-2xl border-4 border-amber-300 flex flex-col items-center justify-center text-7xl font-bold absolute z-20"
                  style={{ left: "50%", transform: "translateX(-50%)" }}
                >
                  🎴
                </motion.div>
              )}
            </AnimatePresence>
            <div className="relative w-56 h-80 mb-2">
              <motion.div
                key={
                  currentCard
                    ? `${currentCard.suit}-${currentCard.value}`
                    : "back"
                }
                initial={{ rotateY: 180 }}
                animate={{ rotateY: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                {currentCard ? (
                  <div className="w-full h-full bg-white rounded-2xl shadow-xl border-4 border-amber-300 flex flex-col justify-between p-6">
                    <div className="flex justify-between">
                      <span
                        className={`text-6xl font-bold ${
                          suitColors[currentCard.suit]
                        }`}
                      >
                        {currentCard.value}
                      </span>
                      <span
                        className={`text-6xl font-bold ${
                          suitColors[currentCard.suit]
                        }`}
                      >
                        {suitSymbols[currentCard.suit]}
                      </span>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <span
                        className={`text-[120px] font-bold ${
                          suitColors[currentCard.suit]
                        }`}
                      >
                        {suitSymbols[currentCard.suit]}
                      </span>
                    </div>
                    <div className="text-center text-[12px] text-gray-700 font-semibold -mt-4 min-h-[2rem] line-clamp-2">
                      {cardRules[currentCard.value]}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-200/30 to-purple-300/30 rounded-2xl shadow-xl border-4 border-amber-300 flex items-center justify-center text-6xl text-amber-400">
                    ?
                  </div>
                )}
              </motion.div>
            </div>
            <div className="flex gap-4 mt-2">
              <button
                onClick={handleDraw}
                disabled={isDrawing || deck.length === 0}
                className="px-8 py-3 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-bold text-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deck.length === 0
                  ? "ไพ่หมดแล้ว"
                  : isDrawing
                  ? "กำลังจั่ว..."
                  : "จั่วไพ่"}
              </button>
              <button
                onClick={handleReset}
                className="px-8 py-3 rounded-full bg-purple-700 hover:bg-purple-600 text-white font-bold text-lg shadow-lg transition-all"
              >
                สับไพ่ใหม่
              </button>
              <button
                onClick={() => setSoundEnabled((s) => !s)}
                className={`px-4 py-3 rounded-full ${
                  soundEnabled ? "bg-green-600" : "bg-gray-600"
                } text-white font-bold text-lg shadow-lg transition-all`}
                title="เปิด/ปิดเสียง"
              >
                {soundEnabled ? "🔊" : "🔇"}
              </button>
              <div className="mt-4 text-center text-lg font-semibold">
                ไพ่ที่เหลือ: {deck.length} ใบ
              </div>
            </div>
            <div className="mt-8 w-full">
              <h2 className="text-xl font-bold mb-2">ประวัติการจั่วไพ่</h2>
              {history.length === 0 ? (
                <div className="text-gray-400">ยังไม่มีประวัติ</div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {history.map((h, i) => (
                    <div
                      key={i}
                      className="bg-white/10 rounded-lg px-4 py-2 flex items-center gap-4"
                    >
                      <span
                        className={`text-2xl font-bold ${
                          suitColors[h.card.suit]
                        }`}
                      >
                        {h.card.value}
                        {suitSymbols[h.card.suit]}
                      </span>
                      <span className="text-sm text-amber-200">{h.rule}</span>
                      <span className="ml-auto text-xs text-gray-400">
                        {h.time}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8 w-full">
              <h2 className="text-xl font-bold mb-2">กฎของไพ่</h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {Object.entries(cardRules).map(([value, rule]) => (
                  <div key={value} className="bg-white/10 rounded-lg px-4 py-2">
                    <span className="font-bold">{value}:</span> {rule}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
