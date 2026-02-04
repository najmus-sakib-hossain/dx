"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Box, Code, ChevronDown, ChevronUp } from "lucide-react";
import { useState, Suspense, lazy, useRef } from "react";

// Lazy load components - ANIMATIONS
const ClickSpark = lazy(() => import("@/components/react-bits/animations/ClickSpark/ClickSpark"));
const GradualBlur = lazy(() => import("@/components/react-bits/animations/GradualBlur/GradualBlur"));
const Magnet = lazy(() => import("@/components/react-bits/animations/Magnet/Magnet"));
const Crosshair = lazy(() => import("@/components/react-bits/animations/Crosshair/Crosshair"));
const SplashCursor = lazy(() => import("@/components/react-bits/animations/SplashCursor/SplashCursor"));

// Lazy load components - BACKGROUNDS
const GridScan = lazy(() => import("@/components/react-bits/backgrounds/GridScan/GridScan").then(m => ({ default: m.GridScan })));
const GridDistortion = lazy(() => import("@/components/react-bits/backgrounds/GridDistortion/GridDistortion"));
const LetterGlitch = lazy(() => import("@/components/react-bits/backgrounds/LetterGlitch/LetterGlitch"));
const Beams = lazy(() => import("@/components/react-bits/backgrounds/Beams/Beams"));
const Grainient = lazy(() => import("@/components/react-bits/backgrounds/Grainient/Grainient"));

// Lazy load components - COMPONENTS
const ScrollStack = lazy(() => import("@/components/react-bits/components/ScrollStack/ScrollStack"));
const Stack = lazy(() => import("@/components/react-bits/components/Stack/Stack"));
const Masonry = lazy(() => import("@/components/react-bits/components/Masonry/Masonry"));
const ChromaGrid = lazy(() => import("@/components/react-bits/components/ChromaGrid/ChromaGrid"));
const Folder = lazy(() => import("@/components/react-bits/components/Folder/Folder"));
const PixelCard = lazy(() => import("@/components/react-bits/components/PixelCard/PixelCard"));
const Carousel = lazy(() => import("@/components/react-bits/components/Carousel/Carousel"));
const ElasticSlider = lazy(() => import("@/components/react-bits/components/ElasticSlider/ElasticSlider"));
const Counter = lazy(() => import("@/components/react-bits/components/Counter/Counter"));
const InfiniteMenu = lazy(() => import("@/components/react-bits/components/InfiniteMenu/InfiniteMenu"));
const Stepper = lazy(() => import("@/components/react-bits/components/Stepper/Stepper"));

interface Example {
  id: string;
  title: string;
  category: "backgrounds" | "animations" | "components";
  description: string;
  component: React.LazyExoticComponent<any>;
  props?: any;
}

const examples: Example[] = [
  // BACKGROUNDS (lightweight only - no WebGL)
  {
    id: "grid-scan",
    title: "Grid Scan",
    category: "backgrounds",
    description: "Animated scanning grid",
    component: GridScan,
    props: {}
  },
  {
    id: "grid-distortion",
    title: "Grid Distortion",
    category: "backgrounds",
    description: "Distorted grid effect",
    component: GridDistortion,
    props: { imageSrc: "https://picsum.photos/800/600" }
  },
  {
    id: "letter-glitch",
    title: "Letter Glitch",
    category: "backgrounds",
    description: "Glitchy text background",
    component: LetterGlitch,
    props: {}
  },
  {
    id: "beams",
    title: "Beams",
    category: "backgrounds",
    description: "Light beam effects",
    component: Beams,
    props: {}
  },
  {
    id: "grainient",
    title: "Grainient",
    category: "backgrounds",
    description: "Grainy gradient background",
    component: Grainient,
    props: {}
  },
  
  // ANIMATIONS (lightweight only)
  {
    id: "click-spark",
    title: "Click Spark",
    category: "animations",
    description: "Spark on click - Click anywhere!",
    component: ClickSpark,
    props: { sparkColor: "#10b981", sparkCount: 12 }
  },
  {
    id: "gradual-blur",
    title: "Gradual Blur",
    category: "animations",
    description: "Progressive blur effect",
    component: GradualBlur,
    props: { position: "bottom", strength: 2 }
  },
  {
    id: "magnet",
    title: "Magnet",
    category: "animations",
    description: "Magnetic attraction effect",
    component: Magnet,
    props: {}
  },
  {
    id: "crosshair",
    title: "Crosshair",
    category: "animations",
    description: "Crosshair cursor effect",
    component: Crosshair,
    props: {}
  },
  {
    id: "splash-cursor",
    title: "Splash Cursor",
    category: "animations",
    description: "Splash effect cursor",
    component: SplashCursor,
    props: {}
  },
  
  // COMPONENTS (lightweight only - no heavy 3D)
  {
    id: "pixel-card",
    title: "Pixel Card",
    category: "components",
    description: "Pixelated card effect",
    component: PixelCard,
    props: {}
  },
  {
    id: "stack",
    title: "Stack",
    category: "components",
    description: "Card stacking component",
    component: Stack,
    props: {}
  },

  {
    id: "masonry",
    title: "Masonry",
    category: "components",
    description: "Masonry grid layout",
    component: Masonry,
    props: {
      items: [
        { id: 1, img: "https://picsum.photos/400/300", height: 300 },
        { id: 2, img: "https://picsum.photos/400/400", height: 400 },
        { id: 3, img: "https://picsum.photos/400/500", height: 500 },
        { id: 4, img: "https://picsum.photos/400/350", height: 350 },
      ]
    }
  },
  {
    id: "chroma-grid",
    title: "Chroma Grid",
    category: "components",
    description: "Chromatic grid effect",
    component: ChromaGrid,
    props: {}
  },
  {
    id: "folder",
    title: "Folder",
    category: "components",
    description: "Animated folder component",
    component: Folder,
    props: {}
  },
  {
    id: "carousel",
    title: "Carousel",
    category: "components",
    description: "Smooth carousel slider",
    component: Carousel,
    props: {}
  },
  {
    id: "elastic-slider",
    title: "Elastic Slider",
    category: "components",
    description: "Elastic sliding animation",
    component: ElasticSlider,
    props: {}
  },
  {
    id: "counter",
    title: "Counter",
    category: "components",
    description: "Animated number counter",
    component: Counter,
    props: { value: 1.63 }
  },
  {
    id: "infinite-menu",
    title: "Infinite Menu",
    category: "components",
    description: "Infinite scrolling menu",
    component: InfiniteMenu,
    props: {}
  },
  {
    id: "stepper",
    title: "Stepper",
    category: "components",
    description: "Step progress indicator",
    component: Stepper,
    props: { step: 2 }
  },
  {
    id: "scroll-stack",
    title: "Scroll Stack",
    category: "components",
    description: "Stacking scroll animation",
    component: ScrollStack,
    props: {}
  },
];

const categoryColors = {
  backgrounds: "from-blue-500 to-cyan-500",
  animations: "from-purple-500 to-pink-500",
  components: "from-green-500 to-emerald-500",
};

const categoryIcons = {
  backgrounds: Box,
  animations: Zap,
  components: Sparkles,
};

export function ReactBitsLiveShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredExamples = selectedCategory === "all" 
    ? examples 
    : examples.filter(ex => ex.category === selectedCategory);

  const categories = [
    { id: "all", label: "All", count: examples.length },
    { id: "backgrounds", label: "Backgrounds", count: examples.filter(e => e.category === "backgrounds").length },
    { id: "animations", label: "Animations", count: examples.filter(e => e.category === "animations").length },
    { id: "components", label: "Components", count: examples.filter(e => e.category === "components").length },
  ];

  const scrollToSection = (index: number) => {
    const section = document.getElementById(`react-bit-${filteredExamples[index]?.id}`);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setCurrentIndex(index);
    }
  };

  const nextSection = () => {
    if (currentIndex < filteredExamples.length - 1) {
      scrollToSection(currentIndex + 1);
    }
  };

  const prevSection = () => {
    if (currentIndex > 0) {
      scrollToSection(currentIndex - 1);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Fixed Header */}
      <div className="sticky top-16 z-40 w-full bg-background/95 backdrop-blur-xl border-b border-emerald-500/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
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
              <div>
                <h2 className="text-2xl font-bold">React Bits Live Showcase</h2>
                <p className="text-sm text-muted-foreground">
                  {currentIndex + 1} / {filteredExamples.length} - {filteredExamples[currentIndex]?.title}
                </p>
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setCurrentIndex(0);
                  }}
                  className={selectedCategory === cat.id ? "bg-gradient-to-r from-emerald-500 to-teal-500" : ""}
                >
                  {cat.label}
                  <Badge variant="secondary" className="ml-2">
                    {cat.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Full-Height Sections */}
      <div className="w-full">
        {filteredExamples.map((example, index) => {
          const Icon = categoryIcons[example.category];
          const colorClass = categoryColors[example.category];
          const Component = example.component;
          
          return (
            <section
              key={example.id}
              id={`react-bit-${example.id}`}
              className="relative w-full min-h-screen flex items-center justify-center"
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* Background Component */}
              <div className="absolute inset-0 w-full h-full">
                <Suspense fallback={
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-background/50 to-background/80">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      <div className="h-12 w-12 border-4 border-emerald-500 border-t-transparent rounded-full" />
                    </motion.div>
                  </div>
                }>
                  <Component {...example.props} />
                </Suspense>
              </div>

              {/* Info Overlay */}
              <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6 }}
                  className="bg-background/80 backdrop-blur-xl border-2 border-emerald-500/30 rounded-2xl p-8 shadow-2xl"
                >
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <motion.div
                      className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-xl`}
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </motion.div>
                  </div>
                  
                  <Badge variant="outline" className="mb-3">
                    {example.category}
                  </Badge>
                  
                  <h3 className="text-4xl font-bold mb-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                    {example.title}
                  </h3>
                  
                  <p className="text-lg text-muted-foreground mb-6">
                    {example.description}
                  </p>

                  <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
                    <Code className="h-4 w-4" />
                    <span>Live Interactive Demo</span>
                  </div>
                </motion.div>
              </div>

              {/* Navigation Arrows */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevSection}
                  disabled={index === 0}
                  className="h-12 w-12 rounded-full bg-background/80 backdrop-blur-xl border-emerald-500/30 hover:bg-emerald-500/10 disabled:opacity-30"
                >
                  <ChevronUp className="h-6 w-6" />
                </Button>
                
                <div className="px-4 py-2 rounded-full bg-background/80 backdrop-blur-xl border border-emerald-500/30">
                  <span className="text-sm font-medium">
                    {index + 1} / {filteredExamples.length}
                  </span>
                </div>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextSection}
                  disabled={index === filteredExamples.length - 1}
                  className="h-12 w-12 rounded-full bg-background/80 backdrop-blur-xl border-emerald-500/30 hover:bg-emerald-500/10 disabled:opacity-30"
                >
                  <ChevronDown className="h-6 w-6" />
                </Button>
              </div>
            </section>
          );
        })}
      </div>

      {/* Scroll Indicator for First Section */}
      {currentIndex === 0 && (
        <motion.div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          <ChevronDown className="h-8 w-8 text-emerald-500/60" />
        </motion.div>
      )}
    </div>
  );
}
