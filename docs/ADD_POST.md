# How to Add Posts

## 1. Add a markdown file

Create a new `.md` file under `posts/`, for example:

- `posts/my-first-post.md`

File name becomes the post URL:

- `posts/my-first-post.md` -> `/post/my-first-post`

## 2. Add frontmatter

Use YAML frontmatter at the top:

```md
---
title: "My Post Title"
summary: "One line summary"
tags:
  - notes
---

# Content

Your markdown content here.
```

Supported markdown features (static render):

- GFM: tables, task lists, footnotes, strikethrough
- Math: inline `$...$` and block `$$...$$`
- Heading anchors + automatic TOC section
- Syntax-highlighted code blocks
- Directive callouts: `:::note`, `:::tip`, `:::info`, `:::warning`, `:::danger`
- Raw HTML (trusted content only)

Callout example:

```md
:::note{title="Build Time"}
This block is rendered at build time.
:::
```

## 3. Travel post format (for the Travel tab)

If a post should appear in **Travel**, include the `travel` tag and add `location` and `travelDate`:

```md
---
title: "Trip in Japan"
summary: "Travel diary"
tags:
  - travel
location:
  - Tokyo
  - Kyoto
travelDate:
  start: "2025-04-01"
  end: "2025-04-08"
---
```

Travel table columns are read as:

- `Post Title`: `title`
- `Location`: `location` list
- `Date`: `travelDate.start ~ travelDate.end`

## 4. Event post format (for the Event tab)

If a post should appear in **Event**, include the `event` tag and add an `events` list.
Travel fields (`location`, `travelDate`) are not used by the Event tab.

```md
---
title: "Weekend in the City"
summary: "Concert and exhibition notes"
tags:
  - event
events:
  - name: "Coldplay Live 2026"
    type: "concert"
    location:
      - Hong Kong Coliseum
    date:
      start: "2026-05-03"
      end: "2026-05-03"
  - name: "Art Basel Hong Kong"
    type: "exhibition"
    location:
      - Hong Kong Convention and Exhibition Centre
    date:
      start: "2026-05-04"
      end: "2026-05-05"
---
```

Each event in `events` becomes one row in the Event table:

- `Post Title`: `title`
- `Event Name`: `events[].name`
- `Event Type`: `events[].type` (for example `concert`, `exhibition`, `festival`)
- `Location`: `events[].location` list
- `Date`: `events[].date.start ~ events[].date.end`

## 5. About Me content

Create (or edit) this file:

- `posts/about-me.md`

Set this in frontmatter so it is used by the **About Me** tab:

```md
about: true
```

## 6. Created/Updated time behavior

By default, created time and updated time are taken from **git commit timestamps** for each markdown file.

- `Created`: first commit time of the file
- `Updated`: latest commit time of the file

If you set `created` / `updated` (or `createdAt` / `updatedAt`) in frontmatter, those values are used instead of commit timestamps.

```md
---
created: "2026-02-01T09:30:00+08:00"
updated: "2026-02-11T20:15:00+08:00"
---
```

## 7. Deploy to GitHub Pages

The workflow file is:

- `.github/workflows/deploy.yml`

After you push changes (including `posts/**`) to `main`, GitHub Actions will build and deploy the blog automatically.

If your default branch is not `main`, change the workflow trigger branch.
