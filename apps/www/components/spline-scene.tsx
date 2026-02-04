"use client";

import Spline from "@splinetool/react-spline";
import { Suspense } from "react";

export function SplineScene() {
  return (
    <Suspense fallback={<div className="w-full h-full bg-gray-100 animate-pulse" />}>
      <div className="w-full h-[600px]">
        <Spline
          scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
          className="w-full h-full"
        />
      </div>
    </Suspense>
  );
}
