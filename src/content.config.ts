import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const blog = defineCollection({
	loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		date: z.coerce.date(),
		/** When set, shown in UI and emitted as `dateModified` in JSON-LD */
		updated: z.coerce.date().optional(),
		/** Short answer-first summary shown above the article body */
		tldr: z.string().optional(),
		tags: z.array(z.string()).default([]),
		draft: z.boolean().default(false),
		image: z.string().optional(),
	}),
})

export const collections = {
	blog,
}
