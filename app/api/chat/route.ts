import { NextResponse } from "next/server";
import { chatwithGemini } from "@/lib/gemini";
import connectDB from "@/lib/db";
import Chat from "@/models/chat";

export async function POST(req: Request) {
  let connection;

  try {
    const { prompt, username } = await req.json();

    // Validasi input
    if (!prompt || !username) {
      return NextResponse.json(
        { error: "Prompt atau username tidak boleh kosong" },
        { status: 400 }
      );
    }

    // Validasi konten career-related
    const allowedKeywords = [
      "career",
      "pekerjaan",
      "kerja",
      "profesi",
      "bidang",
      "masa depan",
      "karir",
      "pengembangan",
      "skill",
      "kemampuan",
      "gaji",
      "posisi",
      "jabatan",
      "pendidikan",
      "belajar",
    ];

    const isCareerRelated = allowedKeywords.some((keyword) =>
      prompt.toLowerCase().includes(keyword)
    );

    if (!isCareerRelated) {
      return NextResponse.json(
        {
          error:
            "Pertanyaan ini tidak relevan dengan topik karier. Silakan tanyakan hal yang berkaitan dengan karir, pekerjaan, atau pengembangan kemampuan.",
          isValidationError: true,
        },
        { status: 400 }
      );
    }

    // Koneksi database
    connection = await connectDB();

    // Simpan pertanyaan user
    try {
      await Chat.create({
        username,
        sender: "user",
        message: prompt,
      });
    } catch (dbError) {
      console.error("[DATABASE ERROR - USER MESSAGE]", dbError);
    }

    // Dapatkan jawaban dari Gemini
    const reply = await chatwithGemini(prompt);

    // Simpan balasan AI
    try {
      await Chat.create({
        username,
        sender: "ai",
        message: reply,
      });
    } catch (dbError) {
      console.error("[DATABASE ERROR - AI MESSAGE]", dbError);
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("[ERROR CHAT]", error);

    // Fallback kalau gagal konek DB
    if (error.name === "MongooseError" || error.name === "MongoError") {
      try {
        const { prompt } = await req.json();
        const reply = await chatwithGemini(prompt);
        return NextResponse.json({
          reply,
          warning: "Chat tidak disimpan ke database karena error koneksi",
        });
      } catch (fallbackError) {
        console.error("[FALLBACK ERROR]", fallbackError);
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
