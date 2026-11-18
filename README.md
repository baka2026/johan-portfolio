# Johan — Personal Portfolio

A responsive, minimal portfolio website with a Cloudflare Pages Function powering the AI chat assistant through FreeLLMAPI.

## Project structure

- `index.html` — portfolio content and chat UI
- `styles.css` — responsive visual design
- `script.js` — interactions and chat frontend
- `functions/api/chat.js` — server-side AI proxy (keeps the API key private)

## Run locally

You need Node.js installed.

```bash
npm install -g wrangler
npx wrangler pages dev .
```

Create a local `.dev.vars` file in the project root (never commit it):

```dotenv
FREELLM_API_BASE="https://YOUR-PUBLIC-FREELLMAPI-HOST/v1"
FREELLM_API_KEY="YOUR-ROTATED-UNIFIED-KEY"
FREELLM_MODEL="auto"
```

The FreeLLMAPI server must be reachable from the internet by the Cloudflare Function. `http://localhost:3001` on your own computer will not work for a deployed Cloudflare site. Do not expose the dashboard or API without authentication and appropriate access controls.

## Deploy with GitHub + Cloudflare Pages

1. Create a new GitHub repository, for example `johan-portfolio`.
2. Upload/push all files in this folder to the repository root.
3. In Cloudflare, open **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
4. Select your GitHub repository.
5. For this plain static site, leave the build command empty and set the build output directory to `/` (the repository root).
6. Deploy.

## Add the AI secrets in Cloudflare

Open your Pages project → **Settings** → **Variables and Secrets** → **Add**.

Add these values:

- `FREELLM_API_BASE` — non-secret base URL reachable by Cloudflare, for example `https://your-api.example.com/v1`
- `FREELLM_API_KEY` — choose **Encrypt** / Secret and paste your newly rotated FreeLLMAPI unified key
- `FREELLM_MODEL` — optional model ID supported by your FreeLLMAPI configuration; `auto` is the default in this template

Save and redeploy if Cloudflare asks you to.

## Connect your domain

In the Pages project, open **Custom domains** → **Set up a custom domain**. Enter your domain and follow Cloudflare's prompts. Since the domain is already using Cloudflare nameservers, you should not need to change nameservers at Namecheap again.

## Before publishing

Search the files for `hello@example.com` and replace it with your real contact email. Update the GitHub and LinkedIn links. Replace the illustrative project cards with real projects and links. Review the AI system prompt in `functions/api/chat.js` so it describes only facts you want public.

## Security notes

- Never put provider keys in HTML, CSS, browser JavaScript, GitHub or public configuration.
- Rotate the key shared in chat before adding a replacement.
- The server-side function currently limits message size and chat history, but does not implement per-IP rate limiting. Add a Cloudflare rate-limit/WAF rule or another abuse-control mechanism before promoting the chatbot widely.
- The FreeLLMAPI endpoint must be reachable from Cloudflare. A local `localhost:3001` URL is not reachable by Cloudflare's global network.
