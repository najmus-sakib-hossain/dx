"use client";

import { useCallback, useEffect, useRef } from "react";
import { useChatStore } from "@/stores/chat-store";

const CHAT_API_URL = "/api/chat";
const POLL_INTERVAL_MS = 5000;

/**
 * Hook that provides chat operations.
 * Wraps the chat store with API integration and polling.
 */
export function useChat() {
  const store = useChatStore();
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /** Send a message via the API */
  const sendMessage = useCallback(
    async (content: string) => {
      if (!store.username || !content.trim()) return;

      // Optimistic update
      store.addMessage({
        id: crypto.randomUUID(),
        userId: "local",
        username: store.username,
        content: content.trim(),
        timestamp: Date.now(),
        type: "user",
      });

      try {
        await fetch(CHAT_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: store.username,
            content: content.trim(),
          }),
        });
      } catch (error) {
        console.error("[useChat] Failed to send message:", error);
      }
    },
    [store]
  );

  /** Join the chat as a guest */
  const joinAsGuest = useCallback(
    (name: string) => {
      store.setUsername(name.trim());
      store.setIsConnected(true);
    },
    [store]
  );

  /** Leave the chat */
  const leave = useCallback(() => {
    store.setUsername("");
    store.setIsConnected(false);
    store.clearMessages();
  }, [store]);

  // Poll for new messages when connected
  useEffect(() => {
    if (!store.isConnected) {
      if (pollRef.current) clearInterval(pollRef.current);
      return;
    }

    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(CHAT_API_URL);
        if (res.ok) {
          // Future: merge new messages from server
        }
      } catch {
        // Silently ignore poll failures
      }
    }, POLL_INTERVAL_MS);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [store.isConnected]);

  return {
    ...store,
    sendMessage,
    joinAsGuest,
    leave,
  };
}
