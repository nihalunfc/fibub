---
name: Wi-Fi Finder
num: 2125
shelf: everyday
code: T951
section: connection
title: "Wi-Fi spot finder: find the room with the best Wi-Fi and dead zones at home"
seoTitle: "Wi-Fi spot finder: best Wi-Fi room and dead zones"
summary: "Walk around your home or office, test each spot and see which one gives the best real connection, with a live walking test that shows dead zones. Explains why Wi-Fi bars and real speed differ."
status: live
ads: false
order: 2125
icon: target
works: online
updated: 2026-11-14
related: [internet-speed-test, cell-signal-guide]
sources:
  - "Measurements: timed downloads, uploads and pings against Cloudflare's public speed test server (speed.cloudflare.com), as in fibub's Speed Test. Only random test bytes are sent."
  - "Score weights (download 45%, ping 25%, upload 20%, jitter 10%, on log scales for speed) are fibub's own choice to rank spots, not a standard."
  - "Wi-Fi dBm bands (-55 / -67 / -75 / -85) are common rules of thumb from Wi-Fi equipment makers for data, voice and video; they are guides."
  - "The sample spots are made up by fibub."
flow:
  - { icon: pencil, label: "Name spot" }
  - { icon: target, label: "Test" }
  - { icon: chart, label: "Compare" }
---

## What it does

Wi-Fi Finder helps you find the best place in your home or office to work, take video calls or put a smart TV, and the places where the Wi-Fi gives up. You stand in a spot, give it a name and press **Test this spot**. It measures download, upload, ping and jitter in about 10 seconds, gives the spot a score from 0 to 100, and ranks every spot you test with a bar chart. The **walk and watch** mode sends one tiny request a second while you walk, so you see the connection get worse as you head for the back bedroom.

**Wi-Fi signal and connectivity are not the same thing.** Signal is how loudly your device hears the router; connectivity is how well data actually gets through. Full bars can be slow when the router, a crowded channel or your plan is the bottleneck, and two bars can be fine for a call. Browsers are not allowed to read Wi-Fi signal strength, so this tool measures connectivity, which is what you feel, and lets you type in the bars or dBm your device shows so you can see both side by side. It works on any Wi-Fi and is made for homes in **Canada, India, the UK and the USA**. For one full measurement of your line, use the [[internet-speed-test|Speed Test]]; for mobile networks, [[cell-signal-guide|Cell Signal]].

Why full bars can still be slow, good Wi-Fi dBm values and where to put a router are explained in [[blog:guides/wifi-spot-finder|full Wi-Fi bars but slow internet]].

## How to find the best Wi-Fi spot

1. Stand where you would really use the device: on the sofa, at the desk, by the bed.
2. Type a spot name and, if you like, the bars or dBm your device shows.
3. Press **Test this spot**. Wait about 10 seconds. Move to the next spot and repeat.
4. Read the ranking. The page points out any spot where strong bars give a poor connection, or the other way round.
5. To hunt for dead zones, press **Start walking test** and walk slowly. Green bars are good, amber so-so, red poor; "Lost" means nothing came back within 2 seconds.

## What each setting does

- **Spot name**: up to 30 characters; it is only shown on this page.
- **Signal your device shows**: optional; bars or a dBm number. Used only to flag mismatches.
- **Keep my spots on this device**: off by default; when on, spots stay in this browser until you clear them.

## Worked example

The sample house has five spots. The living room scores highest (210 Mbps, ping 14 ms). The back porch shows full bars but only 4 Mbps and 120 ms ping, so the page says the router or a busy channel is the problem there, not distance: an extender would not help, but changing the router's channel might. The basement, with one bar and 2.4 Mbps, needs a mesh point or a wired access point.

## FAQs

**Why can't it show signal strength in dBm?** Web pages are not given access to Wi-Fi radio details on any system. The page shows how to read it on Windows, Mac and Android.

**How much data does it use?** Up to about 8 MB per spot test, and about 1 MB per 10 minutes of walking test.

**Is anything uploaded?** Only random test bytes. Spot names and results never leave your device.
