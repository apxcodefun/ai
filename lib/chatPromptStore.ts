import { create } from "zustand";

type ChatPromptState = {
  prompt: string;
  setPrompt: (text: string) => void;
  shouldSend: boolean;
  setShouldSend: (value: boolean) => void;
};

export const useChatPrompt = create<ChatPromptState>((set) => ({
  prompt: "",
  shouldSend: false,
  setPrompt: (text, autoSend = false) =>
    set({ prompt: text, shouldSend: autoSend }),
  setShouldSend: (value) => set({ shouldSend: value }),
}));
