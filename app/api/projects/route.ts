import { NextResponse } from "next/server";
import { DEMO_PROJECTS } from "@/lib/fixtures";
import type { Project } from "@/lib/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const demo = searchParams.get("demo") !== "false";

  if (demo || !process.env.VERCEL_API_TOKEN) {
    return NextResponse.json(DEMO_PROJECTS);
  }

  try {
    const res = await fetch("https://api.vercel.com/v9/projects?limit=20", {
      headers: { Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}` },
      next: { revalidate: 60 },
    });

    if (!res.ok) return NextResponse.json(DEMO_PROJECTS);

    const { projects } = await res.json();

    const mapped: Partial<Project>[] = projects.map((p: Record<string, unknown>) => ({
      id: p.id as string,
      name: p.name as string,
      slug: p.name as string,
      description: (p.description as string) ?? "No description",
      status: "healthy" as const,
      url: `https://${p.name}.vercel.app`,
      repoUrl: "",
      stack: ["Next.js"],
      designSystem: "unknown",
      uptimeSeconds: 0,
      uptimePct: 99.9,
      revenueCents: 0,
      revenueGrowthPct: 0,
      activeUsers: 0,
      conversionPct: 0,
      deployedAt: new Date((p.createdAt as number) ?? Date.now()),
      lastCommit: "—",
      lastCommitAt: new Date(),
      guardianEnabled: false,
      errorsLast24h: 0,
      p95LatencyMs: 0,
    }));

    return NextResponse.json(mapped);
  } catch {
    return NextResponse.json(DEMO_PROJECTS);
  }
}
