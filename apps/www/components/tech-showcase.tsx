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
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6" />
          <CardTitle>Technology Integration</CardTitle>
        </div>
        <CardDescription>
          All technologies working together seamlessly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-semibold">Zustand State</h4>
              <p className="text-sm text-muted-foreground">
                Current theme: <Badge variant="outline">{mounted ? appTheme : "loading"}</Badge>
              </p>
            </div>
            <Button onClick={toggleTheme} variant="outline">
              Toggle Store Theme
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-semibold">Next Themes</h4>
              <p className="text-sm text-muted-foreground">
                Active theme: <Badge variant="outline">{mounted ? theme : "loading"}</Badge>
              </p>
            </div>
            <Button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              variant="outline"
              disabled={!mounted}
            >
              Toggle UI Theme
            </Button>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-2">React Query Status</h4>
            <div className="flex items-center gap-2">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              )}
              <p className="text-sm text-muted-foreground">
                {isLoading ? "Loading posts..." : `${posts?.length || 0} posts cached`}
              </p>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-3">Framer Motion</h4>
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
                  className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="font-semibold mb-3">Tech Stack</h4>
          <div className="grid grid-cols-2 gap-2">
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
            ].map((tech) => (
              <div key={tech} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
