import { NextResponse } from "next/server";
import { DEMO_PATTERNS } from "@/lib/fixtures";
import { promises as fs } from "fs";
import path from "path";
import os from "os";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const demo = searchParams.get("demo") !== "false";

  if (demo) return NextResponse.json(DEMO_PATTERNS);

  try {
    const registryPath = path.join(os.homedir(), ".saas-factory", "brain", "patterns.json");
    const raw = await fs.readFile(registryPath, "utf-8");
    const patterns = JSON.parse(raw);
    return NextResponse.json(patterns);
  } catch {
    // Registry not found — fall back to demo patterns
    return NextResponse.json(DEMO_PATTERNS);
  }
}
