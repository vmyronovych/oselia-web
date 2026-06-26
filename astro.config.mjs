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
const BASE_CLEAN = BASE.replace(/\/$/, '');

/**
 * Markdown/MDX links are authored as root-absolute (e.g. `/uk/docs/...`) but the
 * site is served from a sub-path (`/oselia-web`). Astro does NOT auto-prefix the
 * base onto links inside rendered Markdown, so this rehype plugin does it — for
 * both <a href> and <img src> — leaving external, anchor (#…) and protocol-relative
 * (//…) links alone, and never double-prefixing.
 */
function rehypeBasePaths() {
  if (!BASE_CLEAN) return () => {};
  const fix = (val) =>
    typeof val === 'string' &&
    val.startsWith('/') &&
    !val.startsWith('//') &&
    !val.startsWith(`${BASE_CLEAN}/`) &&
    val !== BASE_CLEAN
      ? `${BASE_CLEAN}${val}`
      : val;

  /** @param {any} node */
  const visit = (node) => {
    if (node.type === 'element' && node.properties) {
      if (node.tagName === 'a') node.properties.href = fix(node.properties.href);
      if (node.tagName === 'img') node.properties.src = fix(node.properties.src);
    }
    if (node.children) node.children.forEach(visit);
  };
  return (/** @type {any} */ tree) => visit(tree);
}

/**
 * Wrap every Markdown <table> in <div class="table-wrap"> so wide tables scroll
 * horizontally inside their own box on small screens instead of overflowing the
 * whole page.
 */
function rehypeTableWrap() {
  /** @param {any} node */
  const visit = (node) => {
    if (!node.children) return;
    node.children = node.children.map((/** @type {any} */ child) => {
      if (child.type === 'element' && child.tagName === 'table') {
        return {
          type: 'element',
          tagName: 'div',
          properties: { className: ['table-wrap'] },
          children: [child],
        };
      }
      visit(child);
      return child;
    });
  };
  return (/** @type {any} */ tree) => visit(tree);
}

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'ignore',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'uk'],
    routing: {
      prefixDefaultLocale: false, // English at /, Ukrainian at /uk/
    },
  },
  markdown: {
    rehypePlugins: [rehypeBasePaths, rehypeTableWrap],
  },
  integrations: [mdx(), sitemap({ i18n: { defaultLocale: 'en', locales: { en: 'en', uk: 'uk' } } })],
});
