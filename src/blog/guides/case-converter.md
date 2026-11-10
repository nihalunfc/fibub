---
title: "Text case styles explained: Title Case, snake_case, camelCase and more"
seoTitle: "Text case styles explained, with examples | fibub"
summary: "What each letter-case style means, when writers and programmers use it, and how to switch a heading, a list or a variable name between them in one press."
tools: [case-converter, text-cleaner, find-replace, word-counter]
updated: 2026-11-10
sources:
  - "Title Case here leaves short joining words (such as a, an, and, for, of, the, to) small in the middle of a line, a common house-style rule. Style guides such as APA and Chicago differ in the details."
  - "The programming styles (camelCase, PascalCase, snake_case, CONSTANT_CASE, kebab-case) are naming habits used across many languages and style guides, not a single standard."
---

Letter case is the choice between big letters (capitals) and small letters, and the way words are joined. The [[case-converter]] takes any text you paste and shows it in ten styles: four for ordinary writing and six that programmers and data people use for names. It helps students tidying headings, office staff fixing a list typed with Caps Lock on, and developers turning a plain phrase into a variable name. If your text came from a PDF with stray spaces and broken lines, run it through the [[text-cleaner]] first, and use [[find-replace]] when only some words need a change.

## What it is

Case styles fall into two families.

**Writing styles** keep the spaces between words and only change the letters:

- **UPPER CASE** turns every letter into a capital. It is loud, so it suits short labels and warnings.
- **lower case** makes every letter small.
- **Title Case** gives each word a capital first letter, except short joining words such as "of", "the" and "for" when they sit in the middle. The first word, the last word and any word right after a colon, full stop, question mark or dash always start big.
- **Sentence case** starts each sentence with a capital and makes everything else small, apart from the word "I".

**Naming styles** remove the spaces and punctuation, because names in code, file paths and spreadsheet headers cannot hold a space safely. They use something else to show where one word ends:

- **camelCase**: words run together, and each word after the first starts big (`orderTotal`).
- **PascalCase**: like camelCase, but the first word starts big too (`OrderTotal`).
- **snake_case**: small letters joined by underscores (`order_total`).
- **CONSTANT_CASE**: capitals joined by underscores (`ORDER_TOTAL`).
- **kebab-case**: small letters joined by hyphens (`order-total`), common in web addresses.

There is also **aLtErNaTe**, which flips letters between small and big. It has no serious use, but people ask for it.

To build a naming style, the tool first cuts the text into words. It splits at spaces and punctuation, and also inside joined-up names where a small letter meets a capital. That is why `getUserName` turns into `get_user_name` in snake_case.

## How to use it

1. Type or paste your text into the **Your text** box. It can be one word or many paragraphs.
2. Press one of the ten case buttons. The pressed button stays highlighted, and the converted text appears in the **Result** box.
3. Keep typing if you like. The result follows your edits while the same button stays chosen.
4. Press **Copy the result** to put it on your clipboard.
5. Press **Use result as my text** if you want to keep working on the converted version, for example to try a second style on top of it.

Your original text stays as it was until you press that last button.

## A worked example

Say you have the phrase `monthly sales report for the north region` and need it in several places.

- As a document heading in Title Case: **Monthly Sales Report for the North Region**. "for" and "the" stay small because they are joining words in the middle.
- As a sentence: **Monthly sales report for the north region**.
- As a column name in a database: **monthly_sales_report_for_the_north_region** (snake_case).
- As a setting name in code that never changes: **MONTHLY_SALES_REPORT_FOR_THE_NORTH_REGION** (CONSTANT_CASE).
- As part of a web address: **monthly-sales-report-for-the-north-region** (kebab-case).
- As a JavaScript variable: **monthlySalesReportForTheNorthRegion** (camelCase).

One more check: `Order #42: ship today!` in snake_case becomes `order_42_ship_today`. The hash, colon and exclamation mark are dropped, and the number is kept as a word of its own.

## Where it is used

- **Office work**: lists of names, product lines or headings often arrive in capitals from old systems. Sentence case or Title Case makes them readable again before a report goes out.
- **Programming**: each language has its habit. Python names variables in snake_case, JavaScript in camelCase, and classes in many languages in PascalCase. Fixed settings are often in CONSTANT_CASE.
- **Data and spreadsheets**: column headers in snake_case import cleanly into databases and analysis tools that dislike spaces.
- **Websites**: page addresses and file names in kebab-case are easy to read and safe in links.

## Common mistakes

1. **Losing acronyms.** Title Case and Sentence case make every letter after the first one small, so "NASA" becomes "Nasa". Put acronyms back by hand, or fix them afterwards with [[find-replace]].
2. **Losing proper nouns in Sentence case.** Place names and people's names turn small ("Kerala" becomes "kerala"). Read the result before you paste it.
3. **Expecting a naming style to come back.** camelCase and snake_case throw away punctuation. Converting `monthlySalesReport` back to Title Case gives `Monthlysalesreport`, because Title Case does not split joined words. Keep your original wording if you may need it again.
4. **Converting a whole document at once.** Title Case on a long text capitalises every line, not only the headings. Convert headings one at a time.
5. **Counting after changing.** Changing case never changes the number of words in writing styles, but naming styles join words together. If you need a count, use the [[word-counter]] on the original text.

## Questions people ask

**Does it keep accents?** Yes. Accented letters change case like any other letter, so `café crème brûlée` becomes `CaféCrèmeBrûlée` in PascalCase.

**Why does Title Case leave "for" small but give "Tale" a capital at the end?** Short joining words stay small only in the middle. The last word always starts big, whatever it is.

**Can I turn a snake_case name into normal words?** Not in one press. Title Case keeps the underscores, so `monthly_sales_report` becomes `Monthly_Sales_Report`. Swap the underscores for spaces with [[find-replace]] first, then choose a writing style.

**Is my text stored anywhere?** No. The conversion happens on your device, and nothing is saved when you close the page.
