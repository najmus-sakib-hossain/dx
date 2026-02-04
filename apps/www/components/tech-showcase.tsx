"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { usePosts } from "@/lib/hooks/use-posts";

export function TechShowcase() {
  const { theme, toggleTheme } = useAppStore();
  const { data: posts, isLoading } = usePosts();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-8"
    >
      <h3 className="text-2xl font-bold mb-6">Technology Integration</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-semibold">Zustand State</h4>
            <p className="text-sm text-gray-600">Current theme: {theme}</p>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Toggle Theme
          </button>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">React Query Status</h4>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isLoading ? "bg-yellow-500" : "bg-green-500"
              }`}
            />
            <p className="text-sm text-gray-600">
              {isLoading ? "Loading posts..." : `${posts?.length || 0} posts cached`}
            </p>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Framer Motion</h4>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded"
              />
            ))}
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Tech Stack</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Next.js 16</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>React Query v5</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Framer Motion 12</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Drizzle ORM</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Zustand 5</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Better Auth</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>PGlite</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Spline 3D</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
