---
title: Flip-flops, counters and registers
summary: 'Sequential logic at GATE depth: SR and D latches, edge-triggered D, JK and T flip-flops with characteristic and excitation tables, the race-around problem, setup and hold times and metastability, shift registers, ring and Johnson counters, ripple and synchronous counters, mod-N counters and their glitches, frequency division, timing limits on the clock, and Moore and Mealy state machines.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'A JK flip-flop has J = K = 1 and Q = 0 before a clock edge. After three active clock edges Q is'
    choices: ['1', '0', 'undefined', 'equal to J']
    ans: 0
    why: 'With J = K = 1 the flip-flop toggles on each edge: 0 → 1 → 0 → 1.'
  - q: 'A 5-bit Johnson (twisted-ring) counter has how many distinct states in its normal cycle?'
    choices: ['10', '5', '32', '31']
    ans: 0
    why: 'A Johnson counter feeds the inverted last output back to the first stage and cycles through 2n states: 10 for n = 5. A ring counter has n states.'
  - q: 'A 4-bit ripple counter uses flip-flops with 15 ns delay. If the count must be read only after every output has settled, plus 5 ns for the decoder, the maximum clock frequency is'
    choices: ['15.4 MHz', '66.7 MHz', '50 MHz', '13.3 MHz']
    ans: 0
    why: 'The last bit can settle 4 × 15 = 60 ns after the edge; adding 5 ns gives 65 ns, so f_max = 1/65 ns ≈ 15.4 MHz.'
sources:
  - 'M. M. Mano and M. D. Ciletti, Digital Design, 5th ed. (2013), chapters 5 and 6'
  - 'R. J. Tocci, N. S. Widmer and G. L. Moss, Digital Systems, 12th ed. (2017), chapters 5 and 7'
  - 'J. F. Wakerly, Digital Design: Principles and Practices, 4th ed. (2006), chapters 7 and 8'
  - 'GATE Physics (PH) syllabus, Electronics section, published by the organising IIT each year'
---

**Module 9 · about 45 minutes.** The circuits of [lesson 9.5](/learn/courses/gate-physics/combinational-logic/) forget their inputs as soon as the inputs change. Add feedback from outputs to inputs and a circuit can hold a bit: that is memory, and with a clock it becomes registers, counters and state machines. GATE asks for state tables, counter moduli, timing diagrams and clock limits.

<div class="bigidea">A flip-flop samples its input at a clock edge and holds it until the next edge. A synchronous system is combinational logic between ranks of flip-flops that all update on the same edge, so its behaviour is a table of present state and input against next state. Its speed limit is one rule: data launched at one edge must settle before the next edge arrives.</div>

## 1. Latches and flip-flops

**SR latch.** Two cross-coupled NOR gates. S = 1 sets Q = 1, R = 1 resets it, S = R = 0 holds, and S = R = 1 forces both outputs to 0 and leaves the next state undecided when both inputs drop together, so it is forbidden. (With NAND gates the inputs are active-low.) Gating it with an enable and feeding `$S = D$`, `$R = D'$` gives the **D latch**, which is transparent while the enable is high.

Clock a flip-flop by hand and read the timing diagram.

<div class="steps" data-fig="@sx-flipflop">
<div class="step"><b>Reset.</b> Q = 0. Choose the flip-flop type and set its inputs.</div>
<div class="step"><b>Clock edge.</b> At the rising edge, Q takes the value the inputs ask for. Press the next step again to see another edge.</div>
<div class="step"><b>Another edge.</b> Change the inputs between edges: Q does not move until the next rising edge.</div>
<div class="step"><b>Toggle.</b> With T = 1 or J = K = 1 every edge flips Q: divide by 2.</div>
</div>

**Edge-triggered flip-flops** change only at a clock edge. Their behaviour is summarised by a characteristic equation for the next state `$Q^+$`:

| Flip-flop | Characteristic equation | Excitation (inputs needed for Q → Q⁺) |
|---|---|---|
| D | `$Q^+ = D$` | D = Q⁺ |
| T | `$Q^+ = T\oplus Q$` | T = Q ⊕ Q⁺ |
| JK | `$Q^+ = JQ' + K'Q$` | 0→0: J=0, K=X; 0→1: J=1, K=X; 1→0: J=X, K=1; 1→1: J=X, K=0 |
| SR | `$Q^+ = S + R'Q$` (SR = 0) | 0→1: S=1, R=0; 1→0: S=0, R=1 |

The JK flip-flop is the SR with the forbidden input made useful: J = K = 1 toggles. Built as a level-triggered latch, it would toggle over and over while the clock is high: the **race-around** condition. The master-slave arrangement (one latch enabled on each clock level) or true edge triggering cures it.

<div class="meaning">

<dl>
<dt>setup time `$t_{su}$`</dt><dd>the input must be stable this long before the clock edge</dd>
<dt>hold time `$t_h$`</dt><dd>and this long after it</dd>
<dt>clock-to-Q `$t_{cq}$`</dt><dd>delay from the edge to the new output</dd>
<dt>metastability</dt><dd>if the input changes inside the setup-hold window, the flip-flop can hang between 0 and 1 for an unpredictable time. Signals from outside the clock domain pass through two flip-flops in series (a synchroniser) to make the failure rate negligible.</dd>
</dl>

</div>

## 2. Registers

A register is `$n$` flip-flops sharing a clock. Connecting each output to the next input gives a **shift register**: one shift per clock edge.

| Type | Load | Read | Use |
|---|---|---|---|
| SISO | serial, n clocks | serial, n more clocks | delay line |
| SIPO | serial | parallel | serial-to-parallel (receivers) |
| PISO | parallel, one clock | serial | parallel-to-serial (transmitters) |
| PIPO | parallel | parallel | storage, buffers |

Shifting left by one place multiplies an unsigned number by 2; shifting right divides by 2 (an arithmetic shift keeps the sign bit for two's complement).

**Ring and Johnson counters.** Feed the last output of a shift register back to the first. Preloaded with a single 1, the **ring counter** circulates it through `$n$` states, one output high at a time, with no decoding needed. Feed back the complement instead and you get the **Johnson counter**, with `$2n$` states: a 4-bit one runs 0000, 1000, 1100, 1110, 1111, 0111, 0011, 0001, and each state is decoded by a two-input gate. Both waste most of their `$2^n$` possible states and need a reset to avoid locking into an unused cycle.

## 3. Counters

**Ripple (asynchronous) counters.** Each flip-flop toggles (T = 1, or JK with J = K = 1) and is clocked by the output of the one before. Each stage divides the frequency by 2, so `$n$` stages count to `$2^n$` and divide by `$2^n$`. The catch is delay: bit `$k$` changes `$k + 1$` propagation delays after the edge, so between edges the count passes through wrong values (going from 0111 to 1000 shows 0110, 0100, 0000 on the way).

**Synchronous counters.** All flip-flops share the clock. For a binary up-counter with T flip-flops, bit `$i$` toggles when all lower bits are 1:

```math
T_0 = 1, \qquad T_i = Q_0Q_1\cdots Q_{i-1}
```

All outputs change together one `$t_{cq}$` after the edge, with no wrong intermediate states.

**Mod-N counters.** A counter that cycles through `$N$` states needs `$\lceil\log_2N\rceil$` flip-flops. A ripple counter is made mod-N by detecting the count `$N$` and clearing all flip-flops asynchronously: a decade counter (mod-10) uses a NAND of `$Q_3$` and `$Q_1$` (1010) to clear. The state `$N$` therefore exists briefly, a glitch. A synchronous design instead loads 0 at the clock edge after `$N - 1$`, with no glitch. Design a synchronous counter from its state table: list present and next states, read off the flip-flop inputs from the excitation table, and minimise each with a K-map, using the unused states as don't-cares.

<figure class="fig" data-fig="counter-timing"><figcaption>Timing diagram of a 3- or 4-bit counter, simulated edge by edge with a chosen flip-flop delay. In the ripple counter each bit changes one delay after the bit before it, and the count row shows the short-lived wrong states (shaded); with mod-N the clear pulse makes N flash briefly. The synchronous counter changes all bits together.</figcaption></figure>

**Frequency division.** Counters are dividers: cascaded mod-`$N_1$` and mod-`$N_2$` counters divide by `$N_1N_2$`. A 32 768 Hz watch crystal through 15 toggle stages gives exactly 1 Hz. The MSB of a counter whose modulus is not a power of two is not a symmetric square wave (a mod-6 counter's MSB is high for 2 of 6 counts); a final divide-by-2 stage fixes that.

<div class="problem" data-problem="counter-division"></div>

## 4. Timing limits

For a synchronous path from one flip-flop through logic to the next:

```math
T_{clk} \ge t_{cq} + t_{logic,max} + t_{su} + t_{skew}, \qquad t_{cq} + t_{logic,min} \ge t_h + t_{skew}
```

The first (setup) inequality sets the maximum clock frequency; the second (hold) inequality does not depend on the clock period at all, and a violation cannot be fixed by slowing the clock. For a ripple counter whose full count must be read, the clock period must exceed `$n\,t_{pd}$` plus the time to read the count.

**Worked example.** A 4-bit ripple counter with 10 ns flip-flops settles 40 ns after an edge; with a 10 ns strobe it runs at most at 1/(50 ns) = 20 MHz. A synchronous version with `$t_{cq} = 5$` ns, an AND chain of 8 ns and `$t_{su} = 2$` ns needs only 15 ns: 66.7 MHz, and adding bits only lengthens the AND chain (or not at all, with parallel carry gates).

<div class="problem" data-problem="max-clock"></div>

**State machines.** In a **Moore** machine the outputs depend only on the state; in a **Mealy** machine they also depend on the present input, which can save states but lets input glitches through to the outputs. A sequence detector for 101 needs three states as a Mealy machine and four as a Moore machine.

<div class="myth">

**"A ripple counter and a synchronous counter are equally good dividers, so why bother with the synchronous one?"** As a pure frequency divider, the ripple counter is fine and uses less logic. The difference shows the moment the count is decoded: its outputs pass through wrong states for up to `$n$` delays after every edge, and a decoder watching them produces glitches. Anything that acts on the count value needs a synchronous counter, or must wait for the ripple to settle.

</div>

<div class="keypoints">

- D: `$Q^+ = D$`; T: `$Q^+ = T\oplus Q$`; JK: `$Q^+ = JQ' + K'Q$` (J = K = 1 toggles); SR forbids S = R = 1.
- Race-around: level-triggered JK with J = K = 1; cured by master-slave or edge triggering.
- Ring counter `$n$` states; Johnson `$2n$` states; binary `$2^n$`.
- Ripple: bit `$k$` settles after `$(k + 1)t_{pd}$`, wrong intermediate counts; mod-N by asynchronous clear at N (glitch).
- Synchronous: `$T_i = Q_0\cdots Q_{i-1}$`; `$T_{clk} \ge t_{cq} + t_{logic} + t_{su} + t_{skew}$`; hold violations do not depend on the clock.
- Cascaded counters divide by the product of their moduli.

</div>

## Practise: exam questions on this lesson

<div class="qbank" data-bank="physics" data-topics="sequential-logic" data-exam="gate" data-n="10"></div>

**Next:** [lesson 9.7](/learn/courses/gate-physics/adc-dac/) connects digital circuits to the analogue world with DACs and ADCs, several of which are built from the counters and registers here.
