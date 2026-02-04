"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { usePosts } from "@/lib/hooks/use-posts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function TechShowcase() {
  const { theme: appTheme, toggleTheme } = useAppStore();
  const { theme, setTheme } = useTheme();
  const { data: posts, isLoading } = usePosts();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Card className="border-2 border-purple-500/20 bg-card/50 backdrop-blur-sm overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Sparkles className="h-6 w-6 text-purple-500" />
            </motion.div>
            <CardTitle className="text-2xl">Technology Integration</CardTitle>
          </div>
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
            Live Demo
          </Badge>
        </div>
        <CardDescription className="text-base">
          All technologies working together seamlessly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between p-4 border-2 border-blue-500/20 rounded-lg bg-gradient-to-r from-blue-500/5 to-purple-500/5"
          >
            <div>
              <h4 className="font-semibold text-lg">Zustand State</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Current theme:{" "}
                <Badge variant="outline" className="ml-2">
                  {mounted ? appTheme : "loading"}
                </Badge>
              </p>
            </div>
            <Button
              onClick={toggleTheme}
              variant="outline"
              className="hover:bg-blue-500/10 hover:border-blue-500/50"
            >
              Toggle Store Theme
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between p-4 border-2 border-purple-500/20 rounded-lg bg-gradient-to-r from-purple-500/5 to-pink-500/5"
          >
            <div>
              <h4 className="font-semibold text-lg">Next Themes</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Active theme:{" "}
                <Badge variant="outline" className="ml-2">
                  {mounted ? theme : "loading"}
                </Badge>
              </p>
            </div>
            <Button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              variant="outline"
              disabled={!mounted}
              className="hover:bg-purple-500/10 hover:border-purple-500/50"
            >
              Toggle UI Theme
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 border-2 border-green-500/20 rounded-lg bg-gradient-to-r from-green-500/5 to-emerald-500/5"
          >
            <h4 className="font-semibold mb-2 text-lg">React Query Status</h4>
            <div className="flex items-center gap-2">
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Loader2 className="h-5 w-5 text-green-500" />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </motion.div>
              )}
              <p className="text-sm text-muted-foreground">
                {isLoading ? "Loading posts..." : `${posts?.length || 0} posts cached`}
              </p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 border-2 border-pink-500/20 rounded-lg bg-gradient-to-r from-pink-500/5 to-rose-500/5"
          >
            <h4 className="font-semibold mb-3 text-lg">Framer Motion</h4>
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                  whileHover={{ scale: 1.5 }}
                  className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl shadow-lg"
                />
              ))}
            </div>
          </motion.div>
        </div>

        <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />

        <div>
          <h4 className="font-semibold mb-4 text-xl">Tech Stack</h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              "Next.js 16",
              "React Query v5",
              "Framer Motion 12",
              "Drizzle ORM",
              "Zustand 5",
              "Better Auth",
              "PGlite",
              "Spline 3D",
              "shadcn/ui",
              "Tailwind CSS v4",
            ].map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 5 }}
                className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-green-500/5"
              >
                <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="font-medium">{tech}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
