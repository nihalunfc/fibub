# Notes for Claude sessions in this repo

fibub.com (Free In-Browser Utility Bubble; free, open-source tools that fill the gaps people and workplaces have): tools for documents, money, data, everyday tasks and science that run entirely in the browser. MIT License (OpenNGC catalogue data is CC-BY-SA 4.0). Astro 5, static, served by a Cloudflare Worker with static assets (`wrangler.jsonc`; Cloudflare builds and deploys `main` on every merge). Owner: nihal (GitHub `nihalunfc`).

## House rules
- **Nothing about the user is stored, ever** (nihal, 2026-11-06). Only anonymous daily totals (tool, file type, size range, device, OS, browser, country, outcome) go to `data/stats/` and the public `/stats/` page. No IPs, IDs, cookies, timestamps finer than a day, or return-visit tracking.
- A tool may keep the user's own data in their browser (localStorage) so it is there next visit, only when the page says so plainly, it never leaves the device, and there is a way to clear it (e.g. planner, budget "Remember my numbers" box, off by default for money data).
- **Only tools that run fully in the browser** (nihal, 2026-11-06). If a feature needs a server to process user files (e.g. layout-perfect PDF to Word), leave it out.
- **Nothing leaves the device.** Tools never upload files or entered data, never call third-party APIs with user data, and work offline once the page has loaded. Public data feeds (e.g. daily currency rates) are fine if they send nothing about the user.
- **Legal everywhere we target** (Canada, India, US, UK, Gulf states). Never build: video/music downloaders, password or DRM removers, VPN/proxy tools, betting or gambling tools, crypto trading signals, anything that stores ID documents.
- **Ads:** `ads: false` on any tool that opens personal files or bank data. No ad code anywhere until nihal approves an ad network.
- Region rules (tax rates, photo sizes, gratuity) show the source and the date checked, and say "check the official source".
- Plain, friendly English. Explain what a setting does in one line.
- Phone first: test at 375 px wide; no sideways scroll.

## Adding a tool
1. Make `src/tools/<id>/` (the id is the URL slug, e.g. `compress-pdf`).
2. `guide.md`: frontmatter (`num`: the tool's permanent #number, the next free one; never change or reuse a number, even if a tool is removed. nihal refers to tools by it, e.g. "make the buttons better on #3". `name`, `shelf`: money | documents | everyday, `title` as people search it, `summary`, `status`: live | soon, `ads`, `order`, `updated`, `works`: offline | online (offline = keeps working with no internet once the page is open; test it), and for live tools `flow`: 3 or 4 steps of `{ icon, label }`, labels up to 12 characters, icons from `src/lib/icons.ts`; it is the picture at the top of the tool page and must stay on one row on a 320 px phone) and a body of 300+ words: how to use it, what each option does, a worked example, FAQs.
3. `Tool.astro`: the UI and its `<script>`. Load heavy libraries with `import()` so the page stays fast.
4. Add checks for it in `tests/run.mjs`, and run `npm run images` to make its share image (`public/og/<id>.png`: tool name, fibub.com, FREE, NO SIGN-UP). Commit the image.
5. Science tools need a `section` (listed in `SECTIONS` in `src/site.ts`); each section belongs to a subject (`SUBJECTS`: physics, astronomy, chemistry, ... 16 in all, from the science ideas list). Subjects get their own page at `/science/<subject>/` once they have a live tool, so a tool id may never equal a subject id. The build fails on an unknown section, a science tool without one, or a tool id that clashes with a subject.
6. **Cross-link related tools (nihal's hard rule):** list them in `related:` (tool ids). Links show both ways ("Works well with" and Related tools); the build fails on an unknown id.
7. Tools that make a report use `src/lib/report.ts` (sections of facts, tables and canvas figures) and `components/Downloads.astro` for PNG, PDF and Word downloads.
8. `npm run build && npm test` must pass, then open a PR. The tool appears at `/<shelf>/<id>/`, on its shelf page and on the home page automatically.

## Site rules
- **No tool lives on both sites** (nihal, 2026-11-07). Everyday public tools go on fibub; ambitious career prototypes go on nihalsulaiman.com. Link between them only where useful. nihal's name appears only on the About page; the footer says "Developer" and links to the portfolio.
- Header: drop-down menus per shelf on computers; on phones a "Tools" button opens a full-height side panel half the screen wide, and the page behind keeps scrolling.
- Every tool page has a **Bookmark this tool** button. Browsers cannot open their bookmark box from a script, so it shows Ctrl/⌘+D (or the share sheet on phones) and offers an optional "pin to My tools" (tool ids only, localStorage `fibub-mytools-v1`, with a Clear button).
- Astronomy pages share the place and night (`src/lib/astro/state.ts`, `components/SkyPlace.astro`). Times show in the visitor's own time zone by default, with a "Times in" switch (the place's local time or any zone); the night itself is the place's own night (from its longitude), whatever zone is shown.
- **Red light for night use** (`html.red-mode`, kept for the tab, switched on before paint by `public/theme.js`, button in the header next to the light/dark switch): dim pure red on black only, no green or blue light; photos go through the `#red-night` filter. Keep it that way for dark-adapted eyes.
- **Built for hundreds of tools.** The home page never lists every tool: search box (site-wide, from `/tools.json`, also in the header panel on every page; "#3" finds tool 3), My tools, then a block per shelf. Small shelves list their tools; Science lists its subjects. Each subject page lists its tools by section. The desktop Science menu shows subjects, then each section's first 3 tools and an "All N" link. The phone/desktop Tools panel has search, My tools and folding shelves (Science folds to subjects).
- A star adds a tool to **My tools**; "Show only my tools" hides the rest until "Show all" (flag `fibub-focus-v1`, this browser only). The Tools panel follows the same switch.
- Pure maths for science tools lives in `src/lib/sci/` as plain TypeScript with no DOM, checked against published worked examples in `tests/sci.mjs` (`node tests/sci.mjs`, part of `npm test`).

## Brand
Look (nihal, 2026-11-07): plain black on white, professional, nothing that reads as an AI template (no gradients, glows, pastel icon tiles). Colour only for meaning (good, warning, error) and in charts. A header switch turns the page dark: black and white swapped, no blue (`html[data-theme=dark]`, set before paint by `public/theme.js`, kept in this browser as `fibub-theme`). The site no longer follows the system dark setting.
Logo: a black-and-white bubble cluster (nihal chose option A, one colour, 2026-11-06), in `src/lib/brand.ts`. `npm run images` rebuilds the favicons and share images from it.

## Security
`public/_headers` sets HSTS and a strict Content Security Policy (scripts only from this site and Cloudflare Web Analytics). Don't add inline scripts or outside script hosts without updating it, and keep `connect-src` tight.
