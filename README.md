<div align="center">

# OSELIA — product site & docs

**Marketing + documentation site for the OSELIA DIN-rail modules** — the
**Hearth (DI16-G)** gateway and the **Ember (DI-16X)** input expander — with a
built-in CMS, built on Astro and deployed free to GitHub Pages.

</div>

---

## What's here

| Path | What's inside |
|------|---------------|
| `src/pages/[...locale]/` | Locale-aware routes (en at `/`, uk at `/uk/`): home, `products/[id]`, `docs/[id]`. |
| `src/content/products/<lang>/` | One Markdown file per module per language (Hearth, Ember). Editable in the CMS. |
| `src/content/docs/<lang>/` | Getting Started, HA integration, automations, troubleshooting — per language. |
| `src/i18n/` | UI strings (`ui.ts`) and locale path helpers (`utils.ts`). |
| `src/layouts/`, `src/components/`, `src/styles/` | Layouts, header/footer, global CSS. |

## Languages

The site is bilingual — **English** (`/`) and **Ukrainian** (`/uk/`) — via Astro's
i18n routing. UI strings live in `src/i18n/ui.ts`; page content is translated per
language under `src/content/<collection>/<lang>/`. The header has a language switcher,
and Decap CMS edits both languages side by side (`i18n: multiple_folders`). To add a
locale: add it to `locales` in `astro.config.mjs`, the `ui` map and `pillars` in
`src/i18n/ui.ts`, the CMS `i18n.locales`, and create `src/content/*/<lang>/` files.
| `public/admin/` | **Decap CMS** — the little content manager (`/admin`). |
| `oauth-proxy/` | Cloudflare Worker for the CMS's GitHub login (online editing). |
| `.github/workflows/deploy.yml` | CI/CD: build + deploy to GitHub Pages on push to `main`. |

## Develop locally

```bash
npm install
npm run dev        # http://localhost:4321/oselia-web/
```

## Edit content

Two ways — see [`public/admin/config.yml`](public/admin/config.yml):

**Local (no setup):** in two terminals —

```bash
npm run cms        # decap-server, the local backend
npm run dev
```

then open <http://localhost:4321/oselia-web/admin/>. Saving writes straight to the
Markdown files on disk; commit them as usual.

**Online (from any browser):** open
`https://vmyronovych.github.io/oselia-web/admin/` and log in with GitHub. Requires
the one-time OAuth proxy setup in [`oauth-proxy/README.md`](oauth-proxy/README.md).
Saving an entry commits to `main`, which triggers a deploy.

You can also just edit the Markdown in `src/content/` directly — the CMS is optional.

## Hosting & deployment

Hosted **free on GitHub Pages** from the **`gh-pages`** branch. Production lives at the
root; **every pull request gets its own preview environment** in a per-PR subfolder:

| Environment | Trigger | URL | Built with `BASE` |
|-------------|---------|-----|-------------------|
| **Production** (live) | push / merge to `main` | https://vmyronovych.github.io/oselia-web/ | `/oselia-web` |
| **PR preview** (`noindex`) | each open **pull request** to `main` | https://vmyronovych.github.io/oselia-web/pr-&lt;N&gt;/ | `/oselia-web/pr-<N>` |

Workflows publish into separate slots of the `gh-pages` branch, each leaving the others
untouched:
- [`deploy-production.yml`](.github/workflows/deploy-production.yml) — on push to `main` → root.
- [`deploy-pr-preview.yml`](.github/workflows/deploy-pr-preview.yml) — on every PR to `main` →
  `/pr-<N>/`. It posts the preview URL as a PR comment **and** is the required `build`
  status check, so a PR that doesn't build can't be merged.
- [`cleanup-pr-preview.yml`](.github/workflows/cleanup-pr-preview.yml) — on PR close → deletes
  that PR's `/pr-<N>/` folder.

One-time repo setup: GitHub → **Settings → Pages → Build and deployment →
Source: Deploy from a branch → `gh-pages` / `(root)`**.

### Preview each PR, then ship live

`main` is protected: it requires a pull request whose `build` check passes (enforced for
admins too). So the flow is:

```bash
# 1. Work on a branch
git switch -c my-change
# …make changes / edit content…
git push origin my-change

# 2. Open a PR into main — it auto-deploys to /oselia-web/pr-<N>/ and comments the URL
gh pr create --base main --head my-change --fill

# 3. Review the preview. Green `build` check? Merge → auto-deploys live; preview is removed
gh pr merge --merge           # (or --squash)
```

Each PR has an isolated preview, so several can be reviewed in parallel. CMS commits land
on whichever branch you're authoring against, so point the CMS at your PR branch to
preview content edits before merging.

### Custom domain or user/org page

This is configured as a **project page** (served under `/oselia-web`). To use a
custom domain or a user page (`vmyronovych.github.io`), set `SITE` and `BASE` env
vars for the build (see [`astro.config.mjs`](astro.config.mjs)) — set `BASE=/` — and
add a `CNAME` file / Pages custom-domain setting.

## Tech

[Astro](https://astro.build) (static output) · content collections ·
[Decap CMS](https://decapcms.org) · GitHub Pages · GitHub Actions.

## Related repos

- [`oselia`](https://github.com/vmyronovych/oselia) — hardware & system architecture
- [`oselia-hearth-di16g-firmware`](https://github.com/vmyronovych/oselia-hearth-di16g-firmware) — firmware & provisioning wizard
- [`oselia-hearth-di16g-ha`](https://github.com/vmyronovych/oselia-hearth-di16g-ha) — Home Assistant integration (HACS)
