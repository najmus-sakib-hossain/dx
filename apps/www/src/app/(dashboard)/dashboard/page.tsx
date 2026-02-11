"use client";

import { DX_TOOLS } from "@/config/tools";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Activity,
  Bot,
  CheckCircle2,
  Clock,
  Cpu,
  Zap,
} from "lucide-react";
import Link from "next/link";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

/**
 * DX Reaction Board — The authenticated dashboard overview.
 * Shows tool status, agent control, activity feed, and quick actions.
 */
export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">DX Reaction Board</h1>
        <p className="mt-1 text-muted-foreground">
          Your development ecosystem at a glance.
        </p>
      </motion.div>

      {/* Agent Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-xl border border-border bg-card/50 p-6 backdrop-blur-sm"
      >
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-accent/10">
            <Bot className="size-6 text-accent" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">DX Agent</h2>
              <span className="flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                <span className="size-1.5 rounded-full bg-accent animate-pulse" />
                Online
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              24/7 AI agent monitoring your projects. Last activity: 2 min ago.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent/10"
            >
              View Logs
            </button>
            <button
              type="button"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
            >
              Configure
            </button>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          { label: "Active Tools", value: "7", icon: Zap, color: "text-primary" },
          { label: "Tasks Completed", value: "142", icon: CheckCircle2, color: "text-accent" },
          { label: "Automations", value: "23", icon: Cpu, color: "text-blue-400" },
          { label: "Uptime", value: "99.9%", icon: Activity, color: "text-orange-400" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            className="rounded-xl border border-border bg-card/50 p-5 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <stat.icon className={cn("size-4", stat.color)} />
            </div>
            <p className="mt-2 text-2xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Tool Status Grid */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Your Tools</h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {DX_TOOLS.map((tool) => (
            <motion.div key={tool.id} variants={itemVariants}>
              <Link
                href={tool.docsPath}
                className="group flex items-center gap-3 rounded-xl border border-border bg-card/50 p-4 transition-all hover:border-primary/30 hover:bg-card"
              >
                <div
                  className="flex size-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${tool.color}15` }}
                >
                  <tool.icon className="size-5" style={{ color: tool.color }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{tool.name}</p>
                  <p className="text-xs text-muted-foreground">{tool.status}</p>
                </div>
                <span
                  className={cn(
                    "size-2 rounded-full",
                    tool.status === "stable" && "bg-accent",
                    tool.status === "beta" && "bg-yellow-500",
                    tool.status === "coming-soon" && "bg-muted-foreground"
                  )}
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { action: "Forge Style tokens regenerated", time: "2 min ago", icon: Activity },
            { action: "Agent detected and fixed 3 linting issues", time: "15 min ago", icon: Bot },
            { action: "Serializer schema updated to v3.2", time: "1 hour ago", icon: Zap },
            { action: "Media pipeline processed 47 images", time: "3 hours ago", icon: Clock },
          ].map((item) => (
            <div
              key={item.action}
              className="flex items-center gap-3 rounded-lg border border-border bg-card/30 px-4 py-3"
            >
              <item.icon className="size-4 text-muted-foreground" />
              <p className="flex-1 text-sm">{item.action}</p>
              <span className="text-xs text-muted-foreground">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
