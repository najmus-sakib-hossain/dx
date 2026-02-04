"use client";

import Spline from "@splinetool/react-spline";
import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function SplineScene() {
  return (
    <Suspense
      fallback={
        <Card>
          <CardContent className="flex items-center justify-center h-[600px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </CardContent>
        </Card>
      }
    >
      <div className="w-full h-[600px] rounded-lg overflow-hidden border">
        <Spline
          scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
          className="w-full h-full"
        />
      </div>
    </Suspense>
  );
}
