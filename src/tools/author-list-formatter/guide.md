---
name: Author list formatter
num: 801
shelf: science
code: T537
section: writing-and-publishing
title: "Author list formatter"
summary: "Type your authors and affiliations once, in a simple line format, and get the author block for AASTeX, MNRAS, A&A, REVTeX or elsarticle, a numbered superscript list for Word, plain text or JATS-style XML. Repeated affiliations are merged and numbered in order, ORCID iDs are checked, and the corresponding author is marked."
status: live
ads: false
order: 801
icon: resume
works: offline
updated: 2026-11-09
related: [plot-maker, graph-digitizer, bibtex-cleaner, abstract-word-counter, reviewer-response, table-converter, figure-checker]
sources:
  - "The output follows the author and affiliation commands in the public author templates of each LaTeX class (AASTeX, mnras.cls, aa.cls, REVTeX 4.2, elsarticle) as general knowledge; no template text is copied. Check the journal's current template."
  - "The ORCID check digit is the ISO 7064 MOD 11-2 rule that ORCID documents."
  - "The example authors and affiliations are made up (Ada Lovelace and Charles Babbage are used as familiar names only)."
flow:
  - { icon: pencil, label: "Authors" }
  - { icon: sliders, label: "Style" }
  - { icon: check, label: "Checks" }
  - { icon: copy, label: "Copy" }
---

## What it does

Every journal wants the author list written its own way. AAS journals repeat the full affiliation under every author, MNRAS wants superscript numbers and a list of institutions, A&A uses `\inst` and `\and`, and Word templates want superscript numbers typed by hand. Keeping the numbers right when an author is added or moved is where mistakes creep in. This page keeps one simple list and writes all of these for you:

- **Affiliations are numbered for you,** in order of first use, so the first author always has 1. The same affiliation written twice (even with different spacing, a missing space after a comma or a full stop at the end) is merged into one number.
- **ORCID iDs are checked** with the check digit that ORCID uses, so a typo in the last digits is caught before submission.
- **The corresponding author** gets the right command: `\correspondingauthor` and `\email` for AASTeX, `\thanks{E-mail: ...}` for MNRAS, `\corref` and `\cortext` for elsarticle, and a star in the Word list.
- **Special characters are escaped** (an & or % in an address would break LaTeX), and accents can be written as LaTeX commands for old templates.

Tidy the reference list with the [[bibtex-cleaner]], and check the abstract's length with the [[abstract-word-counter]].

## How to use it

1. **Authors.** Write one author per line, in author order: `name; affiliations; ORCID; email; *`. Only the name is needed; the other parts can come in any order. Define affiliations once with a short key, such as `1 = Department of Physics, Example University, City, Country`, then give the keys (`1, 2`), or write the affiliation in full on the author line.
2. **Style.** Pick the journal style. Tick *Accents as LaTeX commands* if your template does not read UTF-8, and *ORCID icons* to add `\orcidlink` after each name.
3. **Checks.** Read the warnings: an author with no affiliation, a corresponding author with no email, an ORCID with a wrong check digit or an affiliation key no author uses.
4. **Copy.** Copy the block into your paper, or download it. For Word, choose *Superscript list* and press *Copy for Word*; the superscripts paste as real superscripts.

## Worked example

Press *Use the example*. Four made-up authors share three affiliations. José Núñez-García's affiliation is typed out in full with a missing space and a full stop at the end, but the page sees it is the same as key 1 and merges them, so the page shows **4 authors and 3 affiliations**. In the MNRAS style the block starts:

`\author[A. Lovelace et al.]{`
`Ada Lovelace,$^{1,2}$\thanks{E-mail: ada@example.org}`
`Charles Babbage,$^{2}$`
`José Núñez-García$^{1}$`
`and Mira van der Berg$^{3}$`

and the plain-text style gives `Ada Lovelace¹,²,*, Charles Babbage², José Núñez-García¹ and Mira van der Berg³`. With accents as LaTeX commands, the third name becomes `Jos{\'e} N{\'u}{\~n}ez-Garc{\'\i}a`.

## Tips

- Keep the list here in a text file next to your paper and paste it in again when the author order changes.
- Write the family name first with a comma for names like *van der Berg* or *García Márquez*, so the short running-head list and the JATS surname are right.
- MNRAS, A&A, REVTeX and elsarticle have no ORCID command of their own; without the orcidlink option the iDs are listed as comments for you to add the way the journal asks.
- Journals update their classes. Check the current template and author guide before you submit.

## FAQ

**Does it change the order of authors?** No. Authors stay in your order; only the affiliation numbers are worked out.

**Why are the affiliation numbers sorted for each author?** Most journals list them in increasing order (1,2 rather than 2,1). Because affiliations are numbered by first use, moving an author up the list renumbers everything correctly.

**Is my author list sent anywhere?** No. The list is formatted on this page and is not saved or uploaded.
