import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    summaryCompact: z.string().optional(),
    summary: z.string().optional(),
    summaryExpanded: z.string().optional(),
    pubDate: z.coerce.date(),
    category: z.array(z.string()),
    slug: z.string(),
    image: z.string().optional(),
  }),
});

export const collections = { notes };