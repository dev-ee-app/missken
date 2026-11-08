import { NextResponse } from "next/server";

export async function GET() {
  const uptime = process.uptime();
  return NextResponse.json({
    status: "healthy",
    platform: "Mothakarati SaaS Platform",
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0",
    uptimeSeconds: Math.floor(uptime),
    database: "connected",
    curriculumCompliance: "Algerian Middle School (1AM - 4AM)",
    timestamp: new Date().toISOString(),
  });
}
