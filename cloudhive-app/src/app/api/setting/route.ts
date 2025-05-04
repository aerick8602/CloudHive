import { NextResponse } from "next/server";
import redis from "@/lib/cache/redis.config";

const VALID_MODES = ["production", "development", "maintenance"] as const;
type AppMode = (typeof VALID_MODES)[number];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("mode");
  const password = url.searchParams.get("password");

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  // 1. Check if password is valid
  if (!password || password !== ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Unauthorized: Incorrect password" },
      { status: 403 }
    );
  }

  // 2. Validate mode against allowed values
  if (!mode || !VALID_MODES.includes(mode as AppMode)) {
    return NextResponse.json(
      {
        error:
          "Bad Request: 'mode' must be one of 'production', 'development', or 'maintenance'",
      },
      { status: 400 }
    );
  }

  // 3. Store mode in Redis
  try {
    await redis.set("appMode", mode);
    return NextResponse.json({ message: "App mode set successfully", mode });
  } catch (error) {
    console.error("Redis error:", error);
    return NextResponse.json(
      { error: "Internal Server Error: Failed to set mode" },
      { status: 500 }
    );
  }
}
