---
title: "What is a good internet speed? Mbps, ping and jitter explained"
summary: "What download, upload, ping and jitter mean, how much speed HD and 4K video, video calls and games need, and why a speed test can read lower than your plan."
tools: [internet-speed-test, wifi-spot-finder, cell-signal-guide]
updated: 2026-11-14
sources:
  - "Speed needs for video and calls are rounded from public guidance by streaming and video-call services (about 5 Mbps for HD, 15 to 25 Mbps for 4K, about 3 Mbps each way for HD calls). They change over time; check the service's own help page."
  - "Jitter is the average change between back-to-back pings, as most speed tests report it. The ping series in the chart are made up to show a typical pattern; the median, jitter and bufferbloat labels are worked out with the Speed Test's own code (src/lib/net/speed.ts)."
  - "1 GB is taken as 1,000 megabytes = 8,000 megabits."
---

A speed test gives you four or five numbers, and most people only look at the biggest one. This guide explains what each number means, how much you really need for streaming, calls and games, and why the result can be lower than the speed on your bill. To measure your own line, [[internet-speed-test|test your internet speed]] first; if the problem is one room, the [[wifi-spot-finder]] finds the best and worst spots, and for phones on mobile data, [[cell-signal-guide|Cell Signal]] compares networks.

## What it is

Your connection is like a road. **Download speed** is how many lanes bring data to you; **upload speed** is the lanes going the other way. Both are measured in **megabits per second (Mbps)**. One byte is 8 bits, so to get megabytes per second (what download bars show), divide by 8: 100 Mbps is about 12.5 MB/s.

**Ping** (also called latency or round-trip time) is how long a tiny message takes to reach a server and come back, in milliseconds (ms). It decides how quick things *feel*: a page starting to load, your voice reaching the other person, a game reacting to your click. Lots of lanes do not help if every trip is slow.

**Jitter** is how much the ping jumps around. It is worked out as the average change from one ping to the next:

jitter = (|p₂ − p₁| + |p₃ − p₂| + … + |pₙ − pₙ₋₁|) ÷ (n − 1)

where p₁ … pₙ are the pings in order. Calls and games need steady pings more than low ones.

**Ping while busy** is the ping measured while the test is downloading. If it shoots up, your router lets big downloads crowd out everything else, an effect called **bufferbloat**. It is why a call stutters when someone starts a download.

## How much speed you need

| Activity | Download | Upload | Ping |
|---|---|---|---|
| Web pages and email | 1 to 5 Mbps | under 1 Mbps | under 150 ms |
| HD video, per screen | about 5 Mbps | – | any |
| 4K video, per screen | 15 to 25 Mbps | – | any |
| HD video call | about 3 to 4 Mbps | about 3 Mbps | under 100 ms, steady |
| Online games | 3 to 5 Mbps | 1 Mbps | under 60 ms, jitter under 15 ms |

Add up what your household does at the same time. Two 4K TVs (2 × 25), one HD call (4) and some browsing (5) need about 59 Mbps down, so a 100 Mbps plan has room to spare and a 50 Mbps plan does not.

## How to use it

1. Close downloads, streams and cloud backups on all devices, so you measure the line and not your own traffic.
2. Open the [[internet-speed-test|Speed Test]] and pick **Light** on mobile data or **Full** on a fast home line.
3. Run it once next to the router, ideally on a cable, and once where you actually use the device.
4. Compare the results with the table above and with your plan.
5. Repeat at a busy time (evenings) and a quiet time (early morning). A big drop in the evening points to a busy network at your provider.
6. If the cable result is fine and the room result is not, the problem is Wi-Fi: use the Wi-Fi Finder.

## A worked example

A family on a 100 Mbps plan in Bengaluru runs the test on a laptop in the bedroom at 9 pm: 38 Mbps down, 9 Mbps up, ping 24 ms, jitter 3 ms, ping while busy 160 ms.

- Download: 38 Mbps is enough for one 4K stream (25) plus browsing, but not two.
- Ping 24 ms and jitter 3 ms are excellent on a quiet line.
- Ping while busy rose by 136 ms, more than 100 ms, so bufferbloat is high: calls will stutter whenever someone downloads.
- Next to the router on a cable they get 96 Mbps. So the plan is delivered, and two fixes remain: better Wi-Fi in the bedroom, and turning on the router's "Smart Queue" or "SQM" setting for the bufferbloat.

A 1 GB game update at 38 Mbps takes 8,000 ÷ 38 ≈ 211 seconds, about 3.5 minutes.

## Checked with the tools

The chart below is a made-up but typical pair of ping series: twenty pings on a quiet line, then twenty while a big download runs. The median, jitter and bufferbloat labels are computed by the Speed Test's own code, the same code that runs on the tool page.

<!-- fig:ping-bloat --><figure class="fig"><svg viewBox="0 0 640 240" width="100%" role="img" aria-label="Pings on a quiet line and while a download runs. Median and jitter from the Speed Test's own maths: idle 21 ms (jitter 2.6 ms), busy 154.5 ms."><line x1="44" x2="620" y1="200" y2="200" style="stroke:var(--line)"/><text x="38" y="204" text-anchor="end" style="fill:var(--muted);font:11px system-ui,sans-serif">0</text><line x1="44" x2="620" y1="140" y2="140" style="stroke:var(--line)"/><text x="38" y="144" text-anchor="end" style="fill:var(--muted);font:11px system-ui,sans-serif">60</text><line x1="44" x2="620" y1="80" y2="80" style="stroke:var(--line)"/><text x="38" y="84" text-anchor="end" style="fill:var(--muted);font:11px system-ui,sans-serif">120</text><line x1="44" x2="620" y1="20" y2="20" style="stroke:var(--line)"/><text x="38" y="24" text-anchor="end" style="fill:var(--muted);font:11px system-ui,sans-serif">180</text><text x="38" y="14" text-anchor="end" style="fill:var(--muted);font:11px system-ui,sans-serif">ms</text><text x="320" y="232" text-anchor="middle" style="fill:var(--muted);font:11px system-ui,sans-serif">ping number (one every 0.35 s)</text><polyline fill="none" stroke-width="2.5" style="stroke:var(--good)" points="44.0,179.0 74.3,181.0 104.6,178.0 134.9,180.0 165.3,176.0 195.6,181.0 225.9,179.0 256.2,177.0 286.5,180.0 316.8,178.0 347.2,181.0 377.5,179.0 407.8,175.0 438.1,180.0 468.4,179.0 498.7,178.0 529.1,181.0 559.4,180.0 589.7,177.0 620.0,179.0"/><polyline fill="none" stroke-width="2.5" style="stroke:var(--bad)" points="44.0,176.0 74.3,152.0 104.6,123.0 134.9,97.0 165.3,72.0 195.6,59.0 225.9,48.0 256.2,51.0 286.5,40.0 316.8,45.0 347.2,42.0 377.5,38.0 407.8,50.0 438.1,43.0 468.4,39.0 498.7,46.0 529.1,41.0 559.4,37.0 589.7,44.0 620.0,40.0"/><text x="620" y="171" text-anchor="end" style="fill:var(--ink);font:12px system-ui,sans-serif" >idle: median 21 ms, jitter 2.6 ms</text><text x="620" y="63.5" text-anchor="end" style="fill:var(--ink);font:12px system-ui,sans-serif" >while downloading: median 154.5 ms (bufferbloat: High)</text></svg><figcaption>Pings on a quiet line and while a download runs. Median and jitter from the Speed Test's own maths: idle 21 ms (jitter 2.6 ms), busy 154.5 ms.</figcaption></figure><!-- /fig -->

The idle line is low and flat. The busy line climbs within two seconds and stays high: that is bufferbloat, and it is what the "Ping while busy" result catches.

The second chart is plain arithmetic, 8,000 megabits divided by the speed, to show how plan speed turns into waiting time.

<!-- fig:gb-time --><figure class="fig"><svg viewBox="0 0 640 230" width="100%" role="img" aria-label="Time to download a 1 GB file at each speed: 1 GB is 8,000 megabits, so time = 8,000 / Mbps (before any slowdowns)."><text x="82" y="30" text-anchor="end" style="fill:var(--ink);font:12px system-ui,sans-serif" >10 Mbps</text><rect x="90" y="14" width="430.0" height="22" rx="3" style="fill:var(--accent)"/><text x="526" y="30" text-anchor="start" style="fill:var(--ink);font:12px system-ui,sans-serif" >13 min 20 s</text><text x="82" y="64" text-anchor="end" style="fill:var(--ink);font:12px system-ui,sans-serif" >25 Mbps</text><rect x="90" y="48" width="172.0" height="22" rx="3" style="fill:var(--accent)"/><text x="268" y="64" text-anchor="start" style="fill:var(--ink);font:12px system-ui,sans-serif" >5 min 20 s</text><text x="82" y="98" text-anchor="end" style="fill:var(--ink);font:12px system-ui,sans-serif" >50 Mbps</text><rect x="90" y="82" width="86.0" height="22" rx="3" style="fill:var(--accent)"/><text x="182" y="98" text-anchor="start" style="fill:var(--ink);font:12px system-ui,sans-serif" >2 min 40 s</text><text x="82" y="132" text-anchor="end" style="fill:var(--ink);font:12px system-ui,sans-serif" >100 Mbps</text><rect x="90" y="116" width="43.0" height="22" rx="3" style="fill:var(--accent)"/><text x="139" y="132" text-anchor="start" style="fill:var(--ink);font:12px system-ui,sans-serif" >1 min 20 s</text><text x="82" y="166" text-anchor="end" style="fill:var(--ink);font:12px system-ui,sans-serif" >300 Mbps</text><rect x="90" y="150" width="14.3" height="22" rx="3" style="fill:var(--accent)"/><text x="110.33333333333334" y="166" text-anchor="start" style="fill:var(--ink);font:12px system-ui,sans-serif" >27 s</text><text x="82" y="200" text-anchor="end" style="fill:var(--ink);font:12px system-ui,sans-serif" >1000 Mbps</text><rect x="90" y="184" width="4.3" height="22" rx="3" style="fill:var(--accent)"/><text x="100.3" y="200" text-anchor="start" style="fill:var(--ink);font:12px system-ui,sans-serif" >8 s</text></svg><figcaption>Time to download a 1 GB file at each speed: 1 GB is 8,000 megabits, so time = 8,000 / Mbps (before any slowdowns).</figcaption></figure><!-- /fig -->

## Where it is used

- **Before you complain to a provider.** Regulators and complaint bodies (the CCTS in Canada, TRAI in India, Ofcom in the UK, the FCC in the USA) expect cable tests at different times. Save results with the tool's opt-in history.
- **Choosing a plan.** Add up what runs at the same time, as in the table, and pick the plan above it.
- **Working from home.** Upload and steady ping matter more than download for calls and sending files.
- **Gaming.** Ping, jitter and bufferbloat matter far more than a high download number.

## Common mistakes

- **Testing over weak Wi-Fi and blaming the provider.** Test on a cable or next to the router first.
- **Mixing up Mbps and MB/s.** A 100 Mbps line downloads at about 12.5 MB/s, not 100.
- **Testing once.** Speeds change through the day; take the middle of three tests.
- **Ignoring upload.** Many plans have a small upload, which is what makes video calls blurry.
- **Leaving a VPN on.** It adds distance and slows the test; turn it off to measure the line itself.

## Questions people ask

**Why is my speed test lower than my plan?** Plans say "up to". Wi-Fi, an old device, other users and busy evening networks all take a share. On a cable at a quiet time you should get close to the plan.

**Is a lower ping always better?** Yes, but steadiness matters as much: 40 ms with 2 ms jitter is nicer for calls than 20 ms with 30 ms jitter.

**Does 5G or fibre fix bufferbloat?** Not by itself. Bufferbloat usually comes from the router's queue, so a router setting fixes it on any line.
