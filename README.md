# Johan Guse Portfolio - Astro

A modern personal portfolio and blog built with Astro and the Resend Design System.

## Features

- **Resend Design System**: Pure black void background with frost blue-tinted borders, cinematic spacing
- **Typography**: Three-font hierarchy - Domaine Display (hero), ABC Favorit (sections), Inter (body)
- **Astro 6**: Latest framework with Content Layer API
- **TypeScript**: Full type safety with strict mode
- **MDX Blog**: Blog support with Astro 6 Content Layer API
- **Projects Showcase**: Portfolio grid with detailed project cards
- **Responsive Design**: Mobile-first with elegant desktop layouts
- **Vanilla JS**: No framework dependencies for interactions
- **Cloudflare**: Static deploy via Wrangler (`dist` + `wrangler.jsonc`)

## Design Principles

This site follows the Resend Design System aesthetic:

- **Pure black background** (`#000000`) - the void is the canvas
- **Frost borders** (`rgba(214, 235, 253, 0.19)`) - signature blue-tinted structural lines
- **Three-font editorial hierarchy** - Domaine/ABC Favorit/Inter with strict role separation
- **Aggressive negative tracking** on display fonts (-0.96px, -2.8px)
- **Pill-shaped buttons** (9999px radius) with transparent backgrounds
- **Multi-color accent system** (orange/green/blue/yellow/red) at low opacity
- **No traditional shadows** - depth through frost borders only

## Tech Stack

- **Framework**: [Astro 6.1.3](https://astro.build) with Content Layer API
- **Styling**: [Tailwind CSS 4.1.8](https://tailwindcss.com) (CSS-first configuration)
- **Content**: MDX with Astro Content Collections (glob loader)
- **TypeScript**: Full type safety with strict mode
- **Runtime**: Node.js 22+ / Bun compatible
- **Package Manager**: pnpm (preferred), yarn, or bun
- **Deployment**: Cloudflare Workers (static assets) via Wrangler

## Getting Started

### Prerequisites

- Node.js 22.12.0+ or Bun 1.0+ (Astro 6 requirement)
- pnpm, yarn, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/johanguse/johanguse-dev-astro.git
cd johanguse-dev-astro

# Install dependencies (choose one)
pnpm install
# or
bun install
# or
yarn install

# Start development server (choose one)
pnpm dev
# or
bun dev
# or
yarn dev
```

The site will be available at `http://localhost:4321`

### Build for Production

```bash
# Build the site (choose one)
pnpm build
bun run build
yarn build

# Preview production build locally
pnpm preview
bun run preview
yarn preview

# Deploy to Cloudflare (requires wrangler setup)
pnpm deploy
bun run deploy
yarn deploy
```

### Code Quality (Biome)

```bash
# Lint code
pnpm lint
bun lint
yarn lint

# Lint and fix issues
pnpm lint:fix
bun lint:fix
yarn lint:fix

# Format code
pnpm format
bun format
yarn format

# Check and fix everything (lint + format + organize imports)
pnpm biome:check
bun biome:check
yarn biome:check
```

## Project Structure

```
/
├── public/                 # Static files (images, favicons, logo.svg)
├── scripts/
│   └── deploy.sh           # build + wrangler deploy (pipe for DNS-friendly CI)
├── src/
│   ├── components/         # Astro components (Navigation, Footer, cards, …)
│   ├── content/
│   │   └── blog/           # Blog MDX files (glob-loaded via content.config)
│   ├── content.config.ts   # Astro 6 collections + Zod schema
│   ├── data/               # siteConfig.ts, projectsData.ts
│   ├── layouts/            # BaseLayout.astro
│   ├── pages/              # Routes (blog/, projects/, tags/, …)
│   ├── styles/
│   │   └── global.css      # Tailwind 4 + @theme (Resend tokens)
│   ├── types/              # Shared TypeScript types
│   └── utils/              # helpers (dates, tags, …)
├── astro.config.ts         # Astro + MDX + sitemap + Vite/Tailwind
├── biome.jsonc             # Lint & format (Astro-aware)
├── package.json
├── tsconfig.json
└── wrangler.jsonc          # Cloudflare Worker + static assets from dist/
```

## Content Management

### Adding Blog Posts

Create MDX files in `src/content/blog/`. Frontmatter must match `src/content.config.ts` (required: `title`, `description`, `date`; optional: `tags`, `draft`, `image`).

````mdx
---
title: 'Your Post Title'
description: 'Post summary shown in listings and SEO.'
date: '2025-04-04'
tags: ['tag1', 'tag2']
draft: false
image: '/static/images/your-hero.jpg'
---

Your content here…
````

Use `draft: true` to hide a post from the public blog index (it is still in the collection for local preview).

### Adding Projects

Edit `src/data/projectsData.ts` and append an object to the `projectsData` array (type `Project` from `src/types/index.ts`).

```typescript
{
	title: 'Project Name',
	description: 'Short summary for the card.',
	imgSrc: 'https://example.com/preview.jpg',
	href: '/projects/my-slug',
	externalHref: 'https://live-site.com',
	clientName: 'Client or Personal Project',
	clientURL: 'https://client-site.com',
	date: 'Month Year',
	skills: ['Astro', 'TypeScript', 'Tailwind CSS'],
},
```

- **`href`**: internal page under `src/pages/projects/my-slug.astro`, or an `https://…` URL (opens in a new tab), or `''` if the card should not link anywhere.
- **`externalHref`**: optional; used where you want an explicit “live site” link separate from the card link.
- **Detail pages**: for `/projects/slug`, add `src/pages/projects/slug.astro` (see existing project pages as templates).

## Customization

### Site Configuration

Edit `src/data/siteConfig.ts` to update:
- Site metadata
- Social links
- Navigation links

### Design Tokens

The Resend Design System is implemented with Tailwind CSS 4:
- `src/styles/global.css` - All theme configuration using `@theme` directive
- No `tailwind.config.ts` needed (Tailwind 4 uses CSS-first configuration)
- All colors, fonts, radii, shadows defined as CSS variables

### Fonts

Current setup uses Google Fonts (Inter, JetBrains Mono). To use actual Resend fonts:
1. Obtain Domaine Display and ABC Favorit font files
2. Place in `public/fonts/`
3. Update `@font-face` declarations in `global.css`

## Deployment

### Cloudflare (this repo)

The site is **static** (`output: "static"`). Build output is uploaded from `dist/` via Wrangler.

```bash
bun run deploy
# or: pnpm deploy / yarn deploy — runs scripts/deploy.sh (astro build + wrangler deploy)
```

Configure routes, zones, and custom domains in `wrangler.jsonc` and the [Cloudflare dashboard](https://dash.cloudflare.com). Ensure DNS records exist (e.g. proxied `www` CNAME) before expecting `www` to resolve.

### Cloudflare Pages (Git-based alternative)

If you prefer CI from Git: connect the repo to **Cloudflare Pages**, build command `bun run build` (or `pnpm build`), output directory `dist`.

### Vercel / Netlify

Switch to SSR or hybrid and add an adapter in `astro.config.ts`, for example:

```typescript
import vercel from '@astrojs/vercel'
import { defineConfig } from 'astro/config'

export default defineConfig({
	output: 'server',
	adapter: vercel(),
	// …
})
```

```typescript
import netlify from '@astrojs/netlify'
import { defineConfig } from 'astro/config'

export default defineConfig({
	output: 'server',
	adapter: netlify(),
	// …
})
```

For a fully static export you can often deploy the `dist/` folder without an adapter; follow each host’s static-site docs.

## Performance

- Lighthouse Score: 100/100 (target)
- First Contentful Paint: < 1s
- Time to Interactive: < 2s
- Bundle size: < 100KB (initial)

## Browser Support

- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions + ESR
- Safari: Last 2 versions
- Mobile: iOS 14+, Android 10+

## License

MIT


