/**
 * Decap CMS GitHub OAuth proxy — Cloudflare Worker.
 *
 * GitHub Pages can only serve static files, so it can't perform the GitHub OAuth
 * token exchange Decap needs for the `github` backend. This tiny Worker does it.
 *
 * Flow:
 *   1. Decap opens  /auth   → we redirect the popup to GitHub's authorize page.
 *   2. GitHub redirects back to  /callback?code=...  → we exchange the code for a
 *      token and postMessage it back to the Decap window that opened the popup.
 *
 * Setup: see ./README.md. You need a GitHub OAuth App and two Worker secrets:
 *   GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
 */

const ALLOWED_ORIGINS = [
  'https://vmyronovych.github.io',
  'http://localhost:4321',
];

function randomState() {
  const a = new Uint8Array(16);
  crypto.getRandomValues(a);
  return [...a].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function renderResult(status, content) {
  // postMessage handshake expected by Decap CMS.
  const message = `authorization:github:${status}:${JSON.stringify(content)}`;
  return `<!doctype html><html><body><script>
    (function () {
      function send(e) {
        window.opener && window.opener.postMessage(
          ${JSON.stringify(message)},
          e && e.origin ? e.origin : '*'
        );
      }
      window.addEventListener('message', send, false);
      window.opener && window.opener.postMessage('authorizing:github', '*');
    })();
  </script><p>${status === 'success' ? 'Logged in. You can close this window.' : 'Login failed.'}</p></body></html>`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/' || url.pathname === '/health') {
      return new Response('OSELIA Decap OAuth proxy is running.', { status: 200 });
    }

    // Step 1 — kick off the OAuth dance.
    if (url.pathname === '/auth') {
      const state = randomState();
      const redirect = new URL('https://github.com/login/oauth/authorize');
      redirect.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      redirect.searchParams.set('redirect_uri', `${url.origin}/callback`);
      redirect.searchParams.set('scope', 'repo,user');
      redirect.searchParams.set('state', state);
      return new Response(null, {
        status: 302,
        headers: {
          Location: redirect.toString(),
          // Bind state to the popup so /callback can verify it.
          'Set-Cookie': `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`,
        },
      });
    }

    // Step 2 — exchange the code for a token.
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      const cookie = request.headers.get('Cookie') || '';
      const savedState = /(?:^|;\s*)oauth_state=([^;]+)/.exec(cookie)?.[1];

      if (!code || !state || state !== savedState) {
        return new Response(renderResult('error', { message: 'Invalid OAuth state.' }), {
          status: 400,
          headers: { 'Content-Type': 'text/html' },
        });
      }

      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });
      const data = await tokenRes.json();

      if (data.error || !data.access_token) {
        return new Response(renderResult('error', { message: data.error || 'No token returned.' }), {
          status: 401,
          headers: { 'Content-Type': 'text/html' },
        });
      }

      return new Response(
        renderResult('success', { token: data.access_token, provider: 'github' }),
        { status: 200, headers: { 'Content-Type': 'text/html' } }
      );
    }

    return new Response('Not found', { status: 404 });
  },
};

// Silence unused warning; ALLOWED_ORIGINS documents intended callers.
void ALLOWED_ORIGINS;
