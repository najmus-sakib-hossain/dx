"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Box, Code } from "lucide-react";
import { useState, Suspense, lazy } from "react";

// Lazy load components - ANIMATIONS
const ClickSpark = lazy(() => import("@/components/react-bits/animations/ClickSpark/ClickSpark"));
const TargetCursor = lazy(() => import("@/components/react-bits/animations/TargetCursor/TargetCursor"));
const GradualBlur = lazy(() => import("@/components/react-bits/animations/GradualBlur/GradualBlur"));
const Magnet = lazy(() => import("@/components/react-bits/animations/Magnet/Magnet"));
const GhostCursor = lazy(() => import("@/components/react-bits/animations/GhostCursor/GhostCursor"));
const Crosshair = lazy(() => import("@/components/react-bits/animations/Crosshair/Crosshair"));
const SplashCursor = lazy(() => import("@/components/react-bits/animations/SplashCursor/SplashCursor"));
const LaserFlow = lazy(() => import("@/components/react-bits/animations/LaserFlow/LaserFlow"));
const ImageTrail = lazy(() => import("@/components/react-bits/animations/ImageTrail/ImageTrail"));

// Lazy load components - BACKGROUNDS
const Galaxy = lazy(() => import("@/components/react-bits/backgrounds/Galaxy/Galaxy"));
const Lightning = lazy(() => import("@/components/react-bits/backgrounds/Lightning/Lightning"));
const GridScan = lazy(() => import("@/components/react-bits/backgrounds/GridScan/GridScan").then(m => ({ default: m.GridScan })));
const Hyperspeed = lazy(() => import("@/components/react-bits/backgrounds/Hyperspeed/Hyperspeed"));
const GridDistortion = lazy(() => import("@/components/react-bits/backgrounds/GridDistortion/GridDistortion"));
const LetterGlitch = lazy(() => import("@/components/react-bits/backgrounds/LetterGlitch/LetterGlitch"));
const LiquidChrome = lazy(() => import("@/components/react-bits/backgrounds/LiquidChrome/LiquidChrome"));
const Beams = lazy(() => import("@/components/react-bits/backgrounds/Beams/Beams"));
const Silk = lazy(() => import("@/components/react-bits/backgrounds/Silk/Silk"));
const LightPillar = lazy(() => import("@/components/react-bits/backgrounds/LightPillar/LightPillar"));
const Grainient = lazy(() => import("@/components/react-bits/backgrounds/Grainient/Grainient"));

// Lazy load components - COMPONENTS
const ScrollStack = lazy(() => import("@/components/react-bits/components/ScrollStack/ScrollStack"));
const CircularGallery = lazy(() => import("@/components/react-bits/components/CircularGallery/CircularGallery"));
const Stack = lazy(() => import("@/components/react-bits/components/Stack/Stack"));
const FluidGlass = lazy(() => import("@/components/react-bits/components/FluidGlass/FluidGlass"));
const Masonry = lazy(() => import("@/components/react-bits/components/Masonry/Masonry"));
const ChromaGrid = lazy(() => import("@/components/react-bits/components/ChromaGrid/ChromaGrid"));
const Folder = lazy(() => import("@/components/react-bits/components/Folder/Folder"));
const Lanyard = lazy(() => import("@/components/react-bits/components/Lanyard/Lanyard"));
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
  // BACKGROUNDS
  {
    id: "galaxy",
    title: "Galaxy",
    category: "backgrounds",
    description: "Cosmic galaxy effect with stars",
    component: Galaxy,
    props: {}
  },
  {
    id: "lightning",
    title: "Lightning",
    category: "backgrounds",
    description: "Electric lightning animation",
    component: Lightning,
    props: {}
  },
  {
    id: "grid-scan",
    title: "Grid Scan",
    category: "backgrounds",
    description: "Animated scanning grid",
    component: GridScan,
    props: {}
  },
  {
    id: "hyperspeed",
    title: "Hyperspeed",
    category: "backgrounds",
    description: "Warp speed animation",
    component: Hyperspeed,
    props: {}
  },
  {
    id: "grid-distortion",
    title: "Grid Distortion",
    category: "backgrounds",
    description: "Distorted grid effect",
    component: GridDistortion,
    props: {}
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
    id: "liquid-chrome",
    title: "Liquid Chrome",
    category: "backgrounds",
    description: "Metallic liquid effect",
    component: LiquidChrome,
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
    id: "silk",
    title: "Silk",
    category: "backgrounds",
    description: "Smooth silk-like animation",
    component: Silk,
    props: {}
  },
  {
    id: "light-pillar",
    title: "Light Pillar",
    category: "backgrounds",
    description: "3D light pillar effect with WebGL",
    component: LightPillar,
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
  
  // ANIMATIONS
  {
    id: "click-spark",
    title: "Click Spark",
    category: "animations",
    description: "Spark on click - Click anywhere!",
    component: ClickSpark,
    props: { sparkColor: "#3b82f6", sparkCount: 12 }
  },
  {
    id: "target-cursor",
    title: "Target Cursor",
    category: "animations",
    description: "Interactive targeting cursor",
    component: TargetCursor,
    props: { targetSelector: ".cursor-target" }
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
    id: "ghost-cursor",
    title: "Ghost Cursor",
    category: "animations",
    description: "Trailing ghost cursor",
    component: GhostCursor,
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
  {
    id: "laser-flow",
    title: "Laser Flow",
    category: "animations",
    description: "Flowing laser animation",
    component: LaserFlow,
    props: {}
  },
  {
    id: "image-trail",
    title: "Image Trail",
    category: "animations",
    description: "Image trailing effect",
    component: ImageTrail,
    props: {}
  },
  
  // COMPONENTS
  {
    id: "pixel-card",
    title: "Pixel Card",
    category: "components",
    description: "Pixelated card effect",
    component: PixelCard,
    props: {}
  },
  {
    id: "circular-gallery",
    title: "Circular Gallery",
    category: "components",
    description: "Circular image gallery",
    component: CircularGallery,
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
    id: "fluid-glass",
    title: "Fluid Glass",
    category: "components",
    description: "Glassmorphism effect",
    component: FluidGlass,
    props: {}
  },
  {
    id: "masonry",
    title: "Masonry",
    category: "components",
    description: "Masonry grid layout",
    component: Masonry,
    props: {}
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
    id: "lanyard",
    title: "Lanyard",
    category: "components",
    description: "3D Discord presence card",
    component: Lanyard,
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
  const [selectedExample, setSelectedExample] = useState<Example | null>(null);

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
            <CardTitle className="text-2xl">React Bits Live Showcase</CardTitle>
          </div>
          <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500">
            {filteredExamples.length} Live Examples
          </Badge>
        </div>
        <CardDescription className="text-base">
          Interactive demonstrations of stunning React animations, backgrounds, and components
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
            const Component = example.component;
            
            return (
              <motion.div
                key={example.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="h-full border-2 hover:border-emerald-500/50 transition-all duration-300 bg-card/50 backdrop-blur-sm group cursor-pointer overflow-hidden">
                  {/* Live Preview */}
                  <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-background/50 to-background/80">
                    <Suspense fallback={
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
                      </div>
                    }>
                      <Component {...example.props} />
                    </Suspense>
                    <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent pointer-events-none" />
                  </div>
                  
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
                      onClick={() => setSelectedExample(example)}
                    >
                      <Code className="h-4 w-4 mr-2" />
                      View Full Demo
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
          <h3 className="text-xl font-bold mb-2">All components are live and interactive!</h3>
          <p className="text-muted-foreground mb-4">
            Click on any card to see the full demo. All source code is available in the react-bits folder.
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
}
