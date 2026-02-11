import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: number;
  type: "message" | "system" | "join" | "leave";
}

interface ChatUser {
  id: string;
  username: string;
  avatar: string;
  joinedAt: number;
}

interface ChatState {
  isOpen: boolean;
  isConnected: boolean;
  messages: ChatMessage[];
  users: ChatUser[];
  username: string;
  isTyping: string[];
  toggleChat: () => void;
  setIsOpen: (open: boolean) => void;
  setIsConnected: (connected: boolean) => void;
  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  setUsers: (users: ChatUser[]) => void;
  setUsername: (username: string) => void;
  addTypingUser: (username: string) => void;
  removeTypingUser: (username: string) => void;
}

export const useChatStore = create<ChatState>()(
  devtools(
    (set) => ({
      isOpen: false,
      isConnected: false,
      messages: [],
      users: [],
      username: "",
      isTyping: [],
      toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
      setIsOpen: (open) => set({ isOpen: open }),
      setIsConnected: (connected) => set({ isConnected: connected }),
      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages.slice(-199), message],
        })),
      setMessages: (messages) => set({ messages }),
      setUsers: (users) => set({ users }),
      setUsername: (username) => set({ username }),
      addTypingUser: (username) =>
        set((state) => ({
          isTyping: state.isTyping.includes(username)
            ? state.isTyping
            : [...state.isTyping, username],
        })),
      removeTypingUser: (username) =>
        set((state) => ({
          isTyping: state.isTyping.filter((u) => u !== username),
        })),
    }),
    { name: "dx-chat" }
  )
);
