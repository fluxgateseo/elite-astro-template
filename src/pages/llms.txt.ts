import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import config from "../site.config";

/**
 * llms.txt — concise, AI-readable site manifest (llmstxt.org). Lists the
 * primary pages with one-line summaries so LLM crawlers can answer questions
 * about the site without scraping every URL. Generated at build time from
 * the same site.config used everywhere else.
 */
export const GET: APIRoute = async () => {
  const base = `https://${config.domain}`;
  const lines: string[] = [];
  lines.push(`# ${config.name}`);
  lines.push("");
  if (config.tagline) lines.push(`> ${config.tagline}`);
  if (config.description) {
    lines.push("");
    lines.push(config.description.split("\n")[0].trim());
  }

  const serviziMenuEnabled = !!config.pages?.serviziMenu?.enabled;
  const serviziMenuLabel = config.pages?.serviziMenu?.label ?? "Menu / Servizi";
  const corePages: { label: string; path: string; enabled: boolean; desc: string }[] = [
    { label: "Home", path: "/", enabled: true, desc: `Homepage di ${config.name}` },
    { label: "Chi siamo", path: "/chi-siamo/", enabled: !!config.pages?.chiSiamo, desc: "Storia e missione" },
    { label: serviziMenuLabel, path: "/menu/", enabled: serviziMenuEnabled, desc: "Offerta e listino" },
    { label: "Galleria", path: "/galleria/", enabled: !!config.pages?.galleria, desc: "Foto del locale e dei piatti" },
    { label: "Eventi", path: "/eventi/", enabled: !!config.pages?.eventi, desc: "Eventi privati e ricorrenze" },
    { label: "FAQ", path: "/faq/", enabled: !!config.pages?.faq, desc: "Domande frequenti" },
    { label: "Contatti", path: "/contatti/", enabled: !!config.pages?.contatti, desc: `Telefono, email, indirizzo` },
  ];
  const enabledCore = corePages.filter((p) => p.enabled);
  if (enabledCore.length > 0) {
    lines.push("");
    lines.push("## Pagine principali");
    lines.push("");
    for (const p of enabledCore) {
      lines.push(`- [${p.label}](${base}${p.path}): ${p.desc}`);
    }
  }

  if (config.pages?.blog) {
    let articoli: Awaited<ReturnType<typeof getCollection>> = [];
    try {
      articoli = await getCollection("articoli");
    } catch {}
    if (articoli.length > 0) {
      lines.push("");
      lines.push("## Blog");
      lines.push("");
      const sorted = articoli
        .slice()
        .sort((a, b) => {
          const da = a.data && typeof a.data === "object" && "date" in a.data ? new Date((a.data as { date: string }).date).getTime() : 0;
          const db = b.data && typeof b.data === "object" && "date" in b.data ? new Date((b.data as { date: string }).date).getTime() : 0;
          return db - da;
        });
      for (const a of sorted) {
        const data = a.data as { title?: string; excerpt?: string; description?: string; slug?: string };
        const slug = data.slug ?? a.id.replace(/\.md$/, "");
        const summary = (data.excerpt ?? data.description ?? "").split("\n")[0].trim();
        lines.push(`- [${data.title ?? slug}](${base}/blog/${slug}/)${summary ? `: ${summary}` : ""}`);
      }
    }
  }

  lines.push("");
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
