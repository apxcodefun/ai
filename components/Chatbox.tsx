"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useChatPrompt } from "@/lib/chatPromptStore";
import { useRouter } from "next/navigation";

type Message = {
  sender: "user" | "ai";
  text: string;
};

export default function Chatbox() {
  const { prompt, setPrompt, shouldSend, setShouldSend } = useChatPrompt();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUsername = localStorage.getItem("username");
      if (!savedUsername) {
        router.push("/login");
      } else {
        setUsername(savedUsername);
        // Tambahkan greeting AI di sini
        setMessages([
          {
            sender: "ai",
            text: `Halo! ${savedUsername}, ada yang bisa saya bantu tentang karir Anda hari ini?`,
          },
        ]);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMessage: Message = { sender: "user", text: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setPrompt("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    const reply = data.reply;

    // Set up typing animation
    setTypedText("");
    setIsTyping(true);
    setMessages((prev) => [...prev, { sender: "ai", text: "" }]);

    let i = 0;
    const typingInterval = setInterval(() => {
      setTypedText((prev) => prev + reply[i]);
      i++;
      if (i >= reply.length) {
        clearInterval(typingInterval);
        setIsTyping(false);
        setLoading(false);
      }
    }, 20);
  };

  const handleAutoSubmit = async (autoPrompt: string) => {
    const userMessage: Message = { sender: "user", text: autoPrompt };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setPrompt("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: autoPrompt }),
    });
    const data = await res.json();

    const aiMessage: Message = { sender: "ai", text: data.reply };
    setMessages((prev) => [...prev, aiMessage]);
    setLoading(false);
  };

  useEffect(() => {
    if (!isTyping && typedText === "") return;

    setMessages((prev) => {
      const lastMsg = prev[prev.length - 1];
      if (lastMsg?.sender === "ai") {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...lastMsg,
          text: typedText,
        };
        return updated;
      }
      return prev;
    });
  }, [typedText, isTyping]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typedText]);

  useEffect(() => {
    if (shouldSend && prompt.trim()) {
      handleAutoSubmit(prompt);
      setShouldSend(false);
    }
  }, [shouldSend]);

  return (
    <div className="flex flex-col h-screen w-full bg-[#f0e4d7] text-[#3e3e3e]">
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto py-6 px-4 w-full">
        <div className="max-w-3xl mx-auto w-full">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              } mb-4`}
            >
              <div
                className={`p-3 rounded-xl max-w-[90%] ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-gray-800 text-gray-100 rounded-tl-none"
                }`}
              >
                <ReactMarkdown class="text-sm md:text-base">
                  {msg.text}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-800 text-gray-500 p-3 rounded-xl rounded-tl-none">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                  <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="w-full px-4 pb-4">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto flex gap-2 bg-gray-800 p-2 rounded-xl"
        >
          <input
            className="w-full px-4 py-3 rounded-lg bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-200 placeholder-gray-400"
            placeholder="Tanya seputar karir Anda..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-800 disabled:opacity-50 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 2L11 13"></path>
                <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
