# Homepage designs

Every homepage design is kept here as its own version, so any of them can come back at any time
(nihal's rule, 2026-11-10). Versions are named v1, v2, ... for new designs and v1.1, v2.3, ... for
smaller changes to a design. Never delete or overwrite an old version: copy it to a new folder instead.

| Version | Folder | What it is |
|---|---|---|
| v1 | `v1/` | The original: tool count, search, My tools, a block per shelf listing its tools. |
| v2 | `v2/` | "Three doors": intro and search, then Learn, Tools and News panels, most used tools, site in numbers. |

## See any version
Every version is online at `/home/<version>/` (for example fibub.com/home/v1/), with a note on top.
These previews are kept out of search engines and the sitemap.

## Switch the live home page
1. In `src/pages/index.astro`, change the import to the version you want, e.g. `../home/v1/Home.astro`.
2. In `src/home/versions.ts`, set `LIVE` to the same version.
3. Build, test and merge. That is all: search, My tools, the counters and the bottom bar work the same in every version.

## Make a new version
1. Copy the folder of the version you start from (e.g. `v2/` to `v2.1/` or `v3/`).
2. Change the copy, add it to `VERSIONS` in `versions.ts` and a row to the table above.
3. Preview it at `/home/<version>/` before making it live.
