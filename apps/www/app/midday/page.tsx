"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  TrendingUp, 
  FileText, 
  CreditCard, 
  BarChart3, 
  Receipt 
} from "lucide-react";
import Link from "next/link";

export default function MiddayPage() {
  const features = [
    {
      title: "Financial Overview",
      description: "Track income and expenses",
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Analytics",
      description: "Business insights and trends",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Invoicing",
      description: "Create and manage invoices",
      icon: FileText,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Transactions",
      description: "Bank account integration",
      icon: CreditCard,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Reports",
      description: "Financial reports and exports",
      icon: BarChart3,
      color: "from-indigo-500 to-blue-500",
    },
    {
      title: "Receipts",
      description: "Document management",
      icon: Receipt,
      color: "from-teal-500 to-cyan-500",
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
            <Badge variant="outline">Midday</Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Business Finance{" "}
              <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                Management
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              All-in-one platform for managing your business finances
            </p>
            <Button size="lg" asChild>
              <Link href="/midday/dashboard">
                <BarChart3 className="mr-2 h-5 w-5" />
                View Dashboard
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div
                        className={`h-12 w-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-2`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
