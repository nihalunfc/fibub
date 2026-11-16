---
title: "Radial artery occlusion after angiography: checking a trial's sample size"
summary: "A 2026 trial protocol plans 818 patients to test pressure-guided wrist compression against radial artery occlusion. We rework its sample size and power with fibub's sample size tool."
tools: [sample-size, nnt-calculator]
updated: 2026-11-16
sources:
  - "Zhang, X., Zou, L., Zhang, D., Yao, B., Chen, J., Wei, T. et al. (2026), Balloon pressure monitoring for radial artery hemostasis after transradial coronary procedures: protocol for a randomized controlled trial, PLOS ONE 21(6): e0350563, doi:10.1371/journal.pone.0350563. Licence CC BY 4.0, stated on the article page, checked 2026-11-16. Values used here, from the sample size section: occlusion at 24 hours assumed 4.3% with usual care (from the PROPHET-II control arm) and 1.0% or less with pressure monitoring; two-sided α 0.05, power 80%, 1:1 allocation, PASS 15.0.5; 736 patients before and 818 (409 per group) after allowing 10% dropout; registration ChiCTR2400088258."
  - "R Core Team, power.prop.test (stats package): the pooled-variance normal approximation the Sample size tool follows."
  - "Fleiss, J. L., Levin, B. and Paik, M. C. (2003), Statistical Methods for Rates and Proportions, 3rd ed., Wiley (sample size formulas for two proportions)."
paper:
  title: "Balloon pressure monitoring for radial artery hemostasis after transradial coronary procedures: protocol for a randomized controlled trial"
  authors: "Zhang X, Zou L, Zhang D, Yao B, Chen J, Wei T et al."
  journal: "PLOS ONE"
  year: 2026
  doi: "10.1371/journal.pone.0350563"
  url: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0350563"
  licence: "CC BY 4.0"
  reviewed: true
---

Many heart tests and stent procedures now go in through the **radial artery** at the wrist rather than the groin. Afterwards a band with an air balloon presses on the wrist to stop the bleeding. Press too hard or too long and the artery can clot shut: **radial artery occlusion (RAO)**. It is usually silent, but it closes that artery for future procedures. A trial protocol published in PLOS ONE in 2026 plans to test a band with a pressure gauge and step-by-step release against the usual band. This article shows how the [[sample-size]] tool lets anyone rework how many patients such a trial needs, and how the [[nnt-calculator]] puts the hoped-for benefit in patient terms.

*General education only, not medical advice.*

## The paper in brief

This is a **protocol**: the plan of a trial, published before the results. The trial is single-centre, randomised 1:1 and open-label (the doctors know which band is used), but the person who checks the artery with Doppler ultrasound at 24 hours does not. The main outcome is RAO at 24 hours.

The sample size rests on four choices: RAO of **4.3%** with the usual band (taken from an earlier trial's control arm), **1.0%** hoped for with pressure monitoring, a two-sided 5% significance level and **80% power** (an 80% chance of a clear result if the true rates really are 4.3% and 1.0%). The authors' software gave **736 patients**, and they plan **818 (409 per group)** to allow for 10% dropping out.

## Checked with the tools

Everything here is a **recomputation from the protocol's stated assumptions**; there are no trial results yet.

**Check 1: the 736.** The Sample size tool, set to two proportions, 4.3% against 1.0%, gives **371 per group (exactly 370.69)**, 742 in all: six more than the protocol. The difference is the formula, not a mistake. The tool follows R's `power.prop.test`, which uses the pooled rate under "no difference" for the significance part. The simpler unpooled formula, which many programs offer, gives **367.95, so 368 per group and exactly 736**. Both are standard; they differ by less than 1%.

| Check | Protocol | Our result |
|---|---|---|
| People per group before dropout | 368 (736 in all) | 371 with the tool's pooled formula; 368 with the unpooled formula |
| After 10% dropout | 409 per group, 818 in all | 736 ÷ 0.9 = 817.8, so 818 (the tool: 413 per group, 826) |
| Power with 409 per group, if 4.3% against 1.0% | 80% after dropout | 83.7% if nobody drops out |
| Patients per occlusion avoided | not stated | NNT 30.3 at the planned rates |

**Check 2: dividing, not multiplying.** The protocol inflates 736 by dividing by 0.9 (817.8, so 818), which is right: after 10% loss, 818 leaves 736. Multiplying by 1.1 instead would give 810 and leave too few. The tool's *Expected dropout (%)* box divides in the same way.

**Check 3: what if the benefit is smaller?** A drop from 4.3% to 1.0% is a large effect: a relative reduction of about 77%. Figure 1 shows the trial's power with 409 per group if the new band only brings RAO down to 1.5% or 2.0%: **67%** and **47%**. Figure 2 shows how fast the numbers grow: about **563 per group** for 1.5% and **904** for 2.0% (before dropout). With small event rates, every bit of hoped-for benefit you give up costs many patients.

<!-- fig:power -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 298" role="img" aria-label="With 409 per group the trial has 84% power if the new method brings occlusion to 1.0%, but only 67% at 1.5% and 47% at 2.0%." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Power to detect fewer occlusions (4.3% in the control arm)</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Power to detect fewer occlusions (4.3% in the control arm)</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--line)"/><text x="52" y="256" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="211.6" y2="211.6" style="stroke:var(--line)"/><text x="52" y="215.6" text-anchor="end" style="fill:var(--muted)">0.2</text><line x1="58" x2="546" y1="171.2" y2="171.2" style="stroke:var(--line)"/><text x="52" y="175.2" text-anchor="end" style="fill:var(--muted)">0.4</text><line x1="58" x2="546" y1="130.8" y2="130.8" style="stroke:var(--line)"/><text x="52" y="134.8" text-anchor="end" style="fill:var(--muted)">0.6</text><line x1="58" x2="546" y1="90.4" y2="90.4" style="stroke:var(--line)"/><text x="52" y="94.4" text-anchor="end" style="fill:var(--muted)">0.8</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">1</text><line x1="58" x2="58" y1="252" y2="256" style="stroke:var(--muted)"/><text x="58" y="269" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="158" x2="158" y1="252" y2="256" style="stroke:var(--muted)"/><text x="158" y="269" text-anchor="middle" style="fill:var(--muted)">250</text><line x1="258" x2="258" y1="252" y2="256" style="stroke:var(--muted)"/><text x="258" y="269" text-anchor="middle" style="fill:var(--muted)">500</text><line x1="358" x2="358" y1="252" y2="256" style="stroke:var(--muted)"/><text x="358" y="269" text-anchor="middle" style="fill:var(--muted)">750</text><line x1="458" x2="458" y1="252" y2="256" style="stroke:var(--muted)"/><text x="458" y="269" text-anchor="middle" style="fill:var(--muted)">1e+3</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--muted)"/><text x="302" y="290" text-anchor="middle" style="fill:var(--ink)">People per group</text><text transform="translate(14 151) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Power</text><line x1="58" x2="546" y1="90.4" y2="90.4" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="85.4" text-anchor="end" style="fill:var(--muted)">80% power</text><line x1="221.6" x2="221.6" y1="50" y2="252" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="225.6" y="62" text-anchor="start" style="fill:var(--muted)">409 planned</text><path d="M66 233L72 224.9L78 216.8L84 208.8L90 200.8L96 193L102 185.2L108 177.7L114 170.3L120 163.2L126 156.3L132 149.7L138 143.3L144 137.3L150 131.5L156 126L162 120.7L168 115.8L174 111.1L180 106.7L186 102.6L192 98.7L198 95L204 91.6L210 88.4L216 85.5L222 82.7L228 80.1L234 77.7L240 75.5L246 73.4L252 71.5L258 69.7L264 68.1L270 66.6L276 65.1L282 63.9L288 62.7L294 61.6L300 60.6L306 59.7L312 58.8L318 58L324 57.3L330 56.7L336 56.1L342 55.5L348 55L354 54.6L360 54.1L366 53.8L372 53.4L378 53.1L384 52.8L390 52.5L396 52.3L402 52.1L408 51.9L414 51.7L420 51.6L426 51.4L432 51.3L438 51.2L444 51L450 50.9L456 50.8L462 50.8L468 50.7L474 50.6L480 50.6L486 50.5L492 50.5L498 50.4L504 50.4L510 50.3L516 50.3L522 50.3L528 50.2L534 50.2L540 50.2L546 50.2" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M66 236.8L72 231.3L78 225.9L84 220.5L90 215.2L96 209.9L102 204.7L108 199.5L114 194.3L120 189.2L126 184.1L132 179.1L138 174.2L144 169.4L150 164.7L156 160.1L162 155.6L168 151.3L174 147L180 142.9L186 138.9L192 135L198 131.2L204 127.5L210 124L216 120.6L222 117.3L228 114.2L234 111.1L240 108.2L246 105.4L252 102.7L258 100.1L264 97.6L270 95.2L276 93L282 90.8L288 88.7L294 86.7L300 84.8L306 83L312 81.2L318 79.6L324 78L330 76.5L336 75.1L342 73.7L348 72.4L354 71.2L360 70L366 68.9L372 67.9L378 66.9L384 65.9L390 65L396 64.2L402 63.4L408 62.6L414 61.9L420 61.2L426 60.5L432 59.9L438 59.3L444 58.8L450 58.3L456 57.8L462 57.3L468 56.9L474 56.5L480 56.1L486 55.7L492 55.4L498 55.1L504 54.7L510 54.4L516 54.2L522 53.9L528 53.7L534 53.5L540 53.2L546 53.1" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><path d="M66 239.7L72 236L78 232.6L84 229.2L90 225.9L96 222.5L102 219.2L108 215.9L114 212.6L120 209.4L126 206.1L132 202.8L138 199.6L144 196.3L150 193.1L156 189.9L162 186.8L168 183.6L174 180.5L180 177.5L186 174.4L192 171.4L198 168.5L204 165.5L210 162.7L216 159.8L222 157L228 154.3L234 151.5L240 148.9L246 146.3L252 143.7L258 141.2L264 138.7L270 136.3L276 133.9L282 131.5L288 129.2L294 127L300 124.8L306 122.7L312 120.6L318 118.5L324 116.5L330 114.5L336 112.6L342 110.8L348 108.9L354 107.1L360 105.4L366 103.7L372 102.1L378 100.5L384 98.9L390 97.4L396 95.9L402 94.4L408 93L414 91.7L420 90.3L426 89L432 87.8L438 86.5L444 85.4L450 84.2L456 83.1L462 82L468 80.9L474 79.9L480 78.9L486 77.9L492 77L498 76.1L504 75.2L510 74.3L516 73.5L522 72.7L528 71.9L534 71.2L540 70.4L546 69.7" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">new arm 1.0%</text><line x1="170.4" x2="182.4" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="186.4" y="40" style="fill:var(--muted)">new arm 1.5%</text><line x1="282.8" x2="294.8" y1="36" y2="36" style="stroke:var(--ink);stroke-width:2"/><text x="298.8" y="40" style="fill:var(--muted)">new arm 2.0%</text></svg><figcaption>Figure 1. Power curves from the Sample size tool's two-proportion maths for the protocol's 4.3% control rate and three possible rates with the new method. The dashed line marks the 409 people per group the trial plans.</figcaption></figure>
<!-- /fig:power -->

<!-- fig:n -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 280" role="img" aria-label="About 253 per group if the new rate is 0.5%, 371 at 1.0%, 904 at 2.0%." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>People per group needed as the expected benefit shrinks</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">People per group needed as the expected benefit shrinks</text><line x1="58" x2="546" y1="234" y2="234" style="stroke:var(--line)"/><text x="52" y="238" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="183.5" y2="183.5" style="stroke:var(--line)"/><text x="52" y="187.5" text-anchor="end" style="fill:var(--muted)">500</text><line x1="58" x2="546" y1="133" y2="133" style="stroke:var(--line)"/><text x="52" y="137" text-anchor="end" style="fill:var(--muted)">1e+3</text><line x1="58" x2="546" y1="82.5" y2="82.5" style="stroke:var(--line)"/><text x="52" y="86.5" text-anchor="end" style="fill:var(--muted)">1.5e+3</text><line x1="58" x2="546" y1="32" y2="32" style="stroke:var(--line)"/><text x="52" y="36" text-anchor="end" style="fill:var(--muted)">2e+3</text><line x1="82.4" x2="82.4" y1="234" y2="238" style="stroke:var(--muted)"/><text x="82.4" y="251" text-anchor="middle" style="fill:var(--muted)">0.5</text><line x1="204.4" x2="204.4" y1="234" y2="238" style="stroke:var(--muted)"/><text x="204.4" y="251" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="326.4" x2="326.4" y1="234" y2="238" style="stroke:var(--muted)"/><text x="326.4" y="251" text-anchor="middle" style="fill:var(--muted)">1.5</text><line x1="448.4" x2="448.4" y1="234" y2="238" style="stroke:var(--muted)"/><text x="448.4" y="251" text-anchor="middle" style="fill:var(--muted)">2</text><line x1="58" x2="546" y1="234" y2="234" style="stroke:var(--muted)"/><text x="302" y="272" text-anchor="middle" style="fill:var(--ink)">Occlusion rate with the new method (%)</text><text transform="translate(14 133) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">People per group</text><line x1="204.4" x2="204.4" y1="32" y2="234" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="208.4" y="44" text-anchor="start" style="fill:var(--muted)">protocol: 1.0%</text><path d="M58 210.2L70.2 209.4L82.4 208.4L94.6 207.4L106.8 206.4L119 205.4L131.2 204.3L143.4 203.2L155.6 202L167.8 200.7L180 199.4L192.2 198L204.4 196.5L216.6 195L228.8 193.4L241 191.8L253.2 190L265.4 188.1L277.6 186.1L289.8 184.1L302 181.9L314.2 179.7L326.4 177.1L338.6 174.6L350.8 171.9L363 169L375.2 165.8L387.4 162.6L399.6 159.1L411.8 155.4L424 151.5L436.2 147.2L448.4 142.7L460.6 137.8L472.8 132.7L485 127L497.2 121.1L509.4 114.6L521.6 107.6L533.8 100.1L546 91.9" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/></svg><figcaption>Figure 2. People needed per group for 80% power at a two-sided 5% level, as the true occlusion rate with the new method rises from 0.4% to 2.4%. Worked out with the tool's maths; not trial data.</figcaption></figure>
<!-- /fig:n -->

**Check 4: in patient terms.** If the rates are 4.3% and 1.0%, the risk difference is 3.3 points, so about **30 patients** would need the pressure-monitored band for one fewer occluded artery at 24 hours. The NNT calculator gives this from any pair of counts, such as 43 of 1,000 against 10 of 1,000.

## How we made the graphs

The charts and numbers come from `scripts/blog-figures/radial-artery-occlusion-hemostasis-trial-sample-size.mjs` in fibub's public code. It calls `powerProp` and `solveN` from `src/lib/sci/power.ts`, the maths behind the [[sample-size]] tool, and `compare` from `src/lib/sci/nnt.ts`, the maths behind the [[nnt-calculator]]. The unpooled formula is written out in the script for comparison only. Every input (4.3%, 1.0%, 5%, 80%, 10% dropout, 409 per group) is from the protocol; the alternative rates of 1.5% and 2.0% in the figures are our own what-ifs.

## How we test the maths

On every change to fibub, `tests/sci.mjs` and `tests/sci-tools/sample-size.mjs` check the power maths against R:

- 4.3% against 1.0% at 80% power must give **370.689 per group**, R's `power.prop.test` result, and the unpooled formula must give **367.946** (the protocol's 368). This check was added with this article.
- 50 per group, 50% against 75%, must give power **0.74017**, as `power.prop.test` does; and the earlier check of **76.7 per group** for 90% power.
- For means, 20 per group with an effect size of 1 must give power **0.86895** (R's `power.t.test`), and 64 per group with 0.5 must give **0.80146**.

## Check it yourself

On the [[sample-size]] tool:

1. Set *Comparing* to **Two proportions (percentages)**.
2. Type **4.3** in *Group 1 (%)* and **1** in *Group 2 (%)*.
3. Leave *Significance level α* on **0.05** and *Power* on **0.8**.
4. The result reads **371 per group**, with *Without dropout* **371 per group (exactly 370.69)** and *Total* **742**.
5. Type **10** in *Expected dropout (%)*: it reads **413 per group** and *Total* **826**.
6. Change *Group 2 (%)* to **2**: the result jumps to **905 per group** before dropout. The power curves under it show the same story as Figure 1.

On the [[nnt-calculator]], type **10** and **1000** for the first group and **43** and **1000** for the second: the big result reads **NNTB 30.3**.

## What researchers can use it for

- **Recheck a protocol or grant** before review: type in its stated rates, level and power and see whether the n matches, as here.
- **Explain small differences** between programs (pooled against unpooled variance) rather than suspecting an error.
- **Stress-test the assumptions** with the power curves: how much power is left if the benefit is smaller than hoped?
- **Plan the dropout allowance** correctly by dividing, with the *Expected dropout (%)* box.
- **Report the benefit in patients** with the [[nnt-calculator]], and later pool similar trials in the [[meta-analysis]] tool.

## The fine print

- The 1.0% target is optimistic; the trial will show whether it holds. Our what-if figures are not predictions.
- Neither formula here adds a continuity correction; with it, 4.3% against 1.0% would need about 430 per group. Programs and protocols differ on this.
- RAO at 24 hours is a short-term outcome; some arteries reopen later, which the planned 30-day check may show.
- A single-centre, open-label trial can be affected by the team's experience with the new band; the protocol plans a learning-curve analysis for that.
