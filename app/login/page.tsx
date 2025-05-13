"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const page = () => {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    // Save to localStorage
    localStorage.setItem("username", username);
    // Save To DB
    await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    router.push("/careerbuddy");
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-800">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-4 text-center italic">
          {" "}
          Masukkan Username
        </h1>
        <Input
          type="text"
          className="w-full border border-green-900 p-2 rounded mb-4"
          placeholder="Jhondoe123"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Masuk
        </Button>
      </form>
    </div>
  );
};

export default page;
