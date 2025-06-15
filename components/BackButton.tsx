import { useRouter } from "next/router";
import { FaArrowLeft } from "react-icons/fa";

const BackButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600/20 hover:bg-purple-600/30 rounded-lg border border-purple-500/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
    >
      <FaArrowLeft className="w-4 h-4" />
      กลับ
    </button>
  );
};

export default BackButton;
