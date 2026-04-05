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
- **Cloudflare Ready**: Configured for Cloudflare Pages deployment

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
- **Deployment**: Cloudflare Pages / Workers ready

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

\`\`\`
/
├── public/             # Static assets
├── src/
│   ├── components/     # Astro components
│   ├── content/        # Content collections (blog posts)
│   ├── data/           # Site configuration and data
│   ├── layouts/        # Page layouts
│   ├── pages/          # Route pages
│   └── styles/         # Global CSS and Tailwind
├── astro.config.ts     # Astro configuration
├── tailwind.config.ts  # Tailwind with Resend design tokens
└── package.json
\`\`\`

## Content Management

### Adding Blog Posts

Create MDX files in `src/content/blog/`:

\`\`\`mdx
---
title: 'Your Post Title'
description: 'Post summary'
date: '2025-04-04'
tags: ['tag1', 'tag2']
draft: false
---

Your content here...
\`\`\`

### Adding Projects

Edit `src/data/projectsData.ts` to add new projects:

\`\`\`typescript
{
  title: 'Project Name',
  description: 'Project description',
  imgSrc: 'https://...',
  href: '/projects/slug',
  date: 'Month Year',
  skills: ['React', 'TypeScript', ...],
}
\`\`\`

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

### Cloudflare Pages

1. Connect your repository to Cloudflare Pages
2. Build command: `pnpm build`
3. Output directory: `dist`
4. Environment variables: None required

### Vercel/Netlify

Change the adapter in `astro.config.ts`:

\`\`\`typescript
// For Vercel
import vercel from '@astrojs/vercel/serverless'
adapter: vercel()

// For Netlify
import netlify from '@astrojs/netlify'
adapter: netlify()
\`\`\`

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

## Credits

- Design System: Inspired by [Resend](https://resend.com)
- Framework: [Astro](https://astro.build)
- Fonts: Inter (Google Fonts), JetBrains Mono
- Icons: Heroicons

---

Built with Astro and the Resend Design System by Johan Guse
