---
name: URL encoder
num: 2002
shelf: everyday
code: T850
section: encode-decode
title: "URL encoder: encode and decode URLs, percent-encoding and query strings"
summary: "Percent-encode text for a web address and decode it back, as a part (encodeURIComponent) or a whole address (encodeURI), and read a pasted address's query string as a table."
status: live
ads: false
order: 2002
icon: link
works: offline
updated: 2026-11-10
related: [base64-converter, link-cleaner]
sources:
  - "RFC 3986, Uniform Resource Identifier: Generic Syntax (IETF), section 2 on percent-encoding; the WHATWG URL Standard for query strings and + as a space in forms."
flow:
  - { icon: pencil, label: "Paste" }
  - { icon: link, label: "Encode" }
  - { icon: table, label: "Read" }
---

## What it does

Web addresses may only contain a small set of characters. Spaces, accents, & and = inside a value must be written as % followed by two hex digits, such as %20 for a space. This page encodes text that way as you type, and decodes percent-encoded text back to plain words. A second box reads any address and lists its query string (the part after ?) as a table of keys and values.

Everything runs in your browser and nothing is sent anywhere. To strip tracking tags from a link first, use the [[link-cleaner]]; to carry bytes rather than text, use the [[base64-converter]].

## How to use it

1. Pick what the text is for: a part of an address, or a whole address.
2. Type in **Plain text** to encode, or paste in **Encoded** to decode. The other box follows.
3. Press **Copy encoded**, or **Clear** to start again.
4. Paste a full address in **Web address** to see each parameter on its own row, already decoded.

## What each setting does

- **A part of an address (encodeURIComponent)**: encodes everything except letters, digits and - _ . ! ~ * ' ( ). Use it for one search term or value.
- **A whole address (encodeURI)**: leaves : / ? # & = alone so the address still works, and only encodes spaces and other unsafe characters.
- **Spaces as +**: writes spaces as + the way HTML forms do, and reads + as a space when decoding.

## Worked example

Encoding **a b&c=d** as a part gives **a%20b%26c%3Dd**: the space becomes %20, & becomes %26 and = becomes %3D. Paste h%C3%A9llo%20world in Encoded and you get héllo world. As a whole address, a b&c=d becomes a%20b&c=d instead, because & and = have a meaning there.

The address **https://x.com/?q=fibub&n=2** gives a table of 2 rows: q = fibub and n = 2.

## FAQs

**Why does it say it cannot be decoded?** A % must be followed by two hex digits that make valid UTF-8. "100%" on its own or "%zz" is broken.

**Which mode should I use?** For a value you put after = in a link, use the part mode. Use the whole address mode only for a full link that has spaces in it.

**Why is é two codes?** In UTF-8, é is two bytes, so it becomes %C3%A9.