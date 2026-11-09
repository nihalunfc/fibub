# Page views and tool uses

Open counts for every page on fibub.com, copied here from the live counters every day at 00:20 UTC
by `.github/workflows/views.yml` (script: `scripts/views-export.mjs`). Days are UTC.

**What is counted:** one view each time a page is opened, and one use the first time someone works a
tool after opening its page. **What is not:** anything about the visitor. There are no IP addresses,
cookies, visitor IDs, times of day, devices or browsers anywhere in these files or in the counters
behind them. Reloading a page counts again, because nothing can tell visits apart.

| File | What it holds |
|---|---|
| `days/YYYY/YYYY-MM-DD.json` | One day: `site` (all page views), `pages` (views per page address), `uses` (uses per tool id) |
| `daily.csv` | One row per day and page |
| `weekly.csv` | One row per ISO week (Monday to Sunday, e.g. `2026-W46`) and page |
| `monthly.csv` | One row per month and page |
| `yearly.csv` | One row per year and page |
| `all-time.csv` | Running totals per page since the counters started (includes views from before daily counting began on 2026-11-09) |
| `totals.json` | The same running totals as JSON |
| `tools.json` | Which page belongs to which tool id |

CSV columns: `period`, `page` (the address, or `(site)` for the whole site), `tool` (the tool id when
the page is a tool), `views`, `uses`. They open directly in Excel, Power BI or Tableau.

Daily counts start on the day this was switched on (2026-11-09). Before that only running totals
were kept, so those views appear in `all-time.csv` but in no single day.

Rebuild the CSV files from the day files: `node scripts/views-export.mjs --rebuild`.
