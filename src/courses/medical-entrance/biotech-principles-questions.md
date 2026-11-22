---
title: 'Biotechnology: principles and processes: question types and traps'
seoTitle: 'Biotechnology principles NEET questions and traps'
summary: 'Every way NEET asks about the principles of biotechnology: enzyme naming, palindromes and complementary strands, fragment counts, gel band reading, vector features and pBR322, insertional inactivation and blue-white screening, competence, DNA isolation, PCR counts and bioreactors, each with a method and the usual trap. Then practise.'
minutes: 24
updated: 2026-11-22
quiz:
  - q: 'Which of these is a palindromic recognition site?'
    choices: ['5′-GAATTG-3′', '5′-GGATCC-3′', '5′-AAGCTA-3′', '5′-CTGCAC-3′']
    ans: 1
    why: 'The complement of GGATCC, read 5′ → 3′, is GGATCC again (the BamH I site). The others change when read on the other strand.'
  - q: 'Starting from 2 copies, how many copies of DNA are there after 10 ideal PCR cycles?'
    choices: ['20', '1024', '2048', '4096']
    ans: 2
    why: '2 × 2¹⁰ = 2 × 1024 = 2048.'
  - q: 'Chilled ethanol is added during DNA isolation to:'
    choices: ['break the cell wall', 'remove proteins', 'precipitate the DNA', 'cut DNA into fragments']
    ans: 2
    why: 'Purified DNA comes out of solution as fine white threads when chilled ethanol is added. Lysozyme, cellulase or chitinase break walls; protease removes proteins.'
sources:
  - 'NCERT Biology Class 12 (2023 rationalised), chapter Biotechnology: principles and processes: topics followed, no text copied; NEET question patterns studied (no questions copied)'
---

**Biology · Class 12 · about 24 minutes.** Read [Biotechnology: principles and processes](/learn/courses/medical-entrance/biotech-principles/) first. Here you meet every question type NEET builds from this chapter, then practise.

<div class="bigidea">Questions here follow the lab bench in order: break the cell, clean the DNA, cut it, check it on a gel, paste it into a vector, put it into a host, select, copy, scale up. If you can say what each step uses and why, every question becomes a step to identify.</div>

## The question types

<div class="steps" data-ms="8000">
<div class="step"><b>1. Enzyme naming.</b> Genus (capital), species (two letters), strain, order of discovery. <i>Trap:</i> "R" is not "restriction".</div>
<div class="step"><b>2. Palindromes and complements.</b> <i>Method:</i> write the complement and read it 5′ → 3′; if it matches, it is a palindrome. <i>Trap:</i> reading the bottom strand 3′ → 5′.</div>
<div class="step"><b>3. Fragment counts.</b> Linear DNA with k cuts gives k + 1 fragments; circular gives k. Expected cuts = length ÷ 4ⁿ for an n-bp site.</div>
<div class="step"><b>4. Gel reading.</b> Smaller fragments run farther, towards the anode; ethidium bromide + UV shows orange bands. <i>Trap:</i> "DNA moves to the cathode".</div>
<div class="step"><b>5. Vector features.</b> ori (copy number), selectable marker, unique cloning site, small size. pBR322: BamH I, Sal I in tetR; Pvu I, Pst I in ampR; <i>rop</i>.</div>
<div class="step"><b>6. Selection.</b> Insert in tetR → grows on ampicillin, not tetracycline. Blue-white: white = recombinant. <i>Trap:</i> reversing which antibiotic kills recombinants.</div>
<div class="step"><b>7. Competence and delivery.</b> Ca²⁺, ice, 42 °C, ice; microinjection (animal nucleus); gene gun (plants, gold or tungsten); Ti plasmid, retroviruses (disarmed).</div>
<div class="step"><b>8. DNA isolation.</b> Lysozyme (bacteria), cellulase (plants), chitinase (fungi); RNase and protease; chilled ethanol.</div>
<div class="step"><b>9. PCR.</b> Copies = start × 2ⁿ; steps in order denature, anneal, extend; Taq from <i>Thermus aquaticus</i>.</div>
<div class="step"><b>10. Bioreactors and downstream.</b> Stirred-tank, sparged; continuous culture keeps the log phase; downstream = separation, purification, formulation, quality control.</div>
</div>

## Worked examples

**Example 1 (level 4, pBR322).** A gene is inserted at the Pst I site of pBR322 and *E. coli* is transformed. On which plates will recombinants grow? *Solution.* Pst I lies in ampR, so the insert inactivates ampicillin resistance; tetR still works. **Tetracycline yes, ampicillin no.**

**Example 2 (level 4, gel).** A 10 kb linear DNA is cut by an enzyme with sites at 2 kb and 7 kb from one end. Which band runs farthest? *Solution.* Fragments: 2, 5 and 3 kb. The smallest, **2 kb**, runs farthest.

**Example 3 (level 5, PCR).** How many cycles take 5 copies to at least 5000? *Solution.* Need 2ⁿ ≥ 1000; 2¹⁰ = 1024. **10 cycles.**

**Example 4 (level 5, statements).** Statement I: Exonucleases cut DNA at specific positions inside the molecule. Statement II: Restriction enzymes belong to the endonuclease class. *Solution.* Exonucleases remove nucleotides from the ends, so I is false; II is true. **I incorrect, II correct.**

<div class="myth">

**"A vector with many cloning sites for one enzyme is better."** One site per enzyme is best; several sites would chop the vector into pieces.

</div>

<div class="meaning">
<dl>
<dt>Cuts to fragments</dt><dd>linear: k + 1; circular: k</dd>
<dt>Site frequency</dt><dd>once per 4ⁿ bp for an n-bp site</dd>
<dt>PCR</dt><dd>start × 2ⁿ after n cycles</dd>
<dt>Physical meaning</dt><dd>Selection always asks "which gene still works?" An insert switches off the gene it lands in.</dd>
</dl>
</div>

## Practise

<div class="qbank" data-bank="entrance-biology" data-topics="biotech-principles" data-mode="practice" data-exam="neet"></div>

<div class="keypoints">

- Name enzymes from genus, species, strain, number.
- Palindrome check: complement read 5′ → 3′ matches.
- Linear k cuts → k + 1 pieces; circular → k.
- Gel: small fragments farther, towards the anode.
- Insert in tetR: survive ampicillin, die on tetracycline; white colonies are recombinant.
- PCR copies = start × 2ⁿ.

</div>
