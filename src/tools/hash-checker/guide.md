---
name: Hash checker
num: 2004
shelf: everyday
code: T852
section: encode-decode
title: "Hash checker: SHA-256, SHA-1, SHA-512 and MD5 checksum of text or a file"
summary: "Work out the SHA-256, SHA-512, SHA-384, SHA-1 and MD5 hash of text or a file in your browser, and paste an expected checksum to see whether it matches."
seoTitle: "Hash checker: SHA-256 and MD5 checksum, free online tool"
status: live
ads: false
order: 2004
icon: check
works: offline
updated: 2026-11-10
related: [base64-converter, jwt-decoder, uuid-generator]
sources:
  - "FIPS 180-4, Secure Hash Standard (NIST) for SHA-1 and SHA-2, run by the browser's Web Crypto; RFC 1321 (IETF) for MD5, fibub's own small implementation."
flow:
  - { icon: file, label: "Add" }
  - { icon: lock, label: "Hash" }
  - { icon: check, label: "Compare" }
---

## What it does

A hash is a short fingerprint of some data. Change one letter or one byte and the fingerprint changes completely. Download sites often print a SHA-256 or MD5 checksum next to a file so you can check that your copy arrived whole and was not swapped. This page works out five hashes at once for typed text or a file, and compares them with a checksum you paste.

Files are read on your device and never uploaded, so it also works with large or private files and with no internet once the page is open. To turn the raw bytes into text instead use the [[base64-converter]]; to read the parts of a login token try the [[jwt-decoder]].

## How to use it

1. Pick **Text** and type, or pick **File** and choose a file. The hashes appear below.
2. To check a download, paste the published checksum in **Expected hash**.
3. A green **Match** names the kind of hash that matched; otherwise you see **No match**.
4. Use **Copy** next to any hash, or **Clear** to start again.

## What each part does

- **SHA-256**: the usual choice today, 64 hex characters.
- **SHA-512 and SHA-384**: longer members of the same SHA-2 family.
- **SHA-1**: 40 characters; old and no longer safe against deliberate forgery.
- **MD5**: 32 characters; old and not secure, but still printed on many download pages.
- **Expected hash**: compared with all five, ignoring upper or lower case, spaces and a label such as "sha256:" in front.

Text is hashed as UTF-8 bytes, exactly as typed, so a space or line break at the end changes the result.

## Worked example

The text **abc** is 3 bytes. Its SHA-256 is ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad and its MD5 is 900150983cd24fb0d6963f7d28e17f72, the test values given in FIPS 180 and RFC 1321. Pasting the SHA-256 in capitals still shows "Match: this is the SHA-256 hash". A file holding just abc gives the same hashes.

## FAQs

**Why does my text not match?** Check for a trailing space or line break, and that the other side hashed the same text encoding.

**Can a hash be reversed?** No. You can only hash a guess and compare.

**Is this for storing passwords?** No. Passwords need slow, salted schemes such as bcrypt or Argon2, not a plain hash.
