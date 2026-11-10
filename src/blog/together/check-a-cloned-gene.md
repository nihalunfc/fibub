---
title: "How to check a cloned gene in a plasmid, step by step"
summary: "Use a restriction digest, a sequence alignment and a protein calculator together to check that your gene went into the plasmid, the right way round and without typos."
tools: [restriction-digest, sequence-alignment, protein-calculator]
updated: 2026-11-10
sources:
  - "Restriction enzyme recognition sites (EcoRI GAATTC, HindIII AAGCTT) are textbook facts."
  - "The average amino acid mass of about 110 Da is a standard rule of thumb. The plasmid sizes, positions and gene length in the worked example are made up."
---

You have grown colonies after a cloning step. Some may hold your gene, some may hold an empty plasmid, and some may hold the gene the wrong way round or with a typo. Checking takes three questions: is the insert there, is it facing the right way, and is the sequence what you meant? Three free tools answer them in order: the [[restriction-digest]], the [[sequence-alignment]] and the [[protein-calculator]].

## Why these tools fit together

Each tool checks a different thing, and each catches mistakes the others miss.

- A **restriction digest** cuts DNA at known short sites. The sizes of the pieces tell you whether the insert is present and which way it faces. It is quick and cheap, but it cannot see a single wrong letter.
- A **sequence alignment** lines up your sequencing result with the sequence you planned. It shows every changed, missing or extra letter.
- A **protein calculator** turns the planned protein into a mass and a charge. This tells you what to expect on a protein gel, and whether a typo has changed the protein.

Run them in that order. The digest is a fast filter, the alignment is the proof, and the protein numbers tell you what to look for next.

## Step by step

### 1. Predict the digest

Paste the full sequence of the plasmid you expect, with the gene inside it, into the restriction digest simulator and choose circular. Tick the enzymes you plan to use, or type your own. Write down the predicted fragment sizes. Also paste the empty vector, so you know what a failed clone would give. Type your ladder sizes and compare the virtual gel with the real one. To read real band sizes from a photo, the [[gel-band-sizer]] fits a line through your ladder.

### 2. Align the sequencing result

Paste the planned sequence as the first sequence and your sequencing result as the second. Use semi-global mode if the read covers only part of the plasmid, because it does not charge for the unread ends. Use global mode if both cover the same stretch. Read the identity, the number of gaps, and the blocks, where a space instead of "|" between the two lines marks a changed or missing letter.

### 3. Check the protein

Paste the amino acid sequence your gene should make. Note the molecular weight, the pI (the pH at which its positive and negative charges balance) and the extinction coefficient. If the alignment found a change, translate your actual DNA into protein with the [[sequence-tools]] first (the protein calculator takes protein letters only), paste that too, then compare the two.

## A worked example

All numbers here are made up. The plasmid with no insert is 2,700 bp, with one EcoRI site and one HindIII site. You cut the gene (900 bp) out with EcoRI at both ends and ligate it into the EcoRI site. The new plasmid is 2,700 + 900 = 3,600 bp.

**Digest with EcoRI.** The cuts fall after bases 400 and 1,300, giving pieces of 900 and 2,700 bp. The 900 bp band says the insert is there. It does not say which way it faces, because EcoRI cuts both ends alike.

**Digest with HindIII.** The vector has one HindIII site, at base 3,000 in the new plasmid's numbering. The gene has one, 650 bp from its start.

- Gene facing the right way: the sites are at 1,050 and 3,000, giving **1,950 and 1,650 bp**.
- Gene flipped: the gene's site is now 250 bp from the start, at 650, giving **2,350 and 1,250 bp**.

Both pairs add up to 3,600 bp. A colony showing 1,950 and 1,650 bp has the gene facing the right way.

**Alignment.** Sequencing the gene gives 899 letters. The plan has 900. A global alignment finds 899 identical columns out of 900, so identity is 899 ÷ 900 = 99.9 %, with one gap. One missing base is not harmless: every codon after it is read in the wrong frame.

**Protein.** The plan is 900 bp, or 300 codons. One is the stop codon, so the protein has 299 amino acids. With about 110 Da per amino acid, expect about 299 × 110 = 32,890 Da, near 33 kDa. The calculator gives the exact figure from the sequence. A frameshift would make a protein of a different length, so the band on a protein gel would be in the wrong place.

The verdict: right insert, right direction, but one base missing. Pick another colony.

## Tips

- Always digest the empty vector too. It is your control.
- Choose enzymes whose fragments differ clearly in size, so the bands do not merge. Bands of 1,950 and 1,650 bp separate well on a 1 % gel; 1,000 and 1,050 bp would look like one band.
- The simulator models an ideal gel. Uncut supercoiled plasmid runs faster than its size suggests, so do not worry if an undigested lane looks smaller.
- Check primer-based screens with the [[primer-checker]], which also shows the expected product size on your template.
- Sequence both strands where you can. One read can hide an error near its ends.
- Save a copy of the plasmid map with the [[plasmid-map]] tool, so the next person knows what is inside.
