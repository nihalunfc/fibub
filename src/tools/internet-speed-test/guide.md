---
name: Speed Test
num: 2124
shelf: everyday
code: T950
section: connection
title: "Internet speed test: download, upload, ping and jitter, with no app or sign-up"
seoTitle: "Internet speed test: download, upload, ping, jitter"
summary: "Test your internet speed in the browser: download and upload in Mbps, ping, jitter and ping while the line is busy (bufferbloat), with what the result is good for. For Canada, India, the UK and the USA."
status: live
ads: false
order: 2124
icon: chart
works: online
updated: 2026-11-14
related: [wifi-spot-finder, cell-signal-guide, unit-converter]
sources:
  - "Test server: Cloudflare's public speed test server (speed.cloudflare.com), the one behind Cloudflare's open-source @cloudflare/speedtest library (MIT). Only random test bytes are sent; fibub does not report results to Cloudflare or anyone else."
  - "Jitter is the average change between back-to-back pings, as most speed tests report it. Download and upload are the 90th percentile of the timed transfers; ping is the median."
  - "'Good enough for' thresholds are rounded from public guidance by streaming and video-call services (about 5 Mbps for HD video, 15 to 25 Mbps for 4K, about 3 Mbps each way for HD video calls) and common gaming advice (ping under 60 ms)."
  - "Official checkers: CIRA (Canada), TRAI MySpeed (India), Ofcom (UK), FCC (USA); links checked 2026-11-14."
flow:
  - { icon: pointer, label: "Start" }
  - { icon: clock, label: "Ping" }
  - { icon: download, label: "Download" }
  - { icon: chart, label: "Results" }
---

## What it does

The Speed Test measures how fast your internet really is right now, from the device you are holding. It shows **download** and **upload** speed in megabits per second (Mbps), **ping** (how long a tiny message takes to get to the server and back), **jitter** (how much the ping jumps around) and **ping while busy**, which shows *bufferbloat*: a line that feels laggy on video calls while someone else is downloading. It then tells you plainly what the connection is good enough for: web pages, HD or 4K video, video calls, online games and big uploads.

It works anywhere and is made for **Canada, India, the UK and the USA**, with links to each country's official checker. There is no app, no sign-up and no tracking. To find the room where your Wi-Fi works best, use the [[wifi-spot-finder]]; to compare mobile networks where you live, use [[cell-signal-guide|Cell Signal]].

## How to use it

1. Close other apps and tabs that are downloading or streaming, so you measure the line and not your own traffic.
2. Pick **Light test** (about 15 seconds, up to about 25 MB) or **Full test** (about 30 seconds; up to about 200 MB on a very fast line, so it measures gigabit plans better).
3. Press **Start**. The bar shows ping first, then download, then upload.
4. Read the results and the "Good enough for" list. Press **Copy results** to paste them into a message to your provider.
5. Tick **Keep my results on this device** if you want to compare times of day, such as 8 am and 9 pm.

## What each result means

- **Download**: how fast data reaches you. Streaming, browsing and app updates depend on it.
- **Upload**: how fast you send data. Video calls, cloud backups and posting videos depend on it.
- **Ping (idle)**: round trip in milliseconds with the line quiet. Under 30 ms is excellent, under 60 ms good.
- **Jitter**: under 10 ms is steady. High jitter makes calls robotic and games stutter.
- **Ping while busy**: if it is 100 ms or more above the idle ping, your router lets downloads crowd out everything else. Turning on "SQM" or "Smart Queue" in the router settings often fixes it.
- **Your connection**: your IP address, IPv4 or IPv6, the nearest Cloudflare data centre and, when available, your provider's network name. Every website already sees these; fibub shows them and keeps nothing.

## Worked example

A home in Ontario on a "300 Mbps" cable plan runs the Full test over Wi-Fi in the kitchen: 212 Mbps down, 18.4 Mbps up, ping 14 ms, jitter 2 ms, ping while busy 95 ms. The page says it is fine for 4K video and video calls, and shows "Bufferbloat: Some". On a cable next to the router the download reads 296 Mbps, so the plan is delivered and the kitchen Wi-Fi is the limit; that is a job for the Wi-Fi Finder.

## Why results differ from other speed tests

Every test uses different servers, file sizes and maths. Results vary with time of day, Wi-Fi, other devices and the server's distance. Run it three times and look at the middle result.

## FAQs

**Does it use my data plan?** Yes, the test downloads and uploads real bytes. The light test is the right choice on mobile data.

**Is anything stored?** No. Results stay on the page, and in your browser only if you tick the box. The test server sees your IP address, as every website does.

**It says the server cannot be reached.** Some work, school and hotel networks, ad blockers and firewalls block speed test servers. Try another network.

**Can it measure packet loss?** Not reliably from a web page, so it does not pretend to.
