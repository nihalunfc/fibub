# fibub roadmap

Rule: every tool runs fully in the browser. Nothing is uploaded, and nothing about the user is stored.

| # | Tool | Page | Status |
| --- | --- | --- | --- |
| 1 | File compressor (PDF, images, Word/Excel/PowerPoint, ZIP, CSV, any file) | /documents/compress-file/ | Live |
| 2 | Image resizer (crop, rotate, resize, JPG/PNG/WebP/AVIF, target size, photo sizes) | /documents/image-resizer/ | Built |
| 3 | ZIP checker (is it as small as it can be? hands off to the compressor) | /documents/zip-checker/ | Built |
| 4 | File converter (only conversions that work in the browser) | /documents/file-converter/ | Planned |
| 5 | Weekly and monthly planner, download as image or PDF | /everyday/planner/ | Planned |
| 6 | Link cleaner (strip trackers, UTM tags, affiliate parts) | /everyday/link-cleaner/ | Planned |
| 7 | ATS resume checker (PDF, DOCX, DOC, Markdown; score out of 100 with fixes) | /documents/ats-resume-checker/ | Planned |
| 8 | Data cleaner: CSV/Excel/JSON profile (missing values, outliers, duplicates, types), basic cleaning, plus a schema generator (SQL CREATE TABLE, nested-field warnings, matching mock data) | /documents/data-cleaner/ | Planned |
| 9 | BI sandbox: SQL on local CSV/Parquet with duckdb-wasm, partitioning, instant charts | /documents/bi-sandbox/ | Planned |
| 10 | MCP server starter: production-ready MCP server code from your API endpoints or file schema | /everyday/mcp-starter/ | Planned |
| 11 | Equation physicalizer: paste a 2D/3D formula, see it as weights, friction or waves on a canvas | /everyday/equation-physicalizer/ | Planned |
| 12 | Prompt pruner: strip boilerplate, repeated headers, metadata blocks and extra whitespace from PDFs, text and code folders to cut LLM tokens (shows tokens before and after). Output: clean text with headings and lists kept, to copy or download as .md, so people paste text instead of uploading the heavy PDF. No AI summary: nothing is cut that matters | /documents/prompt-pruner/ | Planned |
| 13 | Where did I put it? Type an item and where it is; a searchable list kept only in your browser, with backup file save/load | /everyday/where-is-it/ | Planned |
| 14 | Declutter shredder: pick your Downloads folder, group files by type and age, review and clear old ones (moved to a Trash folder by default). Banner at the top: works only in Chrome and Edge on a computer | /everyday/declutter/ | Planned |
| - | Clickbait checker browser extension (on-device summary of the real outcome on hover). A separate extension, not a fibub.com page | - | Idea |
| - | Anonymous usage counter feeding /stats/ | - | Planned |
| - | Budget, sales tax/VAT/GST, loan EMI, currency, time zone, QR code tools | - | Ideas |

Every tool page opens with a picture of its 3 or 4 steps (`flow` in guide.md), kept on one row on phones.

Dropped (nihal, 2026-11-06): suggestion box (use the Contact page), postal code finder, WebAssembly "sub-second" shrinkers, recipe scaler, expiry meal wheel (too hard across cuisines).
