import { updateProgress } from "@/lib/progress";
import { NextResponse } from "next/server";

// Simple GET endpoint to return current progress
export async function GET() {
  const progress = updateProgress;
  return NextResponse.json(progress);
}
