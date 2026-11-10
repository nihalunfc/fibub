---
name: Base64 converter
num: 2001
shelf: everyday
code: T877
section: encode-decode
title: "Base64 converter: encode and decode text and files, URL-safe option"
summary: "Turn text into Base64 and back (UTF-8 safe, so accents and emoji work), switch to URL-safe Base64, turn a file into Base64 or a data: URL, and save Base64 back as a file."
status: live
ads: false
order: 2001
icon: convert
works: offline
updated: 2026-11-10
related: [url-encoder, hash-checker, jwt-decoder]
sources:
  - "RFC 4648, The Base16, Base32, and Base64 Data Encodings (IETF), sections 4 (standard) and 5 (URL-safe). RFC 2397 for data: URLs."
flow:
  - { icon: pencil, label: "Type" }
  - { icon: convert, label: "Convert" }
  - { icon: copy, label: "Copy" }
---

## What it does

Base64 writes any bytes using only 64 safe characters (A-Z, a-z, 0-9, + and /), so binary data can travel inside email, JSON, web pages and settings files. This page converts both ways as you type: write text in the top box and the Base64 appears below; paste Base64 below and the text appears above.

Text is turned into UTF-8 bytes first, so accents, other scripts and emoji survive the round trip. Everything runs in your browser and nothing is sent anywhere. To make text safe inside a web address use the [[url-encoder]]; to read the parts of a login token, which are Base64, try the [[jwt-decoder]].

## How to use it

1. Type or paste text in **Text**, or Base64 in **Base64**. The other box updates at once.
2. Tick **URL-safe** if the result goes into a web address or file name.
3. Press **Copy Base64**, or **Clear** to start again.
4. For a file, use **Choose a file**. To turn Base64 back into a file, paste it in the Base64 box, give a file name and press **Download file**.

## What each setting does

- **URL-safe**: uses - and _ instead of + and /, and drops the = padding at the end (RFC 4648 section 5).
- **Add the data: URL start**: puts `data:<file type>;base64,` in front, so you can paste it straight into an HTML `src` or CSS `url()`.
- **File name**: the name the downloaded file gets.

Decoding accepts both the standard and URL-safe alphabets, spaces and line breaks, and Base64 with or without padding, including a whole data: URL.

## Worked example

The word **héllo** is 5 characters but 6 bytes in UTF-8, because é takes two. Its Base64 is **aMOpbGxv**. Pasting aMOpbGxv in the Base64 box gives back héllo. The text "??>" shows the difference between the alphabets: standard Base64 is Pz8+, URL-safe is Pz8-.

## FAQs

**Is Base64 encryption?** No. Anyone can decode it. It only changes how bytes are written.

**Why is the result longer?** Every 3 bytes become 4 characters, so Base64 is about a third bigger.

**It says the result is not text.** The Base64 holds a file such as an image. Use **Download file** to save it.

**What does the error about characters mean?** Something other than the Base64 alphabet is in the box, often a stray quote or a percent sign.
