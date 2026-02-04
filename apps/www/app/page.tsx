"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { PGliteDemo } from "@/components/pglite-demo";
import { SplineScene } from "@/components/spline-scene";
import { PostsDemo } from "@/components/posts-demo";
import { TechShowcase } from "@/components/tech-showcase";
import { ThemeToggle } from "@/components/theme-toggle";
import { SiteNav } from "@/components/site-nav";
import { useSession, signIn, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sparkles,
  Database,
  Zap,
  Box,
  Shield,
  Layers,
  RefreshCw,
  Palette,
  Menu,
  LogOut,
  User,
  Github,
} from "lucide-react";

export default function Home() {
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const { data: session, isPending } = useSession();

  const features = [
    {
      title: "React Query",
      description: "Powerful data fetching and caching",
      icon: RefreshCw,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Framer Motion",
      description: "Beautiful animations made simple",
      icon: Sparkles,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Drizzle ORM",
      description: "Type-safe database queries",
      icon: Database,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Zustand",
      description: "Lightweight state management",
      icon: Zap,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Better Auth",
      description: "Modern authentication solution",
      icon: Shield,
      color: "from-indigo-500 to-blue-500",
    },
    {
      title: "PGlite",
      description: "PostgreSQL in the browser",
      icon: Layers,
      color: "from-teal-500 to-cyan-500",
    },
    {
      title: "Spline 3D",
      description: "Interactive 3D experiences",
      icon: Box,
      color: "from-violet-500 to-purple-500",
    },
    {
      title: "shadcn/ui",
      description: "Beautiful UI components",
      icon: Palette,
      color: "from-pink-500 to-rose-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <Menu className="h-5 w-5" />
            </Button>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500" />
              <h1 className="text-xl font-bold">Modern Stack</h1>
            </motion.div>
            <SiteNav />
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isPending ? (
              <Button variant="ghost" disabled>
                Loading...
              </Button>
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src={session.user.image} alt={session.user.name} />
                      <AvatarFallback>
                        {session.user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{session.user.name}</p>
                      <p className="text-xs text-muted-foreground">{session.user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => signIn.social({ provider: "github" })}>
                <Github className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Hero Section */}
          <section className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Badge variant="outline" className="mb-4">
                <Sparkles className="mr-1 h-3 w-3" />
                Latest Technologies 2026
              </Badge>
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
              Welcome to the{" "}
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Modern Stack
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the cutting edge of web development with Next.js 16, React Query,
              Framer Motion, Drizzle ORM, Zustand, Better Auth, PGlite, and Spline 3D.
            </p>
          </section>

          <Separator />

          {/* 3D Scene */}
          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Box className="h-6 w-6" />
                  3D Scene with Spline
                </CardTitle>
                <CardDescription>
                  Interactive 3D rendering powered by WebGL
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SplineScene />
              </CardContent>
            </Card>
          </motion.section>

          {/* Tech Showcase */}
          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <TechShowcase />
          </motion.section>

          {/* PGlite Demo */}
          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <PGliteDemo />
          </motion.section>

          {/* Posts Demo */}
          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <PostsDemo />
          </motion.section>

          {/* Features Grid */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-6 text-center">Technology Stack</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Card className="h-full">
                      <CardHeader>
                        <div
                          className={`h-12 w-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-2`}
                        >
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* Project Showcases */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-center">Project Showcases</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>shadcn/ui</CardTitle>
                  <CardDescription>Component library with themes</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/shadcn">Explore</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>TweakCN</CardTitle>
                  <CardDescription>AI-powered theme generator</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/tweakcn">Explore</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>Themux</CardTitle>
                  <CardDescription>Theme multiplexer system</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/themux">Explore</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>Midday</CardTitle>
                  <CardDescription>Business finance management</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/midday">Explore</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>React Bits</CardTitle>
                  <CardDescription>Component library collection</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/react-bits">Explore</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.section>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          <p>Built with Next.js 16 and the latest web technologies • 2026</p>
        </div>
      </footer>
    </div>
  );
}
