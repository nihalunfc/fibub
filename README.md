# fibub.com

Free everyday tools that never see your files. Every tool runs in the browser; nothing is uploaded.

```
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
npm test         # end-to-end checks in a headless browser (run build first)
```

Hosting: Cloudflare Workers static assets (see `wrangler.jsonc`); merging to `main` deploys fibub.com.
How to add a tool: see CLAUDE.md.
