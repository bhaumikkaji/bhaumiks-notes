import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    category: z.enum(['Tech', 'Design', 'AI', 'Career', 'Observations', 'Life']),
    slug: z.string(),
    image: z.string().optional(),
  }),
});

export const collections = { notes };