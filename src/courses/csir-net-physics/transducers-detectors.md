---
title: Transducers and detectors
summary: 'The sensors NET asks about: thermocouples, platinum resistance thermometers and thermistors, strain gauges and Wheatstone bridges, piezoelectric, Hall and LVDT sensors, first-order response, photodiodes, photoconductors and photomultipliers, thermal detectors, gas counters, scintillators and semiconductor detectors with dead time and the Fano factor, and vacuum gauges and pumps.'
minutes: 55
updated: 2026-11-22
quiz:
  - q: 'A type K thermocouple (41 μV/°C) has its hot junction at 400 °C and its reference junction at 25 °C. What EMF does it give?'
    choices: ['15.4 mV', '16.4 mV', '1.0 mV', '17.4 mV']
    ans: 0
    why: 'The EMF depends on the difference of the junction temperatures: 41 μV/°C × 375 °C = 15.4 mV.'
  - q: 'A counter with 200 μs dead time (non-paralysable) records 500 counts/s. What is the true rate?'
    choices: ['556 s⁻¹', '500 s⁻¹', '450 s⁻¹', '600 s⁻¹']
    ans: 0
    why: 'The counter is dead for mτ = 0.1 of the time, so n = m/(1 − mτ) = 500/0.9 = 556 s⁻¹.'
  - q: 'Why does a silicon photodiode stop responding beyond about 1.1 μm?'
    choices: ['Those photons have less energy than the 1.12 eV band gap', 'The window absorbs infrared', 'The junction capacitance is too large', 'Infrared photons are too energetic']
    ans: 0
    why: 'Only photons above the gap create electron-hole pairs: λ_c = 1239.8/1.12 = 1107 nm.'
sources:
  - 'E. O. Doebelin and D. N. Manik, Measurement Systems: Application and Design, 6th ed. (2011), chapters 3, 4 and 8'
  - 'G. F. Knoll, Radiation Detection and Measurement, 4th ed. (2010), chapters 4 to 6, 8 and 11'
  - 'J. Moore, C. Davis, M. Coplan and S. Greer, Building Scientific Apparatus, 4th ed. (2009), chapters 3 and 6'
  - 'A. Roth, Vacuum Technology, 3rd ed. (1990), chapters 2, 5 and 8'
  - 'CSIR-UGC NET Physical Sciences syllabus, Part C unit on experimental techniques (transducers, detectors, vacuum)'
---

**Module 7 · about 55 minutes.** By the end you will be able to read a thermocouple with cold-junction compensation, compare resistance thermometers, get a voltage out of a strain gauge with a bridge, work with piezoelectric, Hall and LVDT sensors, describe the speed of a first-order sensor, choose and use photodetectors, handle gas counters, scintillators and semiconductor detectors (including dead time and energy resolution), and pick the right vacuum gauge and pump. The semiconductor physics behind photodiodes is in the JAM lessons on [semiconductors](/learn/courses/iit-jam-physics/semiconductors/) and [diodes](/learn/courses/iit-jam-physics/diodes/).

<div class="bigidea">A transducer turns the quantity you care about (temperature, strain, light, radiation, pressure) into an electrical signal. For each one, NET wants three things: the physical principle, the size of the signal (so you know it needs a bridge or an amplifier), and the main way it goes wrong.</div>

## 1. Temperature

**Thermocouples** (Seebeck effect). Two different metals joined at both ends give an EMF that depends on the *difference* of the junction temperatures, about 41 μV/°C for type K (chromel-alumel). Two laws do all the work:

- *Intermediate temperatures:* `$E(T_1, T_3) = E(T_1, T_2) + E(T_2, T_3)$`. Tables are made with the reference at 0 °C; if your reference sits at room temperature, add `$E(T_{room}, 0)$` back (cold-junction compensation).
- *Intermediate metals:* a third metal (copper leads, solder) adds nothing if both its ends are at the same temperature.

**Worked example.** Tables give `$E(300\ °\text{C}) = 12.209$` mV and `$E(25\ °\text{C}) = 1.000$` mV. With the reference at 25 °C the meter reads `$12.209 - 1.000 = 11.209$` mV. Using a constant sensitivity instead would give `$0.041\times275 = 11.28$` mV, close but not exact, because the real curve is not straight.

**Resistance thermometers.** Platinum (Pt100: 100 Ω at 0 °C) is nearly linear, `$R = R_0(1 + \alpha T)$` with `$\alpha = 0.00385$` K⁻¹, stable and accurate. An NTC thermistor (a semiconductor) follows

```math
R = R_{25}\exp\left[B\left(\frac1T - \frac1{T_{25}}\right)\right], \qquad \frac{1}{R}\frac{dR}{dT} = -\frac{B}{T^2}
```

about −4% per kelvin near room temperature, ten times platinum, but exponential and limited in range. Read resistance sensors with four wires (two carry current, two sense voltage) so the leads drop out, and keep the current small: self-heating is `$I^2R$` divided by the dissipation constant.

**Response time.** Most sensors are first order: `$\tau\,dT_s/dt = T - T_s$`. After a step they reach 63% of the change in one time constant and 99% in `$4.6\tau$`; following a steady ramp at rate `$a$` they lag by `$a\tau$`.

<figure class="fig" data-fig="sensor-response"><figcaption>Response curves of four transducers. Thermocouple: the EMF falls by E(T_ref) as the reference junction warms. Pt100 against thermistor: linear against steep and curved. Silicon photodiode: rising as λ/1240, then cut off at the gap. Strain-gauge quarter bridge: exact output against the linear estimate as the gauge factor grows.</figcaption></figure>

## 2. Strain, force, displacement and field

**Strain gauges.** Stretching a wire lengthens it and narrows it: `$\Delta R/R = (1 + 2\nu)\varepsilon + \Delta\rho/\rho$`. The gauge factor `$GF = (\Delta R/R)/\varepsilon$` is about 2 for metal foil (1.6 from geometry with `$\nu = 0.3$`, the rest from resistivity) and 50 to 200 for semiconductor gauges (piezoresistance). Changes are tiny (0.1% at 500 microstrain), so gauges go in a **Wheatstone bridge**:

Bend the cantilever and see how a strain gauge and a bridge turn it into a voltage.

<figure class="fig" data-fig="@sx-wheatstone-strain"><figcaption>V<sub>out</sub> = V<sub>ex</sub>·GF·ε/4 for one gauge, ×2 for two, ×4 for four. Temperature changes that hit all arms equally cancel out.</figcaption></figure>

```math
V_{out} \approx \frac{n}{4}\,V_s\,GF\,\varepsilon \quad (n = 1, 2, 4 \text{ active arms, strains arranged to add})
```

A half bridge (gauges on the top and bottom of a bent beam, in adjacent arms) doubles the signal, cancels temperature changes and removes the non-linearity of the quarter bridge, whose exact output `$V_sx/(4 + 2x)$` (with `$x = \Delta R/R$`) falls short of linear by about `$x/2$`.

**Worked example.** One 120 Ω gauge (GF = 2) in a 10 V bridge under `$10^{-3}$` strain: `$x = 2\times10^{-3}$`, `$V_{out} = 10\times2\times10^{-3}/4 = 5$` mV; the gauge resistance changes by only 0.24 Ω.

<div class="problem" data-problem="bridge-output"></div>

**Piezoelectric sensors.** A force `$F$` on quartz releases a charge `$q = dF$` (`$d = 2.3$` pC/N; PZT ceramics hundreds of pC/N). The voltage `$q/C$` depends on the cable capacitance too, so charge amplifiers are used. The charge leaks away with time constant `$RC$`: piezo sensors measure changing forces and vibrations, never static ones.

**Hall sensors** give `$V_H = IB/(net)$`: thin, lightly doped semiconductors (InSb, GaAs) give tens of mV per tesla where a metal gives nanovolts. **LVDTs** (a movable iron core between a primary and two opposed secondaries) give an AC output whose amplitude grows with displacement and whose phase flips by 180° as the core crosses the centre; a phase-sensitive detector (see [lesson 7.4](/learn/courses/csir-net-physics/noise-lock-in/)) turns this into a signed reading. **Capacitive sensors** use `$C = \epsilon_0A/d$`: sub-nanometre displacements with a bridge.

## 3. Light

**Photodiodes** collect the electron-hole pairs made by absorbed photons. The responsivity is

```math
\mathcal R = \frac{\eta e}{h\nu} = \frac{\eta\,\lambda[\text{nm}]}{1239.8}\ \text{A/W}
```

rising with wavelength (more photons per watt) until the photon energy drops below the gap: silicon stops at 1.1 μm, germanium at 1.8 μm, InGaAs at 1.7 μm (the choice for 1550 nm). Reverse bias (photoconductive mode) widens the depletion layer: faster, linear, but with dark current. Zero bias (photovoltaic mode) has no dark current and is quietest for faint, slow signals; the open-circuit voltage grows only as `$(k_BT/e)\ln(1 + I_{ph}/I_0)$`.

**Photoconductors** (CdS, PbS) have gain `$G = \tau_{life}/t_{transit}$`: the contacts replace every carrier that leaves, so one photon can pass many electrons. **Photomultipliers** add a photocathode (quantum efficiency 20 to 30% in the blue) and `$n$` dynodes, each multiplying by `$\delta$`: gain `$\delta^n$`, `$4^{10} \approx 10^6$`, enough to count single photons. **Avalanche photodiodes** give gains of about 100 with extra noise. **Thermal detectors** (bolometers, thermopiles, pyroelectrics) measure the heat of absorbed light: flat response over wavelength but slow; photon detectors are fast but have a cut-off.

**Worked example.** A photodiode with `$\eta = 0.8$` at 800 nm: `$\mathcal R = 0.8\times800/1239.8 = 0.52$` A/W, so 10 μW gives 5.2 μA.

## 4. Ionising radiation

**Gas detectors.** As the voltage rises, a gas-filled tube goes through the ionisation-chamber region (all primary ions collected, gain 1), the **proportional** region (gas multiplication near the thin anode, pulse ∝ deposited energy) and the **Geiger-Müller** region (every event triggers the same full discharge: counting but no energy information). In air about 34 eV makes one ion pair.

**Dead time.** After each count a GM tube is blind for `$\tau$` (100 to 300 μs). For a non-paralysable counter

```math
n = \frac{m}{1 - m\tau}
```

with `$m$` the observed and `$n$` the true rate. A paralysable detector obeys `$m = ne^{-n\tau}$` and peaks at `$1/(e\tau)$`: beyond that a stronger source reads lower.

<div class="problem" data-problem="gm-dead-time"></div>

**Scintillators and semiconductors.** NaI(Tl) gives about 38 photons per keV; after light collection and photocathode efficiency only a few thousand photoelectrons remain for a 662 keV gamma ray, limiting the resolution to about 4% (6 to 7% in practice). A germanium detector makes one electron-hole pair per 2.96 eV (silicon 3.6 eV), so `$N = E/w$` is in the hundreds of thousands, and the spread is reduced further by the **Fano factor** `$F \approx 0.1$`:

```math
\text{FWHM} = 2.355\sqrt{FEw}
```

About 1.1 keV at 662 keV, thirty times better than NaI, at the price of cooling to 77 K (germanium's small gap gives too much leakage current at room temperature).

<div class="meaning">

<dl>
<dt>gauge factor</dt><dd>fractional resistance change per unit strain: about 2 for metals, 100 for semiconductors</dd>
<dt>responsivity</dt><dd>amperes of photocurrent per watt of light; quantum efficiency divided by the photon energy in eV</dd>
<dt>dead time</dt><dd>the time after each count during which the detector cannot register another; the lost fraction is mτ</dd>
<dt>Fano factor</dt><dd>the variance of the number of charge carriers divided by its mean; below 1 because the carriers are not independent</dd>
</dl>

</div>

## 5. Vacuum: making and measuring it

| Range (mbar) | Pumps | Gauges |
|---|---|---|
| 1000 to 1 | rotary vane, scroll | Bourdon, diaphragm, capacitance manometer |
| 1 to `$10^{-3}$` | rotary, roots | Pirani (heat loss through the gas) |
| `$10^{-3}$` to `$10^{-8}$` | diffusion, turbomolecular (need backing) | cold-cathode (Penning), hot-cathode ionisation |
| below `$10^{-8}$` | ion, cryo, titanium sublimation, after baking | Bayard-Alpert ionisation gauge |

Diffusion and turbo pumps cannot exhaust to atmosphere: their jet or blades work only against a forevacuum. Pirani and ionisation gauges read differently for different gases; capacitance manometers do not. The mean free path in air is about `$6.6\times10^{-3}$` Pa m divided by the pressure: 1 m at `$6.6\times10^{-5}$` mbar.

**Pump-down time.** With a constant speed `$S$` and no outgassing, `$V\,dp/dt = -Sp$` gives `$t = (V/S)\ln(p_0/p)$`: each decade of pressure costs `$(V/S)\ln10$`. A 50 L chamber on 5 L/s goes from 1000 to 0.1 mbar in 92 s; below about `$10^{-6}$` mbar, outgassing from the walls takes over and the simple formula fails.

<div class="myth">

**"A thermocouple measures the temperature of its tip."** It measures the difference between its two junctions. Forget the reference junction and every reading is off by the room temperature.

**"A detector with more gain is always better."** Gain amplifies the noise that came with the signal too. Energy resolution is set by the smallest number in the chain (photoelectrons in a scintillator, electron-hole pairs in a semiconductor), not by the amplifier.

</div>

<div class="keypoints">

- Thermocouple EMF ∝ junction temperature difference; law of intermediate temperatures; cold-junction compensation.
- Pt100: `$R = 100(1 + 0.00385T)$` Ω; thermistor: `$R \propto e^{B/T}$`, coefficient `$-B/T^2$`; four-wire reading; self-heating `$I^2R/\delta$`.
- First-order sensors: 63% in `$\tau$`, ramp lag `$a\tau$`.
- Strain gauge GF ≈ 2 (metal); bridge output `$(n/4)V_sGF\varepsilon$`; piezo `$q = dF$`, no DC; Hall `$V_H = IB/net$`; LVDT phase gives the sign.
- Photodiode responsivity `$\eta\lambda/1239.8$` A/W with a band-gap cut-off; PMT gain `$\delta^n$`; photoconductor gain `$\tau/t_{tr}$`.
- Dead time `$n = m/(1 - m\tau)$`; paralysable maximum `$1/e\tau$`; resolution FWHM `$2.355\sqrt{FEw}$`; Ge (2.96 eV, cooled) beats NaI.
- Vacuum: rotary → diffusion or turbo → ion; Pirani to `$10^{-3}$` mbar, ionisation gauges below; `$t = (V/S)\ln(p_0/p)$`.

</div>

## Practise: exam questions on this lesson

NET Part C style, with full solutions. More on the [CSIR NET practice page](/learn/courses/csir-net-physics/practice/); the [Counting statistics helper](/science/counting-statistics/) handles count-rate errors and background subtraction.

<div class="qbank" data-bank="physics" data-topics="transducers-detectors" data-exam="net" data-n="10"></div>

**Next:** [lesson 7.4](/learn/courses/csir-net-physics/noise-lock-in/): every one of these signals comes with noise, and the lock-in amplifier is how weak ones are measured.
