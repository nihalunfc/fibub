---
title: 'Molecular basis of inheritance'
seoTitle: 'Molecular basis of inheritance: NEET biology'
summary: 'DNA structure and packaging, the experiments that proved DNA is the genetic material, RNA world, semi-conservative replication, transcription in bacteria and eukaryotes, the genetic code, tRNA and translation, the lac operon, the Human Genome Project and DNA fingerprinting, with the numbers and traps NEET asks most.'
minutes: 36
updated: 2026-11-22
quiz:
  - q: 'In the Hershey-Chase experiment, radioactivity was found inside the bacteria when the phage was labelled with:'
    choices: ['³⁵S', '³²P', '¹⁵N', '¹⁴C']
    ans: 1
    why: '³²P labels DNA (proteins have no phosphorus), and it entered the bacteria. ³⁵S labels protein (DNA has no sulphur), and it stayed outside in the ghosts. So DNA is what enters and carries the genes.'
  - q: 'Okazaki fragments are formed on:'
    choices: ['the leading strand', 'the lagging strand', 'both strands', 'mRNA during splicing']
    ans: 1
    why: 'DNA polymerase works only 5′ → 3′. On the strand whose template runs 5′ → 3′ towards the fork, it must work backwards in short pieces (Okazaki fragments), later joined by DNA ligase.'
  - q: 'Which statement about the genetic code is correct?'
    choices: ['One codon codes for several amino acids', 'Most amino acids are coded by more than one codon', 'There are 64 codons that code for amino acids', 'The code is read with commas between codons']
    ans: 1
    why: 'The code is degenerate: most amino acids have several codons. It is unambiguous (one codon, one amino acid), 61 of 64 codons code for amino acids, and it is comma-less.'
sources:
  - 'NCERT Biology Class 12 (2023 rationalised), chapter Molecular basis of inheritance: topics followed, no text copied'
  - 'National Medical Commission, NEET (UG) syllabus: Genetics and evolution https://www.nmc.org.in'
  - 'Watson J. D., Crick F. H. C. (1953), Molecular structure of nucleic acids, Nature 171, 737-738 https://doi.org/10.1038/171737a0'
  - 'Meselson M., Stahl F. W. (1958), The replication of DNA in Escherichia coli, PNAS 44(7), 671-682 https://doi.org/10.1073/pnas.44.7.671'
  - 'International Human Genome Sequencing Consortium (2004), Finishing the euchromatic sequence of the human genome, Nature 431, 931-945 https://doi.org/10.1038/nature03001'
---

**Biology · Class 12 · about 36 minutes.** By the end you will be able to describe DNA and how it is packed, explain the experiments behind each discovery, follow a gene from replication to transcription to protein, explain how the lac operon switches genes, and handle NEET's numerical and statement questions on this chapter.

<div class="bigidea">DNA is a long, two-stranded message in a four-letter alphabet. Because A always pairs with T and G with C, each strand holds the full information of the other. That one fact explains copying (replication), reading (transcription) and checking identity (fingerprinting). Triplets of letters spell amino acids, so the message builds proteins.</div>

## 1. The structure of DNA

A **nucleotide** = nitrogen base + pentose sugar + phosphate. The base joins the sugar by an **N-glycosidic bond** (making a nucleoside); the phosphate joins at the 5′ carbon by a **phosphoester bond**; nucleotides link by **3′-5′ phosphodiester bonds** into a strand with a 5′ end and a 3′ end. Purines: adenine, guanine; pyrimidines: cytosine, thymine (DNA), uracil (RNA). RNA's sugar is ribose, with an extra 2′-OH.

Watson and Crick (1953) built the **double helix** using X-ray pictures from Maurice Wilkins and Rosalind Franklin and **Chargaff's rule** (A = T, G = C, so purines = pyrimidines):

- Two strands, **antiparallel** (one 5′ → 3′, the other 3′ → 5′), sugar-phosphate backbone outside, bases inside.
- **A = T with two hydrogen bonds, G ≡ C with three**. A purine always faces a pyrimidine, so the helix has a constant width of about 2 nm.
- Right-handed, **3.4 nm per turn**, **10 bp per turn**, so **0.34 nm** between base pairs.

<div class="problem" data-problem="mol-chargaff"></div>

**Sizes:** phage φX174 has 5386 nucleotides, phage λ 48,502 bp, *E. coli* 4.6 × 10⁶ bp, and a haploid human set about 3.3 × 10⁹ bp. A diploid human cell has 6.6 × 10⁹ bp, which is about **2.2 m** of DNA in a nucleus a few micrometres wide.

<div class="problem" data-problem="mol-dna-length"></div>

**Packaging.** In prokaryotes the negatively charged DNA is held in loops by positive proteins in the **nucleoid**. In eukaryotes, **histones** (rich in positive lysine and arginine) form an **octamer**; DNA wraps around it to make a **nucleosome** of about 200 bp. Nucleosomes look like "beads on a string" and coil further into chromatin fibres and, at metaphase, chromosomes. Non-histone chromosomal (NHC) proteins help the higher packing. Loosely packed, active, lightly staining chromatin is **euchromatin**; densely packed, inactive, darkly staining is **heterochromatin**.

## 2. DNA is the genetic material

- **Griffith (1928)**, *Streptococcus pneumoniae* in mice: S strain (smooth, capsule) kills, R strain (rough) does not, heat-killed S does not; but heat-killed S + live R kills, and live S bacteria come back. Something "transformed" R into S.
- **Avery, MacLeod and McCarty (1944)**: the transforming principle survived proteases and RNases but was destroyed by DNase. So it was DNA.
- **Hershey and Chase (1952)**: T2 phages grown with ³²P (labels DNA) or ³⁵S (labels protein) infected *E. coli*; after blending and spinning, ³²P was inside the bacteria and ³⁵S outside. Only DNA enters.

A genetic material must copy itself, be chemically and structurally stable, allow slow change (mutation) for evolution, and express itself as traits (Mendelian characters). DNA is preferred over RNA for storage because it is more stable (no reactive 2′-OH; thymine instead of uracil) and double-stranded. RNA is better at catalysis and expression. **RNA was probably the first genetic material (the RNA world)**: it can store information and act as a catalyst, and DNA evolved later from it.

## 3. Replication

DNA copies **semi-conservatively**: each new molecule keeps one old strand and makes one new strand. **Meselson and Stahl (1958)** grew *E. coli* on ¹⁵N (heavy), moved them to ¹⁴N, and spun the DNA in a caesium chloride gradient. After one generation all DNA was hybrid (intermediate density); after two, half hybrid and half light. Taylor showed the same in *Vicia faba* chromosomes with radioactive thymidine.

The main enzyme is **DNA-dependent DNA polymerase**, which only adds nucleotides at the 3′ end (works **5′ → 3′**), uses deoxynucleoside triphosphates as both building blocks and energy, and is fast and accurate. Replication starts at an **origin (ori)**, opens a **replication fork**, and proceeds:

- **leading strand**: made continuously;
- **lagging strand**: made in short pieces, **Okazaki fragments**, joined by **DNA ligase**.

In eukaryotes replication happens in the S phase; if it is not followed by division, the cell becomes polyploid.

Press play, slow the fork down and then switch ligase off.

<figure class="fig" data-fig="@bio-replication-fork"><figcaption>The leading strand is made in one piece toward the fork; the lagging strand is made backwards in Okazaki fragments, each started by an RNA primer, and ligase joins them.</figcaption></figure>

## 4. Transcription

Only one strand is copied into RNA. The **template strand** runs 3′ → 5′; the other, the **coding strand**, has the same sequence as the RNA (with T for U) and is the one written by convention. A **transcription unit** = **promoter** (upstream, where RNA polymerase binds; it decides the template strand) + **structural gene** + **terminator** (downstream).

- **Bacteria**: one RNA polymerase makes mRNA, tRNA and rRNA. The **σ (sigma) factor** helps it start, the **ρ (rho) factor** helps it stop. Transcription and translation can happen together, since there is no nucleus. Bacterial genes are often **polycistronic**.
- **Eukaryotes**: three RNA polymerases in the nucleus: **I** makes rRNAs (28S, 18S, 5.8S), **II** makes the precursor of mRNA (**hnRNA**), **III** makes tRNA, 5S rRNA and snRNAs. Genes are **split**: coding **exons** interrupted by non-coding **introns**. hnRNA is processed: **splicing** removes introns and joins exons; **capping** adds methyl guanosine triphosphate at the 5′ end; **tailing** adds 200 to 300 adenylates at the 3′ end. Then mRNA leaves the nucleus.

## 5. The genetic code and translation

George Gamow argued that 4 bases need codons of 3 to cover 20 amino acids (4³ = 64). Nirenberg's cell-free system, Khorana's synthetic RNAs and Ochoa's enzyme (polynucleotide phosphorylase) cracked it. Features:

- **Triplet**: 64 codons, **61 code for amino acids**, **3 are stop codons** (UAA, UAG, UGA).
- **Unambiguous** (one codon, one amino acid) and **degenerate** (some amino acids have several codons).
- **Read 5′ → 3′ in a continuous frame, comma-less**. Insert or delete one or two bases and the frame shifts (frameshift mutation); insert or delete three and one amino acid is added or lost, the rest stays readable.
- **Nearly universal** (exceptions in mitochondria and some protozoans). **AUG** is both the **start codon** and the code for **methionine**.

**tRNA** is the adapter: an **anticodon loop** reads the codon and the **amino acid acceptor end** (3′) carries the amino acid. It looks like a **cloverleaf** in 2D and an **inverted L** in 3D. There is one tRNA per amino acid at least, and an initiator tRNA; there is no tRNA for stop codons.

**Translation**: amino acids are first **charged** (activated with ATP and attached to their tRNA, aminoacylation). The ribosome's small subunit meets the mRNA at AUG; the large subunit joins. In bacteria the **23S rRNA** acts as the enzyme that makes peptide bonds (a ribozyme). The ribosome moves codon by codon, and a **release factor** binds the stop codon to end the chain. The mRNA has **untranslated regions (UTRs)** before the start and after the stop codon.

<div class="problem" data-problem="mol-codons"></div>

<div class="myth">

**"The coding strand is the one that is transcribed."** The template strand is copied. The coding strand is called that because its sequence matches the mRNA.

</div>

Pick a codon, then mutate one letter and read whether it is silent, missense or nonsense.

<figure class="fig" data-fig="@bio-codon-table"><figcaption>The code is degenerate: many amino acids have several codons, so changes in the third letter are often silent.</figcaption></figure>

Step through transcription and translation of a short gene.

<div class="steps" data-fig="@bio-central-dogma">
<div class="step"><b>The gene.</b> The template strand is read 3' to 5'.</div>
<div class="step"><b>Transcription.</b> RNA polymerase builds mRNA by base pairing (A with U).</div>
<div class="step"><b>mRNA.</b> Codons AUG GUG CAC CUU UAA.</div>
<div class="step"><b>Start.</b> The ribosome meets AUG and tRNA brings Met.</div>
<div class="step"><b>Elongation.</b> Each codon brings its amino acid and a peptide bond forms.</div>
<div class="step"><b>Termination.</b> UAA is a stop codon; the polypeptide Met-Val-His-Leu is released.</div>
</div>

## 6. Gene regulation: the lac operon

In bacteria, genes for one job often sit together under one promoter as an **operon**. Jacob and Monod described the **lac operon** of *E. coli*: a regulator gene **i** (makes the repressor all the time), a promoter, an operator, and three structural genes: **z** (β-galactosidase, splits lactose into glucose and galactose), **y** (permease, lets lactose in) and **a** (transacetylase).

<figure class="fig" data-fig="lac-operon"><figcaption>The lac operon with lactose absent (repressor on the operator) and present (inducer removes the repressor). Lactose acts as the inducer.</figcaption></figure>

Lactose (or allolactose) is the **inducer**. This control by a repressor is **negative regulation**. Low levels of the operon's proteins are always present, enough to let a little lactose in to start the switch.

Switch tryptophan between low and high and see which state turns the operon on.

<figure class="fig" data-fig="@bio-trp-operon"><figcaption>Compare with the lac operon above: lac is switched on by an inducer (lactose), trp is switched off by its end product acting as a corepressor.</figcaption></figure>

## 7. The Human Genome Project and DNA fingerprinting

The **Human Genome Project** (1990 to 2003) aimed to find all human genes and sequence all 3 billion base pairs, store the data, develop tools, and address ethical, legal and social issues. Two approaches: **expressed sequence tags (ESTs)** to find expressed genes, and **sequence annotation** (sequence everything, then assign functions). DNA was cut, cloned in **BAC** and **YAC** vectors, and sequenced by automated versions of Frederick Sanger's method. Salient findings (from the project's reports): 3164.7 million bp; average gene about 3000 bases, the largest (**dystrophin**) about 2.4 million bases; about 30,000 genes estimated then (later work puts protein-coding genes nearer 20,000); 99.9% of bases identical between people; less than 2% codes for proteins; chromosome 1 has the most genes (2968) and Y the fewest (231); about 1.4 million **single nucleotide polymorphisms (SNPs)**.

**DNA fingerprinting** (Alec Jeffreys) compares repetitive DNA. Some repeats separate as a minor peak in density gradient centrifugation: **satellite DNA**. **VNTRs** (variable number of tandem repeats) differ in copy number between people, so their fragment sizes differ. Steps: isolate DNA, cut with restriction enzymes, separate by gel electrophoresis, transfer to a membrane (**Southern blotting**), hybridise with a labelled VNTR probe, and detect by autoradiography. Used in forensics, paternity tests and studying population diversity. Polymorphism arises from inheritable mutations at a high frequency in a population.

<div class="meaning">
<dl>
<dt>Antiparallel</dt><dd>the two strands run in opposite 5′ → 3′ directions</dd>
<dt>Template / coding strand</dt><dd>3′ → 5′ strand that is copied / 5′ → 3′ strand with the same sequence as mRNA</dd>
<dt>Cistron</dt><dd>a segment that codes for one polypeptide; mono- or polycistronic units</dd>
<dt>Okazaki fragments</dt><dd>short DNA pieces of the lagging strand, joined by ligase</dd>
<dt>Inducer</dt><dd>lactose: removes the repressor and switches the lac operon on</dd>
<dt>Physical meaning</dt><dd>Base pairing is a lock and key. Copy, read and compare DNA all use the same lock: a strand finds or builds its complement.</dd>
</dl>
</div>

Press play and compare the crime-scene lane with the three suspects.

<figure class="fig" data-fig="@bio-gel-electrophoresis"><figcaption>DNA fingerprinting compares band patterns of VNTR fragments: the lane that matches the scene is the same person.</figcaption></figure>

<div class="keypoints">

- Nucleotide bonds: N-glycosidic, phosphoester, phosphodiester. A = T (2 H-bonds), G ≡ C (3); 0.34 nm per bp, 10 bp and 3.4 nm per turn.
- Histone octamer + about 200 bp = nucleosome; euchromatin active, heterochromatin inactive.
- Griffith (transformation), Avery-MacLeod-McCarty (DNA), Hershey-Chase (³²P enters).
- Semi-conservative: Meselson-Stahl (¹⁵N, CsCl). Polymerase works 5′ → 3′; Okazaki fragments on the lagging strand.
- σ starts, ρ stops in bacteria; pol I rRNA, II hnRNA, III tRNA, 5S, snRNA; splicing, capping, tailing.
- Code: triplet, 61 sense + 3 stop, AUG start, degenerate, unambiguous, comma-less, nearly universal.
- lac operon: i, p, o, z, y, a; lactose is the inducer; negative regulation.
- HGP 1990 to 2003; DNA fingerprinting uses VNTRs and Southern blotting.

</div>
