import { copyFileSync, existsSync, writeFileSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Post-build step:
 *  1. Alias sitemap-index.xml → sitemap.xml (canonical alias).
 *  2. Emit dist/_redirects with CF-Pages canonical rules read from astro.config.mjs.
 *     - www.<host>/*  → https://<host>/:splat (301, canonical apex)
 *     - common typo paths → /
 */

const root = resolve(import.meta.dirname, "..");
const indexPath = resolve(root, "dist/sitemap-index.xml");
const aliasPath = resolve(root, "dist/sitemap.xml");

if (!existsSync(indexPath)) {
  console.error(`✗ post-build: ${indexPath} not found — did @astrojs/sitemap run?`);
  process.exit(1);
}

copyFileSync(indexPath, aliasPath);
console.log(`✓ post-build: copied sitemap-index.xml → sitemap.xml (canonical alias)`);

// --- canonical redirects ---
const cfgPath = resolve(root, "astro.config.mjs");
let host = null;
try {
  const cfgText = readFileSync(cfgPath, "utf8");
  const m = cfgText.match(/site:\s*"https?:\/\/([^"/]+)"/);
  host = m?.[1] ?? null;
} catch {}
if (!host || host === "demo.example") {
  console.warn(`! post-build: skip _redirects — astro.config.mjs site is missing or demo`);
} else {
  const redirects = [
    `# Canonical: force apex (non-www)`,
    `https://www.${host}/*  https://${host}/:splat  301!`,
    `http://www.${host}/*   https://${host}/:splat  301!`,
    `http://${host}/*       https://${host}/:splat  301!`,
    ``,
    `# Common typos / non-existent legacy paths → home`,
    `/public/*       /  301`,
    `/wp-admin/*     /  301`,
    `/wp-login.php   /  301`,
    `/index.html     /  301`,
    `/index.php      /  301`,
    `/home           /  301`,
    `/home/          /  301`,
    ``,
    `# Trailing /index removed for clean URLs`,
    `/*/index        /:splat/  301`,
    ``,
  ].join("\n");
  writeFileSync(resolve(root, "dist/_redirects"), redirects);
  console.log(`✓ post-build: wrote dist/_redirects with canonical rules for ${host}`);
}
