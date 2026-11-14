---
title: "Full Wi-Fi bars but slow internet? Signal vs connectivity"
summary: "Why Wi-Fi bars and real speed often disagree, what a good Wi-Fi signal in dBm is, and how to find the best spot for your router, desk or TV."
tools: [wifi-spot-finder, internet-speed-test, cell-signal-guide]
updated: 2026-11-14
sources:
  - "Wi-Fi dBm bands (-55, -67, -75 and -85 dBm) are common rules of thumb from Wi-Fi equipment makers for data, voice and video; they are guides, not a standard."
  - "Spot scores in the chart use the Wi-Fi Finder's own scoring code (src/lib/net/speed.ts, spotScore) on made-up readings for a made-up house."
---

Full bars on the Wi-Fi icon do not promise fast internet, and two bars do not mean it will be slow. The bars show the **signal**: how strongly your device hears the router. What you feel is **connectivity**: how well data actually gets through to the internet and back. This guide explains why the two differ and how to find the best place for working, calls and streaming. To test the rooms in your home, use the [[wifi-spot-finder|Wi-Fi spot finder]]; to check the line itself, [[internet-speed-test|test your internet speed]] next to the router.

## What it is

Wi-Fi signal strength is measured in **dBm** (decibels relative to one milliwatt). The numbers are negative, and closer to zero is stronger: -45 dBm is strong, -80 dBm is weak. Every 3 dB is roughly half or double the power, so -70 dBm carries about half the power of -67 dBm.

| Signal | What it is good for |
|---|---|
| -30 to -55 dBm | Excellent: anything |
| -55 to -67 dBm | Good: video calls and HD streaming |
| -67 to -75 dBm | Fair: browsing, some buffering |
| -75 to -85 dBm | Weak: slow, drops out |
| below -85 dBm | Unusable |

**Connectivity** depends on the signal, but also on:

- **Noise and neighbours.** Many routers on the same channel take turns to talk, so each gets less time, even with full bars.
- **The router.** Old or busy routers slow everything down for every device.
- **The line from your provider.** If the plan is 20 Mbps, perfect Wi-Fi still gives 20 Mbps.
- **Band.** 5 GHz Wi-Fi is faster but fades quickly through walls; 2.4 GHz reaches further but is slower and more crowded.

Web browsers are not allowed to read Wi-Fi signal strength, so the Wi-Fi Finder measures connectivity (speed, ping and jitter) and lets you type in the bars or dBm your device shows. Then it points out spots where the two disagree.

## How to use it

1. Open the Wi-Fi Finder on the device you care about (a laptop for work, a phone for calls).
2. Stand at the first spot, type a name such as "Desk", and optionally the bars or dBm your device shows.
3. Press **Test this spot** and wait about 10 seconds.
4. Repeat in every room or corner you use, including outdoors if you work there.
5. Read the ranking and the notes on mismatched spots.
6. For dead zones, start the **walking test** and walk slowly; watch where the bars on the live chart turn red.

## A worked example

The chart below scores five spots in a made-up two-floor house with the Wi-Fi Finder's own scoring code.

## Checked with the tools

<!-- fig:wifi-spots --><figure class="fig"><svg viewBox="0 0 640 200" width="100%" role="img" aria-label="Spot scores (0 to 100) from the Wi-Fi Finder's scoring for a made-up house. The back porch shows full bars yet scores low: signal and connectivity are different things."><text x="122" y="27" text-anchor="end" style="fill:var(--ink);font:12px system-ui,sans-serif" >Living room</text><rect x="130" y="10" width="338.4" height="24" rx="3" style="fill:var(--good)"/><text x="474.4" y="27" text-anchor="start" style="fill:var(--ink);font:12px system-ui,sans-serif" >94  (4 bars, 210 Mbps)</text><text x="122" y="63" text-anchor="end" style="fill:var(--ink);font:12px system-ui,sans-serif" >Kitchen</text><rect x="130" y="46" width="316.8" height="24" rx="3" style="fill:var(--good)"/><text x="452.8" y="63" text-anchor="start" style="fill:var(--ink);font:12px system-ui,sans-serif" >88  (3 bars, 120 Mbps)</text><text x="122" y="99" text-anchor="end" style="fill:var(--ink);font:12px system-ui,sans-serif" >Bedroom upstairs</text><rect x="130" y="82" width="262.8" height="24" rx="3" style="fill:var(--good)"/><text x="398.8" y="99" text-anchor="start" style="fill:var(--ink);font:12px system-ui,sans-serif" >73  (2 bars, 35 Mbps)</text><text x="122" y="135" text-anchor="end" style="fill:var(--ink);font:12px system-ui,sans-serif" >Back porch</text><rect x="130" y="118" width="140.4" height="24" rx="3" style="fill:var(--bad)"/><text x="276.4" y="135" text-anchor="start" style="fill:var(--ink);font:12px system-ui,sans-serif" >39  (4 bars, 4 Mbps)</text><text x="122" y="171" text-anchor="end" style="fill:var(--ink);font:12px system-ui,sans-serif" >Basement</text><rect x="130" y="154" width="108.0" height="24" rx="3" style="fill:var(--bad)"/><text x="244" y="171" text-anchor="start" style="fill:var(--ink);font:12px system-ui,sans-serif" >30  (1 bar, 2.4 Mbps)</text></svg><figcaption>Spot scores (0 to 100) from the Wi-Fi Finder's scoring for a made-up house. The back porch shows full bars yet scores low: signal and connectivity are different things.</figcaption></figure><!-- /fig -->

The living room and kitchen, near the router, score highest. The bedroom upstairs, through a floor, drops to two bars and 35 Mbps but still scores well enough for calls. The interesting one is the **back porch**: full bars, yet 4 Mbps and a 120 ms ping. Distance is not the problem there. Likely causes are a neighbour's router on the same channel, or the device joining a weak 2.4 GHz band. Changing the router's channel, or naming the 2.4 and 5 GHz networks differently and picking 5 GHz, are the fixes to try first. The **basement**, with one bar, needs more hardware: a mesh point or a wired access point.

## Where it is used

- **Placing a router.** Put it high, central and in the open, away from microwaves, fish tanks and mirrors. Test the rooms again after moving it.
- **Choosing where to work.** Pick the desk spot with the steadiest ping, not the fastest download.
- **Deciding on mesh or extenders.** If every far spot is weak, add a mesh point halfway, not in the dead zone itself.
- **Offices and classrooms.** Walk the room before a class or meeting that depends on video.

## Common mistakes

- **Trusting the bars alone.** Measure the speed in the spot.
- **Putting the extender in the dead zone.** It must hear the router well to pass anything on; put it halfway.
- **Testing one spot once.** Busy evenings change results; test the close calls twice.
- **Blaming Wi-Fi for a slow plan.** If the speed next to the router is low too, the line is the limit.

## Questions people ask

**Is 2.4 GHz or 5 GHz better?** 5 GHz is faster in the same room; 2.4 GHz goes through more walls. Many routers now pick for you; test both if you can choose.

**Do Wi-Fi boosters work?** A mesh system works well; a cheap plug-in extender often halves the speed because it listens and talks on the same radio. Test before and after.

**Why does my phone have full bars but my laptop is slow?** Devices have different antennas and Wi-Fi versions. Test each device you rely on.
