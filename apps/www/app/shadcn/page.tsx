"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Blocks, Palette, FileCode, BookOpen } from "lucide-react";
import Link from "next/link";

export default function ShadcnPage() {
  const sections = [
    {
      title: "Components",
      description: "Beautifully designed components",
      icon: Blocks,
      href: "/shadcn/docs",
    },
    {
      title: "Themes",
      description: "Customizable color themes",
      icon: Palette,
      href: "/shadcn/themes",
    },
    {
      title: "Blocks",
      description: "Pre-built component blocks",
      icon: FileCode,
      href: "/shadcn/blocks",
    },
    {
      title: "Examples",
      description: "Full page examples",
      icon: BookOpen,
      href: "/shadcn/examples",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <Badge variant="outline">shadcn/ui</Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Build Your Component Library
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Beautifully designed components built with Radix UI and Tailwind CSS
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <Icon className="h-8 w-8 mb-2" />
                      <CardTitle>{section.title}</CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={section.href}>Explore</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Component Showcase</CardTitle>
              <CardDescription>
                Explore the full collection of components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Component gallery</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
