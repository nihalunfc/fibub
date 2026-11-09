---
name: Checksum checker
num: 818
shelf: science
section: data-management
title: "Checksum checker: SHA-256, MD5 and CRC32 for many files, sha256sum and BagIt manifests, verify downloads"
summary: "Make SHA-256, SHA-512, SHA-1, MD5 or CRC32 checksums for a whole folder of files, save them as a sha256sum, BSD or BagIt manifest, and check files against a manifest you were given: match, does not match, missing or extra. Nothing is uploaded."
status: live
ads: false
order: 818
icon: check
works: offline
updated: 2026-11-09
related: [science-file-converter, zip-checker, dataset-readme, metadata-builder, data-management-plan, compress-file, cipher-teacher]
sources:
  - "SHA-1, SHA-256 and SHA-512 come from the browser's Web Crypto API. MD5 (RFC 1321) and CRC-32 (the zlib / ZIP polynomial) are written by fibub."
  - "Manifest formats: GNU coreutils sha256sum (including its escaping of unusual file names), the BSD tag format, and BagIt payload manifests (RFC 8493)."
  - "Checked in the tests against Python's hashlib and zlib.crc32, the RFC 1321 test strings, sha256sum -c, md5sum -c and the Python bagit library."
  - "The example files are made up by the page. Your files are read on the page only and never uploaded or stored."
flow:
  - { icon: file, label: "Files" }
  - { icon: lock, label: "Checksums" }
  - { icon: download, label: "Manifest" }
  - { icon: check, label: "Verify" }
---

## What it does

A checksum is a short fingerprint of a file. If even one byte of the file changes, the checksum changes. Archives, data repositories and download pages publish checksums so you can prove a file arrived complete and unchanged, and data management plans ask for them so a dataset can be checked years later. This page:

- makes **SHA-256, SHA-512, SHA-1, MD5 and CRC32** checksums for as many files as you like (up to 5,000 at a time), including whole folders;
- writes a **manifest**, the list of checksums and file names, in the format your tools expect;
- **checks files against a manifest** and tells you, file by file, whether each one matches, does not match, is missing or is not in the manifest.

List the files and their checksums in a [[dataset-readme|dataset README]], and see how SHA-256 works inside with the [[cipher-teacher|cipher and hash teaching tool]].

## How to use it

1. **Choose files** or **Choose a folder** (or drop them on the page). Picking a folder keeps the folder names in the paths, such as `survey/raw/day1.csv`.
2. Tick the **checksums to make**. SHA-256 is the usual choice. MD5 and SHA-1 are still common in older manifests and some repositories; they catch accidental damage well but are no longer trusted against deliberate tampering. CRC32 is the quick check stored in ZIP files.
3. The table fills in as the files are read. SHA checksums are made by your browser, which needs the whole file in memory, so they are limited to 2 GB per file; MD5 and CRC32 are read in 8 MB pieces and work for any size.
4. Under **Make a manifest**, pick the checksum and the format:
   - **sha256sum / md5sum**: `checksum  path` on each line, two spaces between. Check it later on Linux or macOS with `sha256sum -c SHA256SUMS.txt`. Names with a backslash or a line break are escaped the way coreutils does.
   - **BSD tag**: `SHA256 (path) = checksum`, the format of `sha256sum --tag` and macOS `shasum`.
   - **BagIt**: the payload manifest of a BagIt bag (`manifest-sha256.txt`), one space between, every path under `data/`. The page also gives you the Payload-Oxum for `bag-info.txt`.
5. To **check** files, paste a manifest (or open one) and choose the files or folder. The checksum type is read from the manifest. A single checksum copied from a download page is compared with the one file you chose.

## Worked example

Press **Try the example files**. The page makes three small made-up files and a manifest with three lines. `readings.csv` has the SHA-256 `1e05c2ec8a20bf845af9d16e6020dfd0777e4592be30a204f03fd509dbd7033e` and its line matches. The line for `notes.txt` has its first character changed, so it **does not match**. `calibration.csv` is in the manifest but was not chosen, so it is **missing**, and `photo-log.txt` was chosen but is **not in the manifest**. The result reads "✗ 1 match, 1 do not match, 1 missing, 1 not in the manifest". Tick MD5 and the table adds `3f24293b9689cd621e736fdaefc07e78` for `readings.csv`.

## Tips

- If a folder was picked one level higher or lower than the manifest expects (for example the manifest says `data/raw/a.csv` and you picked the `raw` folder), the page still pairs the files by the end of their paths, as long as only one file fits.
- Download the results as CSV to keep a record of the check with your data.
- Upper-case checksums, comment lines starting with `#` and the `*` binary marker of `md5sum -b` are all accepted.

## FAQ

**Are my files uploaded?** No. They are read by code on this page and never leave your device. Once the page is open it works offline.

**Which checksum should I use?** SHA-256 for anything new. Use the checksum type that a repository or the person you are sending data to asks for.

**Why does a file that looks the same not match?** Any change counts: a different line ending (Windows and Mac), a spreadsheet saved again, or a download that stopped early.
