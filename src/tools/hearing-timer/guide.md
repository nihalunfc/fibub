---
name: Hearing timer
num: 3025
shelf: everyday
code: T1032
section: dj-mixing
title: "Hearing timer: how long can you safely listen at a sound level"
summary: "Type a sound level in dB(A), pick the NIOSH or OSHA rule and see how long you can listen, with a countdown and dose used for your set. Free, on your device, not medical advice."
status: live
ads: false
order: 3025
icon: clock
works: offline
updated: 2026-11-18
related: [noise-dose, soundcheck-list, live-lufs-meter]
sources:
  - "Allowed time T = 8 h / 2^((L - Lc) / q). NIOSH (1998), Criteria for a Recommended Standard: Occupational Noise Exposure, DHHS (NIOSH) Publication No. 98-126: Lc 85 dB(A), q 3 dB. US OSHA 29 CFR 1910.95: Lc 90 dB(A), q 5 dB. Checked 2026-11-18. Rules differ by country and job: check the official source."
  - "Example levels (conversation about 60, heavy city traffic about 85, motorcycle about 95 dB(A)) are rounded typical values from the US NIDCD page on noise-induced hearing loss. Checked 2026-11-18."
  - "Earplug rule of thumb: for A-weighted levels the printed NRR is reduced by 7 dB (OSHA 29 CFR 1910.95 Appendix B) and then halved as a safety margin, as in older US guidance, so the cut is (NRR - 7) x 0.5. Real fit varies a lot. Checked 2026-11-18; check the official source. SNR (used in Europe) is not converted."
flow:
  - { icon: sliders, label: "Set level" }
  - { icon: clock, label: "Timer" }
  - { icon: check, label: "Dose" }
---

## What it does

Loud sound harms hearing by how loud it is and how long you hear it. Workplace rules turn this into an allowed time: at 85 dB(A) it is 8 hours under the NIOSH advice, and every 3 dB louder halves it. This page does that sum for any level you type, and runs a countdown through your set that shows the share of the day's dose used so far.

It is made for DJs, who stand next to monitors and speakers for hours. It is not medical advice, and a phone microphone is not a sound level meter, so treat the level as an estimate. For a whole day with several levels use the [[noise-dose]] calculator, and check levels in your mix with the [[live-lufs-meter]] and your set-up with the [[soundcheck-list]].

## How to use it

1. Type the level, or pick an example to fill it in.
2. Choose the **Rule**.
3. Read the allowed time. Enter your set length and press **Start** when you begin. **Pause**, **Continue** and **Reset** do what they say.
4. Under **More options** you can add earplugs.

## What each setting does

- **NIOSH**: 85 dB(A) for 8 hours, 3 dB exchange. Health-based advice.
- **OSHA**: 90 dB(A) for 8 hours, 5 dB exchange. The US legal limit for work.
- **Earplugs (NRR)**: lowers the level at your ear by (NRR − 7) × 0.5 dB, a cautious estimate.

## Worked example

At **94 dB(A)** under NIOSH, 94 is 9 dB above 85, which is three halvings, so 8 ÷ 8 = **1 hour**. Under OSHA, **95 dB(A)** is 5 dB above 90, one halving, so **4 hours**. A 2-hour set at 94 dB(A) under NIOSH is **200%** of the day's dose.

## FAQs

**Is it safe to stay under 100%?** It is the rule's limit for a day, not a promise. Rest your ears, and stop if they ring.

**Why do the two rules differ?** NIOSH halves the time for every 3 dB, matching the energy in the sound. OSHA's 5 dB is a legal compromise.

**Can I measure with my phone?** Not reliably. Use a proper meter.
