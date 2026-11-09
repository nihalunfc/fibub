---
name: Modulation and BER simulator
num: 634
shelf: science
section: rf-and-communications
title: "BER simulator: BPSK, QPSK, 8-PSK, 16-QAM and 64-QAM constellations in noise, with bit error rate against Eb/N0"
summary: "Send Gray-coded BPSK, QPSK, 8-PSK, 16-QAM or 64-QAM symbols through seeded white Gaussian noise at your Eb/N0 and see the noisy constellation. Count the bit and symbol errors with a 95 % interval and compare them with the theoretical rates. Sweep Eb/N0 to plot the simulated bit error rate against the theory curves of all five schemes, and download the sweep as CSV."
status: live
ads: true
order: 634
icon: chart
works: offline
updated: 2026-11-09
related: [link-budget-calculator, antenna-calculator, smith-chart, error-correcting-codes, entropy-calculator]
sources:
  - "Bit and symbol error rates of BPSK, QPSK and M-PSK in AWGN (Craig's integral for the M-PSK symbol error rate) and of square M-QAM, as in Proakis and Salehi, Digital Communications, and Simon and Alouini, Digital Communication over Fading Channels (equations only)."
  - "Exact bit error rate of Gray-coded square M-QAM from Cho and Yoon (2002), IEEE Transactions on Communications 50(7), 1074–1080 (equation only)."
  - "Wilson score interval for the measured error rate (Wilson, 1927)."
  - "Checked against SciPy (scipy.special.erfc, scipy.integrate.quad, and an independent exact QAM bit error rate summed from Gray PAM transition probabilities with scipy.stats.norm) and an independent NumPy Monte Carlo simulation."
flow:
  - { icon: sliders, label: "Modulate" }
  - { icon: target, label: "Add noise" }
  - { icon: check, label: "Decide" }
  - { icon: chart, label: "BER curve" }
---

## What it does

Digital radios, modems and Wi-Fi send bits as **symbols**: points in a plane of in-phase (I) and quadrature (Q) amplitude, called a **constellation**. Noise moves each received symbol away from its ideal point, and when it lands nearer a different point the receiver makes an error. This simulator shows that happening and measures it:

- the **constellation** of BPSK, QPSK, 8-PSK, 16-QAM or 64-QAM with Gray-coded bit labels, and the cloud of received points at your **Eb/N0**,
- the measured **bit error rate (BER)** and **symbol error rate (SER)**, with a 95 % interval, next to the **theoretical** values,
- a **sweep** of Eb/N0 that plots the simulated BER against the theory curves of all five schemes.

The noise is additive white Gaussian noise (AWGN) from a seeded random generator, so the same seed always gives the same result. The receiver picks the nearest constellation point (the optimum decision in this channel).

Get the signal-to-noise ratio from the [[link-budget-calculator]], and see how coding fixes the errors with the [[error-correcting-codes|error-correcting codes playground]].

## How to use it

1. Pick the **modulation** and the **Eb/N0** in dB: the energy per bit divided by the noise power density.
2. Choose how many **symbols** to simulate. Rare errors need many symbols: to measure a BER of 10⁻⁵ you want at least a few million bits.
3. Set the **sweep** range, step and symbols per point. The chart and table update on their own; download the sweep as CSV.

## What the results mean

- **More bits per symbol needs more Eb/N0.** BPSK and QPSK need about 10.5 dB for a BER of 10⁻⁶, 8-PSK about 13.9 dB, 16-QAM 14.4 dB and 64-QAM 18.8 dB. Higher orders carry more bits in the same bandwidth, so the choice is a trade between speed and robustness.
- **BPSK and QPSK have the same BER** against Eb/N0. QPSK is two BPSK signals at right angles, so it doubles the bits per symbol for free.
- **Gray coding** makes neighbouring points differ by one bit, so most symbol errors cost only one bit error and BER ≈ SER / bits per symbol.

## Worked example

16-QAM at Eb/N0 = 10 dB with 100,000 symbols (400,000 bits) and seed 1: the simulation counts **687 bit errors**, a BER of **1.72 × 10⁻³** (95 % interval 1.59 to 1.85 × 10⁻³). The exact theory for Gray-coded 16-QAM gives **1.75 × 10⁻³**, inside the interval. The symbol error rate is 6.86 × 10⁻³ against 7 × 10⁻³ in theory, almost exactly four times the BER, as Gray coding predicts. Es/N0 is 16.02 dB (10 dB plus 10 log10 4).

The same setting with BPSK gives no errors at all in 100,000 bits, which fits the theoretical BER of 3.87 × 10⁻⁶: you would expect fewer than one error.

## FAQ

**Why do simulated points wander from the line at low error rates?** Few errors means a large random spread. The 95 % interval shows how far the true rate could be; send more symbols to tighten it.

**Is the 8-PSK BER exact?** The 8-PSK symbol error rate is exact (Craig's integral). Its BER uses the Gray approximation SER / 3, which is very close at the error rates that matter. BPSK, QPSK and square QAM are exact.

**Does it model fading, phase noise or coding?** No. It is the plain AWGN channel, the reference every real system is compared with. Use the link budget calculator to find the Eb/N0 a radio link actually delivers.
