---
title: Landing files from folders and shared drives
summary: 'Land files from shared folders safely: skip half-written files, fingerprint each one with SHA-256, keep a manifest, and never move a source file.'
minutes: 35
updated: 2026-11-22
quiz:
  - q: Why copy files to raw instead of moving them out of the shared folder?
    choices: ['Moving is slower', 'The folder belongs to another team; moving breaks their process and removes your way to re-check the source', 'Python cannot move files between drives']
    ans: 1
    why: Treat sources as read-only. Your copy plus the manifest is your evidence.
  - q: A file has the same name as yesterday's but a different hash. What is the safest default?
    choices: ['Skip it, the name is already in the manifest', 'Overwrite yesterday''s raw file', 'Land it as a new version and let staging pick the latest by received time']
    ans: 2
    why: Raw keeps every version. Staging applies the "latest wins" rule, and you can always see what changed.
  - q: Why write to a temporary name and then rename?
    choices: ['Windows requires it', 'A rename is atomic, so a reader never sees a half-copied file', 'It makes the hash faster']
    ans: 1
    why: The rename happens all at once. Your own later steps get the same protection you want from the source.
sources:
  - 'Python documentation: hashlib (secure hashes) https://docs.python.org/3/library/hashlib.html'
  - 'Python documentation: pathlib and os.replace https://docs.python.org/3/library/pathlib.html'
  - 'Kleppmann, M. (2017), Designing Data-Intensive Applications, O''Reilly Media, Chapter 11 (idempotence and exactly-once effects)'
---

**Module 1 · about 35 minutes · read first: 1.2.** You'll be able to land files from a shared folder so that reruns add nothing, re-sends are spotted, corrections are kept as new versions, and half-written files are never read.

<div class="bigidea">Land files like a careful librarian: never take the original off the shelf, photocopy it, stamp the copy with a fingerprint, and write it in the register, so a second copy of the same pages is recognised at once.</div>

## 1. Why this matters

In many medium-sized companies the most common data source is still **a folder**: a network share, a SharePoint library synced to a server, a vendor's export directory. Folder loading looks trivial, and it is where most silent errors live: the file read twice, the file read while it was still being written, the file replaced with a corrected version under the same name.

## 2. The landing pattern

1. **Discover:** list the candidate files and skip anything not finished.
2. **Fingerprint:** compute a **SHA-256 hash** of the file's bytes. A hash is a 64-character code worked out from every byte; change one byte and the code changes completely. Two files with the same hash have the same content.
3. **Check the manifest:** the manifest is your register of every file landed. Is this hash already in it? If so, skip and log `duplicate`.
4. **Copy** into the raw zone at a path that says the source and the business date: `raw/qsr/business_date=2026-09-14/pos_Q204__a3f91c2e.csv` (the first 8 characters of the hash keep names unique).
5. **Record** a manifest row: source, original path, size, modified time, hash, when you received it, raw path.

You **copy**, you never move. The source folder belongs to someone else. Moving files breaks their process and destroys your ability to check the source again.

```python
import hashlib, shutil, sqlite3, time
from pathlib import Path

def sha256(path: Path, chunk=1 << 20) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for block in iter(lambda: f.read(chunk), b""):   # 1 MB at a time: works for huge files
            h.update(block)
    return h.hexdigest()

def is_stable(path: Path, wait=2.0) -> bool:
    """A file still being written keeps growing. Skip partials and temp names."""
    if path.suffix in {".partial", ".tmp", ".crdownload"} or path.name.startswith("~$"):
        return False
    s1 = path.stat().st_size; time.sleep(wait); s2 = path.stat().st_size
    return s1 == s2 and s1 > 0

def land(src_dir: Path, raw_dir: Path, db: sqlite3.Connection, source: str):
    db.execute("""create table if not exists manifest(
        sha256 text primary key, source text, src_path text, size int, mtime real,
        received_at text, raw_path text)""")
    for p in sorted(src_dir.rglob("*.csv")):
        if not is_stable(p):
            continue
        digest = sha256(p)
        if db.execute("select 1 from manifest where sha256=?", (digest,)).fetchone():
            continue                                       # exact same bytes already landed
        business_date = p.parent.name                      # in this source, the folder is the date
        dest = raw_dir / source / f"business_date={business_date}" / f"{p.stem}__{digest[:8]}{p.suffix}"
        dest.parent.mkdir(parents=True, exist_ok=True)
        tmp = dest.with_suffix(dest.suffix + ".tmp")
        shutil.copy2(p, tmp); tmp.replace(dest)            # rename is atomic: no half files
        db.execute("insert into manifest values (?,?,?,?,?,datetime('now'),?)",
                   (digest, source, str(p), p.stat().st_size, p.stat().st_mtime, str(dest)))
        db.commit()
```

Watch one run over a folder with four files in it:

<div class="steps" data-fig="landing-files-hash">
<div class="step"><b>Discover.</b> The job lists four files. <code>pos_Q207.csv.partial</code> is still being uploaded, so it is held back until it is renamed.</div>
<div class="step"><b>New content.</b> <code>pos_Q204.csv</code> hashes to <code>a3f91c2e…</code>, which is not in the manifest. It is copied to raw and a row is added.</div>
<div class="step"><b>Exact re-send.</b> <code>pos_Q205.csv</code> hashes to <code>7be04d19…</code>, already in the manifest from yesterday. Same bytes, so it is skipped and logged as a duplicate.</div>
<div class="step"><b>Correction.</b> <code>pos_Q206.csv</code> has yesterday's name but a new hash: someone fixed the file. It lands as a second version; staging will use the latest.</div>
<div class="step"><b>Rerun.</b> Run the job again a minute later. Every hash is already known, so nothing is added. Running it twice has the same effect as once.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a step is **idempotent** if doing it twice has the same effect as doing it once. Landing keyed by content hash is idempotent.

**Equation:** `$f(f(x)) = f(x)$`. With a manifest `$M$` (a set of hashes) and a file `$F$` with hash `$h(F)$`:

```math
\text{land}(M, F) = M \cup \{h(F)\}, \qquad M \cup \{h\} \cup \{h\} = M \cup \{h\}
```

because a set ignores repeats.

**Analogy:** pressing a lift button twice; the lift still comes once. Where it breaks: the same *business* data can arrive with different bytes (a re-export with a new "printed at" line). Then the hash differs, and you need a second, business-level key (source, store, business date) with a rule such as "latest version wins".

**Try it:** a folder has 18 files today; 2 are byte-identical re-sends of yesterday's. How many manifest rows does today add if the job runs twice? *(16. The re-sends and the second run add nothing.)*
</details>

<div class="problem" data-problem="landing-files-manifest"></div>

Press Next day, then Load changes, then Re-run same load with each write mode.

<figure class="fig" data-fig="@data-watermark-load"><figcaption>Notice that the watermark limits what is copied, and that MERGE is safe to repeat while a blind APPEND makes duplicates.</figcaption></figure>


## 3. Same name, new content

Vendors often fix a file and drop it again under the same name. Decide the rule out loud and write it in the README:

| Situation | Hash | Name | Rule |
|---|---|---|---|
| Exact re-send | same | any | skip |
| Correction | new | same | land as a new version; staging takes the latest by received time |
| New day | new | new | land |

Never trust the file's **modified time** alone: copy tools, sync clients and unzipping all rewrite it. Never trust **dates in file names** alone either: people rename files. Record name, modified time and received time, and choose one **business date** rule per source.

<div class="meaning">

<dl>
<dt>Hash (SHA-256)</dt><dd>A fingerprint of a file's bytes. Same bytes, same fingerprint; one byte different, a completely different one.</dd>
<dt>Manifest</dt><dd>Your register of every file landed: where it came from, its hash, when it arrived and where the copy lives.</dd>
<dt>Idempotent</dt><dd>Safe to repeat: running it again changes nothing.</dd>
<dt>Atomic rename</dt><dd>A rename that happens all at once, so nobody can see a half-written file.</dd>
<dt>Physical meaning</dt><dd>Six months from now, finance will ask why March's numbers changed. The manifest answers in one query: which version of which file fed which load, and when it arrived. Because the job is idempotent, you can also rerun it after any failure without fear of double-counting.</dd>
</dl>

</div>

<div class="myth">

**"If the file name is in the manifest, I already have it."** Names lie: a corrected file can reuse yesterday's name, and two different stores can send files with the same name. Key the manifest on the hash of the content, and keep the name only as information.

</div>

## 4. Service accounts, mapped drives and polling

A scheduled job usually runs as a **service account** (a login for a program, not a person). The `Z:` drive you mapped in your own session does not exist for it. Use full network paths (`\\fileserver\exports\qsr`) and give the service account **read-only** access. Read-only is a feature: it makes deleting the source impossible.

You can **poll** (list the folder every few minutes) or **watch** (ask the operating system for change events, for example with Python's `watchdog`). Polling is simpler and works on network shares, where events are unreliable. It is what Dagster sensors do in Module 3.

## 5. Try it: land the restaurant shared drive

1. In `retail-ingest`, create `src/retail_ingest/sources/folder.py` with `sha256`, `is_stable` and `land` (use `wait=0.2` locally).
2. Run it over `data/landing/shared_drive/qsr`. Count the manifest rows; it should equal the number of files.
3. Run it again: zero new rows. Write `tests/test_folder_idempotent.py` that proves it, using pytest's `tmp_path`.
4. Simulate a correction: add a line to one source file and rerun. Check a second version lands with a new hash.
5. Simulate an upload in progress: create `pos_Q999.csv.partial` and check it is skipped.
6. Move the manifest to DuckDB (`duckdb.connect("data/manifest.duckdb")`) and query files per day, total bytes, and any day with fewer than 18 files.

Commit: `feat(ingest): idempotent folder landing with sha256 manifest`.

**What to check:** both tests pass, and your "fewer than 18 files" query returns nothing for the restaurant source (each of the 18 restaurants sends one file a day).

## 6. Practice

1. A folder holds 18 files. You run the job three times. How many manifest rows?
2. Why does `is_stable` check the size twice?
3. The sync client rewrote every file's modified time overnight. Does your job re-land them?

<details>
<summary>Answers</summary>

1. 18. The second and third runs add nothing.
2. A file still being written grows between the two checks. Same size twice (and above zero) suggests the writer has finished.
3. No. The hashes have not changed, so the manifest already has them.
</details>

**New words:** *hash*, *SHA-256*, *manifest*, *idempotent*, *atomic rename*, *service account*, *polling*.

<div class="keypoints">

- Copy, never move: the source folder belongs to someone else.
- Fingerprint every file with SHA-256 and keep a manifest keyed on that hash.
- Skip half-written files (temp names, growing sizes) and write your own copies to a temp name, then rename.
- A correction under the same name has a new hash: land it as a new version and let staging take the latest.

</div>
