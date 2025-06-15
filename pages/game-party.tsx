import Head from "next/head";
import Navbar from "../components/Navbar";
import Link from "next/link";
import {
  FaHandPaper,
  FaCommentDots,
  FaBrain,
  FaRunning,
  FaHourglassHalf,
  FaTheaterMasks,
  FaVoteYea,
  FaHeart,
  FaSpellCheck,
  FaLightbulb,
  FaGlassCheers,
  FaGamepad,
  FaRandom,
  FaUndo,
  FaVolumeUp,
  FaVolumeMute,
  FaPlay,
  FaRegHeart,
  FaRegClock,
  FaWheelchair,
  FaComments,
  FaDice,
} from "react-icons/fa";

const GameParty = () => {
  const games = [
    {
      title: "คำต้องห้าม",
      description:
        'แต่ละคนได้ "คำต้องห้าม" ส่วนตัว ถ้าหลุดพูดระหว่างวงต้องดื่ม',
      icon: <FaHandPaper className="text-4xl mb-4" />,
      link: "/forbidden-word-game",
    },
    {
      title: "ถั่วงอกสามัคคี",
      description: "ผู้เล่น 2 คนต้องพูดคำพร้อมกันให้เหมือนกัน ถ้าไม่ตรง ดื่ม!",
      icon: <FaCommentDots className="text-4xl mb-4" />,
      link: "/say-the-same-word",
    },
    {
      title: "ล้วงใจ",
      description:
        'ระบบถามคำถาม แล้วผู้เล่นต้องเดาคำตอบ "ของผู้ถูกเลือก" ให้ตรง',
      icon: <FaBrain className="text-4xl mb-4" />,
      link: "/mind-reader-game",
    },
    {
      title: "เร็วมั้ย?",
      description:
        "ระบบแสดงสีหรือคำ แล้วผู้เล่นต้องกดปุ่มเร็วที่สุด ใครช้า = ดื่ม!",
      icon: <FaRunning className="text-4xl mb-4" />,
      link: "/fast-tap-game",
    },
    {
      title: "สิบวิสารภาพ",
      description:
        "ระบบสุ่มคำถามลับแรงๆ ผู้เล่นต้องตอบภายใน 10 วินาที ถ้าไม่กล้า = ดื่ม!",
      icon: <FaHourglassHalf className="text-4xl mb-4" />,
      link: "/confess-in-10-sec-game",
    },
    {
      title: "เหล้าใบ้คำ",
      description:
        "ระบบให้คำ ผู้เล่นต้องแสดงท่าทางโดยห้ามพูด คนอื่นทายให้ได้ใน 30 วินาที",
      icon: <FaTheaterMasks className="text-4xl mb-4" />,
      link: "/drunken-charades-game",
    },
    {
      title: "อย่าโกหกนะ!",
      description:
        'ระบบสุ่มคำถาม เช่น "คุณเคยแอบชอบเพื่อนสนิทไหม?" ผู้เล่นตอบ แล้วคนอื่นโหวตว่าโกหกไหม ถ้าเสียงส่วนใหญ่บอกว่าโกหก ต้องดื่ม',
      icon: <FaVoteYea className="text-4xl mb-4" />,
      link: "/lie-detector-game",
    },
    {
      title: "เหล้าหัวใจ",
      description:
        "หมุนวงล้อ เลือกคู่ที่ต้องเล่น 'เกมรัก' เช่น สบตา 10 วินาที หรือ เลือกว่าชอบใครในวง",
      icon: <FaHeart className="text-4xl mb-4" />,
      link: "/love-roulette-game",
    },
    {
      title: "จับคู่คำ",
      description:
        'ระบบเริ่มต้นคำ เช่น "ปลา" แล้วผู้เล่นต้องพูดคำที่สัมผัสได้ ใครตัน = ดื่ม',
      icon: <FaSpellCheck className="text-4xl mb-4" />,
      link: "/rhyme-battle-game",
    },
    {
      title: "เกมทายคำ",
      description:
        "ระบบสุ่มคำศัพท์ ผู้เล่นต้องทายคำให้ได้ภายใน 30 วินาที ถ้าทายถูกคนอื่นดื่ม ถ้าทายไม่ได้ตัวเองดื่ม!",
      icon: <FaLightbulb className="text-4xl mb-4" />,
      link: "/word-guess-game",
    },
    {
      title: "กูไม่เคย",
      description:
        'ระบบสุ่มคำว่า "ฉันไม่เคย..." เช่น "จูบเพื่อนตัวเอง" ใครเคยทำ = ดื่ม!',
      icon: <FaGlassCheers className="text-4xl mb-4" />,
      link: "/never-have-i-ever-game",
    },
    {
      title: "เกมไพ่โดเรม่อน",
      description: "เกมไพ่ป๊อก 1 สำรับ (52 ใบ) แต่ละใบมีกติกาพิเศษ!",
      icon: <FaDice className="text-4xl mb-4" />,
      link: "/doraemon-card-game",
    },
  ];

  return (
    <>
      <Head>
        <title>Game Party</title>
        <meta name="description" content="Join the Game Party!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-screen py-20 bg-background text-textLight px-4">
        <h1 className="text-6xl md:text-8xl font-bold text-primary animate-glow mb-12">
          Game Party
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-4xl">
          {games.map((game, index) => (
            <div
              key={index}
              className="glass-card p-6 flex flex-col items-center justify-center text-center"
            >
              {game.icon}
              <h2 className="text-3xl font-semibold text-textLight mb-4">
                {game.title}
              </h2>
              <p className="text-lg text-textLight/70 mb-6">
                {game.description}
              </p>
              <Link href={game.link} className="btn btn-primary">
                Play Now
              </Link>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default GameParty;
