import Navbar from "@/components/Navbar";
import { FaLongArrowAltRight } from "react-icons/fa";
import { IoHardwareChipSharp } from "react-icons/io5";

export default function Home() {
  return (
    <div className="bg-zinc-800">
      <Navbar />
      {/* Main Container with Flex Layout */}
      <div className="container mx-auto flex flex-col md:flex-row gap-8 py-12 px-4 min-h-screen items-center">
        {/* Text Section */}
        <div className="flex-1 space-y-6 space-x-4">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-zinc-200">
              YOUR AI CAREER BUDDY
            </h1>
            <p className="text-lg text-gray-600">
              Navigate your career path with best AI Chatbot
            </p>
          </div>
          <div className="relative w-full max-w-xl">
            <div className="absolute inset-0 bg-white translate-x-1 translate-y-1 rounded-lg"></div>
            <div className="relative w-full bg-cyan-700 text-white font-bold py-3 rounded-lg flex items-center justify-between px-6 hover:-translate-y-1 hover:shadow-lg transition duration-200 cursor-pointer">
              <span>Get your Best Job</span>
              <FaLongArrowAltRight size={20} />
            </div>
          </div>
        </div>

        {/* ROBOTIC SECTION */}
        <div className="flex-1 relative w-full max-w-xl">
          {" "}
          {/* Mengubah max-w-md menjadi max-w-xl */}
          <div className="absolute inset-0 bg-white translate-y-1 translate-x-1 rounded-lg"></div>
          <div className="relative w-full bg-cyan-700 text-white font-bold py-8 rounded-lg flex flex-col items-start px-8 hover:-translate-y-1 hover:shadow-lg transition duration-200">
            {" "}
            {/* Mengubah py-6 ke py-8 dan px-6 ke px-8 */}
            <div className="flex items-center gap-3 w-full mb-4">
              {" "}
              {/* Mengubah mb-2 ke mb-4 */}
              <IoHardwareChipSharp size={24} />{" "}
              {/* Mengubah size dari 20 ke 24 */}
              <span className="text-xl font-bold">
                AI-POWERED ANALYSIS
              </span>{" "}
              {/* Mengubah text-lg ke text-xl */}
            </div>
            {/* Progress Bar 1 - 100% completed */}
            <div className="w-full h-3 bg-white/20 rounded-full my-5">
              {" "}
              {/* Mengubah h-2 ke h-3 dan my-4 ke my-5 */}
              <div className="h-full bg-white rounded-full w-full"></div>{" "}
              {/* Mengubah w-5/5 ke w-full */}
            </div>
            <span className="my-3 text-lg">Career MATCHING</span>{" "}
            {/* Mengubah my-2 ke my-3 dan tambah text-lg */}
            {/* Progress Bar 2 - 100% completed */}
            <div className="w-full h-3 bg-white/20 rounded-full my-5">
              {" "}
              {/* Mengubah h-2 ke h-3 dan my-4 ke my-5 */}
              <div className="h-full bg-white rounded-full w-full"></div>{" "}
              {/* Mengubah w-5/5 ke w-full */}
            </div>
            <span className="my-3 text-lg">SKILL DEVELOPMENT</span>{" "}
            {/* Mengubah my-2 ke my-3 dan tambah text-lg */}
          </div>
        </div>
      </div>
    </div>
  );
}
