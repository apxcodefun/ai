import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API!);

// Fungsi untuk chat dengan Gemini
export const chatwithGemini = async (prompt: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error chatting with Gemini:", error);
    throw error;
  }
};
