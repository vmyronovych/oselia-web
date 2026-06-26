import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ── Products ────────────────────────────────────────────────────────────────
// One entry per OSELIA DIN-rail module. Editable in the CMS under "Products".
const products = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/products' }),
  schema: () =>
    z.object({
      title: z.string(),
      sku: z.string(),
      tagline: z.string(),
      summary: z.string(),
      role: z.enum(['gateway', 'expander']),
      order: z.number().default(0),
      // Path under /uploads (managed by the CMS media library), e.g. /uploads/hearth.png
      heroImage: z.string().optional(),
      // Short bullet specs shown in the product spec table.
      specs: z
        .array(z.object({ label: z.string(), value: z.string() }))
        .default([]),
      // Marketing feature cards.
      features: z
        .array(z.object({ title: z.string(), body: z.string() }))
        .default([]),
      draft: z.boolean().default(false),
    }),
});

// ── Docs (Getting Started / guides) ──────────────────────────────────────────
const docs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Sidebar grouping + ordering.
    section: z.string().default('Guides'),
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

export const collections = { products, docs };
