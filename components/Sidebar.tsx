"use client";

import { useChatPrompt } from "@/lib/chatPromptStore";
import { useState, useEffect } from "react";
import { FaRegTrashCan } from "react-icons/fa6";

const Sidebar = () => {
  const { setPrompt } = useChatPrompt();
  const [isOpen, setIsOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  // Mendeteksi ukuran layar untuk responsivitas
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Cek saat pertama kali load
    checkIfMobile();

    // Tambahkan event listener untuk resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup event listener
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleItemClick = (item) => {
    setPrompt(item.message || item, true);
    if (isMobile) setIsOpen(false);
  };

  const handleDelete = async (id) => {
    if (!id) {
      console.error("ID tidak valid untuk penghapusan");
      return;
    }

    try {
      const response = await fetch(`/api/history/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setChatHistory((prev) => prev.filter((item) => item._id !== id));
      } else {
        console.error("Gagal menghapus chat:", data.message);
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  useEffect(() => {
    const username = localStorage.getItem("username");

    if (username) {
      fetch(`/api/history?user=${username}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("API History Response:", data);
          setChatHistory(data);
        })
        .catch((err) => {
          console.error("Failed to fetch chat history", err);
        });
    }
  }, []);

  // Close dropdown when sidebar closes
  useEffect(() => {
    if (!isOpen) {
      setIsModelDropdownOpen(false);
    }
  }, [isOpen]);

  return (
    <>
      {/* Button untuk toggle sidebar - hanya muncul di mobile atau saat sidebar tertutup */}
      {(!isOpen || isMobile) && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-40 bg-gray-800 hover:bg-gray-700 p-2 rounded-md text-white shadow-lg"
          aria-label="Menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      )}

      {/* Overlay untuk mobile - hanya muncul saat sidebar terbuka di mobile */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar komponen */}
      <div
        className={`${
          isMobile
            ? "fixed top-0 left-0 h-full z-50"
            : isOpen
            ? "relative w-64 min-w-64"
            : "w-0"
        } bg-gray-900 text-gray-300 transition-all duration-300 ease-in-out shadow-lg overflow-hidden`}
      >
        <div className={`w-64 h-full flex flex-col overflow-y-auto`}>
          {/* Header sidebar dengan tombol close */}
          <div className="p-4 flex justify-between items-center border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Menu</h2>
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-700 rounded-md text-gray-300"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Main Chat Items */}
          <div className="px-4 py-3 text-center bg-gray-800 mb-2">
            <h2 className="font-medium text-white">Buddy AI Career</h2>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 my-2"></div>

          {/* History Chat */}
          <div className="px-3 py-2 flex-1">
            <h3 className="text-xs text-gray-400 uppercase font-medium mb-2 px-1">
              History Chat
            </h3>

            <div className="space-y-1">
              {chatHistory.length > 0 ? (
                chatHistory.map((chat, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-800 cursor-pointer transition-colors bg-gray-800 mb-1"
                    onClick={() => handleItemClick(chat)}
                  >
                    <span className="truncate text-sm">
                      {chat.message || "Tidak ada pesan"}
                    </span>
                    <button
                      title="Delete Chat"
                      className="text-gray-400 hover:text-red-400 transition-colors p-1 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation(); // Mencegah event click ke parent
                        handleDelete(chat._id);
                      }}
                    >
                      <FaRegTrashCan size={14} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-3 text-gray-400 text-sm italic">
                  Belum ada history
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
