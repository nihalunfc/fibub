---
title: Row-level security
seoTitle: 'Power BI row-level security (RLS) step by step'
summary: Show each person only their rows, from one report. Create roles with DAX filter rules, use USERPRINCIPALNAME for dynamic security, and test it properly.
minutes: 16
updated: 2026-11-22
sources:
  - 'Microsoft Learn, Row-level security with Power BI: https://learn.microsoft.com/fabric/security/service-admin-row-level-security'
quiz:
  - q: What is a role in row-level security?
    choices: ['A job title', 'A named set of DAX filter rules on tables; members of the role only see rows that pass', 'A workspace']
    ans: 1
    why: Roles hold table filters such as Store[Region] = "West". People or groups are assigned to roles in the Service.
  - q: How does dynamic RLS know who is viewing?
    choices: ['It guesses', 'USERPRINCIPALNAME() returns the viewer''s sign-in (email), matched against a column in a security table', 'Through the URL']
    ans: 1
    why: A table of user emails and regions, related to Store, plus a rule like Security[Email] = USERPRINCIPALNAME(), filters each viewer automatically.
  - q: Does RLS apply to report authors with edit rights in the workspace?
    choices: ['Yes, always', 'No: workspace Admins, Members and Contributors see all data; RLS applies to Viewers and app users', 'Only on weekends']
    ans: 1
    why: People who can edit the content bypass RLS. Give readers the Viewer role or access through an app.
---

**Module 8 · about 16 minutes · read first: 5.1.** You'll be able to create static and dynamic security roles and test them.

## 1. Why this matters

Store managers should see their store, regional managers their region, head office everything, all from one report. RLS does that without making a copy per person, and it's a standard interview topic.

## 2. A static role

1. **Modeling > Manage roles > New**, name it "West".
2. Choose the Store table and enter the rule: `[Region] = "West"`.
3. **Modeling > View as > West** to test.
4. After publishing, in the Service: semantic model > Security > add people or groups to the role.

The rule is a filter on Store, so it flows through relationships to Sales and Targets, exactly like a slicer that readers can't remove:

<!--fig:dax-pad rls-west-->

Notice `Share of All`: ALL(Store) inside CALCULATE does **not** remove a security filter. RLS filters are applied before everything else, so the person's "all" is all West stores (here the editor imitates it with a slicer, so ALL removes it: in Power BI, the West share would add up to 100 %). Security never leaks through ALL.

## 3. Dynamic RLS

One role for everyone, driven by a table:

| Email | Region |
|---|---|
| manager.west@example.com | West |
| manager.east@example.com | East |

Relate `Security[Region]` to a Region dimension (or Store), and in the role write on Security: `[Email] = USERPRINCIPALNAME()`. Each viewer sees only the regions listed for their sign-in. Add a person: add a row, no report change.

## 4. Test and manage

- **View as** a role, and as a specific user with dynamic rules ("Other user").
- Assign **groups**, not individuals, in the Service.
- RLS filters data rows; to hide whole pages or columns use **object-level security** (with external tools) or separate reports.
- Remember: workspace Admin, Member and Contributor roles bypass RLS. Share with readers as Viewers or through an app.

<details class="maths" open>
<summary>Principle</summary>

**Principle:** RLS adds filters to the start of every query for that user. Because filters flow along relationships, filtering a dimension is enough to secure every fact table related to it. Check the model for paths that bypass the filter, such as a fact table not related to the secured dimension.

**Try it:** with a West role on Store, can a West user see Targets for East? (No: Targets relates to Store, so the filter reaches it.)
</details>

## 5. Worked example

*Northbay security.* A Security table lists each store manager's email and StoreKey, related to Store; regional managers have one row per store in their region; head office emails are in a separate "All stores" role with no rule. One report, one model, three groups in the Service.

## 6. Practice

1. Write the rule for a role that sees only Grocery and Home products.
2. Why is a group better than individual emails in role membership?
3. A regional manager can see all stores. They're a Member of the workspace. What's wrong?

<details>
<summary>Answers</summary>

1. On Product: `[Category] IN {"Grocery", "Home"}`.
2. People join and leave; IT manages the group, so the report needs no changes.
3. Members bypass RLS. Make them a Viewer, or share through an app.
</details>
