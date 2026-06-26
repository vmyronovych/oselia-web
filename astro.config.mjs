// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// ─────────────────────────────────────────────────────────────────────────────
// Deployment target: GitHub Pages.
//
// For a *project* page the site lives under https://<user>.github.io/<repo>/, so
// `base` must be the repo name. If you later put it on a custom domain or a
// user/org page (https://<user>.github.io/), set SITE to that origin and clear
// BASE (set it to '/'). The deploy workflow passes neither, so the defaults
// below are what production uses.
// ─────────────────────────────────────────────────────────────────────────────
const SITE = process.env.SITE ?? 'https://vmyronovych.github.io';
const BASE = process.env.BASE ?? '/oselia-web';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'ignore',
  integrations: [mdx(), sitemap()],
});
