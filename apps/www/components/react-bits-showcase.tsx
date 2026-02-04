"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Sparkles, Zap, Box } from "lucide-react";
import { useState } from "react";

interface Example {
  title: string;
  url: string;
  category: "backgrounds" | "animations" | "components";
  description: string;
}

const examples: Example[] = [
  // Backgrounds
  { title: "Light Pillar", url: "https://reactbits.dev/backgrounds/light-pillar", category: "backgrounds", description: "3D light pillar effect with WebGL" },
  { title: "Silk", url: "https://reactbits.dev/backgrounds/silk", category: "backgrounds", description: "Smooth silk-like animation" },
  { title: "Grainient", url: "https://reactbits.dev/backgrounds/grainient", category: "backgrounds", description: "Grainy gradient background" },
  { title: "Grid Scan", url: "https://reactbits.dev/backgrounds/grid-scan", category: "backgrounds", description: "Animated scanning grid" },
  { title: "Beams", url: "https://reactbits.dev/backgrounds/beams", category: "backgrounds", description: "Light beam effects" },
  { title: "Lightning", url: "https://reactbits.dev/backgrounds/lightning", category: "backgrounds", description: "Electric lightning animation" },
  { title: "Galaxy", url: "https://reactbits.dev/backgrounds/galaxy", category: "backgrounds", description: "Cosmic galaxy effect" },
  { title: "Threads", url: "https://reactbits.dev/backgrounds/threads", category: "backgrounds", description: "Flowing thread patterns" },
  { title: "Hyperspeed", url: "https://reactbits.dev/backgrounds/hyperspeed", category: "backgrounds", description: "Warp speed animation" },
  { title: "Grid Distortion", url: "https://reactbits.dev/backgrounds/grid-distortion", category: "backgrounds", description: "Distorted grid effect" },
  { title: "Letter Glitch", url: "https://reactbits.dev/backgrounds/letter-glitch", category: "backgrounds", description: "Glitchy text background" },
  { title: "Liquid Chrome", url: "https://reactbits.dev/backgrounds/liquid-chrome", category: "backgrounds", description: "Metallic liquid effect" },
  
  // Animations
  { title: "Target Cursor", url: "https://reactbits.dev/animations/target-cursor", category: "animations", description: "Interactive targeting cursor" },
  { title: "Laser Flow", url: "https://reactbits.dev/animations/laser-flow", category: "animations", description: "Flowing laser animation" },
  { title: "Ghost Cursor", url: "https://reactbits.dev/animations/ghost-cursor", category: "animations", description: "Trailing ghost cursor" },
  { title: "Gradual Blur", url: "https://reactbits.dev/animations/gradual-blur", category: "animations", description: "Progressive blur effect" },
  { title: "Click Spark", url: "https://reactbits.dev/animations/click-spark", category: "animations", description: "Spark on click animation" },
  { title: "Crosshair", url: "https://reactbits.dev/animations/crosshair", category: "animations", description: "Crosshair cursor effect" },
  { title: "Image Trail", url: "https://reactbits.dev/animations/image-trail", category: "animations", description: "Image trailing effect" },
  { title: "Splash Cursor", url: "https://reactbits.dev/animations/splash-cursor", category: "animations", description: "Splash effect cursor" },
  { title: "Magnet", url: "https://reactbits.dev/animations/magnet", category: "animations", description: "Magnetic attraction effect" },
  
  // Components
  { title: "Scroll Stack", url: "https://reactbits.dev/components/scroll-stack", category: "components", description: "Stacking scroll animation" },
  { title: "Circular Gallery", url: "https://reactbits.dev/components/circular-gallery", category: "components", description: "Circular image gallery" },
  { title: "Stack", url: "https://reactbits.dev/components/stack", category: "components", description: "Card stacking component" },
  { title: "Fluid Glass", url: "https://reactbits.dev/components/fluid-glass", category: "components", description: "Glassmorphism effect" },
  { title: "Masonry", url: "https://reactbits.dev/components/masonry", category: "components", description: "Masonry grid layout" },
  { title: "Chroma Grid", url: "https://reactbits.dev/components/chroma-grid", category: "components", description: "Chromatic grid effect" },
  { title: "Folder", url: "https://reactbits.dev/components/folder?color=ffffff", category: "components", description: "Animated folder component" },
  { title: "Lanyard", url: "https://reactbits.dev/components/lanyard", category: "components", description: "Discord presence card" },
  { title: "Pixel Card", url: "https://reactbits.dev/components/pixel-card", category: "components", description: "Pixelated card effect" },
  { title: "Carousel", url: "https://reactbits.dev/components/carousel", category: "components", description: "Smooth carousel slider" },
  { title: "Elastic Slider", url: "https://reactbits.dev/components/elastic-slider", category: "components", description: "Elastic sliding animation" },
  { title: "Counter", url: "https://reactbits.dev/components/counter?value=1.63", category: "components", description: "Animated number counter" },
  { title: "Infinite Menu", url: "https://reactbits.dev/components/infinite-menu", category: "components", description: "Infinite scrolling menu" },
  { title: "Stepper", url: "https://reactbits.dev/components/stepper?step=2", category: "components", description: "Step progress indicator" },
];

const categoryIcons = {
  backgrounds: Box,
  animations: Zap,
  components: Sparkles,
};

const categoryColors = {
  backgrounds: "from-blue-500 to-cyan-500",
  animations: "from-purple-500 to-pink-500",
  components: "from-green-500 to-emerald-500",
};

export function ReactBitsShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredExamples = selectedCategory === "all" 
    ? examples 
    : examples.filter(ex => ex.category === selectedCategory);

  const categories = [
    { id: "all", label: "All", count: examples.length },
    { id: "backgrounds", label: "Backgrounds", count: examples.filter(e => e.category === "backgrounds").length },
    { id: "animations", label: "Animations", count: examples.filter(e => e.category === "animations").length },
    { id: "components", label: "Components", count: examples.filter(e => e.category === "components").length },
  ];

  return (
    <Card className="border-2 border-emerald-500/20 bg-card/50 backdrop-blur-sm overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="h-6 w-6 text-emerald-500" />
            </motion.div>
            <CardTitle className="text-2xl">React Bits Showcase</CardTitle>
          </div>
          <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500">
            {filteredExamples.length} Examples
          </Badge>
        </div>
        <CardDescription className="text-base">
          Explore our collection of stunning React animations, backgrounds, and components
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className={selectedCategory === cat.id ? "bg-gradient-to-r from-emerald-500 to-teal-500" : ""}
            >
              {cat.label}
              <Badge variant="secondary" className="ml-2">
                {cat.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Examples Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExamples.map((example, index) => {
            const Icon = categoryIcons[example.category];
            const colorClass = categoryColors[example.category];
            
            return (
              <motion.div
                key={example.url}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="h-full border-2 hover:border-emerald-500/50 transition-all duration-300 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm group cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <motion.div
                            className={`h-10 w-10 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-lg`}
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Icon className="h-5 w-5 text-white" />
                          </motion.div>
                          <Badge variant="outline" className="text-xs">
                            {example.category}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg group-hover:text-emerald-500 transition-colors">
                          {example.title}
                        </CardTitle>
                        <CardDescription className="text-sm mt-1">
                          {example.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full group-hover:bg-emerald-500/10 group-hover:text-emerald-500"
                      onClick={() => window.open(example.url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Demo
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 p-6 rounded-lg bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border-2 border-emerald-500/20 text-center"
        >
          <h3 className="text-xl font-bold mb-2">Want to use these in your project?</h3>
          <p className="text-muted-foreground mb-4">
            All components are available in the react-bits folder with full source code
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            onClick={() => window.open('https://reactbits.dev', '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Visit ReactBits.dev
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}
