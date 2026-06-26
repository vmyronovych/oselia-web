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
| `src/pages/` | Routes: home, `products/[id]`, `docs/[id]`. |
| `src/content/products/` | One Markdown file per module (Hearth, Ember). Editable in the CMS. |
| `src/content/docs/` | Getting Started, HA integration, automations, troubleshooting. |
| `src/layouts/`, `src/components/`, `src/styles/` | Layouts, header/footer, global CSS. |
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

Hosted **free on GitHub Pages**, deployed by GitHub Actions on every push to `main`
(including CMS commits). One-time repo setup:

1. Create the repo and push:
   ```bash
   git remote add origin git@github.com:vmyronovych/oselia-web.git
   git push -u origin main
   ```
2. GitHub → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to `main` (or run the workflow manually). The site lands at
   **https://vmyronovych.github.io/oselia-web/**.

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
