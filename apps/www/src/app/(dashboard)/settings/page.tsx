"use client";

import { motion } from "framer-motion";
import { Settings, User, Bell, Shield, Palette } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your DX account and preferences.
        </p>
      </motion.div>

      <div className="space-y-4">
        {[
          { title: "Profile", description: "Manage your name, email, and avatar", icon: User },
          { title: "Notifications", description: "Configure alert preferences", icon: Bell },
          { title: "Security", description: "Password, 2FA, and session management", icon: Shield },
          { title: "Appearance", description: "Theme, layout, and display preferences", icon: Palette },
          { title: "General", description: "Language, timezone, and defaults", icon: Settings },
        ].map((section) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 rounded-xl border border-border bg-card/50 p-5 transition-colors hover:bg-card cursor-pointer"
          >
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <section.icon className="size-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">{section.title}</p>
              <p className="text-sm text-muted-foreground">{section.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
