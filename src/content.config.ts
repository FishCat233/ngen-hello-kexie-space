import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const directions = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/directions" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    id: z.string(),
  }),
});

export const collections = { directions };
