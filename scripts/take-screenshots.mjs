// Run: node scripts/take-screenshots.mjs
import { chromium } from "playwright";
import { mkdir } from "fs/promises";

await mkdir("screenshots", { recursive: true });

const b = await chromium.launch();
const p = await b.newPage();
await p.setViewportSize({ width: 1440, height: 900 });

await p.goto("http://localhost:3001");
await p.waitForTimeout(3000);

// 01 — Standard view
await p.screenshot({ path: "screenshots/01-standard.png" });
console.log("01 standard");

// 02 — Click a project to open drawer
await p.click("text=NuestraOferta");
await p.waitForTimeout(600);
await p.screenshot({ path: "screenshots/02-project-drawer.png" });
console.log("02 project drawer");
await p.keyboard.press("Escape");
await p.waitForTimeout(300);

// 03 — Chat bubble open
await p.click("button.glow-pulse-purple");
await p.waitForTimeout(900);
await p.screenshot({ path: "screenshots/03-chat.png" });
console.log("03 chat");
await p.click("button:has-text('CERRAR')");
await p.waitForTimeout(400);

// 04 — OPS Center tasks
await p.click("button:has-text('TASKS')");
await p.waitForTimeout(700);
await p.screenshot({ path: "screenshots/04-ops-tasks.png" });
console.log("04 ops tasks");

// 05 — OPS Center agents config (click AGENTES tab inside overlay)
const agentesBtn = p.locator(".flex.flex-col.min-h-0 button", { hasText: "AGENTES" });
await agentesBtn.first().click();
await p.waitForTimeout(600);
await p.screenshot({ path: "screenshots/05-ops-agents.png" });
console.log("05 ops agents config");

// Close OPS
await p.click("button:has-text('CERRAR')");
await p.waitForTimeout(300);

// 06 — Settings
await p.click("button:has-text('CONFIG')");
await p.waitForTimeout(600);
await p.screenshot({ path: "screenshots/06-settings.png" });
console.log("06 settings");

await b.close();
console.log("All screenshots saved.");
