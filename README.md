# johanguse.dev

Personal portfolio and blog built with Astro, MDX, and StyleX. The site is statically generated and deployed to Cloudflare.

## Highlights

- Astro 7 static site with content collections and MDX blog posts
- StyleX utilities and reusable typography styles compiled through Vite
- Responsive portfolio, project case studies, blog, tags, and contact form
- Light/dark theme toggle with persisted user preference
- Cookie consent preferences for analytics and marketing categories
- Cloudflare static deployment through Wrangler

## Tech stack

- [Astro](https://astro.build) 7
- [StyleX](https://stylexjs.com) with `@stylexjs/unplugin`
- MDX and Astro Content Collections
- TypeScript
- Bun
- Biome
- Cloudflare Workers / Wrangler

The visual system uses Bricolage Grotesque for display text and Barlow for interface and body text. Global semantic theme variables live in `src/styles/global.css`; shared StyleX utilities and typography are in `src/styles/`.

## Getting started

Requirements: Bun 1.x or Node.js 22+.

```bash
git clone https://github.com/johanguse/johanguse-dev-astro.git
cd johanguse-dev-astro
bun install
bun run dev
```

The development server runs at `http://localhost:4321`.

## Commands

```bash
bun run dev       # Start the development server
bun run check     # Run Astro and TypeScript diagnostics
bun run build     # Generate the production site in dist/
bun run preview   # Build and preview the production site
bun run lint      # Run Biome linting
bun run format    # Format files with Biome
bun run deploy    # Build and deploy with Wrangler
```

## Project structure

```text
src/
├── components/          # Shared Astro and React components
│   └── markdown/        # StyleX-backed Markdown element components
├── content/blog/        # Blog posts written in MDX
├── data/                # Site and project data
├── layouts/             # Base document layout
├── pages/               # Astro routes
├── styles/
│   ├── global.css       # Global reset, theme variables, and component CSS
│   ├── utilities.stylex.ts
│   └── typography.stylex.ts
├── types/               # Shared TypeScript types
└── utils/               # Date, tag, and helper functions

astro.config.ts          # Astro integrations and StyleX Vite plugin
wrangler.jsonc           # Cloudflare deployment configuration
```

## Styling

StyleX is configured in `astro.config.ts` through `@stylexjs/unplugin`. Astro markup uses the `sx()` helper from `src/styles/utilities.stylex.ts`, while Markdown content maps headings, paragraphs, lists, and blockquotes to components using `typography.stylex.ts`.

When adding a reusable style:

1. Add it to the appropriate StyleX module.
2. Apply it with `sx(style)` and the generated `class` value.
3. Keep responsive values inside StyleX condition objects.
4. Keep global selectors in `global.css` only for document-wide behavior or component-specific interaction.

## Content

### Blog posts

Add an MDX file to `src/content/blog/` with frontmatter matching `src/content.config.ts`:

```mdx
---
title: 'Your post title'
description: 'A short summary for listings and SEO.'
date: '2026-08-25'
tags: ['tag']
draft: false
---

Your content here.
```

Use `draft: true` to keep a post out of public listings.

### Projects

Add project metadata to `src/data/projectsData.ts` and create a matching route under `src/pages/projects/` when a case-study page is needed.

## Deployment

The project uses `output: "static"`. Build output is written to `dist/` and deployed with Wrangler:

```bash
bun run build
bun run deploy
```

Configure the Cloudflare account, routes, and custom domains in `wrangler.jsonc` and the Cloudflare dashboard.

## License

MIT
