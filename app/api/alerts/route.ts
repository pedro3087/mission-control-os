import { NextResponse } from "next/server";
import { DEMO_ALERTS } from "@/lib/fixtures";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const demo = searchParams.get("demo") !== "false";

  if (demo || !process.env.GITHUB_TOKEN) {
    return NextResponse.json(DEMO_ALERTS);
  }

  try {
    const owner = process.env.GITHUB_OWNER ?? "";
    const repos = (process.env.GITHUB_REPOS ?? "").split(",").map((r) => r.trim()).filter(Boolean);

    if (!owner || repos.length === 0) return NextResponse.json(DEMO_ALERTS);

    const pulls = await Promise.all(
      repos.map(async (repo) => {
        const r = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/pulls?state=open&per_page=5`,
          {
            headers: {
              Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
              Accept: "application/vnd.github+json",
            },
            next: { revalidate: 30 },
          }
        );
        if (!r.ok) return [];
        const data = await r.json();
        return (data as Record<string, unknown>[]).map((pr) => ({
          id: `gh-${pr.number}`,
          projectId: repo,
          projectName: repo,
          severity: "info" as const,
          type: "pr_opened" as const,
          title: pr.title as string,
          detail: `PR #${pr.number} by ${(pr.user as Record<string, unknown>)?.login ?? "unknown"}`,
          autoFixAvailable: false,
          prUrl: pr.html_url as string,
          prStatus: "open" as const,
          createdAt: new Date(pr.created_at as string),
          resolvedAt: null,
        }));
      })
    );

    return NextResponse.json(pulls.flat());
  } catch {
    return NextResponse.json(DEMO_ALERTS);
  }
}
