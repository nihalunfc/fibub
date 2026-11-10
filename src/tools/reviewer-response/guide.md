---
name: Reviewer response
num: 807
shelf: science
section: writing-and-publishing
title: "Reviewer response"
summary: "Paste the reviewers' reports and the page splits them into numbered points for each reviewer, keeping their numbers and major/minor groups. Write a response and the change made under each point, see which are still unanswered, and download the letter as Word, PDF, image, LaTeX or Markdown. Your draft is kept in this browser only if you tick the box."
status: live
ads: false
order: 807
icon: pencil
works: offline
updated: 2026-11-09
related: [abstract-word-counter, author-list-formatter, bibtex-cleaner, table-converter, figure-checker, equation-converter, readability-checker]
sources:
  - "The splitting rules and letter layout are written by fibub from common practice in response letters; no journal template is copied."
  - "The example reviewer comments are made up."
  - "Comments and responses stay on your device. They are saved in this browser only when you tick Keep my draft."
flow:
  - { icon: pencil, label: "Comments" }
  - { icon: table, label: "Points" }
  - { icon: resume, label: "Responses" }
  - { icon: download, label: "Letter" }
---

## What it does

A response to reviewers is a long, careful document: every comment quoted, every one answered, and the changes pointed out so the editor can check them. Losing track of point 3 from Reviewer 2 is easy. This page does the bookkeeping:

- **Splits the reports** into reviewers and points. Headings such as *Reviewer 1*, *Referee #2:*, *Comments from Reviewer 3 (Remarks to the Author)* or *Editor* start a new reviewer. Numbered lines (1. 2) (a) [3] *Comment 4:*) and bullets start new points, and the reviewer's own numbers are kept, so your R1.3 is their point 3. Text before the first numbered point, usually a summary, becomes point 0. If a reviewer numbered nothing, each paragraph is a point.
- **Keeps groups** such as *Major comments* and *Minor comments* as headings in the letter.
- **One box per point** for your response and an optional box for the change in the manuscript (such as "Methods, lines 80 to 85"). A green edge shows answered points and a count shows what is left.
- **Downloads** the full letter as Word, PDF or an image, as a LaTeX document that compiles on its own (comments in grey italics, responses in normal type), or as Markdown. Unanswered points are marked "[Response to be written.]" so none slips through.
- **Your draft** stays on the page. Tick *Keep my draft in this browser* to have it here next time; it never leaves your device and *Clear draft* deletes it.

Fix the figures the reviewers asked about with the [[figure-checker]], and tidy any new references with the [[bibtex-cleaner]].

## How to use it

1. **Comments.** Paste the decision letter or the reports, or open a text file. Check that the reviewers and points look right; if two points ran together, put a number at the start of the second one in the box.
2. **Points.** Fill in the manuscript title and ID, and edit the opening and closing of the letter.
3. **Responses.** Write a response under each point, polite and specific, and say what changed and where.
4. **Letter.** Download it as Word to finish in your editor, or as LaTeX to compile with your paper.

## Worked example

Press *Use the example*. The made-up decision has two reviewers. Reviewer 1 wrote a summary, then four numbered points under *Major comments* and *Minor comments*; the page shows them as **R1.0** (General) and **R1.1 to R1.4**. Reviewer 2 numbered nothing, so the three paragraphs become **R2.1 to R2.3**. The count reads **0 of 8 points answered**.

Type "We added six plants per group (n = 12) and repeated the analysis." under R1.1 and the count becomes 1 of 8. In the LaTeX download that point appears as `\paragraph{Comment R1.1}`, the reviewer's words in a grey italic block, then `\textbf{Response:} We added six plants per group (n = 12) and repeated the analysis.`

## Tips

- Answer every point, including praise ("We thank the reviewer for the kind words").
- Quote the changed text or give line numbers in the revised manuscript, so the editor does not have to search.
- Keep the tone factual when you disagree, and give the evidence.
- If your journal has its own response form, download Markdown or Word and paste the parts in.

## FAQ

**Is my manuscript information uploaded?** No. Everything happens on this page. Nothing is saved unless you tick *Keep my draft in this browser*, and then only in this browser on this device.

**What if I change the comments after writing responses?** Responses are linked to point numbers such as R1.3. If you add or remove a point, check that each response is still under the right comment.

**Why is the summary point 0?** So that the numbers match the reviewer's own: their comment 1 is your R1.1.
