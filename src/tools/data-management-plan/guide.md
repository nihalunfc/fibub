---
name: Data management plan builder
num: 820
shelf: science
section: ethics-and-planning
title: "Data management plan (DMP) builder: guided sections, word counts and Word, PDF or Markdown downloads"
summary: "Write a data management plan section by section, with plain questions to answer for data, documentation, storage, ethics, sharing, preservation, roles and costs. Word counts and optional word limits per section, and downloads as Markdown, Word, PDF or an image. Your draft stays in your browser."
status: live
ads: false
order: 820
icon: pencil
works: offline
updated: 2026-11-09
related: [plate-layout, plot-maker]
sources:
  - "The eight sections, their short descriptions and the guiding questions are written by fibub in its own words as a generic outline. They are not copied from any funder's or institution's template."
  - "Word counts are checked in the tests against Python (tokens split on white space that hold a letter or digit)."
  - "The example plan is a made-up project."
flow:
  - { icon: file, label: "Details" }
  - { icon: pencil, label: "Sections" }
  - { icon: check, label: "Count" }
  - { icon: download, label: "Download" }
---

## What it does

A data management plan (DMP) says what data a project will make, how it will be kept safe, who may use it and what happens to it at the end. Many funders, universities and ethics boards ask for one with a grant application or before a study starts. This page helps you write one in eight generic sections that most plans have:

1. **Data description**: what you will collect or reuse, in which formats, and how much.
2. **Documentation and metadata**: README files, data dictionaries, file names and versions.
3. **Storage and backup**: where the working data lives, backups and who has access.
4. **Ethics and legal**: consent, personal data, approvals and ownership.
5. **Sharing and access**: what you share, when, where and under which licence.
6. **Preservation**: what is kept long term, for how long, and what is destroyed.
7. **Responsibilities**: who does each part of the plan.
8. **Costs and resources**: storage, staff time, repository fees and training.

Each section has a short list of **questions to answer** (open *Questions to answer*). They are prompts written by fibub, not any funder's wording, so check what your own funder or institution asks for: if they give a template, its headings and limits come first, and you can copy your text across.

## How to use it

1. **Details.** Type the project title, who prepared the plan, the funder or programme (optional) and the date.
2. **Sections.** Write each section in plain sentences. Leave a blank line between paragraphs; the downloads keep them.
3. **Word counts.** Each section shows its word count. Type a **word limit** if your template has one: the count turns red and says how many words you are over. The summary table lists every section as written, not written yet, or over its limit.
4. **Download.** *Download Markdown* gives a plain text file with a heading per section. *Image*, *PDF* and *Word* make a tidy report with the summary first.

**Keep my draft in this browser** (off at first, so nothing is saved until you tick it) saves what you type in this browser's local storage, so the plan is still here when you come back. It is never sent anywhere. Untick it, or press *Start again*, to delete the saved draft. To move a plan to another computer, download the Markdown and open it there with *Open a Markdown file*.

## Worked example

Press **Fill with the example** to load a made-up project: soil samples from 40 allotment plots plus a survey of plot holders. The summary reads **339 words, 8 of 8 sections written**. The data description has 81 words against a limit of 120, and the ethics section 49 against a limit of 50. Change the ethics limit to 40 and the section shows "49 of 40 words, 9 over", and the summary adds "1 over the word limit".

## How words are counted

A word is any run of characters between spaces that holds at least one letter or digit. "Long-term" and "3.5" are one word each; a dash on its own is not a word. Word processors count nearly the same way, but some count a lone dash, so allow a few words of slack under a hard limit.

## Tips

- Be specific: name the storage, the repository and the person, rather than saying "data will be stored securely".
- Say what you **cannot** share and why. That is a normal, accepted answer for personal data.
- Update the plan when the project changes; a DMP is a living document.

## FAQ

**Does this page check my plan against a funder's rules?** No. It gives generic sections and counts words. Funders' requirements differ and change, so check their current guidance and template.

**Where is my draft kept?** Only in this browser, and only while *Keep my draft in this browser* is ticked. Clearing your browser's site data also deletes it.

**Can I add my own sections?** Not on this page. Download the Word file and add them there, or add `## ` headings to the Markdown file.
