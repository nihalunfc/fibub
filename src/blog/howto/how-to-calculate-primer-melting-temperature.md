---
title: "How to calculate primer melting temperature (Tm)"
summary: "Work out a PCR primer's Tm from its GC content, compare three simple formulas and pick a starting annealing temperature, with a worked primer pair."
tools: [primer-checker, pcr-master-mix, sequence-tools]
updated: 2026-11-10
sources:
  - "Wallace rule (2 °C per A or T, 4 °C per G or C), the basic GC formula 64.9 + 41 × (G + C − 16.4) ÷ N and the sodium-adjusted formula 81.5 + 16.6 log₁₀[Na⁺] + 0.41 × %GC − 675 ÷ N: standard textbook formulas for oligo melting temperature."
  - "The primer pair in the example is a made-up sequence."
---

A primer's melting temperature (Tm) is the temperature at which half of it has come off its target strand, and for a typical 18 to 30 base primer you can estimate it from its length and how many G and C bases it holds. Paste the primer into the [[primer-checker]] and it gives you three formula estimates at once, plus the checks that decide whether the primer is worth ordering.

## What you need

- The primer sequence, written 5′ to 3′ exactly as it will appear on the order form.
- The reverse primer too, if you are checking a pair. Its Tm should sit within a few degrees of the forward one.
- The sodium concentration of your PCR buffer, if you want the salt-adjusted number. Many buffers are close to 50 mM.

## Step by step

1. **Count the bases.** Note the length N and the number of G plus C bases. G pairs with C through three hydrogen bonds, while A pairs with T through two, so GC-rich primers hold on more tightly and melt at a higher temperature.
2. **Pick a formula.** The simplest is the Wallace rule, meant for short oligos under about 14 bases:
   Tm = 2 × (A + T) + 4 × (G + C)
   For normal PCR primers the basic GC formula is better:
   Tm = 64.9 + 41 × (G + C − 16.4) ÷ N
   If salt matters to you, there is a sodium-adjusted version, with [Na⁺] in mol/L:
   Tm = 81.5 + 16.6 × log₁₀[Na⁺] + 0.41 × %GC − 675 ÷ N
3. **Let the tool do it.** Open the primer checker, type the forward primer and, if you have one, the reverse primer. Set the sodium box if your buffer differs from 50 mM. The results table lists all three Tm values side by side. For primers of 14 bases or more, the headline uses the basic formula.
4. **Read the other checks.** In the same table you will see GC %, how many of the last five bases are G or C (the "GC clamp"), the longest run of one base, the longest hairpin stem and the strongest self-dimer and cross-dimer. Anything outside the common rules of thumb is marked "(check)".
5. **Choose an annealing temperature to start from.** For a pair, the tool suggests a starting annealing temperature 5 °C below the lower Tm. Treat it as a first guess and refine it with a gradient run.

Once the primers look right, build the reaction with the [[pcr-master-mix]], and use the [[sequence-tools|DNA sequence tools]] if you need to reverse-complement a target before you design.

## A worked example

Take a made-up pair:

- Forward: GACAAGCTCAGGTTGCCAGA
- Reverse: TCCAGATTGCAGGTCAAGTG

Both are 20 bases long. The forward has 11 G or C bases (55 % GC); the reverse has 10 (50 % GC).

Basic formula, forward: 64.9 + 41 × (11 − 16.4) ÷ 20 = 64.9 − 11.07 = **53.8 °C**.
Basic formula, reverse: 64.9 + 41 × (10 − 16.4) ÷ 20 = 64.9 − 13.12 = **51.8 °C**.

Wallace rule, forward: 2 × 9 + 4 × 11 = 62 °C. Reverse: 2 × 10 + 4 × 10 = 60 °C. Wallace runs high for 20-mers, which is why the basic formula is the better guide at this length.

Salt-adjusted at 50 mM (0.05 M), forward: 81.5 + 16.6 × (−1.301) + 0.41 × 55 − 675 ÷ 20 = 81.5 − 21.60 + 22.55 − 33.75 = **48.7 °C**. The reverse comes out at 46.7 °C.

Typed into the primer checker, the pair gives the headline "Pair looks good: Tm 53.8 / 51.8 °C". The two Tm values differ by about 2 °C, well inside the usual 5 °C limit. The forward has 3 G or C bases in its last five and the reverse has 2, both inside the 1 to 3 range. Neither has a run longer than 2 bases, the hairpin stems are 3 base pairs at most, and the strongest cross-dimer is 3 base pairs with only 2 at a 3′ end. The suggested starting annealing temperature is 51.8 − 5 = **46.8 °C**.

## Check your answer

- A 20-mer at 50 % GC should land near 52 °C by the basic formula. Every extra G or C in a 20-mer adds about 2 °C (41 ÷ 20 = 2.05), so 55 % GC gives about 54 °C.
- The three formulas should disagree in a predictable order for a 20-mer: Wallace highest, salt-adjusted lowest, basic in between. If yours do not, check that you typed only A, C, G and T and did not paste the reverse complement by mistake.
- A Tm outside roughly 50 to 65 °C for a 20-base primer usually means the GC content is far from 40 to 60 %.

## Questions people ask

**Why does my supplier's calculator give a different Tm?** Most supplier tools use a nearest-neighbour model, which looks at which bases sit next to each other and adds the polymerase buffer's salt and magnesium. The simple formulas only count bases, so they can be several degrees off. Use the supplier's number for the final setting.

**Is annealing temperature the same as Tm?** No. Annealing is usually set a few degrees below the lower Tm of the pair, so both primers bind but stray matches still fall off.

**Does primer concentration change Tm?** Yes, a little: more primer shifts the balance towards bound strands and raises the true Tm. The simple formulas leave this out, which is one more reason to fine-tune with a gradient.
