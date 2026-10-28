import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    cover: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    stack: z.array(z.string()),
    repo: z.url().optional(),
    demo: z.url().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    cover: z.string().optional(),
    // 프로젝트 목록에서 보이는 순서(작을수록 앞). 없으면 featured·최신순으로 그 뒤에 온다.
    order: z.number().int().optional(),
  }),
});

export const collections = { blog, projects };
