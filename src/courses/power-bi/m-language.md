---
title: Reading the M code behind each step
seoTitle: 'Power Query M language for beginners: read it, edit it'
summary: Every Power Query step is a line of M. Learn to read let and in, step names, each and _, and make small safe edits in the Advanced Editor.
minutes: 14
updated: 2026-11-22
sources:
  - 'Microsoft Learn, Power Query M formula language: https://learn.microsoft.com/powerquery-m/'
quiz:
  - q: In M, what does each step usually refer to?
    choices: ['The source file', 'The step before it, by name', 'The final table']
    ans: 1
    why: Each step is name = function(previous step, ...). That chain is what Applied steps shows.
  - q: What does `each [Qty] * [Price]` mean?
    choices: ['Multiply the whole columns once', 'A small function run for every row, using that row''s Qty and Price', 'An error']
    ans: 1
    why: each is short for a function of the current row (written _). [Qty] reads the Qty field of that row.
  - q: A step name has spaces. How is it written in M?
    choices: ['#"Changed Type"', '[Changed Type]', '"Changed Type"']
    ans: 0
    why: 'Names with spaces or symbols are written #"like this". Plain names like Source need nothing.'
---

**Module 2 · about 14 minutes · read first: 2.1.** You'll be able to read a query in the Advanced Editor and make simple edits safely.

## 1. Why this matters

Buttons cover most work, but sometimes a refresh fails and the message names a step, or you need a small change no button offers. Reading M turns a scary error into a one-line fix.

## 2. The idea in one picture

Click through the steps and watch the M line: it's the code behind each button.

<!--fig:pq-steps clean-->

## 3. The shape of a query

Open **Home > Advanced Editor** in Power Query and you see something like:

```
let
    Source = Csv.Document(File.Contents("C:\Northbay\till-export.csv"), [Delimiter=","]),
    #"Promoted Headers" = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    #"Trimmed Text" = Table.TransformColumns(#"Promoted Headers", {{"Store Name", Text.Trim, type text}}),
    #"Filtered Rows" = Table.SelectRows(#"Trimmed Text", each [Store Name] <> "TOTAL"),
    #"Added Amount" = Table.AddColumn(#"Filtered Rows", "Amount", each [Qty] * [Price], type number)
in
    #"Added Amount"
```

- **let … in**: a list of named steps, then the one to return.
- **Each step** is `Name = Function(previous step, settings)`. The Applied steps pane is this list.
- `#"Promoted Headers"`: names with spaces use `#"…"`.
- `{{"Store Name", Text.Trim, type text}}`: lists use `{ }`; here, a list of column-and-function pairs.
- `[Delimiter=","]`: records use `[ ]` with field = value.
- `each [Qty] * [Price]`: a function run on every row; `[Qty]` reads the current row's Qty. `each` means `(_) =>`, and `[Qty]` is short for `_[Qty]`.
- M is **case-sensitive**: `Text.Trim` works, `text.trim` doesn't. Column names are case-sensitive too.

## 4. Safe edits

1. **Change a file path** in Source when the file moves (or better, use a parameter: Manage parameters > New).
2. **Fix a renamed column**: if the source now calls it "Quantity" instead of "Qty", change the name in the steps that mention it.
3. **Add a condition** in a filter: `each [Store Name] <> "TOTAL" and [Qty] <> null`.

Always check the preview after an edit, and keep the step list readable: rename steps, and add a comment with `//`.

<details class="maths" open>
<summary>Principle</summary>

**Principle:** M is a functional language. A step never changes the step before it; it makes a new table from it. That's why you can click any step to see the data "as it was", and why deleting a step can break the steps after it.

**Try it:** in the query above, which step does `#"Filtered Rows"` use as its input? (`#"Trimmed Text"`.)
</details>

## 5. Worked example

*The refresh fails: "The column 'Qty' of the table wasn't found."* The store's new till exports "Quantity". Open the Advanced Editor, find each `[Qty]` and `"Qty"`, and change them to `Quantity` (or add a first step `Table.RenameColumns(Source, {{"Quantity", "Qty"}})`, which keeps the rest of the query unchanged). Refresh: fixed in a minute.

## 6. Practice

1. Rewrite the filter to also drop rows where Store Name is null.
2. What does `Table.SelectRows(Source, each [Amount] > 100)` keep?
3. Why does `#"Added Amount"` appear after `in`?

<details>
<summary>Answers</summary>

1. `each [Store Name] <> "TOTAL" and [Store Name] <> null`.
2. Only rows whose Amount is more than 100.
3. It is the step the query returns: the final table that loads into the model.
</details>
