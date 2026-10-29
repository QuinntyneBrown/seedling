#!/usr/bin/env node
// docs/mocks/.verify.mjs — renders every mock page in Chromium at five widths
// (320 / 390 / 820 / 1440 / 1920) and, per page x width, requires:
//   1. no failed or >= 400 subresource (fonts from Google excepted when offline)
//   2. zero console errors and zero page errors
//   3. no horizontal overflow: scrollWidth <= innerWidth and no visible element
//      past the right edge of the viewport
//   4. shell chrome: app pages show .bottom-nav below 720px and .topbar from
//      720px, never both, with exactly one aria-current="page" link in the
//      visible nav (none on _shell); bare pages have neither
//   5. fonts settled (document.fonts.ready) before any screenshot
//
// Screenshots: with --capture, full-page PNGs land in ./screenshots/
// (<slug>.<mobile|tablet|desktop>.png at 390 / 820 / 1440).
//
//   node docs/mocks/.verify.mjs
//   node docs/mocks/.verify.mjs --capture
//
// Playwright is resolved from e2e/node_modules, else from the global install.

import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
let chromium;
try {
  ({ chromium } = createRequire(new URL("../../e2e/package.json", import.meta.url))("playwright"));
} catch {
  ({ chromium } = createRequire(import.meta.url)("playwright"));
}

const WIDTHS = [320, 390, 820, 1440, 1920];
const CAPTURE = { 390: "mobile", 820: "tablet", 1440: "desktop" };
const capture = process.argv.includes("--capture");
const pages = [
  { file: "index.html", shell: "bare" },
  ...readdirSync(join(ROOT, "pages"))
    .filter((f) => f.endsWith(".html"))
    .sort()
    .map((f) => ({
      file: `pages/${f}`,
      shell: /data-shell="app"/.test(readFileSync(join(ROOT, "pages", f), "utf8")) ? "app" : "bare",
    })),
];

if (capture) await mkdir(join(ROOT, "screenshots"), { recursive: true });
const browser = await chromium.launch();
let failures = 0;
const fail = (where, msg) => {
  failures++;
  console.log(`${where}  ${msg}`);
};

for (const p of pages) {
  for (const width of WIDTHS) {
    const where = `${p.file}@${width}`;
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    page.on("console", (m) => m.type() === "error" && !/fonts\.(googleapis|gstatic)/.test(m.text()) && fail(where, `console: ${m.text()}`));
    page.on("pageerror", (e) => fail(where, `page error: ${e.message}`));
    page.on("requestfailed", (r) => !/fonts\.(googleapis|gstatic)|example\.com/.test(r.url()) && fail(where, `failed: ${r.url()}`));
    await page.goto(pathToFileURL(join(ROOT, p.file)).href, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);

    const r = await page.evaluate(() => {
      const vw = window.innerWidth;
      const over = [];
      for (const el of document.body.querySelectorAll("*")) {
        const s = getComputedStyle(el);
        if (s.display === "none" || s.visibility === "hidden" || el.closest(".visually-hidden, [aria-hidden='true']")) continue;
        const b = el.getBoundingClientRect();
        if (b.width && b.right > vw + 1) {
          let clipped = false;
          for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
            const o = getComputedStyle(a).overflowX;
            if (o !== "visible") { clipped = true; break; }
          }
          if (!clipped) over.push(`${el.tagName.toLowerCase()}.${[...el.classList].join(".")} (${Math.round(b.right - vw)}px)`);
        }
      }
      const vis = (sel) => [...document.querySelectorAll(sel)].some((e) => e.getClientRects().length && getComputedStyle(e).display !== "none");
      const cur = [...document.querySelectorAll("[aria-current='page']")].filter((e) => e.getClientRects().length).length;
      return { sw: document.documentElement.scrollWidth, vw, over: over.slice(0, 3), top: vis(".topbar"), bottom: vis(".bottom-nav"), cur, slug: document.body.dataset.page };
    });
    if (r.sw > r.vw) fail(where, `horizontal overflow: scrollWidth ${r.sw} > ${r.vw}`);
    if (r.over.length) fail(where, `past the right edge: ${r.over.join(", ")}`);
    if (p.shell === "app") {
      const wantTop = width >= 720;
      if (r.top !== wantTop || r.bottom === wantTop) fail(where, `shell chrome: topbar ${r.top}, bottom-nav ${r.bottom}`);
      const wantCur = r.slug === "_shell" ? 0 : 1;
      if (r.cur !== wantCur) fail(where, `${r.cur} visible aria-current="page" links, want ${wantCur}`);
    } else if (r.top || r.bottom) fail(where, "bare page shows app chrome");

    if (capture && CAPTURE[width]) {
      const slug = p.file === "index.html" ? "index" : p.file.slice(6, -5);
      if (slug !== "index" || width === 1440) {
        await page.screenshot({ path: join(ROOT, "screenshots", `${slug}.${CAPTURE[width]}.png`), fullPage: true, animations: "disabled" });
      }
    }
    await page.close();
  }
}
await browser.close();
console.log(`verify: ${pages.length} page(s) x ${WIDTHS.length} widths, ${failures} failure(s)`);
process.exit(failures ? 1 : 0);
