import type { APIRoute } from "astro";
import config from "../site.config";

export const GET: APIRoute = () => {
  const base = `https://${config.domain}`;
  const body = [
    `User-agent: *`,
    `Allow: /`,
    ``,
    `Sitemap: ${base}/sitemap.xml`,
    ``,
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
