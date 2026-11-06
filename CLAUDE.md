# Notes for Claude sessions in this repo

fibub.com: free everyday tools (money, documents, everyday) that run entirely in the browser. Astro 5, static, served by a Cloudflare Worker with static assets (`wrangler.jsonc`; Cloudflare builds and deploys `main` on every merge). Owner: nihal (GitHub `nihalunfc`).

## House rules
- **Nothing about the user is stored, ever** (nihal, 2026-11-06). Only anonymous daily totals (tool, file type, size range, device, OS, browser, country, outcome) go to `data/stats/` and the public `/stats/` page. No IPs, IDs, cookies, timestamps finer than a day, or return-visit tracking.
- **Only tools that run fully in the browser** (nihal, 2026-11-06). If a feature needs a server to process user files (e.g. layout-perfect PDF to Word), leave it out.
- **Nothing leaves the device.** Tools never upload files or entered data, never call third-party APIs with user data, and work offline once the page has loaded. Public data feeds (e.g. daily currency rates) are fine if they send nothing about the user.
- **Legal everywhere we target** (Canada, India, US, UK, Gulf states). Never build: video/music downloaders, password or DRM removers, VPN/proxy tools, betting or gambling tools, crypto trading signals, anything that stores ID documents.
- **Ads:** `ads: false` on any tool that opens personal files or bank data. No ad code anywhere until nihal approves an ad network.
- Region rules (tax rates, photo sizes, gratuity) show the source and the date checked, and say "check the official source".
- Plain, friendly English. Explain what a setting does in one line.
- Phone first: test at 375 px wide; no sideways scroll.

## Adding a tool
1. Make `src/tools/<id>/` (the id is the URL slug, e.g. `compress-pdf`).
2. `guide.md`: frontmatter (`name`, `shelf`: money | documents | everyday, `title` as people search it, `summary`, `status`: live | soon, `ads`, `order`, `updated`, and for live tools `flow`: 3 or 4 steps of `{ icon, label }`, labels up to 12 characters, icons from `src/lib/icons.ts`; it is the picture at the top of the tool page and must stay on one row on a 320 px phone) and a body of 300+ words: how to use it, what each option does, a worked example, FAQs.
3. `Tool.astro`: the UI and its `<script>`. Load heavy libraries with `import()` so the page stays fast.
4. Add checks for it in `tests/run.mjs`.
5. `npm run build && npm test` must pass, then open a PR. The tool appears at `/<shelf>/<id>/`, on its shelf page and on the home page automatically.

## Security
`public/_headers` sets HSTS and a strict Content Security Policy (scripts only from this site and Cloudflare Web Analytics). Don't add inline scripts or outside script hosts without updating it, and keep `connect-src` tight.
