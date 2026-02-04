"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { PGliteDemo } from "@/components/pglite-demo";
import { SplineScene } from "@/components/spline-scene";
import { PostsDemo } from "@/components/posts-demo";
import { TechShowcase } from "@/components/tech-showcase";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSession, signIn, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  ArrowDown,
} from "lucide-react";
import { useRef } from "react";

export default function Home() {
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const { data: session, isPending } = useSession();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

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
    <div ref={containerRef} className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-cyan-500/10 via-teal-500/10 to-emerald-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <Menu className="h-5 w-5" />
            </Button>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <motion.div
                className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              />
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Modern Stack
              </h1>
            </motion.div>
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
                <DropdownMenuContent align="end" className="w-56">
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
              <Button
                onClick={() => signIn.social({ provider: "github" })}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <Github className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl px-4 py-12 md:py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-16 md:space-y-24"
        >
          {/* Hero Section */}
          <motion.section
            style={{ opacity: heroOpacity, scale: heroScale }}
            className="relative text-center space-y-8 py-12 md:py-20"
          >
            <motion.div variants={itemVariants}>
              <Badge
                variant="outline"
                className="mb-6 px-4 py-2 text-sm border-blue-500/50 bg-blue-500/10"
              >
                <Sparkles className="mr-2 h-4 w-4 text-blue-500" />
                Latest Technologies 2026
              </Badge>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight"
            >
              Welcome to the{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Modern Stack
                </span>
                <motion.span
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                />
              </span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
            >
              Experience the cutting edge of web development with Next.js 16, React Query,
              Framer Motion, Drizzle ORM, Zustand, Better Auth, PGlite, and Spline 3D.
            </motion.p>

            <motion.div variants={itemVariants} className="flex justify-center gap-4 pt-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg shadow-blue-500/25"
              >
                Get Started
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex justify-center pt-8"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <ArrowDown className="h-6 w-6 text-muted-foreground" />
            </motion.div>
          </motion.section>

          {/* 3D Scene */}
          <motion.section variants={itemVariants} className="relative">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-2 border-blue-500/20 bg-card/50 backdrop-blur-sm overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-2xl">
                        <Box className="h-6 w-6 text-blue-500" />
                        3D Scene with Spline
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Interactive 3D rendering powered by WebGL
                      </CardDescription>
                    </div>
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-500">
                      Interactive
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <SplineScene />
                </CardContent>
              </Card>
            </motion.div>
          </motion.section>

          {/* Tech Showcase */}
          <motion.section
            variants={itemVariants}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <TechShowcase />
          </motion.section>

          {/* Features Grid */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="text-center space-y-4">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
              >
                Technology Stack
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground text-lg max-w-2xl mx-auto"
              >
                Built with the most powerful and modern tools in the ecosystem
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className="h-full border-2 hover:border-blue-500/50 transition-all duration-300 bg-card/50 backdrop-blur-sm group">
                      <CardHeader>
                        <motion.div
                          className={`h-14 w-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}
                          whileHover={{ rotate: 5, scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Icon className="h-7 w-7 text-white" />
                        </motion.div>
                        <CardTitle className="text-xl group-hover:text-blue-500 transition-colors">
                          {feature.title}
                        </CardTitle>
                        <CardDescription className="text-base">
                          {feature.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* PGlite Demo */}
          <motion.section
            variants={itemVariants}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <PGliteDemo />
          </motion.section>

          {/* Posts Demo */}
          <motion.section
            variants={itemVariants}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <PostsDemo />
          </motion.section>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="border-t mt-20 bg-card/30 backdrop-blur-sm"
      >
        <div className="container mx-auto max-w-7xl px-4 py-12">
          <div className="text-center space-y-4">
            <motion.div
              className="flex justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500" />
            </motion.div>
            <p className="text-muted-foreground">
              Built with Next.js 16 and the latest web technologies
            </p>
            <p className="text-sm text-muted-foreground/60">© 2026 Modern Stack</p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
