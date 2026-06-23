/* Post-build prerender.
   AI search crawlers (GPTBot, PerplexityBot, ClaudeBot, …) and many social
   scrapers do NOT execute JavaScript, so a client-rendered SPA looks empty to
   them. This script serves the freshly-built dist/, loads it in headless
   Chrome with prefers-reduced-motion forced ON — which makes the loader exit
   instantly and skips every entrance animation, so nothing is left at
   opacity:0 — then snapshots the rendered #root markup back into
   dist/index.html. The client still hydrates/renders normally on real visits.

   Failure is non-fatal: if Chrome can't launch (e.g. a constrained CI box),
   we warn and leave the build as-is. The static <noscript> block in index.html
   remains as the floor. */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { preview } from "vite";
import puppeteer from "puppeteer";

const PORT = 4183;
const INDEX = resolve("dist/index.html");

async function run() {
  const server = await preview({ preview: { port: PORT, strictPort: true } });
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.emulateMediaFeatures([
      { name: "prefers-reduced-motion", value: "reduce" },
    ]);
    await page.goto(`http://localhost:${PORT}/`, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // Wait until the app has rendered real content and the loader is gone.
    await page.waitForFunction(
      () => {
        const root = document.getElementById("root");
        const loaderGone = !document.querySelector(
          '[aria-label="Loading portfolio"]'
        );
        return root && root.innerText.includes("Garv") && loaderGone;
      },
      { timeout: 30000 }
    );

    const rootHtml = await page.$eval("#root", (el) => el.innerHTML);
    if (!rootHtml || rootHtml.length < 500) {
      throw new Error(`Prerendered #root looks too small (${rootHtml.length} chars)`);
    }

    let html = readFileSync(INDEX, "utf8");
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root">${rootHtml}</div>`
    );
    writeFileSync(INDEX, html, "utf8");
    console.log(
      `✓ prerendered ${rootHtml.length.toLocaleString()} chars of #root into dist/index.html`
    );
  } finally {
    if (browser) await browser.close();
    await server.httpServer.close();
  }
}

run().catch((err) => {
  console.warn("⚠ prerender skipped:", err.message);
  console.warn("  Build is intact; the <noscript> fallback still applies.");
  process.exit(0); // never fail the deploy on prerender trouble
});
