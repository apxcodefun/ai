"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useChatPrompt } from "@/lib/chatPromptStore";
import { useRouter } from "next/navigation";

// Types
type Message = {
  sender: "user" | "ai";
  text: string;
};

type ChatResponse = {
  reply: string;
  error?: string;
  isValidationError?: boolean;
};

export default function Chatbox() {
  // Custom hook for chat prompt state
  const { prompt, setPrompt, shouldSend, setShouldSend } = useChatPrompt();

  // User and UI state
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Refs and router
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Initialize component with user data
  useEffect(() => {
    initializeChat();
  }, []);

  // Update message with typing animation
  useEffect(() => {
    updateMessageWithTypingAnimation();
  }, [typedText, isTyping]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, typedText]);

  // Handle auto-submit from external components
  useEffect(() => {
    handleAutoSubmitTrigger();
  }, [shouldSend]);

  // Helper functions
  const initializeChat = () => {
    if (typeof window === "undefined") return;

    const savedUsername = localStorage.getItem("username");
    if (!savedUsername) {
      router.push("/login");
      return;
    }

    setUsername(savedUsername);
    setMessages([
      {
        sender: "ai",
        text: `Halo! ${savedUsername}, ada yang bisa saya bantu tentang karir Anda hari ini?`,
      },
    ]);
    setIsClient(true);
  };

  const updateMessageWithTypingAnimation = () => {
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
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAutoSubmitTrigger = () => {
    if (shouldSend && prompt.trim()) {
      handleSendMessage(prompt);
      setShouldSend(false);
    }
  };

  const addUserMessage = (text: string) => {
    const userMessage: Message = { sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);
  };

  const addAIMessage = (text: string, isError = false) => {
    const aiMessage: Message = { sender: "ai", text };
    setMessages((prev) => [...prev, aiMessage]);
    if (isError) setValidationError(text);
  };

  const startTypingAnimation = (text: string) => {
    setTypedText("");
    setIsTyping(true);
    setMessages((prev) => [...prev, { sender: "ai", text: "" }]);

    let i = 0;
    const typingInterval = setInterval(() => {
      setTypedText((prev) => prev + text[i]);
      i++;
      if (i >= text.length) {
        clearInterval(typingInterval);
        setIsTyping(false);
        setLoading(false);
      }
    }, 20);
  };

  const handleError = (error: unknown, isValidationError = false) => {
    console.error("Error in chat:", error);
    const errorMessage = isValidationError
      ? error
      : "Maaf, terjadi kesalahan. Silakan coba lagi.";

    addAIMessage(errorMessage, isValidationError);
    setLoading(false);
  };

  // API communication
  const sendMessageToAPI = async (messageText: string) => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: messageText, username }),
      });

      const data: ChatResponse = await res.json();

      if (!res.ok) {
        if (data.isValidationError) {
          handleError(data.error, true);
          return null;
        } else {
          throw new Error(data.error || "Terjadi kesalahan");
        }
      }

      return data.reply;
    } catch (error) {
      handleError(error);
      return null;
    }
  };

  // Main message handling functions
  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    setValidationError(null);
    addUserMessage(messageText);
    setLoading(true);
    setPrompt("");

    const reply = await sendMessageToAPI(messageText);
    if (reply) {
      startTypingAnimation(reply);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(prompt);
  };

  // Early return if not client-side
  if (!isClient) {
    return null;
  }

  // UI Components
  const MessageBubble = ({
    message,
    index,
  }: {
    message: Message;
    index: number;
  }) => {
    const isUser = message.sender === "user";
    const isErrorMessage =
      !isUser && validationError && index === messages.length - 1;

    const bubbleStyle = isUser
      ? "bg-blue-600 text-white rounded-tr-none"
      : isErrorMessage
      ? "bg-red-600 text-white rounded-tl-none"
      : "bg-gray-800 text-gray-100 rounded-tl-none";

    return (
      <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
        <div className={`p-3 rounded-xl max-w-[90%] ${bubbleStyle}`}>
          <ReactMarkdown class="text-sm md:text-base">
            {message.text}
          </ReactMarkdown>
        </div>
      </div>
    );
  };

  const TypingIndicator = () => (
    <div className="flex justify-start mb-4">
      <div className="bg-gray-800 text-gray-500 p-3 rounded-xl rounded-tl-none">
        <div className="flex space-x-1">
          <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
          <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );

  const SendButton = () => (
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
  );

  // Main component render
  return (
    <div className="flex flex-col h-screen w-full bg-zinc-800 text-gray-500">
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto py-6 px-4 w-full space-y-3">
        <div className="max-w-3xl mx-auto w-full">
          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} index={i} />
          ))}

          {isTyping && <TypingIndicator />}

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
          <SendButton />
        </form>
      </div>
    </div>
  );
}
