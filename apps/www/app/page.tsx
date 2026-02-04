"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { PGliteDemo } from "@/components/pglite-demo";
import { SplineScene } from "@/components/spline-scene";
import { PostsDemo } from "@/components/posts-demo";
import { TechShowcase } from "@/components/tech-showcase";
import { useSession, signIn, signOut } from "@/lib/auth-client";

export default function Home() {
  const { theme, toggleTheme, sidebarOpen, toggleSidebar } = useAppStore();
  const { data: session, isPending } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold text-gray-900"
            >
              Next.js Modern Stack
            </motion.h1>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                {theme === "light" ? "🌙" : "☀️"}
              </button>
              <button
                onClick={toggleSidebar}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                {sidebarOpen ? "Close" : "Open"} Sidebar
              </button>
              {isPending ? (
                <div className="px-4 py-2">Loading...</div>
              ) : session ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm">Hello, {session.user.name}</span>
                  <button
                    onClick={() => signOut()}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => signIn.social({ provider: "github" })}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-12"
        >
          <section className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to the Modern Stack
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              This project showcases the latest technologies: React Query, Framer Motion,
              Drizzle ORM with Turso, Zustand, Better Auth, PGlite, and Spline 3D.
            </p>
          </section>

          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-xl p-8"
          >
            <h3 className="text-2xl font-bold mb-6">3D Scene with Spline</h3>
            <SplineScene />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <TechShowcase />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <PGliteDemo />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <PostsDemo />
          </motion.section>

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                title: "React Query",
                description: "Powerful data fetching and caching",
                icon: "🔄",
              },
              {
                title: "Framer Motion",
                description: "Beautiful animations made simple",
                icon: "✨",
              },
              {
                title: "Drizzle ORM",
                description: "Type-safe database queries",
                icon: "🗄️",
              },
              {
                title: "Zustand",
                description: "Lightweight state management",
                icon: "🐻",
              },
              {
                title: "Better Auth",
                description: "Modern authentication solution",
                icon: "🔐",
              },
              {
                title: "PGlite",
                description: "PostgreSQL in the browser",
                icon: "🐘",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.section>
        </motion.div>
      </main>
    </div>
  );
}
