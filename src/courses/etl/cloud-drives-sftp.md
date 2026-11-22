---
title: SharePoint, OneDrive, Google Drive, SFTP and object storage
summary: 'Pull only changed files from SharePoint, OneDrive and Google Drive, wait for SFTP uploads to finish, and land everything in object storage.'
minutes: 35
updated: 2026-11-22
quiz:
  - q: A vendor uploads a 2 GB file to SFTP over 10 minutes. What protects you from reading half of it?
    choices: ['Downloading it twice and comparing', 'An agreed completion signal (rename when done, or a .done marker), or a size-stable check', 'A longer SSH timeout']
    ans: 1
    why: The writer has to tell you it has finished, or you infer it from a size that stops changing.
  - q: Which Graph permission is best for a pipeline that reads one SharePoint site?
    choices: ['Files.ReadWrite.All', 'Sites.Selected, granted for that one site', 'Mail.Read']
    ans: 1
    why: A narrow permission is safer and gets approved much faster.
  - q: Why write the raw zone through fsspec URLs?
    choices: ['fsspec is faster than the operating system', 'The same code works on a local folder, S3, Azure storage or Google Cloud Storage by changing one setting', 'It removes the need for a manifest']
    ans: 1
    why: Storage becomes a setting, which matters when you move from a laptop to the cloud.
sources:
  - 'Microsoft Learn: Use delta query to track changes in Microsoft Graph data https://learn.microsoft.com/en-us/graph/delta-query-overview'
  - 'Paramiko documentation (SSH and SFTP for Python) https://docs.paramiko.org/'
  - 'fsspec documentation https://filesystem-spec.readthedocs.io/'
  - 'Reis, J. and Housley, M. (2022), Fundamentals of Data Engineering, O''Reilly Media, Chapter 6 (storage)'
---

**Module 1 · about 35 minutes · read first: 1.3, 1.4.** You'll be able to pull only the changed files from SharePoint or OneDrive, read from Google Drive and SFTP without catching half-finished uploads, and land everything in object storage with code that does not care where the storage is.

<div class="bigidea">Every file store answers the same two questions in its own accent: "what is here?" and "what changed since I last asked?"; learn to ask the second one, and wait until a file is finished before you take it.</div>

## 1. Why this matters

"The shared folder" in a modern company usually means **SharePoint or OneDrive** (Microsoft shops), **Google Drive** (Google shops), an **SFTP server** (vendors, hotel booking systems, payroll, banks) or a **bucket** in object storage (Amazon S3, Azure Blob Storage or ADLS Gen2, Google Cloud Storage). Each lists files, reports changes and fails in its own way.

Think of a parcel locker. You could open every locker every morning to see what is new (listing everything), or you could read the delivery log that says "lockers 4 and 17 were filled since yesterday" (asking for changes). With ten lockers either works. With a million files, only the log does.

## 2. SharePoint and OneDrive through Graph

It is the same app-registration pattern as email (Lesson 1.4), with the permission `Sites.Selected` (limited to sites you are granted, preferred) or `Files.Read.All` (every file, harder to get approved). Every document library is a **drive**. You list its children and download their content. The **delta** endpoint returns only what changed since a token you saved last time: a watermark kept on the server.

```python
site = requests.get("https://graph.microsoft.com/v1.0/sites/contoso.sharepoint.com:/sites/Finance", headers=H).json()
drive = requests.get(f"https://graph.microsoft.com/v1.0/sites/{site['id']}/drive", headers=H).json()
url = saved_delta_link or f"https://graph.microsoft.com/v1.0/drives/{drive['id']}/root:/Exports/QSR:/delta"
while url:
    page = requests.get(url, headers=H, timeout=30).json()
    for item in page["value"]:
        if "file" in item and "deleted" not in item:
            content = requests.get(f"https://graph.microsoft.com/v1.0/drives/{drive['id']}/items/{item['id']}/content",
                                   headers=H, timeout=60).content
            # land(content, name=item["name"], etag=item["eTag"], modified=item["lastModifiedDateTime"])
    url = page.get("@odata.nextLink")
    if "@odata.deltaLink" in page:
        saved_delta_link = page["@odata.deltaLink"]   # save this; the next run starts from it
```

(`contoso` is Microsoft's own example tenant name.) An **eTag** is a version tag the server changes whenever a file's content changes.

## 3. Google Drive

Use a service account, share the folder with the service account's email address, and query with `files.list` and a filter such as `'<folderId>' in parents and trashed=false and modifiedTime > '...'`. Google Sheets are not files, so you export them to CSV or XLSX with `files.export`; ordinary files download with `files.get_media`. Drive's `changes` API is its version of delta.

## 4. SFTP

**SFTP** (SSH File Transfer Protocol) is the old reliable way vendors push or offer files. Two classic failures: the **partial upload** (you read while they are still writing) and **host-key surprises** (the vendor rebuilt their server and its identity key changed).

```python
import os, stat, paramiko

def pull_sftp(host, user, key_path, remote_dir, local_dir, known_hosts="~/.ssh/known_hosts"):
    client = paramiko.SSHClient()
    client.load_host_keys(os.path.expanduser(known_hosts))   # refuse unknown hosts: no AutoAddPolicy in production
    client.connect(host, username=user, key_filename=key_path, timeout=30)
    sftp = client.open_sftp()
    for a in sftp.listdir_attr(remote_dir):
        if stat.S_ISREG(a.st_mode) and a.filename.endswith(".txt"):   # vendor renames .partial to .txt when done
            sftp.get(f"{remote_dir}/{a.filename}", str(local_dir / a.filename))
    client.close()
```

Agree a **completion signal** with the vendor: rename when finished (`.partial` to `.txt`, as in the course data), a `_SUCCESS` or `.done` marker file, or a trailer line holding the row count. Without one, use the size-stable check from Lesson 1.3.

Watch a delta sync of a SharePoint library from one morning to the next:

<div class="steps">
<div class="step"><b>Yesterday.</b> The library held 400 files. Your job saved the delta link the server gave back at the end of the run.</div>
<div class="step"><b>Ask for changes.</b> Today's run calls the saved delta link. The server answers with 6 items, not 403: only what changed.</div>
<div class="step"><b>Sort them.</b> 3 are new files, 2 are existing files with a new eTag (someone fixed them), 1 is marked deleted.</div>
<div class="step"><b>Act.</b> Download 5 (the 3 new and the 2 changed) and land them through the manifest. The deleted one is flagged in the log, but its raw copy stays: raw never forgets.</div>
<div class="step"><b>Save the new delta link</b> for tomorrow. The whole run moved 5 files instead of re-listing and re-checking 403.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** finding changes is a set difference between what exists now and what you saw last time.

**Equation:** new items are

```math
\Delta_t = S_t \setminus S_{t-1}
```

plus the changed ones, `$\{x \in S_t \cap S_{t-1} : \text{etag}_t(x) \neq \text{etag}_{t-1}(x)\}$`. Delta APIs work this out on the server so you never list a million files.

**Analogy:** `git diff`. Where it breaks: deletions. A removed file is in `$S_{t-1} \setminus S_t$`. Decide whether that means "withdraw the data" or "nothing" (usually nothing for raw; flag it).

**Try it:** yesterday 400 files; today 403 listed, 2 eTags changed, 1 file deleted. How many to download? *(4 new, because 403 − 399 = 4, plus 2 changed = 6.)*
</details>

<div class="problem" data-problem="cloud-drives-sftp-delta"></div>

## 5. Object storage as your raw zone

From now on, think of the raw zone as a **bucket**, even while it is a folder on your laptop. Object storage is cheap per GB, very durable, and every tool can read it. Locally you can run **MinIO** (which speaks the S3 protocol) in Docker; in Azure you would use **ADLS Gen2**. The Python library **fsspec** (with `s3fs`, `adlfs` or `gcsfs`) lets one path string work against all of them.

```python
import fsspec
fs = fsspec.filesystem("s3", key="minio", secret="minio123",
                       client_kwargs={"endpoint_url": "http://localhost:9000"})
fs.put("data/raw/hotel/business_date=2026-09-14/pms_bookings_20260914__ab12cd34.txt",
       "raw/hotel/business_date=2026-09-14/pms_bookings_20260914__ab12cd34.txt")
```

Ready-made transfer tools exist too: **rclone** syncs between dozens of storage systems from one command line, **AzCopy** moves data in and out of Azure, **Azure Data Factory** and **Fabric pipelines** offer copy activities for Microsoft-only teams, and **dlt** has filesystem and SFTP sources (Lesson 1.6). Check each tool's docs for the systems it supports today.

<div class="meaning">

<dl>
<dt>Delta query</dt><dd>Asking a server "what changed since this token?" instead of listing everything.</dd>
<dt>eTag</dt><dd>A version tag that changes whenever a file's content changes.</dd>
<dt>Completion signal</dt><dd>An agreed sign that an upload is finished: a rename, a marker file or a trailer row count.</dd>
<dt>Object storage</dt><dd>Cheap, durable storage for files of any size, addressed by bucket and path (S3, Azure Blob, Google Cloud Storage).</dd>
<dt>Physical meaning</dt><dd>Least privilege gets you to production faster: ask for <code>Sites.Selected</code> on one SharePoint site, not access to every file in the company. Narrow requests are approved in days, wide ones in months. And keep each vendor's SFTP key separately, rotated, in a vault, because the day a vendor moves servers is the day you find out whether you can still find the key.</dd>
</dl>

</div>

<div class="myth">

**"If the file is in the folder, it is ready."** A file appears the moment an upload starts, long before it ends. Reading it then gives you half the rows and no error. Wait for the agreed completion signal, or for a size that stays the same between two checks.

</div>

## 6. Try it

1. Run MinIO locally: `docker run -p 9000:9000 -p 9001:9001 -e MINIO_ROOT_USER=minio -e MINIO_ROOT_PASSWORD=minio123 quay.io/minio/minio server /data --console-address :9001`, and create a bucket called `raw`. No Docker? Use a local folder with `fsspec.filesystem("file")`; the code is the same.
2. Run a local SFTP server: `docker run -p 2222:22 -v $PWD/data/landing/sftp/hotel:/home/pms/upload atmoz/sftp pms:pass:1001`. Pull from it with paramiko (password sign-in is fine for local practice only).
3. Write `sources/sftp.py`: skip `.partial` files and land the rest to the bucket through the Lesson 1.3 manifest.
4. Make the raw location a URL setting (`P2D_RAW_URL=s3://raw` or `file://./data/raw`) and use fsspec everywhere. Run the email and folder landers against MinIO with no code changes.
5. Write a one-page `docs/transfer-choices.md`: for a Microsoft 365 company, a Google company and a company with no licences, which tool would you use for each source, and why?

Commit: `feat(ingest): sftp source and fsspec raw zone (local or S3-compatible)`.

**What to check:** the generated hotel data has at least one late file ending in `.txt.partial`. Your SFTP lander must skip it, then land it once you rename it to `.txt`.

## 7. Practice

1. The vendor has no completion signal and you cannot change that. What do you do?
2. Your delta link is lost. What is the safe recovery?
3. Why should the raw path be a setting rather than written into the code?

<details>
<summary>Answers</summary>

1. Use the size-stable check (size the same across two looks a minute or so apart), and still validate row counts or trailers in staging.
2. Do a full listing once and land through the manifest. The hashes skip everything you already have, so the only cost is time. Then save the new delta link.
3. The same code then runs on a laptop folder, MinIO, S3 or Azure storage. Moving to the cloud becomes a change of setting, not a rewrite.
</details>

**New words:** *SharePoint drive*, *delta query*, *eTag*, *SFTP*, *host key*, *completion signal*, *object storage*, *bucket*, *fsspec*.

<div class="keypoints">

- Ask for changes, not full listings: Graph delta, Drive's changes API, or your own set difference.
- Never read an upload until it is finished: use an agreed signal, or a size that stops changing.
- Refuse unknown SFTP host keys in production, and keep each vendor's key in a vault.
- Treat the raw zone as a bucket and address it with one URL setting through fsspec.

</div>
