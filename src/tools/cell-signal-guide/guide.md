---
name: Cell Signal
num: 2126
shelf: everyday
code: T952
section: connection
title: "Cell signal checker: which mobile network is strongest in my area (Canada, India, UK, USA)"
seoTitle: "Cell signal checker: strongest mobile network near me"
summary: "Find which mobile network is strongest where you live: official coverage maps and tower data for Canada, India, the UK and the USA, a reader for your phone's dBm signal number, and a log to compare networks place by place."
status: live
ads: false
order: 2126
icon: flag
works: offline
updated: 2026-11-14
related: [internet-speed-test, wifi-spot-finder]
sources:
  - "Signal bands (LTE and 5G RSRP: -80 / -90 / -100 / -110 dBm; 3G RSCP and 2G RSSI: -70 / -85 / -100 / -110 dBm; SINR 0 / 13 / 20 dB) are widely used rules of thumb from operators and equipment makers, not a standard. The bars-to-dBm conversion is a rough LTE guide."
  - "Coverage maps and tower data: ISED and CRTC (Canada), TRAI and the Department of Telecommunications' Tarang Sanchar (India), Ofcom (UK), FCC (USA); CellMapper is crowd-sourced. Network lists and links checked 2026-11-14; check the official source."
  - "Speed checks use Cloudflare's public speed test server, as in fibub's Speed Test. The sample readings are made up by fibub."
flow:
  - { icon: flag, label: "Country" }
  - { icon: target, label: "Read dBm" }
  - { icon: table, label: "Log" }
  - { icon: chart, label: "Compare" }
---

## What it does

Cell Signal helps you choose the mobile network that works best where you live, work and travel. **A web page cannot scan cell towers or read your phone's signal**: no browser on Android or iPhone allows it, and any site claiming to do so is guessing. So this tool does the three things that do work:

1. **Official maps for your country.** Pick Canada, India, the UK or the USA to get the regulator's coverage map, the networks (and the brands that ride on them) and where to find official tower locations.
2. **Rate the signal number your phone shows.** Bars differ between phones; the number in dBm does not. Type it in with the network type (5G, 4G, 3G, 2G) and get a plain rating, with SINR if your phone shows it.
3. **Log readings and compare.** Add readings for each network you can test, in each place, with an optional short speed test and a rough location. The table ranks networks by average signal and shows their speeds.

Supported now: **Canada, India, the UK and the USA**. To measure your mobile data speed in detail, use the [[internet-speed-test|Speed Test]] with Wi-Fi off; for Wi-Fi at home, the [[wifi-spot-finder]].

## How to use it

1. Choose your country and open the official map. Check your address for each network, indoors.
2. Find your phone's dBm number: on Android, Settings, About phone, SIM status, Signal strength. iPhones only show it in Field Test mode on some models.
3. Type it into **Rate your phone's signal number** to see what it means.
4. In **Log readings**, type the place and network, the type and the dBm (or bars), then press **Add reading**. Press **Add with speed test** instead to time the data connection too (turn Wi-Fi off first).
5. Repeat with friends' or family members' phones on other networks, or a second SIM. Download the CSV to keep the record.

## What each setting does

- **Network type**: the ratings differ: 3G and 2G numbers run higher than 4G and 5G RSRP for the same quality.
- **SINR**: signal against noise. A strong signal with low SINR (crowded or interfered cell) can still be slow.
- **Add my rough location**: rounds your position to about 100 m and keeps it on this device only.
- **Keep my readings on this device**: off by default.

## Worked example

On 4G, -95 dBm RSRP rates **Fair**: usable, but video may buffer at busy times. With SINR 15 dB the line is clean. The sample log compares three made-up networks at home and work: Network B averages -94 dBm and leads on signal, but Network A gives faster data at home, which is why the table shows both.

## FAQs

**Can it list the towers around me?** Not from the phone's radio. The official and crowd-sourced tower maps linked for your country show them.

**Is anything uploaded?** Only random test bytes during a speed check. Readings and locations stay on your device.
