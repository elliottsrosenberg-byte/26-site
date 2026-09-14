import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const piece = z.object({
  title: z.string(),
  description: z.string(),
  order: z.number().default(0),
  draft: z.boolean().default(false),
  thumb: z.string().optional(),
  link: z.string().optional(),
});

export const collections = {
  projects: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './content/projects' }),
    schema: piece,
  }),
  writing: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './content/writing' }),
    schema: piece,
  }),
};
