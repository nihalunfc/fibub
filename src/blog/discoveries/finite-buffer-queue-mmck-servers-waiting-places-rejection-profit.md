---
title: "Finite-buffer queues: choosing servers and waiting places together (M/M/c/K)"
summary: "A 2025 AppliedMath paper sizes a fuel station as an M/M/c/K queue with limited waiting room. We recompute its best pump count, the profit ranges and its rejection example."
tools: [queueing-calculator, distribution-explorer, npv-irr-calculator]
updated: 2026-11-24
sources:
  - "Raicu, S., Costescu, D. and Popa, M. (2025), Modelling Systems with a Finite-Capacity Queue: A Theoretical Investigation into the Design and Operation of Real Systems, AppliedMath 5(1): 17, doi:10.3390/appliedmath5010017. Licence CC BY (Creative Commons Attribution; the page's licence link is CC BY 3.0), checked on the MDPI page, 2026-11-24. Values used here: M/M/n queue with m waiting places, first come first served; fuel station with 320 vehicles a day arriving, 160 vehicles a day per pump, 6 waiting places, a pump cost of 600 money units a day and a profit of 10 or 20 money units per vehicle; best pump count 2 (v = 10) and 3 (v = 20); one server designed for load 0.5 with 2 waiting places, then run at load 0.9 (rejection given as 0.23 of arrivals, effective utilisation 0.69, or 0.81 with 5 waiting places)."
  - "M/M/c/K steady-state probabilities: standard birth-death queueing theory (for example Gross, Shortle, Thompson and Harris, Fundamentals of Queueing Theory, Wiley)."
paper:
  title: "Modelling Systems with a Finite-Capacity Queue: A Theoretical Investigation into the Design and Operation of Real Systems"
  authors: "Raicu S, Costescu D, Popa M"
  journal: "AppliedMath"
  year: 2025
  doi: "10.3390/appliedmath5010017"
  url: "https://www.mdpi.com/2673-9909/5/1/17"
  licence: "CC BY"
  reviewed: true
---

Many real queues have a wall. A fuel station forecourt holds only so many cars, a phone line only so many callers on hold, a clinic only so many chairs. When the room is full, the next arrival drives on and is lost. A 2025 paper in *AppliedMath* argues that the number of servers and the size of this waiting room must be chosen together, and works through a fuel station as an example. This article recomputes the paper's main design result, the best number of pumps, with the [[queueing-calculator]], and checks its warning about what happens when demand grows into a small buffer. To check that arrivals really look random, use the [[distribution-explorer]]; to weigh a new pump as an investment over years, the [[npv-irr-calculator]].

## The paper in brief

The authors model a service point as an **M/M/n queue with m waiting places**: customers arrive at random (a Poisson stream), each service takes a random time with an exponential spread, n identical servers work in parallel, and anyone who finds all servers busy and all m places taken is turned away. In queueing shorthand this is **M/M/c/K**, where c is the number of servers and K = c + m is the most customers the system can hold.

Their example is a fuel station. Cars arrive at **320 a day**, one pump serves **160 a day** (9 minutes a car on average), and there are **6 waiting places**. Each pump costs **600 money units a day** and each car fuelled earns **v money units**. The paper finds that **2 pumps** are best when v = 10 and **3 pumps** when v = 20, and gives a chart of the profit ranges for each choice.

Its second point is about growth. A single server designed for a **load ρ = 0.5** (arrivals per service time) gets **2 waiting places**, enough to keep losses near 10 % of arrivals. If demand then rises to ρ = 0.9 with the same buffer, the paper says the share turned away grows to **0.23** and the server is busy only **69 %** of the time; with **5 waiting places** it would be busy **81 %** of the time. The lesson: a small buffer quietly caps how much extra demand a system can take.

## Checked with the tools

We ran the paper's numbers through `solveQueue` with the M/M/c/K model, the same function the [[queueing-calculator]] uses. This is a **recomputation** from the stated rates, not a simulation.

**Step 1: the pump table.** With 6 waiting places (K = pumps + 6):

| Pumps | Turned away | Cars served a day | Average wait in the queue | Profit a day at v = 10 | at v = 20 |
|---|---|---|---|---|---|
| 1 | 50.2 % | 159.4 | 45.5 min | 994 | 2,587 |
| 2 | 11.76 % | 282.4 | 12.6 min | **1,624** | 4,447 |
| 3 | 1.34 % | 315.7 | 3.1 min | 1,357 | **4,515** |
| 4 | 0.14 % | 319.6 | 0.7 min | 796 | 3,991 |

Profit here is v × cars served − 600 × pumps. The best count is **2 pumps at v = 10 and 3 pumps at v = 20**, exactly as the paper finds. At v = 20 the race is close: the third pump earns only about 67 money units a day more than it costs.

**Step 2: the profit ranges.** A pump pays for itself when the extra cars it saves from driving away, times v, beat its 600 a day. Going from 1 to 2 pumps saves 123 cars a day, so 2 pumps beat 1 above **v = 4.88**; going from 2 to 3 saves 33.4 cars, so 3 pumps beat 2 above **v = 17.98**; a fourth pump would need **v = 156**, because by then almost no one is turned away (Figure 1). This matches the paper's message that each pump count is right over a band of profit per vehicle.

<!-- fig:profit -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 298" role="img" aria-label="Daily profit for 1 to 4 pumps with 6 waiting places, 320 arrivals and 160 services per pump per day. Two pumps are best from v = 4.9 to 18.0, three above that." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Fuel station: daily profit against pumps</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Fuel station: daily profit against pumps</text><line x1="58" x2="546" y1="214" y2="214" style="stroke:var(--line)"/><text x="52" y="218" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="146.1" y2="146.1" style="stroke:var(--line)"/><text x="52" y="150.1" text-anchor="end" style="fill:var(--muted)">2e+3</text><line x1="58" x2="546" y1="78.3" y2="78.3" style="stroke:var(--line)"/><text x="52" y="82.3" text-anchor="end" style="fill:var(--muted)">4e+3</text><line x1="58" x2="58" y1="252" y2="256" style="stroke:var(--muted)"/><text x="58" y="269" text-anchor="middle" style="fill:var(--muted)">5</text><line x1="139.3" x2="139.3" y1="252" y2="256" style="stroke:var(--muted)"/><text x="139.3" y="269" text-anchor="middle" style="fill:var(--muted)">7.5</text><line x1="220.7" x2="220.7" y1="252" y2="256" style="stroke:var(--muted)"/><text x="220.7" y="269" text-anchor="middle" style="fill:var(--muted)">10</text><line x1="302" x2="302" y1="252" y2="256" style="stroke:var(--muted)"/><text x="302" y="269" text-anchor="middle" style="fill:var(--muted)">12.5</text><line x1="383.3" x2="383.3" y1="252" y2="256" style="stroke:var(--muted)"/><text x="383.3" y="269" text-anchor="middle" style="fill:var(--muted)">15</text><line x1="464.7" x2="464.7" y1="252" y2="256" style="stroke:var(--muted)"/><text x="464.7" y="269" text-anchor="middle" style="fill:var(--muted)">17.5</text><line x1="546" x2="546" y1="252" y2="256" style="stroke:var(--muted)"/><text x="546" y="269" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--muted)"/><text x="302" y="290" text-anchor="middle" style="fill:var(--ink)">Profit per vehicle v (money units)</text><text transform="translate(14 151) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Profit per day (money units)</text><line x1="480.3" x2="480.3" y1="50" y2="252" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="476.3" y="62" text-anchor="end" style="fill:var(--muted)">18.0: 3 pumps start to pay</text><path d="M58 207.3L74.3 204.6L90.5 201.9L106.8 199.2L123.1 196.5L139.3 193.8L155.6 191.1L171.9 188.4L188.1 185.7L204.4 183L220.7 180.3L236.9 177.6L253.2 174.9L269.5 172.1L285.7 169.5L302 166.8L318.3 164L334.5 161.3L350.8 158.6L367.1 155.9L383.3 153.2L399.6 150.5L415.9 147.8L432.1 145.1L448.4 142.4L464.7 139.7L480.9 137L497.2 134.3L513.5 131.6L529.7 128.9L546 126.2" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 206.8L74.3 202L90.5 197.2L106.8 192.4L123.1 187.7L139.3 182.8L155.6 178.1L171.9 173.3L188.1 168.5L204.4 163.7L220.7 158.9L236.9 154.1L253.2 149.3L269.5 144.5L285.7 139.8L302 135L318.3 130.2L334.5 125.4L350.8 120.6L367.1 115.8L383.3 111L399.6 106.2L415.9 101.4L432.1 96.6L448.4 91.9L464.7 87.1L480.9 82.3L497.2 77.5L513.5 72.7L529.7 67.9L546 63.1" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><path d="M58 221.5L74.3 216.1L90.5 210.8L106.8 205.4L123.1 200.1L139.3 194.7L155.6 189.3L171.9 184L188.1 178.6L204.4 173.3L220.7 167.9L236.9 162.6L253.2 157.2L269.5 151.9L285.7 146.5L302 141.1L318.3 135.8L334.5 130.5L350.8 125.1L367.1 119.7L383.3 114.4L399.6 109L415.9 103.7L432.1 98.3L448.4 93L464.7 87.6L480.9 82.3L497.2 76.9L513.5 71.5L529.7 66.2L546 60.8" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/><path d="M58 241.2L74.3 235.8L90.5 230.4L106.8 224.9L123.1 219.5L139.3 214.1L155.6 208.6L171.9 203.3L188.1 197.8L204.4 192.4L220.7 187L236.9 181.6L253.2 176.2L269.5 170.7L285.7 165.3L302 159.9L318.3 154.5L334.5 149L350.8 143.6L367.1 138.2L383.3 132.8L399.6 127.4L415.9 121.9L432.1 116.5L448.4 111.1L464.7 105.7L480.9 100.3L497.2 94.8L513.5 89.4L529.7 84L546 78.6" style="fill:none;stroke:var(--muted);stroke-width:2;stroke-linejoin:round;stroke-dasharray:5 4"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">1 pump</text><line x1="127.2" x2="139.2" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="143.2" y="40" style="fill:var(--muted)">2 pumps</text><line x1="203.6" x2="215.6" y1="36" y2="36" style="stroke:var(--ink);stroke-width:2"/><text x="219.6" y="40" style="fill:var(--muted)">3 pumps</text><line x1="280" x2="292" y1="36" y2="36" style="stroke:var(--muted);stroke-width:2;stroke-dasharray:5 4"/><text x="296" y="40" style="fill:var(--muted)">4 pumps</text><text class="fibub-mark" x="546" y="290" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. Daily profit of the fuel station against the profit per vehicle, for 1 to 4 pumps with 6 waiting places, worked out with the Queueing calculator's M/M/c/K maths from the paper's rates and pump cost. Recomputed, not the paper's own figure.</figcaption></figure>
<!-- /fig:profit -->

**Step 3: the growth example.** One server with 2 waiting places (K = 3) turns away **6.67 %** of arrivals at load 0.5, inside the paper's 10 % target; with only 1 place it would lose 14.3 %, so 2 is indeed the smallest buffer that works. At load 0.9 the same buffer turns away **21.2 %**, and the server is busy **70.9 %** of the time. The paper's 0.23 and 0.69 are a little higher and lower than our exact M/M/1/3 values; its 0.81 for 5 places agrees with ours (**0.808**, with 10.19 % turned away). Strictly, keeping losses at or below 10 % at load 0.9 needs **6** places (8.4 % lost), as Figure 2 shows.

<!-- fig:loss -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 278" role="img" aria-label="Share of arrivals turned away by one server with 2 or 5 waiting places. At load 0.5 two places lose 6.67 %; at load 0.9 they lose 21.2 %, and five places bring it back to 10.19 %." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>One server: share turned away against load</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">One server: share turned away against load</text><line x1="58" x2="546" y1="232" y2="232" style="stroke:var(--line)"/><text x="52" y="236" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="171.3" y2="171.3" style="stroke:var(--line)"/><text x="52" y="175.3" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="110.7" y2="110.7" style="stroke:var(--line)"/><text x="52" y="114.7" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">30</text><line x1="112.2" x2="112.2" y1="232" y2="236" style="stroke:var(--muted)"/><text x="112.2" y="249" text-anchor="middle" style="fill:var(--muted)">0.2</text><line x1="220.7" x2="220.7" y1="232" y2="236" style="stroke:var(--muted)"/><text x="220.7" y="249" text-anchor="middle" style="fill:var(--muted)">0.4</text><line x1="329.1" x2="329.1" y1="232" y2="236" style="stroke:var(--muted)"/><text x="329.1" y="249" text-anchor="middle" style="fill:var(--muted)">0.6</text><line x1="437.6" x2="437.6" y1="232" y2="236" style="stroke:var(--muted)"/><text x="437.6" y="249" text-anchor="middle" style="fill:var(--muted)">0.8</text><line x1="546" x2="546" y1="232" y2="236" style="stroke:var(--muted)"/><text x="546" y="249" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="58" x2="546" y1="232" y2="232" style="stroke:var(--muted)"/><text x="302" y="270" text-anchor="middle" style="fill:var(--ink)">Load ρ = λ/μ</text><text transform="translate(14 141) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Turned away (%)</text><line x1="58" x2="546" y1="171.3" y2="171.3" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="166.3" text-anchor="end" style="fill:var(--muted)">10 % target</text><line x1="274.9" x2="274.9" y1="50" y2="232" style="stroke:var(--muted);stroke-dasharray:4 4"/><line x1="491.8" x2="491.8" y1="50" y2="232" style="stroke:var(--muted);stroke-dasharray:4 4"/><path d="M58 231.5L66.1 231.2L74.3 230.8L82.4 230.4L90.5 229.9L98.7 229.3L106.8 228.6L114.9 227.8L123.1 227L131.2 225.9L139.3 224.8L147.5 223.7L155.6 222.4L163.7 221L171.9 219.4L180 217.8L188.1 216L196.3 214.2L204.4 212.3L212.5 210.2L220.7 208.1L228.8 205.9L236.9 203.5L245.1 201.1L253.2 198.6L261.3 196L269.5 193.4L277.6 190.6L285.7 187.8L293.9 184.9L302 182L310.1 179L318.3 175.9L326.4 172.9L334.5 169.7L342.7 166.5L350.8 163.2L358.9 159.9L367.1 156.6L375.2 153.3L383.3 149.9L391.5 146.5L399.6 143L407.7 139.5L415.9 136.1L424 132.6L432.1 129.1L440.3 125.6L448.4 122.1L456.5 118.6L464.7 115.1L472.8 111.6L480.9 108.1L489.1 104.5L497.2 101.1L505.3 97.6L513.5 94.1L521.6 90.6L529.7 87.2L537.9 83.7L546 80.3" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 232L66.1 232L74.3 232L82.4 232L90.5 232L98.7 232L106.8 232L114.9 231.9L123.1 231.9L131.2 231.9L139.3 231.9L147.5 231.8L155.6 231.8L163.7 231.7L171.9 231.6L180 231.5L188.1 231.4L196.3 231.2L204.4 231L212.5 230.8L220.7 230.5L228.8 230.2L236.9 229.8L245.1 229.4L253.2 228.9L261.3 228.3L269.5 227.7L277.6 227L285.7 226.2L293.9 225.3L302 224.4L310.1 223.3L318.3 222.1L326.4 220.8L334.5 219.4L342.7 217.9L350.8 216.3L358.9 214.6L367.1 212.7L375.2 210.8L383.3 208.6L391.5 206.5L399.6 204.2L407.7 201.7L415.9 199.1L424 196.4L432.1 193.7L440.3 190.7L448.4 187.8L456.5 184.7L464.7 181.5L472.8 178.2L480.9 174.9L489.1 171.4L497.2 167.8L505.3 164.2L513.5 160.5L521.6 156.8L529.7 153.1L537.9 149.2L546 145.3" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">2 waiting places</text><line x1="199.2" x2="211.2" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="215.2" y="40" style="fill:var(--muted)">5 waiting places</text><text class="fibub-mark" x="546" y="270" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. One server with 2 or 5 waiting places: the share of arrivals turned away as the load rises. The dashed lines mark the paper's loads of 0.5 and 0.9.</figcaption></figure>
<!-- /fig:loss -->

| Check | Paper | Queueing calculator maths |
|---|---|---|
| Best pumps at v = 10 | 2 | 2 (profit 1,624 a day) |
| Best pumps at v = 20 | 3 | 3 (profit 4,515 a day) |
| Load 0.5, 2 places: turned away | about 0.1 (design target) | 6.67 % |
| Load 0.9, 2 places: turned away | 0.23 | 21.2 % |
| Load 0.9, 2 places: effective utilisation | 0.69 | 0.709 |
| Load 0.9, 5 places: effective utilisation | 0.81 | 0.808 |

## How we made the graphs

The script `scripts/blog-figures/finite-buffer-queue-mmck-servers-waiting-places-rejection-profit.mjs` in fibub's public code calls `solveQueue` from `src/lib/sci/queue.ts` with `kind: 'mmck'`, the maths behind the [[queueing-calculator]]. It builds the steady-state chance of each number of customers in the system, reads the share turned away (the chance the system is full) and the number served, and adds up the profit for 1 to 5 pumps.

All rates, the 6 waiting places, the pump cost and the profits per car come from the paper's text. The profit formula (money per car served minus pump costs) is **our reading** of the paper's cost rule; it gives the paper's answers. The break-even values of v are our own extension.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/queueing-calculator.mjs`:

- 60 random queue models, including many M/M/c/K cases, must match values worked out in Python with exact fractions, for L, Lq, W, Wq, the chance of waiting and the share turned away.
- Classic table values: Erlang B with 10 erlangs on 12 lines is 0.119739, and a 1 % loss target needs 18 lines; Erlang C for 6 servers at 5 erlangs is 0.587516.
- A seeded simulation of 100,000 customers must land on the formulas for an M/M/2/5 queue and four other models.
- New with this article: the fuel station with 2 pumps and 6 waiting places must turn away 11.76 % and serve 282.4 cars a day, the best pump count must be 2 at v = 10 and 3 at v = 20, and one server with 2 places at load 0.9 must lose 0.0729/0.3439 = 21.20 %, the textbook closed form.

## Check it yourself

On the [[queueing-calculator]], in the *Queue* card:

1. Set *Model* to **M/M/c/K: limited room, extra arrivals turned away**.
2. Type **320** in *Arrivals* and choose *per* **day**. Type **9** in *Average service time* and choose *in* **minutes** (one pump fuels 160 cars a day).
3. Type **2** in *Servers c* and **8** in *Room in the system K* (2 pumps + 6 waiting places).
4. The big line reads **Average wait in the queue Wq = 12.6 minutes**; the facts show *Utilisation ρ* **88.24 %**, *Turned away* **11.76 %** and *Served per minute* **0.1961** (282.4 a day).
5. Change *Servers c* to **3** and *Room in the system K* to **9**: *Turned away* drops to **1.335 %** and the wait to **3.066 minutes**. Multiply the extra cars by your profit per car and compare with the cost of a pump.

## What researchers can use it for

- **Size servers and buffer together**: try pairs of c and K in the [[queueing-calculator]] and read the loss and wait for each, as the paper recommends.
- **Stress-test a design**: raise *Arrivals* step by step (the *What if the arrivals change?* table) to see how fast losses grow when demand outruns the buffer.
- **Check a paper's queue numbers**: every M/M/c/K output is one formula away, so stated losses and waits can be verified in seconds.
- **Check the assumptions first**: fit arrival gaps and service times in the [[distribution-explorer]]; if service times are far from exponential, M/M/c/K can mislead.
- **Teach the trade-off**: the 2-versus-3 pump example shows students why the "best" capacity depends on the money, not only on the queue.

## The fine print

- We recomputed the paper's results from its stated rates; the paper's Table 1 and figures are images that we did not read.
- The profit rule (v per car served, 600 per pump per day) is our reading of the paper's cost constraint; it reproduces the paper's pump counts.
- Our turned-away share at load 0.9 with 2 places (21.2 %) differs slightly from the paper's 0.23. We used the exact M/M/1/3 result; the paper may use a different rounding or formula.
- M/M/c/K assumes steady demand, random arrivals and exponential service times. Real forecourts have rush hours, so plan for the busiest hour, not the daily average.
