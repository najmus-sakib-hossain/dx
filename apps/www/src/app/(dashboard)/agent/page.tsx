"use client";

import { motion } from "framer-motion";
import { Bot, PlayCircle, StopCircle, Terminal, ScrollText, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as React from "react";

export default function AgentPage() {
  const [isRunning, setIsRunning] = React.useState(true);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">DX Agent</h1>
        <p className="mt-1 text-muted-foreground">
          Control your 24/7 AI-powered development agent.
        </p>
      </motion.div>

      {/* Agent Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-xl border border-border bg-card/50 p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-xl bg-accent/10">
              <Bot className="size-8 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Agent Status</h2>
              <div className="mt-1 flex items-center gap-2">
                <span className={`size-2 rounded-full ${isRunning ? "bg-accent animate-pulse" : "bg-muted-foreground"}`} />
                <span className="text-sm text-muted-foreground">
                  {isRunning ? "Running — monitoring 3 repositories" : "Stopped"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={isRunning ? "destructive" : "default"}
              onClick={() => setIsRunning(!isRunning)}
            >
              {isRunning ? (
                <>
                  <StopCircle className="mr-2 size-4" />
                  Stop Agent
                </>
              ) : (
                <>
                  <PlayCircle className="mr-2 size-4" />
                  Start Agent
                </>
              )}
            </Button>
            <Button variant="outline">
              <Settings className="mr-2 size-4" />
              Configure
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Agent Logs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ScrollText className="size-5" />
            Agent Logs
          </h2>
          <Button variant="ghost" size="sm">Clear</Button>
        </div>
        <div className="overflow-hidden rounded-xl border border-border bg-card/80">
          <div className="flex items-center gap-2 border-b border-border px-4 py-2">
            <div className="size-3 rounded-full bg-destructive/70" />
            <div className="size-3 rounded-full bg-yellow-500/70" />
            <div className="size-3 rounded-full bg-green-500/70" />
            <span className="ml-2 text-xs text-muted-foreground font-mono">dx-agent — logs</span>
          </div>
          <div className="max-h-80 overflow-y-auto px-4 py-3 font-mono text-xs leading-relaxed">
            <p className="text-muted-foreground/60">[14:32:01] Agent initialized</p>
            <p className="text-muted-foreground/60">[14:32:02] Connected to 3 repositories</p>
            <p className="text-accent">[14:32:15] Scanning dx-frontend for issues...</p>
            <p className="text-accent">[14:32:18] Found 2 TypeScript strict mode violations</p>
            <p className="text-muted-foreground/60">[14:32:20] Auto-fix applied: strict-null-checks</p>
            <p className="text-muted-foreground/60">[14:32:21] Auto-fix applied: no-implicit-any</p>
            <p className="text-accent">[14:35:00] Running performance audit...</p>
            <p className="text-muted-foreground/60">[14:35:12] LCP: 2.1s ✓ | FID: 45ms ✓ | CLS: 0.05 ✓</p>
            <p className="text-primary">[14:40:00] All checks passed. Monitoring active.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
