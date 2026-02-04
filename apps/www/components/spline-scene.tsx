"use client";

import Spline from "@splinetool/react-spline";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export function SplineScene() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[600px] bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-lg">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <Loader2 className="h-12 w-12 text-blue-500" />
          </motion.div>
        </div>
      }
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full h-[600px] rounded-lg overflow-hidden border-2 border-blue-500/20 shadow-2xl shadow-blue-500/10"
      >
        <Spline
          scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
          className="w-full h-full"
        />
      </motion.div>
    </Suspense>
  );
}
