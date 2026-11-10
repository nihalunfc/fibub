---
title: "From DNA to protein: how a gene is read, and what a mutation does"
summary: "Transcription, the genetic code and translation in plain words, with a fresh worked example of silent, missense, nonsense and frameshift mutations."
tools: [central-dogma, sequence-tools, mendel-peas, cell-explorer]
updated: 2026-11-10
sources:
  - "The standard genetic code and the mutation classes are general biology."
  - "The 25-base gene in the worked example is made up for this article."
---

The Central dogma lab shows how a cell turns a stretch of DNA into a protein, one codon at a time, and lets you change the DNA to see what happens. It is for school students meeting transcription and translation for the first time, and for anyone who wants to see why one changed letter can matter so much. To see where DNA sits in a cell, start with the [[cell-explorer]]; to see how genes pass from parents to children, try [[mendel-peas]]; and for real sequences, use [[sequence-tools]].

## What it is

A **gene** is a stretch of DNA that holds the instructions for one protein. DNA has two strands that pair up: A with T, and G with C.

- The **coding strand** reads, 5′ to 3′, the same as the messenger RNA (with T in place of U). The numbers 5′ and 3′ name the two ends of a strand, so they tell you which way to read it.
- The **template strand** is its partner. The enzyme RNA polymerase reads the template and builds the mRNA from it. This copying is called **transcription**.
- The **mRNA** (messenger RNA) carries the message to a ribosome. RNA uses U (uracil) where DNA uses T.

In **translation**, a ribosome reads the mRNA in groups of three bases called **codons**. Reading starts at the first AUG, which also codes for methionine (Met). Each codon names one amino acid, and the chain grows until a **stop codon** (UAA, UAG or UGA). There are 64 codons but only 20 amino acids, so most amino acids have more than one codon. This is the **genetic code**, shared by almost all living things.

A **mutation** is a change in the DNA. What it does to the protein depends on where it falls:

- a change that gives the same amino acid is **silent**;
- a change that gives a different amino acid is **missense**;
- a change that makes a stop codon is **nonsense**, and the protein ends early;
- adding or removing one or two bases is a **frameshift**: every codon after it is read in the wrong groups of three;
- adding or removing exactly three bases is **in-frame**: one amino acid is gained or lost and the rest stays.

## How to use it

1. Type a **coding strand of DNA, 5′ to 3′**, or keep the example. **Random gene** makes a new one; **Back to the example** returns.
2. Look at the rows: coding strand, template strand, mRNA and the amino acid under each codon.
3. Under **Mutate it**, choose what a tap does: **Change** (pick A, C, G or T), **Insert before** or **Delete**.
4. Tap a base. The page names the kind of mutation and shows the protein before and after.
5. Press **Play translation** to watch the codons being read one by one. **Undo all changes** clears your edits, and **Download codons (CSV)** saves the table.
6. Finish with **Check yourself**, then **New questions** for another set.

## A worked example

Type this made-up coding strand:

CCATGTCTGAACGTTGGCAATAGGC

The page skips the first two bases (CC) and starts at ATG. The template strand underneath reads GGTACAGACTTGCAACCGTTATCCG. The codons are:

AUG UCU GAA CGU UGG CAA UAG

which gives **Met-Ser-Glu-Arg-Trp-Gln**, then stop. Six amino acids.

Now try four changes, one at a time, pressing **Undo all changes** between them.

1. **Silent.** Change the last T of TCT to C. The codon becomes UCC, which still codes for serine. The protein is the same.
2. **Missense.** Change the last A of GAA to C. GAC codes for aspartic acid, so the page reports Glu → Asp at amino acid 3. The chain is Met-Ser-Asp-Arg-Trp-Gln.
3. **Nonsense.** Change the C of CAA to T. UAA is a stop, so the protein ends after Trp: Met-Ser-Glu-Arg-Trp, five amino acids instead of six.
4. **Frameshift.** Delete the first A of GAA. From there the ribosome reads new groups of three: Met-Ser-Asp-Val-Gly-Asn-Arg, and it never reaches a stop inside this short gene. A single missing letter changed every amino acid after it.

For a last test, delete all three bases of CGT (choose Delete and tap the C, then the same spot twice more). The page calls it **in-frame**: Met-Ser-Glu-Trp-Gln, with only Arg missing.

## Where it is used

- **Medicine.** Many inherited conditions come from one changed base. Sickle cell disease is a missense change in a haemoglobin gene, the example used in many textbooks.
- **Genetic testing.** Labs that read a patient's DNA sort each change into these same classes to judge whether it could matter.
- **Biotechnology.** When scientists put a gene into bacteria to make a protein such as insulin, they check the reading frame and the stop codon in exactly this way.

## Common mistakes

- **Reading the template strand as the message.** The mRNA matches the coding strand, not the template. If you translate the template you get nonsense.
- **Starting at the first base.** Reading begins at the first AUG, not at the start of the sequence. Bases before it are not read.
- **Thinking every change is harmful.** Silent changes leave the protein the same, and many missense changes swap one similar amino acid for another.
- **Forgetting T becomes U.** When you write the mRNA, swap every T for U. Codon tables use U.

## Questions people ask

**Why are there three bases per codon and not two?** Two bases give only 4 × 4 = 16 combinations, too few for 20 amino acids. Three give 4 × 4 × 4 = 64, enough for all of them plus stop signals.

**Can a mutation outside the gene matter?** It can. Bases near a gene control when and how much it is read. This lab only looks at the coding part, from AUG to the stop.

**Why is a frameshift near the end of a gene less serious?** Fewer codons come after it, so less of the protein changes.
