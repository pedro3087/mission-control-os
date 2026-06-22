import { NextRequest, NextResponse } from "next/server";
import { matchDemoChatResponse } from "@/lib/fixtures";
import { buildSystemPrompt } from "@/lib/agent-context";
import type { AgentType, Project, BrainPattern, GuardianAlert } from "@/lib/types";
import { DEMO_PATTERNS, DEMO_ALERTS } from "@/lib/fixtures";

interface ChatRequestBody {
  messages: { role: "user" | "assistant"; content: string }[];
  agentType: AgentType;
  context?: {
    projects: Project[];
  };
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ChatRequestBody;
  const { messages, agentType, context } = body;

  const lastUserMessage = messages.findLast((m) => m.role === "user")?.content ?? "";

  // ── Demo / fallback ──────────────────────────────────────────
  const apiKey = process.env.ANTHROPIC_API_KEY ?? process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    // No API key configured — simulate a smart demo response
    await sleep(300);
    const response = matchDemoChatResponse(agentType, lastUserMessage);
    return NextResponse.json({ response });
  }

  // ── Real mode — Anthropic Messages API ──────────────────────
  try {
    const systemPrompt = buildSystemPrompt(agentType, {
      projects: context?.projects ?? [],
      alerts: DEMO_ALERTS as GuardianAlert[],
      patterns: DEMO_PATTERNS as BrainPattern[],
    });

    const isOpenRouter = !!process.env.OPENROUTER_API_KEY && !process.env.ANTHROPIC_API_KEY;
    const baseUrl = isOpenRouter
      ? "https://openrouter.ai/api/v1/chat/completions"
      : "https://api.anthropic.com/v1/messages";

    let responseText: string;

    if (isOpenRouter) {
      const res = await fetch(baseUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.CHAT_MODEL ?? "anthropic/claude-haiku-4-5",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          max_tokens: 300,
        }),
      });
      const data = (await res.json()) as { choices: { message: { content: string } }[] };
      responseText = data.choices[0]?.message?.content ?? "Sin respuesta.";
    } else {
      // Anthropic native API
      const res = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.CHAT_MODEL ?? "claude-haiku-4-5-20251001",
          system: systemPrompt,
          messages,
          max_tokens: 300,
        }),
      });
      const data = (await res.json()) as { content: { type: string; text: string }[] };
      responseText = data.content.find((c) => c.type === "text")?.text ?? "Sin respuesta.";
    }

    return NextResponse.json({ response: responseText });
  } catch {
    // Fallback a demo si la API falla
    const response = matchDemoChatResponse(agentType, lastUserMessage);
    return NextResponse.json({ response });
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
