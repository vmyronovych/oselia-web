import { defaultLang, type Lang } from './ui';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Collection ids look like `en/hearth-di16g` — split off the locale. */
export function entryLang(id: string): Lang {
  return (id.split('/')[0] as Lang) ?? defaultLang;
}

/** The slug without the locale folder, e.g. `hearth-di16g`. */
export function entrySlug(id: string): string {
  return id.split('/').slice(1).join('/');
}

/** URL prefix for a locale param: '' for English, 'uk' for Ukrainian. */
export function localePrefix(lang: Lang): string | undefined {
  return lang === defaultLang ? undefined : lang;
}

/**
 * Build an in-site href for a given language and locale-agnostic path
 * (e.g. localizedPath('uk', '/docs/getting-started')).
 */
export function localizedPath(lang: Lang, path: string): string {
  const clean = path === '/' ? '' : path.replace(/^\//, '/');
  if (lang === defaultLang) return `${BASE}${clean || '/'}`;
  return `${BASE}/${lang}${clean || '/'}`;
}

/**
 * Given the current full pathname, return the equivalent href in `lang` (used by
 * the language switcher). Strips the base and any locale prefix, then re-applies.
 */
export function switchLocaleHref(pathname: string, lang: Lang): string {
  let p = pathname;
  if (BASE && p.startsWith(BASE)) p = p.slice(BASE.length);
  if (p === '/uk' || p.startsWith('/uk/')) p = p.slice(3) || '/';
  if (!p.startsWith('/')) p = `/${p}`;
  return localizedPath(lang, p);
}
