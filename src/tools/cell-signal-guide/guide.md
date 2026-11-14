---
name: Cell Signal
num: 2126
shelf: everyday
code: T952
section: connection
title: "Cell signal checker: which mobile network is strongest in my area (Canada, India, UK, USA)"
seoTitle: "Cell signal checker: strongest mobile network near me"
summary: "See every mobile network with cells near you the moment you open it, then walk around and watch it update. Plus official coverage maps for Canada, India, the UK and the USA, a dBm signal reader and a log to compare networks."
status: live
ads: false
order: 2126
icon: flag
works: online
updated: 2026-11-14
related: [internet-speed-test, wifi-spot-finder]
sources:
  - "Signal bands (LTE and 5G RSRP: -80 / -90 / -100 / -110 dBm; 3G RSCP and 2G RSSI: -70 / -85 / -100 / -110 dBm; SINR 0 / 13 / 20 dB) are widely used rules of thumb from operators and equipment makers, not a standard. The bars-to-dBm conversion is a rough LTE guide."
  - "Coverage maps and tower data: ISED and CRTC (Canada), TRAI and the Department of Telecommunications' Tarang Sanchar (India), Ofcom (UK), FCC (USA); CellMapper is crowd-sourced. Network lists and links checked 2026-11-14; check the official source."
  - "Networks near you: cell records from OpenCelliD (opencellid.org), CC BY-SA 4.0, grouped into squares of about 1 km per carrier by fibub (data in /cells/, shared under CC BY-SA 4.0; rebuilt monthly by .github/workflows/cells.yml). Carrier names from the public MCC-MNC table, normalised to brands by fibub. The 'likely signal' labels are fibub's rules of thumb from the distance to the nearest 4G/5G cells, not measurements."
  - "Speed checks use Cloudflare's public speed test server, as in fibub's Speed Test. The sample readings are made up by fibub."
flow:
  - { icon: pointer, label: "Locate" }
  - { icon: target, label: "Networks" }
  - { icon: table, label: "Log" }
  - { icon: chart, label: "Compare" }
---

## What it does

Cell Signal shows which mobile networks have cells around you as soon as you open it, so you can choose a house, an office desk, a café or a town with good coverage for your carrier, or pick a carrier that suits the places you spend time.

1. **Networks near you.** Allow location and the page lists every network with cells nearby, nearest first: how far the closest cell is, how many 5G, 4G and 3G/2G cells sit within 1, 3 or 10 km, and a plain "likely signal" label. A small map shows the cells around you in one colour per network. Tick **Keep updating as I move** and walk around: it redraws every 50 m or so. You can also paste a place's coordinates to check a house before you visit.
2. **Official maps for your country.** The regulator's coverage checker, the networks (and the brands that use them) and where to find official tower records.
3. **Rate and log your phone's own signal.** Type the dBm number your phone shows to get a rating, and log readings for each network you can test, with an optional speed test.

**What it cannot do:** web pages are not allowed to read your phone's radio on Android or iPhone, so no website can measure other networks' signal directly. "Networks near you" uses OpenCelliD, an open database of cells reported by phones worldwide, so it shows where each network has cells, which is a strong guide to coverage but not a measurement. Walls, hills and busy cells change the real signal; confirm with a phone on that network. Your exact location stays on your device: the page downloads the tower file for your area (about 100 km across) from fibub.com and works everything out on your phone.

Supported now: **Canada, India, the UK and the USA**. To measure your mobile data speed, use the [[internet-speed-test|Speed Test]] with Wi-Fi off; for Wi-Fi at home, the [[wifi-spot-finder]].

What RSRP, RSRQ and SINR mean and which values count as good are explained in [[blog:guides/cell-signal-guide|what is a good cell signal in dBm]].

## How to find the strongest network near you

1. Open the page and allow location. Read **Networks near you**; tick **Keep updating as I move** and walk the house, street or town.
2. Choose your country under Official coverage maps and check your address for each network, indoors.
3. Find your phone's dBm number: on Android, Settings, About phone, SIM status, Signal strength. iPhones only show it in Field Test mode on some models.
4. Type it into **Rate your phone's signal number** to see what it means.
5. In **Log readings**, type the place and network, the type and the dBm (or bars), then press **Add reading**. Press **Add with speed test** instead to time the data connection too (turn Wi-Fi off first).
6. Repeat with friends' or family members' phones on other networks, or a second SIM. Download the CSV to keep the record.

## What each setting does

- **Network type**: the ratings differ: 3G and 2G numbers run higher than 4G and 5G RSRP for the same quality.
- **SINR**: signal against noise. A strong signal with low SINR (crowded or interfered cell) can still be slow.
- **Add my rough location**: rounds your position to about 100 m and keeps it on this device only.
- **Keep my readings on this device**: off by default.

## Worked example

On 4G, -95 dBm RSRP rates **Fair**: usable, but video may buffer at busy times. With SINR 15 dB the line is clean. The sample log compares three made-up networks at home and work: Network B averages -94 dBm and leads on signal, but Network A gives faster data at home, which is why the table shows both.

## FAQs

**Can it list the towers around me?** Yes, from open data: Networks near you shows each network's cells around you. It cannot read your phone's radio, so it shows where cells are, not the live signal.

**How fresh is the tower data?** It is rebuilt every month from OpenCelliD and leaves out cells nobody has seen for three years. The date is shown under the results.

**Is anything uploaded?** No. Your location is used on your device only; the page downloads the tower file for your general area. Speed checks send only random test bytes. Readings stay on your device.
