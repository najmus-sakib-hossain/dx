"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/stores/chat-store";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X, Users } from "lucide-react";
import * as React from "react";

/**
 * ChatPanel — The guest collaboration chat panel that slides up from the dock bar.
 * Ephemeral messaging — no auth required, messages not persisted.
 */
export const ChatPanel = (): React.ReactElement => {
  const isOpen = useChatStore((s) => s.isOpen);
  const messages = useChatStore((s) => s.messages);
  const users = useChatStore((s) => s.users);
  const username = useChatStore((s) => s.username);
  const setIsOpen = useChatStore((s) => s.setIsOpen);
  const setUsername = useChatStore((s) => s.setUsername);
  const addMessage = useChatStore((s) => s.addMessage);

  const [input, setInput] = React.useState("");
  const [guestName, setGuestName] = React.useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const scrollToBottom = React.useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleJoin = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (guestName.trim().length >= 2) {
        setUsername(guestName.trim());
        addMessage({
          id: crypto.randomUUID(),
          userId: "system",
          username: "System",
          text: `${guestName.trim()} joined the chat`,
          timestamp: Date.now(),
          type: "join",
        });
      }
    },
    [guestName, setUsername, addMessage]
  );

  const handleSend = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || !username) return;

      addMessage({
        id: crypto.randomUUID(),
        userId: username,
        username,
        text: input.trim(),
        timestamp: Date.now(),
        type: "message",
      });
      setInput("");
      inputRef.current?.focus();
    },
    [input, username, addMessage]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-24 right-4 z-50 flex h-[480px] w-[360px] flex-col overflow-hidden rounded-2xl border border-border bg-card/95 shadow-2xl backdrop-blur-xl sm:right-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="size-4 text-primary" />
              <span className="text-sm font-semibold">DX Chat</span>
              <span className="flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">
                <Users className="size-3" />
                {users.length || 1}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="size-7"
              aria-label="Close chat"
            >
              <X className="size-4" />
            </Button>
          </div>

          {/* Body */}
          {!username ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
              <MessageCircle className="size-10 text-primary/50" />
              <div className="text-center">
                <h3 className="text-sm font-semibold">Join the conversation</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Chat with other DX visitors in real-time
                </p>
              </div>
              <form onSubmit={handleJoin} className="flex w-full gap-2">
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Pick a username..."
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
                  maxLength={20}
                  autoFocus
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={guestName.trim().length < 2}
                >
                  Join
                </Button>
              </form>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3">
                {messages.length === 0 && (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    No messages yet. Say something!
                  </div>
                )}
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "text-sm",
                        msg.type === "system" || msg.type === "join" || msg.type === "leave"
                          ? "text-center text-xs text-muted-foreground/60 italic"
                          : ""
                      )}
                    >
                      {msg.type === "message" && (
                        <div
                          className={cn(
                            "flex flex-col",
                            msg.username === username ? "items-end" : "items-start"
                          )}
                        >
                          <span className="mb-0.5 text-[10px] font-medium text-muted-foreground">
                            {msg.username === username ? "You" : msg.username}
                          </span>
                          <div
                            className={cn(
                              "max-w-[80%] rounded-xl px-3 py-2 text-sm",
                              msg.username === username
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-foreground"
                            )}
                          >
                            {msg.text}
                          </div>
                        </div>
                      )}
                      {(msg.type === "join" || msg.type === "leave" || msg.type === "system") && (
                        <p>{msg.text}</p>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input */}
              <form
                onSubmit={handleSend}
                className="flex items-center gap-2 border-t border-border px-4 py-3"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
                  maxLength={500}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim()}
                  className="size-9 shrink-0"
                >
                  <Send className="size-4" />
                </Button>
              </form>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
