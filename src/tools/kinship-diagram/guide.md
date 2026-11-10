---
name: Kinship diagram
num: 761
shelf: science
code: T529
section: anthropology
title: "Kinship diagram maker with kin type notation (FBD, MZS) — free"
summary: "Draw a kinship chart with the standard anthropology symbols, choose Ego, and get every relative's kin type (FBD, MZS, WB…) worked out from the family links. Download SVG or PNG, save and reopen as a file. Nothing is stored."
status: live
ads: false
order: 761
icon: link
works: offline
updated: 2026-11-09
related: [plot-maker, pedigree-drawing-tool, field-note-organiser, social-network-analysis, correspondence-network, interlinear-gloss]
sources:
  - "Conventions: standard anthropological kinship diagram symbols and kin type notation (primitive kin types F, M, B, Z, S, D, H, W; P, G, C, E for sex unknown), as taught in introductory anthropology."
  - "Example family: made up, with invented names."
flow:
  - { icon: pencil, label: "Add people" }
  - { icon: link, label: "Link family" }
  - { icon: search, label: "Kin types" }
  - { icon: download, label: "SVG, PNG" }
---

## What it does

Kinship diagrams are how anthropologists record who is related to whom. This page draws one for you with the usual symbols:

- **△ triangle** for a male, **○ circle** for a female and **□ square** when the sex is unknown or not recorded;
- **=** between two people for a marriage, crossed with **//** for a divorce, and a single line for two parents who are not married;
- a **vertical line** down from the couple to a **horizontal siblings bar**, with each child hanging from it;
- a **slash** through the symbol of someone who has died;
- **Ego**, the person every relation is counted from, filled in.

Under each person it writes their **kin type** in standard notation, worked out from the links you entered: F father, M mother, B brother, Z sister, S son, D daughter, H husband, W wife, with P (parent), G (sibling), C (child) and E (spouse) when the sex is unknown. Codes read outwards from Ego, so **FBD** is the father's brother's daughter and **MZS** the mother's sister's son: the two kinds of first cousin that many kinship systems treat very differently (parallel cousins). A table lists every relative with the code, the reading in words, the generation (+1 for Ego's parents, −1 for Ego's children) and whether the link is by blood or by marriage.

Record the interviews behind it in the [[field-note-organiser|field note organiser]], and map wider ties between people with [[social-network-analysis|social network analysis]].

## How to use it

1. Start from the example or press **Start again** to begin with Ego alone.
2. Next to any person, **Add relative** adds a father, mother, brother, sister, son, daughter, child, husband or wife in one step, already linked. Then rename them.
3. Or add people one by one and pick their **Parent 1** and **Parent 2**. Add marriages under **Marriages**, and tick **Divorced** where it applies. Tick **Deceased** for anyone who has died.
4. Choose who is **Ego**: all the codes are recalculated from that person.
5. Turn the kin type and name labels on or off, and switch **Fit to width** off to see a large diagram at full size.
6. Download the diagram as **SVG** (for editing or printing at any size) or **PNG**, or the report with the relations table as an image, PDF or Word file.

## Privacy

Family information is personal. Use pseudonyms or initials for real people. Nothing is stored in your browser or sent anywhere: the diagram disappears when you close the page. To keep it, press **Save to a file** (a small JSON file on your own device) and reopen it later with **Open a saved file**.

## Worked example

The example family (invented names) has Ego, Ravi, with his wife Jaya and their son Kiran (S). Ravi's late father Arun (F) and his brother Chetan (FB) are sons of Lalit (FF, deceased) and Meera (FM). Chetan and his wife Devi (FBW) have a daughter, Esha: **FBD**. Ravi's mother Bina (M) and her sister Farah (MZ) are children of Noor, whose sex is not recorded, so Noor is **MP** and drawn as a square. Farah, now divorced from Gopal (MZH), has a son Hari: **MZS**. Choose Esha as Ego instead and Ravi becomes her **FBS**.

## How the codes are worked out

Each person is linked to their parents, children, spouses and full siblings (people with the same known parent or parents). The code is the shortest chain of links from Ego. A half-sibling, who shares only one parent, comes out as FS or MD, which is how the notation records them. When two chains are equally short, a chain of blood links is preferred over one through a marriage.

## FAQ

**Can I draw polygamous marriages or remarriage?** Yes: add each marriage. A person with several spouses is drawn between them.

**Why is someone shown as "–"?** They are not linked to Ego by any chain of parents, children, siblings or marriages. Add the missing link.

**Does the layout handle cousin marriage?** The codes are always right, but when the same people appear on both sides of a family the layout may need lines that cross. Download the SVG to tidy it in a drawing program.
