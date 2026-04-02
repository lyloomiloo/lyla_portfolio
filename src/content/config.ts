import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    displayTitle: z.string(),
    tagline: z.string(),
    hook: z.string(),
    type: z.string(),
    status: z.string(),
    year: z.string(),
    tags: z.array(z.string()),
    thumbnail: z.string(),
    heroImage: z.string().optional(),
    order: z.number(),
    role: z.string().optional(),
    duration: z.string().optional(),
    tools: z.array(z.string()).optional(),
    screenshots: z.array(z.string()).optional(),
  }),
});

export const collections = { projects };
