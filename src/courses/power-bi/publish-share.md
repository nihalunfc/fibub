---
title: 'Publishing: workspaces, apps and sharing'
seoTitle: 'Publish and share Power BI reports: workspaces and apps'
summary: Move a report from Desktop to the Power BI Service, organise it in workspaces, share it through an app, and know which licences and roles are needed.
minutes: 14
updated: 2026-11-22
sources:
  - 'Microsoft Learn, Roles in workspaces: https://learn.microsoft.com/fabric/fundamentals/roles-workspaces'
quiz:
  - q: What happens when you publish a .pbix?
    choices: ['Only the visuals are uploaded', 'A semantic model (the data and DAX) and a report are created in the chosen workspace', 'It emails everyone']
    ans: 1
    why: 'Publishing creates two items: the semantic model and the report that uses it. Other reports can connect to the same model.'
  - q: Why share through an app rather than adding readers to the workspace?
    choices: ['Apps are free', 'Readers get a clean, versioned set of reports and can''t see work in progress or edit anything', 'Workspaces cannot be shared']
    ans: 1
    why: Apps separate development (workspace) from consumption. You update the app when changes are ready.
  - q: Which workspace role can publish and edit content but not manage access?
    choices: ['Viewer', 'Contributor', 'Admin']
    ans: 1
    why: Contributors create and edit content. Members can also share and add people; Admins manage everything; Viewers only read.
---

**Module 8 · about 14 minutes.** You'll be able to publish, organise and share Power BI content the way companies do.

## 1. Why this matters

A report on your laptop helps nobody. Knowing workspaces, apps and roles shows an employer you can deliver work, not just build it.

## 2. Publish

1. Sign in to Power BI Desktop with a work or school account.
2. **Home > Publish**, choose a workspace. Power BI uploads a **semantic model** and a **report**.
3. Open app.powerbi.com: the report works in the browser, on phones (Power BI app) and in Teams.

Licences, in short: building in Desktop is free; sharing content needs Power BI Pro (or Premium Per User) for creators and viewers, unless the workspace is on a Fabric or Premium capacity, where viewers need no paid licence. Your employer decides; ask which applies.

## 3. Workspaces

A **workspace** is a shared folder for a team's content. Typical setup: one workspace per subject (Sales, Finance), sometimes with Dev, Test and Prod versions connected by a **deployment pipeline**.

| Role | Can |
|---|---|
| Viewer | read content (RLS applies) |
| Contributor | create and edit content |
| Member | the above, plus share and add people |
| Admin | everything, including deleting the workspace |

## 4. Sharing options

- **App:** a packaged, read-only set of reports from a workspace for a wide audience. The usual choice.
- **Share a report** directly: quick for a few people.
- **Teams and SharePoint:** embed a report tab.
- **Subscriptions:** email a snapshot on a schedule.
- **Analyze in Excel:** a pivot table connected to the semantic model, loved by finance teams.
- **Publish to web:** makes the report **public on the internet**. Never use it for company data.

<details class="maths" open>
<summary>Principle</summary>

**Principle:** separate building from using. Build in a workspace where only developers have edit roles; publish to readers through an app; keep one semantic model that many reports share, so a number is defined once for the whole company.

**Try it:** a colleague wants a new report using your Total Sales measure. What do you give them? (Build permission on your semantic model, so they connect to it rather than copying the data.)
</details>

## 5. Worked example

*Northbay's rollout.* Workspace "Sales BI (Dev)" for the BI team; deployment pipeline to "Sales BI" (Prod); an app "Store Performance" for 40 store and regional managers through an Azure AD group, with RLS from Lesson 8.2; a Monday 8 AM email subscription of the overview page to the leadership team.

## 6. Practice

1. Which item do other reports connect to: the report or the semantic model?
2. Why is Publish to web dangerous for company data?
3. A finance analyst wants to pivot your data in Excel. What do you offer?

<details>
<summary>Answers</summary>

1. The semantic model.
2. Anyone with the link, or anyone who finds it through a search engine, can see the data. No sign-in, no security.
3. Analyze in Excel (with Build permission on the model).
</details>
