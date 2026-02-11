import { NextResponse } from "next/server";

export const runtime = "edge";

/**
 * GET /api/health — Health check endpoint
 *
 * Returns service status for monitoring and load balancers.
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "dx-www",
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_APP_VERSION ?? "0.0.0-dev",
  });
}
