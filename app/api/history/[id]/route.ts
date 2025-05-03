import { NextResponse } from "next/server";
import Chat from "@/models/chat";
import connectDB from "@/lib/db";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    // Pastikan params.id ada nilainya
    if (!params.id) {
      return NextResponse.json(
        { success: false, message: "ID tidak ditemukan" },
        { status: 400 }
      );
    }

    const deletedChat = await Chat.findByIdAndDelete(params.id);

    if (!deletedChat) {
      return NextResponse.json(
        { success: false, message: "Chat tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus chat" },
      { status: 500 }
    );
  }
}
