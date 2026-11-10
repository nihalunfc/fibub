# Writing for the fibub Blog

One Markdown file per article: `src/blog/<kind>/<slug>.md`, shown at `/blog/<kind>/<slug>/`.
Check your files with `node scripts/check-links.mjs src/blog/<kind>/<slug>.md` (prints only problems and one OK line).

## Kinds
- `guides/<tool-id>.md`: one per tool. The slug is the tool id. Explains the tool completely.
- `howto/<slug>.md`: one task people search for ("how to calculate molarity"), answered step by step with fibub tools. Title in the searcher's words. Sections: opening (the answer in one or two sentences), ## What you need, ## Step by step, ## A worked example, ## Check your answer, ## Questions people ask.
- `together/<slug>.md`: one real job that takes 2 to 5 tools, step by step.
- `kids/<slug>.md`: for school students (Class 8 to 12), usually one per NCERT chapter. Set `level:`.
- `discoveries/<slug>.md`: one new open-access paper in plain words, and above all how fibub tools let anyone check or extend its numbers. Needs `paper:`. Title: the paper's key finding in the words a researcher would search (topic, object, method), not a pun. Pick papers a fibub tool can genuinely help with. No tool fits? Add `## A tool we could build` and append one line (subject, tool idea, paper DOI) to /mnt/project-files/fibub/blog/tool-ideas-from-papers.md.

## Frontmatter
```yaml
---
title: "What a sequence alignment shows, and how to read one"   # as people search it, under 70 characters if you can
summary: "One or two sentences for cards and search results (160 characters or less reads best)."
tools: [sequence-alignment, primer-checker]   # live tool ids, the main one first (a guide: the tool it explains)
updated: 2026-11-10
level: "Class 9"            # kids only
sources:                    # where any reference values or facts beyond the textbook come from
  - "Needleman and Wunsch (1970), J. Mol. Biol. 48: 443-453 (the original method)."
paper:                      # discoveries only
  title: "..."
  authors: "Surname A, Surname B et al."
  journal: "Scientific Reports"
  year: 2026
  doi: "10.xxxx/xxxxx"
  url: "https://..."
  licence: "CC BY 4.0"
  reviewed: true            # false for a preprint
---
```

## A tool guide (700 to 1,000 words)
Read the tool's own `src/tools/<id>/guide.md` and `Tool.astro` first, so you describe what the tool really does (its real inputs, buttons and outputs). The tool page already has its own short how-to: **do not copy or reword its text**. Your guide is the complete article: the idea behind the tool, how to use it, real uses and a fresh worked example. Sections, in this order:

1. An opening paragraph (no heading): what the tool does, who it is for, and one sentence that sends readers to 2 or 3 related tools, written as `[[tool-id]]`.
2. `## What it is`: the idea behind the tool, in plain words. Formulas where they help, each symbol explained.
3. `## How to use it`: 4 to 7 numbered steps that match the real tool.
4. `## A worked example`: your own numbers (never a published table), worked through to the answer. **Check every number** (run it with `node -e` if needed). Units on every value.
5. `## Where it is used`: real jobs and other fields where the same tool helps (say how).
6. `## Common mistakes`: 3 to 5, each with how to avoid it.
7. `## Questions people ask`: 2 to 4 short questions with answers, different from the tool page's FAQ.

## Links, like an encyclopedia
- `[[tool-id]]` links a tool by its name; `[[tool-id|your words]]` with your words. Another article: `[[blog:guides/planner]]` or `[[blog:guides/planner|your words]]` (only once that article exists).
- Tool names also link themselves the first time they appear. Link where it helps the reader, not as a list.

## House rules
- Plain, friendly English. Short sentences. Explain every term the first time.
- Science only: nothing religious, astrological or pseudo-scientific.
- Never copy text, tables or figures from papers, textbooks (NCERT included) or other sites. Facts and standard constants are fine. Name where reference values come from in `sources:`.
- Money and health: general education only; say "check the official source" for rules that change by country, and never give personal advice.
- Kids: simple words, short steps, safe practice (no real chemicals, flames or mains electricity at home without an adult), encourage checking answers.
- Discoveries: open-access papers only (CC BY or similar); say "preprint, not yet peer-reviewed" when it is; our own words; examples use our own rounded or made-up numbers, never the paper's data tables.
- Never mention fibub's owner by name, and never mention any company someone is applying to.
