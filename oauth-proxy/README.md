# Decap CMS OAuth proxy (Cloudflare Worker)

GitHub Pages serves only static files, so it can't do the GitHub OAuth token
exchange that the Decap CMS `github` backend needs for **online** editing. This
tiny Cloudflare Worker does that one job. It's free on Cloudflare's Workers free
tier.

> **You can skip all of this** if you only ever edit locally with
> `npm run cms` + `npm run dev` (the `local_backend` path). Set this up only when
> you want to log in and edit at `…/oselia-web/admin/` from any browser.

## 1. Create a GitHub OAuth App

GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**:

- **Application name:** `OSELIA CMS`
- **Homepage URL:** `https://vmyronovych.github.io/oselia-web`
- **Authorization callback URL:** `https://oselia-cms-auth.<your-subdomain>.workers.dev/callback`

Save, then note the **Client ID** and generate a **Client secret**.

## 2. Deploy the Worker

```bash
cd oauth-proxy
npx wrangler login
npx wrangler secret put GITHUB_CLIENT_ID       # paste the Client ID
npx wrangler secret put GITHUB_CLIENT_SECRET   # paste the Client secret
npx wrangler deploy
```

`wrangler deploy` prints the Worker URL, e.g.
`https://oselia-cms-auth.<your-subdomain>.workers.dev`.

## 3. Point the CMS at it

In [`../public/admin/config.yml`](../public/admin/config.yml) set `backend.base_url`
to your Worker URL (without a trailing slash):

```yaml
backend:
  name: github
  repo: vmyronovych/oselia-web
  branch: main
  base_url: https://oselia-cms-auth.<your-subdomain>.workers.dev
  auth_endpoint: /auth
```

Commit and let it deploy. Now `https://vmyronovych.github.io/oselia-web/admin/`
offers **Login with GitHub**, and saving an entry commits to the repo — which
triggers the Pages deploy.

## Notes

- The callback URL in the GitHub OAuth App **must exactly match** the Worker's
  `/callback` route.
- Only collaborators on `vmyronovych/oselia-web` can actually write — GitHub
  enforces that on the commit, regardless of who logs in.
- `ALLOWED_ORIGINS` in `worker.js` lists the sites expected to use the proxy; the
  Decap postMessage handshake itself targets the opener window.
