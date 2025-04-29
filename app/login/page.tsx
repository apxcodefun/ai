"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const page = () => {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    localStorage.setItem("busername", username);
    router.push("/careerbuddy");
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf6e3]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">
          {" "}
          Masukkan Username
        </h1>
        <input
          type="text"
          className="w-full border border-gray-300 p-2 rounded mb-4"
          placeholder="Jhondoe123"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Masuk
        </button>
      </form>
    </div>
  );
};

export default page;
