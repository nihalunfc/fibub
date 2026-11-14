---
title: "What is a good cell signal in dBm? RSRP and SINR explained"
summary: "How to read your phone's signal number (RSRP, RSRQ, SINR), what good and bad values are for 4G and 5G, and how to compare networks where you live in Canada, India, the UK and the USA."
tools: [cell-signal-guide, internet-speed-test, wifi-spot-finder]
updated: 2026-11-14
sources:
  - "LTE and 5G RSRP bands (-80, -90, -100 and -110 dBm) and SINR bands (0, 13 and 20 dB) are widely used rules of thumb from operators and equipment makers, not a standard. The chart uses the Cell Signal tool's own rating code (src/lib/net/cell.ts) on made-up readings."
  - "Regulators named: ISED and the CRTC (Canada), TRAI and the Department of Telecommunications (India), Ofcom (UK), the FCC (USA). Check the official source; services and links change."
---

Signal bars are drawn differently by every phone maker, so three bars on one phone can be one bar on another. The number behind the bars, in **dBm**, is the same everywhere. This guide explains what the number means for 4G and 5G, what counts as good, and how to compare mobile networks fairly where you live. To rate your own reading and log readings for each network, use [[cell-signal-guide|Cell Signal]]; to measure mobile data speed, turn Wi-Fi off and [[internet-speed-test|test your internet speed]].

## What it is

Phones report several numbers. The three that matter on 4G LTE and 5G:

- **RSRP** (Reference Signal Received Power): how strong the tower's signal is at your phone, in dBm. Closer to zero is stronger. This is the main "signal strength" number.
- **RSRQ** (Reference Signal Received Quality): how clean the signal is compared to everything else the phone hears, in dB. Around -10 dB or better is good; below -15 dB is poor.
- **SINR** (Signal to Interference plus Noise Ratio), sometimes SNR: how far the wanted signal stands above interference and noise, in dB. Higher is better. It decides how fast data can flow.

On 3G the strength number is **RSCP** and on 2G it is **RSSI**. Their good values sit higher (less negative) than RSRP, so always say which one you mean.

| 4G or 5G RSRP | Rating | SINR | Rating |
|---|---|---|---|
| -80 dBm or more | Excellent | 20 dB or more | Very clean |
| -80 to -90 | Good | 13 to 20 | Clean |
| -90 to -100 | Fair | 0 to 13 | Some interference |
| -100 to -110 | Poor | below 0 | Heavy interference |
| below -110 | Very poor | | |

A strong RSRP with low SINR is common in busy city centres: the tower is close but so are others. That is why a full-bar phone can still be slow.

## What a web page can and cannot do

No browser lets a website read your phone's radio, so no site can measure another network's live signal. What a page can do is look up where each network has cells. Cell Signal does that from OpenCelliD, an open database of cells reported by phones, and shows the networks around you as soon as you open it. Close 4G and 5G cells are a strong guide to good coverage; your own phone's dBm number, and a speed test on mobile data, confirm it.

## How to use it

1. Open Cell Signal and allow location: **Networks near you** lists the carriers with cells around you. Then pick your country (Canada, India, the UK or the USA) and check the official map for each network, indoors.
2. Find the dBm number on your phone. On Android: Settings, About phone, SIM status, Signal strength. On some iPhones, Field Test mode shows RSRP.
3. Type it into **Rate your phone's signal number**, with the network type and SINR if shown.
4. Log a reading for each network you can test (family members' phones, a second SIM) in each place that matters.
5. Use **Add with speed test** with Wi-Fi off to record real data speed too.
6. Compare the averages in the table, and download the CSV.

## A worked example

The chart places three made-up networks on the tool's LTE bands, each from two readings (home and work).

## Checked with the tools

<!-- fig:lte-bands --><figure class="fig"><svg viewBox="0 0 640 150" width="100%" role="img" aria-label="LTE signal bands used by the Cell Signal tool, with the average of two made-up readings per network placed on them."><rect x="20.0" y="40" width="10.5" height="26" style="fill:var(--bad);opacity:1"/><rect x="30.0" y="40" width="10.5" height="26" style="fill:var(--bad);opacity:1"/><rect x="40.0" y="40" width="10.5" height="26" style="fill:var(--bad);opacity:1"/><rect x="50.0" y="40" width="10.5" height="26" style="fill:var(--bad);opacity:1"/><rect x="60.0" y="40" width="10.5" height="26" style="fill:var(--bad);opacity:1"/><rect x="70.0" y="40" width="10.5" height="26" style="fill:var(--bad);opacity:1"/><rect x="80.0" y="40" width="10.5" height="26" style="fill:var(--bad);opacity:1"/><rect x="90.0" y="40" width="10.5" height="26" style="fill:var(--bad);opacity:1"/><rect x="100.0" y="40" width="10.5" height="26" style="fill:var(--bad);opacity:1"/><rect x="110.0" y="40" width="10.5" height="26" style="fill:var(--bad);opacity:1"/><rect x="120.0" y="40" width="10.5" height="26" style="fill:var(--bad);opacity:1"/><rect x="130.0" y="40" width="10.5" height="26" style="fill:var(--bad);opacity:1"/><rect x="140.0" y="40" width="10.5" height="26" style="fill:var(--bad);opacity:1"/><rect x="150.0" y="40" width="10.5" height="26" style="fill:var(--bad);opacity:1"/><rect x="160.0" y="40" width="10.5" height="26" style="fill:var(--bad);opacity:1"/><rect x="170.0" y="40" width="10.5" height="26" style="fill:var(--bad);opacity:0.75"/><rect x="180.0" y="40" width="10.5" height="26" style="fill:var(--bad);opacity:0.75"/><rect x="190.0" y="40" width="10.5" height="26" style="fill:var(--bad);opacity:0.75"/><rect x="200.0" y="40" width="10.5" height="26" style="fill:var(--bad);opacity:0.75"/><rect x="210.0" y="40" width="10.5" height="26" style="fill:var(--bad);opacity:0.75"/><rect x="220.0" y="40" width="10.5" height="26" style="fill:var(--bad);opacity:0.75"/><rect x="230.0" y="40" width="10.5" height="26" style="fill:var(--bad);opacity:0.75"/><rect x="240.0" y="40" width="10.5" height="26" style="fill:var(--bad);opacity:0.75"/><rect x="250.0" y="40" width="10.5" height="26" style="fill:var(--bad);opacity:0.75"/><rect x="260.0" y="40" width="10.5" height="26" style="fill:var(--bad);opacity:0.75"/><rect x="270.0" y="40" width="10.5" height="26" style="fill:var(--warn);opacity:0.75"/><rect x="280.0" y="40" width="10.5" height="26" style="fill:var(--warn);opacity:0.75"/><rect x="290.0" y="40" width="10.5" height="26" style="fill:var(--warn);opacity:0.75"/><rect x="300.0" y="40" width="10.5" height="26" style="fill:var(--warn);opacity:0.75"/><rect x="310.0" y="40" width="10.5" height="26" style="fill:var(--warn);opacity:0.75"/><rect x="320.0" y="40" width="10.5" height="26" style="fill:var(--warn);opacity:0.75"/><rect x="330.0" y="40" width="10.5" height="26" style="fill:var(--warn);opacity:0.75"/><rect x="340.0" y="40" width="10.5" height="26" style="fill:var(--warn);opacity:0.75"/><rect x="350.0" y="40" width="10.5" height="26" style="fill:var(--warn);opacity:0.75"/><rect x="360.0" y="40" width="10.5" height="26" style="fill:var(--warn);opacity:0.75"/><rect x="370.0" y="40" width="10.5" height="26" style="fill:var(--good);opacity:0.75"/><rect x="380.0" y="40" width="10.5" height="26" style="fill:var(--good);opacity:0.75"/><rect x="390.0" y="40" width="10.5" height="26" style="fill:var(--good);opacity:0.75"/><rect x="400.0" y="40" width="10.5" height="26" style="fill:var(--good);opacity:0.75"/><rect x="410.0" y="40" width="10.5" height="26" style="fill:var(--good);opacity:0.75"/><rect x="420.0" y="40" width="10.5" height="26" style="fill:var(--good);opacity:0.75"/><rect x="430.0" y="40" width="10.5" height="26" style="fill:var(--good);opacity:0.75"/><rect x="440.0" y="40" width="10.5" height="26" style="fill:var(--good);opacity:0.75"/><rect x="450.0" y="40" width="10.5" height="26" style="fill:var(--good);opacity:0.75"/><rect x="460.0" y="40" width="10.5" height="26" style="fill:var(--good);opacity:0.75"/><rect x="470.0" y="40" width="10.5" height="26" style="fill:var(--good);opacity:1"/><rect x="480.0" y="40" width="10.5" height="26" style="fill:var(--good);opacity:1"/><rect x="490.0" y="40" width="10.5" height="26" style="fill:var(--good);opacity:1"/><rect x="500.0" y="40" width="10.5" height="26" style="fill:var(--good);opacity:1"/><rect x="510.0" y="40" width="10.5" height="26" style="fill:var(--good);opacity:1"/><rect x="520.0" y="40" width="10.5" height="26" style="fill:var(--good);opacity:1"/><rect x="530.0" y="40" width="10.5" height="26" style="fill:var(--good);opacity:1"/><rect x="540.0" y="40" width="10.5" height="26" style="fill:var(--good);opacity:1"/><rect x="550.0" y="40" width="10.5" height="26" style="fill:var(--good);opacity:1"/><rect x="560.0" y="40" width="10.5" height="26" style="fill:var(--good);opacity:1"/><rect x="570.0" y="40" width="10.5" height="26" style="fill:var(--good);opacity:1"/><rect x="580.0" y="40" width="10.5" height="26" style="fill:var(--good);opacity:1"/><rect x="590.0" y="40" width="10.5" height="26" style="fill:var(--good);opacity:1"/><rect x="600.0" y="40" width="10.5" height="26" style="fill:var(--good);opacity:1"/><rect x="610.0" y="40" width="10.5" height="26" style="fill:var(--good);opacity:1"/><text x="70" y="84" text-anchor="middle" style="fill:var(--muted);font:11px system-ui,sans-serif">-120</text><text x="170" y="84" text-anchor="middle" style="fill:var(--muted);font:11px system-ui,sans-serif">-110</text><text x="270" y="84" text-anchor="middle" style="fill:var(--muted);font:11px system-ui,sans-serif">-100</text><text x="370" y="84" text-anchor="middle" style="fill:var(--muted);font:11px system-ui,sans-serif">-90</text><text x="470" y="84" text-anchor="middle" style="fill:var(--muted);font:11px system-ui,sans-serif">-80</text><text x="570" y="84" text-anchor="middle" style="fill:var(--muted);font:11px system-ui,sans-serif">-70</text><text x="100" y="32" text-anchor="middle" style="fill:var(--ink);font:12px system-ui,sans-serif" >Very poor</text><text x="220" y="32" text-anchor="middle" style="fill:var(--ink);font:12px system-ui,sans-serif" >Poor</text><text x="320" y="32" text-anchor="middle" style="fill:var(--ink);font:12px system-ui,sans-serif" >Fair</text><text x="420" y="32" text-anchor="middle" style="fill:var(--ink);font:12px system-ui,sans-serif" >Good</text><text x="540" y="32" text-anchor="middle" style="fill:var(--ink);font:12px system-ui,sans-serif" >Excellent</text><line x1="315" x2="315" y1="38" y2="100" style="stroke:var(--ink)" stroke-width="1.5"/><text x="319" y="110" text-anchor="start" style="fill:var(--ink);font:12px system-ui,sans-serif" >Network A: -95.5 dBm (Fair)</text><line x1="330" x2="330" y1="38" y2="116" style="stroke:var(--ink)" stroke-width="1.5"/><text x="334" y="126" text-anchor="start" style="fill:var(--ink);font:12px system-ui,sans-serif" >Network B: -94 dBm (Fair)</text><line x1="200" x2="200" y1="38" y2="132" style="stroke:var(--ink)" stroke-width="1.5"/><text x="204" y="142" text-anchor="start" style="fill:var(--ink);font:12px system-ui,sans-serif" >Network C: -107 dBm (Poor)</text><text x="320" y="146" text-anchor="middle" style="fill:var(--muted);font:11px system-ui,sans-serif">LTE RSRP, dBm (less negative = stronger)</text></svg><figcaption>LTE signal bands used by the Cell Signal tool, with the average of two made-up readings per network placed on them.</figcaption></figure><!-- /fig -->

Network B averages -94 dBm, the strongest, though its home reading alone (-104 dBm) is poor. Network A averages -95.5 dBm, about the same, and gave the fastest speed at home (180 Mbps on 5G). Network C averages -107 dBm and is the one to avoid here. If home matters most, Network A wins even though B has the best average; that is why the tool logs readings by place.

## Where it is used

- **Picking a carrier or a prepaid brand.** Brands ride on a big network, so choose by which network is strongest at home and work.
- **Moving house.** Check the new address on the official map and take readings on a visit.
- **Working remotely or in the field.** Log readings along a route to know where calls drop.
- **Reporting a problem.** Readings with places and times help a provider, or the regulator, see a real gap.

## Common mistakes

- **Comparing bars between phones.** Use dBm.
- **Mixing 3G RSCP with 4G RSRP.** They use different scales.
- **One reading per network.** Signal swings with weather, crowds and where you stand; take several.
- **Trusting outdoor maps for indoor use.** Walls, concrete and low-e glass cut the signal a lot; check indoor coverage.

## Questions people ask

**Is -100 dBm good?** On 4G or 5G it is fair, at the edge of poor: calls work, data slows. On 3G RSCP it is weak.

**Why do I have signal but no data?** Low SINR, a busy tower or the network limiting your plan. A speed test on mobile data shows which.

**Do signal boosters help?** A booster approved in your country can help a weak indoor signal; unapproved boosters are illegal in many places and can disturb the network.
