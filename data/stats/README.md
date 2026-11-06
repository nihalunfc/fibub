# Usage statistics

One JSON file per day (`YYYY-MM-DD.json`), holding anonymous totals only: how many times each tool was used, split by file type, size range, device type, operating system, browser, country and outcome. No IP addresses, no visitor IDs, no file names, no file contents. The site's `/stats/` page is built from these files.

Shape:

```json
{ "date": "2026-11-06", "rows": [ { "tool": "compress-pdf", "type": "pdf", "size": "1-5 MB", "device": "mobile", "os": "Android", "browser": "Chrome", "country": "IN", "outcome": "smaller", "saved": 62, "count": 3 } ] }
```

`saved` is the average percentage saved for that row.
